import { useState } from "react";
import { DEFAULT_THEME } from "../../../shared/config/themes";
import type { ClipboardEntry, Locale } from "../../../shared/types";
import type {
  AppState,
  DefaultAppsMap,
  InstalledAppOption,
  SettingsSubpage
} from "../types";
import type { AppCleanupPolicy } from "../../settings/types";

export const useAppState = (): AppState => {
  const [showSettings, setShowSettings] = useState(false);
  const [settingsSubpage, setSettingsSubpage] = useState<SettingsSubpage>("home");
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({
    general: true,
    clipboard: true,
    advanced: true,
    appearance: true,
    default_apps: true,
    data: true
  });
  const [history, setHistory] = useState<ClipboardEntry[]>([]);
  const [search, setSearch] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [searchIsFocused, setSearchIsFocused] = useState(false);
  const [showEmojiPanel, setShowEmojiPanel] = useState(false);
  const [emojiFavorites, setEmojiFavorites] = useState<string[]>([]);
  const [revealedIds, setRevealedIds] = useState<Set<number>>(new Set());
  const [autoStart, setAutoStart] = useState(true);
  const [deduplicate, setDeduplicate] = useState(true);
  const [persistent, setPersistent] = useState(true);
  const [persistentLimitEnabled, setPersistentLimitEnabled] = useState(true);
  const [persistentLimit, setPersistentLimit] = useState<number>(1000);
  const [appSettings, setAppSettings] = useState<Record<string, string>>({});
  const [defaultApps, setDefaultApps] = useState<DefaultAppsMap>({});
  const [showAppSelector, setShowAppSelector] = useState<string | null>(null);
  const [installedApps, setInstalledApps] = useState<InstalledAppOption[]>([]);
  const [dataPath, setDataPath] = useState<string>("");
  const [hotkey, setHotkey] = useState<string>("Ctrl+Shift+V");
  const [isRecording, setIsRecording] = useState(false);
  const [moveToTopAfterPaste, setMoveToTopAfterPaste] = useState(true);
  const [privacyProtection, setPrivacyProtection] = useState(true);
  const [privacyProtectionKinds, setPrivacyProtectionKinds] = useState<string[]>([
    "phone",
    "idcard",
    "email",
    "secret"
  ]);
  const [privacyProtectionCustomRules, setPrivacyProtectionCustomRules] = useState<string>("");
  const [sensitiveMaskPrefixVisible, setSensitiveMaskPrefixVisible] = useState(3);
  const [sensitiveMaskSuffixVisible, setSensitiveMaskSuffixVisible] = useState(3);
  const [sensitiveMaskEmailDomain, setSensitiveMaskEmailDomain] = useState(false);
  const [cleanupRules, setCleanupRules] = useState<string>("");
  const [appCleanupPolicies, setAppCleanupPolicies] = useState<AppCleanupPolicy[]>([]);
  const [captureFiles, setCaptureFiles] = useState(true);
  const [captureRichText, setCaptureRichText] = useState(true);
  const [richTextSnapshotPreview, setRichTextSnapshotPreview] = useState(true);
  const [silentStart, setSilentStart] = useState(true);
  const [followMouse, setFollowMouse] = useState(false);
  const [showAppBorder, setShowAppBorder] = useState(false);
  const [winClipboardDisabled, setWinClipboardDisabled] = useState(false);
  const [registryWinVEnabled, setRegistryWinVEnabled] = useState(false);
  const [pasteMethod, setPasteMethod] = useState("simulate");
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [colorMode, setColorMode] = useState("system");
  const [showSourceAppIcon, setShowSourceAppIcon] = useState(true);

  const [compactMode, setCompactMode] = useState(false);
  const [clipboardItemFontSize, setClipboardItemFontSize] = useState(13);
  const [emojiPanelEnabled, setEmojiPanelEnabled] = useState(true);
  const [emojiPanelTab, setEmojiPanelTab] = useState<"emoji" | "favorites">("emoji");
  const [showHotkeyHint, setShowHotkeyHint] = useState(false);
  const [showAutoCloseHint, setShowAutoCloseHint] = useState(false);
  const [language, setLanguage] = useState<Locale>("zh");
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [isWindowPinned, setIsWindowPinned] = useState(false);
  const [showSearchBox, setShowSearchBox] = useState(true);
  const [arrowKeySelection, setArrowKeySelection] = useState(true);
  const [hideDockIcon, setHideDockIcon] = useState(false);
  const [edgeDocking, setEdgeDocking] = useState(false);
  const [customBackground, setCustomBackground] = useState<string>("");
  const [customBackgroundOpacity, setCustomBackgroundOpacity] = useState(45);
  const [surfaceOpacity, setSurfaceOpacity] = useState(50);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isKeyboardMode, setIsKeyboardMode] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [pasteSoundEnabled, setPasteSoundEnabled] = useState(true);
  const [soundVolume, setSoundVolume] = useState(1.0);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  return {
    showSettings,
    setShowSettings,
    settingsSubpage,
    setSettingsSubpage,
    collapsedGroups,
    setCollapsedGroups,
    history,
    setHistory,
    search,
    setSearch,
    isComposing,
    setIsComposing,
    searchIsFocused,
    setSearchIsFocused,
    showEmojiPanel,
    setShowEmojiPanel,
    emojiFavorites,
    setEmojiFavorites,
    revealedIds,
    setRevealedIds,
    autoStart,
    setAutoStart,
    deduplicate,
    setDeduplicate,
    persistent,
    setPersistent,
    persistentLimitEnabled,
    setPersistentLimitEnabled,
    persistentLimit,
    setPersistentLimit,
    appSettings,
    setAppSettings,
    defaultApps,
    setDefaultApps,
    showAppSelector,
    setShowAppSelector,
    installedApps,
    setInstalledApps,
    dataPath,
    setDataPath,
    hotkey,
    setHotkey,
    isRecording,
    setIsRecording,
    moveToTopAfterPaste,
    setMoveToTopAfterPaste,
    privacyProtection,
    setPrivacyProtection,
    privacyProtectionKinds,
    setPrivacyProtectionKinds,
    privacyProtectionCustomRules,
    setPrivacyProtectionCustomRules,
    sensitiveMaskPrefixVisible,
    setSensitiveMaskPrefixVisible,
    sensitiveMaskSuffixVisible,
    setSensitiveMaskSuffixVisible,
    sensitiveMaskEmailDomain,
    setSensitiveMaskEmailDomain,
    cleanupRules,
    setCleanupRules,
    appCleanupPolicies,
    setAppCleanupPolicies,
    captureFiles,
    setCaptureFiles,
    captureRichText,
    setCaptureRichText,
    richTextSnapshotPreview,
    setRichTextSnapshotPreview,
    silentStart,
    setSilentStart,
    followMouse,
    setFollowMouse,
    showAppBorder,
    setShowAppBorder,
    winClipboardDisabled,
    setWinClipboardDisabled,
    registryWinVEnabled,
    setRegistryWinVEnabled,
    pasteMethod,
    setPasteMethod,
    theme,
    setTheme,
    colorMode,
    setColorMode,
    showSourceAppIcon,
    setShowSourceAppIcon,

    compactMode,
    setCompactMode,
    clipboardItemFontSize,
    setClipboardItemFontSize,
    emojiPanelEnabled,
    setEmojiPanelEnabled,
    emojiPanelTab,
    setEmojiPanelTab,
    showHotkeyHint,
    setShowHotkeyHint,
    showAutoCloseHint,
    setShowAutoCloseHint,
    language,
    setLanguage,
    settingsLoaded,
    setSettingsLoaded,
    isWindowPinned,
    setIsWindowPinned,
    showSearchBox,
    setShowSearchBox,
    arrowKeySelection,
    setArrowKeySelection,
    hideDockIcon,
    setHideDockIcon,
    edgeDocking,
    setEdgeDocking,

    customBackground,
    setCustomBackground,
    customBackgroundOpacity,
    setCustomBackgroundOpacity,
    surfaceOpacity,
    setSurfaceOpacity,
    selectedIndex,
    setSelectedIndex,
    isKeyboardMode,
    setIsKeyboardMode,
    isLoadingMore,
    setIsLoadingMore,
    hasMore,
    setHasMore,
    currentOffset,
    setCurrentOffset,
    soundEnabled,
    setSoundEnabled,
    pasteSoundEnabled,
    setPasteSoundEnabled,
    soundVolume,
    setSoundVolume,
    typeFilter,
    setTypeFilter
  };
};
