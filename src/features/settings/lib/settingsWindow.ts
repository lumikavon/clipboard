const SETTINGS_WINDOW_LABEL = "settings";

const loadWebviewWindowModule = async () => import("@tauri-apps/api/webviewWindow");

/**
 * Open (or focus) the standalone settings window.
 * Falls back to the in-app settings view when window creation fails.
 */
export const openSettingsWindow = async (): Promise<void> => {
  const { WebviewWindow } = await loadWebviewWindowModule();
  const existing = await WebviewWindow.getByLabel(SETTINGS_WINDOW_LABEL);
  if (existing) {
    await existing.show();
    await existing.setFocus();
    return;
  }

  const window = new WebviewWindow(SETTINGS_WINDOW_LABEL, {
    url: "index.html?window=settings",
    title: "Clipboard",
    width: 900,
    height: 720,
    minWidth: 480,
    minHeight: 480,
    resizable: true,
    decorations: true,
    transparent: false,
    skipTaskbar: false,
    alwaysOnTop: false,
    visible: true,
    focus: true,
    center: true
  });

  window.once("tauri://error", (event) => {
    console.error("Failed to open settings window:", event);
  });
};
