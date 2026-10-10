import type { ComponentProps } from "react";
import SettingsPanel from "../components/SettingsPanel";
import type { AppState } from "../../app/types";
import type { Locale } from "../../../shared/types";

type SettingsPanelProps = ComponentProps<typeof SettingsPanel>;

interface UseSettingsPanelPropsOptions {
  t: (key: string) => string;
  theme: string;
  language: Locale;
  colorMode: string;
  hotkeyParts: string[];
  checkHotkeyConflict: (newHotkey: string, mode: "main" | "sequential" | "rich" | "search") => boolean;
  updateHotkey: (key: string) => void;
  updateSequentialHotkey: (key: string) => void;
  updateRichPasteHotkey: (key: string) => void;
  updateSearchHotkey: (key: string) => void;
  saveAppSetting: (key: string, val: string) => void;
  saveSetting: (key: string, val: string) => void;
  handleResetSettings: () => void;
  toggleGroup: (group: string) => void;
  state: AppState;
}

export const useSettingsPanelProps = ({
  t,
  hotkeyParts,
  checkHotkeyConflict,
  updateHotkey,
  updateSequentialHotkey,
  updateRichPasteHotkey,
  updateSearchHotkey,
  saveAppSetting,
  handleResetSettings,
  state
}: UseSettingsPanelPropsOptions): SettingsPanelProps => {
  const {
    autoStart,
    silentStart,
    persistent,
    persistentLimitEnabled,
    persistentLimit,
    deduplicate,
    captureFiles,
    captureRichText,
    richTextSnapshotPreview,
    deleteAfterPaste,
    moveToTopAfterPaste,
    sequentialMode,
    sequentialHotkey,
    isRecordingSequential,
    richPasteHotkey,
    isRecordingRich,
    searchHotkey,
    isRecordingSearch,
    quickPasteModifier,
    setQuickPasteModifier,
    privacyProtection,
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
    hotkey,
    scrollTopButtonEnabled,
    setScrollTopButtonEnabled,
    hideTrayIcon,
    setHideTrayIcon,
    hideDockIcon,
    setHideDockIcon,
    dataPath,
    setAutoStart,
    setSilentStart,
    setPersistent,
    setPersistentLimitEnabled,
    setPersistentLimit,
    setDeduplicate,
    setCaptureFiles,
    setCaptureRichText,
    setRichTextSnapshotPreview,
    setDeleteAfterPaste,
    setMoveToTopAfterPaste,
    setSequentialModeState,
    setIsRecordingSequential,
    setIsRecordingRich,
    setIsRecordingSearch,
    setPrivacyProtection,
    setIsRecording,
    isRecording,
  } = state;

  return {
    t,
    autoStart,
    silentStart,
    persistent,
    persistentLimitEnabled,
    persistentLimit,
    deduplicate,
    captureFiles,
    captureRichText,
    richTextSnapshotPreview,
    deleteAfterPaste,
    moveToTopAfterPaste,
    sequentialMode,
    sequentialHotkey,
    isRecordingSequential,
    richPasteHotkey,
    isRecordingRich,
    searchHotkey,
    isRecordingSearch,
    quickPasteModifier,
    setQuickPasteModifier,
    privacyProtection,
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
    hotkey,
    scrollTopButtonEnabled,
    setScrollTopButtonEnabled,
    hideTrayIcon,
    setHideTrayIcon,
    hideDockIcon,
    setHideDockIcon,
    dataPath,
    setAutoStart,
    setSilentStart,
    setPersistent,
    setPersistentLimitEnabled,
    setPersistentLimit,
    setDeduplicate,
    setCaptureFiles,
    setCaptureRichText,
    setRichTextSnapshotPreview,
    setDeleteAfterPaste,
    setMoveToTopAfterPaste,
    saveAppSetting,
    setSequentialModeState,
    setIsRecordingSequential,
    updateSequentialHotkey,
    setIsRecordingRich,
    updateRichPasteHotkey,
    setIsRecordingSearch,
    updateSearchHotkey,
    setPrivacyProtection,
    setIsRecording,
    isRecording,
    hotkeyParts,
    updateHotkey,
    checkHotkeyConflict,
    handleResetSettings,
  };
};
