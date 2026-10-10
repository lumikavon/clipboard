import { useLayoutEffect, useRef, useState } from "react";
import type { ContextMenuState } from "../hooks/useContextMenu";

interface ContextMenuProps {
  state: ContextMenuState | null;
  onClose: () => void;
}

const MARGIN = 8;

const ContextMenu = ({ state, onClose }: ContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    if (!state) return;
    const element = menuRef.current;
    const width = element?.offsetWidth ?? 180;
    const height = element?.offsetHeight ?? 40;
    const x = Math.max(MARGIN, Math.min(state.x, window.innerWidth - width - MARGIN));
    const y = Math.max(MARGIN, Math.min(state.y, window.innerHeight - height - MARGIN));
    setPosition({ x, y });
  }, [state]);

  if (!state) return null;

  return (
    <div
      ref={menuRef}
      className="app-context-menu"
      style={{ left: position.x, top: position.y }}
      onMouseDown={(event) => event.stopPropagation()}
      onContextMenu={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      {state.items.map((item) => (
        <button
          key={item.label}
          type="button"
          className="app-context-menu-item"
          onClick={() => {
            onClose();
            item.onClick();
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default ContextMenu;
