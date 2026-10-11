import type { RefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  Pin,
  PinOff,
  Search,
  Settings as SettingsIcon,
  Trash2,
  X
} from "lucide-react";
import { invoke } from "@tauri-apps/api/core";

interface AppHeaderProps {
  t: (key: string) => string;
  showSettings: boolean;
  setShowSettings: (val: boolean) => void;
  showEmojiPanel: boolean;
  setShowEmojiPanel: (val: boolean) => void;
  emojiPanelEnabled: boolean;
  isWindowPinned: boolean;
  setIsWindowPinned: (val: boolean) => void;
  clearHistory: () => void;
  showSearchBox: boolean;
  search: string;
  setSearch: (val: string) => void;
  setIsComposing: (val: boolean) => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
  setSearchIsFocused: (val: boolean) => void;
  colorMode: string;
  settingsTitle: string;
  typeFilter: string | null;
  setTypeFilter: (val: string | null) => void;
  onBack: () => void;
}

const AppHeader = ({
  t,
  showSettings,
  setShowSettings,
  showEmojiPanel,
  setShowEmojiPanel,
  emojiPanelEnabled,
  isWindowPinned,
  setIsWindowPinned,
  clearHistory,
  showSearchBox,
  search,
  setSearch,
  setIsComposing,
  searchInputRef,
  setSearchIsFocused,
  colorMode,
  settingsTitle,
  typeFilter,
  setTypeFilter,
  onBack
}: AppHeaderProps) => {
  // Search box is always shown (setting removed); emoji entry button removed.
  // Props retained for compatibility.
  void showSearchBox;
  void emojiPanelEnabled;
  void setShowEmojiPanel;
  const getTypeName = (type: string) => {
    switch (type) {
      case "code": return t('type_code');
      case "link":
      case "url": return t('type_url');
      case "file": return t('type_file');
      case "image": return t('type_image');
      case "video": return t('type_video');
      case "rich_text": return t('type_rich_text');
      default: return t('type_text') || 'Text';
    }
  };

  return (
  <header className="window-drag-region">
    <div className="header-top">
      <div className="header-leading">
        {(showSettings || showEmojiPanel) && (
          <button className="btn-icon window-no-drag" onClick={onBack}>
            <ChevronLeft size={18} />
          </button>
        )}
        <div className="header-drag-region" data-tauri-drag-region>
          <span className="header-title">
            {showEmojiPanel
              ? (t('emoji_panel') || '表情包')
              : showSettings
                ? settingsTitle
                : t('app_name')}
          </span>
        </div>
      </div>
      <div className="header-actions window-no-drag">
        {/* Pin Button - Always visible but single instance */}
        <button
          className={`btn-icon ${isWindowPinned ? 'active' : ''}`}
          title={t('pin')}
          onClick={() => {
            const newVal = !isWindowPinned;
            setIsWindowPinned(newVal);
            invoke("set_window_pinned", { pinned: newVal }).catch(console.error);
          }}
        >
          {isWindowPinned ? <PinOff size={16} /> : <Pin size={16} />}
        </button>

        {!showSettings && !showEmojiPanel && (
          <>
            <button className="btn-icon" title={t('clear_history')} onClick={clearHistory}>
              <Trash2 size={16} />
            </button>
            <button className="btn-icon" title={t('settings')} onClick={() => setShowSettings(true)}>
              <SettingsIcon size={16} />
            </button>
          </>
        )}
        <button className="btn-icon" title={t('hide')} onClick={async () => {
          invoke("hide_window_cmd").catch(console.error);
        }}>
          <X size={16} />
        </button>
      </div>
    </div>

    {!showSettings && !showEmojiPanel && (
      <AnimatePresence>
        {
          <motion.div
            initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
            animate={{
              height: "auto",
              opacity: 1,
              transitionEnd: { overflow: "visible" }
            }}
            exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
            transition={{ duration: 0.2, ease: "circOut" }}
            style={{ flexShrink: 0 }}
          >
            <div className="search-container window-no-drag">
              <div style={{ position: 'relative' }}>
                <Search size={14} className="search-icon" />
                <input
                  ref={searchInputRef}
                  type="text"
                  className="search-input"
                  placeholder={t('search_placeholder')}
                  value={search}
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={(e) => {
                    setIsComposing(false);
                    setSearch((e.target as HTMLInputElement).value);
                  }}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  onMouseDown={() => {
                    invoke("activate_window_focus").catch(console.error);
                  }}
                  onClick={() => { invoke("activate_window_focus").catch(console.error); }}
                  onFocus={() => {
                    invoke("activate_window_focus").catch(console.error);
                    setSearchIsFocused(true);
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setSearchIsFocused(false);
                    }, 200);
                  }}
                  style={{ color: colorMode === 'dark' ? '#ffffff' : undefined }}
                />
              </div>
              <div
                className="hide-scrollbar"
                style={{
                  display: 'flex',
                  gap: '6px',
                  padding: '8px 0 0 0',
                  overflowX: 'auto',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
                onWheel={(e) => {
                  if (e.deltaY !== 0) {
                    e.currentTarget.scrollLeft += e.deltaY;
                  }
                }}
              >
                {['text', 'image', 'file', 'url', 'code', 'video', 'rich_text'].map(t => (
                  <button
                    key={t}
                    className={`btn-icon ${typeFilter === t ? 'active' : ''}`}
                    onClick={() => setTypeFilter(typeFilter === t ? null : t)}
                    style={{
                      width: 'auto',
                      padding: '4px 8px',
                      fontSize: '11px',
                      borderRadius: '4px',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      opacity: typeFilter === t ? 1 : 0.7
                    }}
                    title={getTypeName(t)}
                  >
                    {getTypeName(t)}
                  </button>
                ))}
              </div>

            </div>
          </motion.div>
        }
      </AnimatePresence>
    )}
  </header>
);
};

export default AppHeader;
