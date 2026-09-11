import { useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import type { Dispatch, SetStateAction } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import type { ClipboardEntry } from "../types";

interface UseClipboardActionsOptions {
  t: (key: string) => string;
  pushToast: (msg: string, duration?: number) => number;
  deleteAfterPaste: boolean;
  moveToTopAfterPaste: boolean;
  setSearch: (val: string) => void;
  setHistory: Dispatch<SetStateAction<ClipboardEntry[]>>;
}

export const useClipboardActions = ({
  t,
  pushToast,
  deleteAfterPaste,
  moveToTopAfterPaste,
  setSearch,
  setHistory
}: UseClipboardActionsOptions) => {
  const copyToClipboard = useCallback(
    async (id: number, content: string, contentType: string, pasteWithFormat = false) => {
      try {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }

        await invoke("copy_to_clipboard", {
          content,
          contentType,
          paste: true,
          id: id,
          deleteAfterUse: deleteAfterPaste,
          pasteWithFormat,
          moveToTop: moveToTopAfterPaste
        });

        if (moveToTopAfterPaste && !deleteAfterPaste) {
          const now = Date.now();
          setHistory((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, timestamp: now } : item
            )
          );
        }

        setSearch("");
      } catch (err) {
        const errorMsg = t("copy_failed") + (err?.toString() || "");
        pushToast(errorMsg, 3000);
      }
    },
    [deleteAfterPaste, moveToTopAfterPaste, pushToast, setHistory, setSearch, t]
  );

  const openContent = useCallback(
    async (item: ClipboardEntry) => {
      try {
        await invoke("open_content", {
          id: item.id,
          content: item.content,
          contentType: item.content_type
        });
      } catch (err) {
        const errorMsg = t("open_failed") + (err?.toString() || "");
        pushToast(errorMsg, 3000);
      }
    },
    [pushToast, t]
  );

  const deleteEntry = useCallback(
    async (e: ReactMouseEvent, id: number) => {
      e.stopPropagation();
      try {
        await invoke("delete_clipboard_entry", { id });
        setHistory((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        const errorMsg = "删除失败: " + (err?.toString() || "");
        pushToast(errorMsg, 3000);
      }
    },
    [pushToast, setHistory]
  );

  const togglePin = useCallback(
    async (e: ReactMouseEvent, id: number, currentPinned: boolean) => {
      e.stopPropagation();
      try {
        const newId = await invoke<number>("toggle_clipboard_pin", { id, isPinned: !currentPinned });
        setHistory((prev) =>
          prev
            .map((item) =>
              item.id === id ? { ...item, id: newId, is_pinned: !currentPinned } : item
            )
            .sort((a, b) => {
              if (a.is_pinned === b.is_pinned) return b.timestamp - a.timestamp;
              return a.is_pinned ? -1 : 1;
            })
        );
      } catch (err) {
        const errorMsg =
          (currentPinned ? "取消固定失败" : "固定失败") + ": " + (err?.toString() || "");
        pushToast(errorMsg, 3000);
      }
    },
    [pushToast, setHistory]
  );

  return {
    copyToClipboard,
    openContent,
    deleteEntry,
    togglePin
  };
};


