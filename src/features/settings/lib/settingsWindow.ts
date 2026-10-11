const SETTINGS_WINDOW_LABEL = "settings";

const SETTINGS_DEFAULT_WIDTH = 360;
const SETTINGS_DEFAULT_HEIGHT = 600;
const SETTINGS_GEOMETRY_KEY = "app.settings_window_geometry";
const SETTINGS_WINDOW_GAP = 12;

interface SettingsWindowGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
}

const isValidGeometry = (value: unknown): value is SettingsWindowGeometry => {
  if (!value || typeof value !== "object") return false;
  const geometry = value as Record<string, unknown>;
  const { x, y, width, height } = geometry;
  return (
    typeof x === "number" &&
    Number.isFinite(x) &&
    typeof y === "number" &&
    Number.isFinite(y) &&
    typeof width === "number" &&
    Number.isFinite(width) &&
    width >= 150 &&
    width <= 1600 &&
    typeof height === "number" &&
    Number.isFinite(height) &&
    height >= 200 &&
    height <= 1600
  );
};

const loadPersistedGeometry = async (): Promise<SettingsWindowGeometry | null> => {
  try {
    const { invoke } = await import("@tauri-apps/api/core");
    const settings = await invoke<Record<string, string>>("get_settings");
    const raw = settings?.[SETTINGS_GEOMETRY_KEY];
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isValidGeometry(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const computeDefaultPosition = async (
  width: number,
  height: number
): Promise<{ x: number; y: number } | null> => {
  try {
    const { getCurrentWindow, currentMonitor } = await import("@tauri-apps/api/window");
    const main = getCurrentWindow();
    const [position, size, scaleFactor] = await Promise.all([
      main.outerPosition().catch(() => null),
      main.outerSize().catch(() => null),
      main.scaleFactor().catch(() => 1)
    ]);
    if (!position || !size) return null;
    const scale = scaleFactor || 1;
    let x = Math.round((position.x + size.width) / scale + SETTINGS_WINDOW_GAP);
    let y = Math.round(position.y / scale);
    const monitor = await currentMonitor().catch(() => null);
    if (monitor) {
      const areaPosition = monitor.workArea.position;
      const areaSize = monitor.workArea.size;
      const areaX = areaPosition.x / scale;
      const areaY = areaPosition.y / scale;
      const areaRight = areaX + areaSize.width / scale;
      const areaBottom = areaY + areaSize.height / scale;
      if (x + width > areaRight) {
        const leftX = Math.round(position.x / scale - SETTINGS_WINDOW_GAP - width);
        if (leftX >= areaX) {
          x = leftX;
        } else {
          x = Math.round(Math.min(Math.max(x, areaX), Math.max(areaX, areaRight - width)));
        }
      }
      y = Math.round(Math.min(Math.max(y, areaY), Math.max(areaY, areaBottom - height)));
    }
    return { x, y };
  } catch {
    return null;
  }
};

const loadWebviewWindowModule = async () => import("@tauri-apps/api/webviewWindow");

/**
 * Open (or focus) the standalone settings window.
 * The main window stays visible while settings is open (backend also guards
 * against auto-hide when the settings window exists).
 * Falls back to the in-app settings view when window creation fails.
 */
export const openSettingsWindow = async (): Promise<void> => {
  const { invoke } = await import("@tauri-apps/api/core");
  // Prevent the main window blur handler from hiding main while settings opens.
  try {
    await invoke("set_ignore_blur", { ignore: true });
  } catch {
    // Ignore: backend guard still keeps main visible when settings exists.
  }
  const { WebviewWindow } = await loadWebviewWindowModule();
  const existing = await WebviewWindow.getByLabel(SETTINGS_WINDOW_LABEL);
  if (existing) {
    await existing.show();
    await existing.setFocus();
    try {
      await existing.setTitle("设置");
    } catch {
      // Ignore: title sync is best-effort for windows created before the rename.
    }
    return;
  }

  const persisted = await loadPersistedGeometry();
  const width = persisted?.width ?? SETTINGS_DEFAULT_WIDTH;
  const height = persisted?.height ?? SETTINGS_DEFAULT_HEIGHT;
  let x = persisted?.x;
  let y = persisted?.y;
  if (x === undefined || y === undefined) {
    const fallback = await computeDefaultPosition(width, height);
    if (fallback) {
      x = fallback.x;
      y = fallback.y;
    }
  }

  const window = new WebviewWindow(SETTINGS_WINDOW_LABEL, {
    url: "index.html?window=settings",
    title: "设置",
    width,
    height,
    minWidth: 200,
    minHeight: 300,
    resizable: true,
    decorations: true,
    transparent: false,
    skipTaskbar: false,
    alwaysOnTop: false,
    visible: true,
    focus: true,
    ...(x !== undefined && y !== undefined ? { x, y } : { center: true })
  });

  window.once("tauri://error", (event) => {
    console.error("Failed to open settings window:", event);
  });
};
