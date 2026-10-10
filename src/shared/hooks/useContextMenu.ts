import { useCallback, useEffect, useState } from "react";

export interface ContextMenuItem {
  label: string;
  onClick: () => void;
}

export interface ContextMenuState {
  x: number;
  y: number;
  items: ContextMenuItem[];
}

/**
 * Shows a custom right-click menu anywhere in the app.
 * The native webview context menu is suppressed.
 */
export const useContextMenu = (items: ContextMenuItem[]) => {
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  useEffect(() => {
    const isInsideMenu = (target: EventTarget | null) =>
      target instanceof Element && !!target.closest(".app-context-menu");

    const handleContextMenu = (event: MouseEvent) => {
      if (isInsideMenu(event.target)) return;
      event.preventDefault();
      setContextMenu({ x: event.clientX, y: event.clientY, items });
    };

    const closeIfOutside = (event: MouseEvent) => {
      if (event.button !== 0) return;
      if (isInsideMenu(event.target)) return;
      setContextMenu(null);
    };

    const close = () => setContextMenu(null);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("mousedown", closeIfOutside);
    document.addEventListener("wheel", close, { passive: true });
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("blur", close);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("mousedown", closeIfOutside);
      document.removeEventListener("wheel", close);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("blur", close);
    };
  }, [items]);

  const closeContextMenu = useCallback(() => setContextMenu(null), []);

  return { contextMenu, closeContextMenu };
};
