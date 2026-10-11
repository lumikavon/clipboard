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
  checkHotkeyConflict: (newHotkey: string, mode: "main") => boolean;
  updateHotkey: (key: string) => void;
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
    moveToTopAfterPaste,
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
    setMoveToTopAfterPaste,
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
    moveToTopAfterPaste,
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
    setMoveToTopAfterPaste,
    saveAppSetting,
    setPrivacyProtection,
    setIsRecording,
    isRecording,
    hotkeyParts,
    updateHotkey,
    checkHotkeyConflict,
    handleResetSettings,
  };
};
