
import { memo, useState, useEffect } from "react";
import { getVersion } from "@tauri-apps/api/app";
import { HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import GeneralSettingsGroup from "./groups/GeneralSettingsGroup";
import ClipboardSettingsGroup from "./groups/ClipboardSettingsGroup";
import DataSettingsGroup from "./groups/DataSettingsGroup";
import SettingsFooter from "./SettingsFooter";

type SettingsTab = "general" | "clipboard" | "data";

interface SettingsPanelProps {
    t: (key: string) => string;
    autoStart: boolean;
    silentStart: boolean;
    persistent: boolean;
    persistentLimitEnabled: boolean;
    persistentLimit: number;
    deduplicate: boolean;
    captureFiles: boolean;
    captureRichText: boolean;
    richTextSnapshotPreview: boolean;
    deleteAfterPaste: boolean;
    moveToTopAfterPaste: boolean;
    sequentialMode: boolean;
    sequentialHotkey: string;
    isRecordingSequential: boolean;
    richPasteHotkey: string;
    isRecordingRich: boolean;
    searchHotkey: string;
    isRecordingSearch: boolean;
    quickPasteModifier: "disabled" | "ctrl" | "alt" | "shift" | "win";
    setQuickPasteModifier: (val: "disabled" | "ctrl" | "alt" | "shift" | "win") => void;
    privacyProtection: boolean;
    privacyProtectionKinds: string[];
    setPrivacyProtectionKinds: (val: string[]) => void;
    privacyProtectionCustomRules: string;
    setPrivacyProtectionCustomRules: (val: string) => void;
    sensitiveMaskPrefixVisible: number;
    setSensitiveMaskPrefixVisible: (val: number) => void;
    sensitiveMaskSuffixVisible: number;
    setSensitiveMaskSuffixVisible: (val: number) => void;
    sensitiveMaskEmailDomain: boolean;
    setSensitiveMaskEmailDomain: (val: boolean) => void;
    hotkey: string;
    scrollTopButtonEnabled: boolean;
    setScrollTopButtonEnabled: (val: boolean) => void;
    hideTrayIcon: boolean;
    setHideTrayIcon: (val: boolean) => void;
    hideDockIcon: boolean;
    setHideDockIcon: (val: boolean) => void;
    dataPath: string;
    setAutoStart: (val: boolean) => void;
    setSilentStart: (val: boolean) => void;
    setPersistent: (val: boolean) => void;
    setPersistentLimitEnabled: (val: boolean) => void;
    setPersistentLimit: (val: number) => void;
    setDeduplicate: (val: boolean) => void;
    setCaptureFiles: (val: boolean) => void;
    setCaptureRichText: (val: boolean) => void;
    setRichTextSnapshotPreview: (val: boolean) => void;
    setDeleteAfterPaste: (val: boolean) => void;
    setMoveToTopAfterPaste: (val: boolean) => void;
    saveAppSetting: (key: string, val: string) => void;
    setSequentialModeState: (val: boolean) => void;
    setIsRecordingSequential: (val: boolean) => void;
    updateSequentialHotkey: (key: string) => void;
    setIsRecordingRich: (val: boolean) => void;
    updateRichPasteHotkey: (key: string) => void;
    setIsRecordingSearch: (val: boolean) => void;
    updateSearchHotkey: (key: string) => void;
    setPrivacyProtection: (val: boolean) => void;
    setIsRecording: (val: boolean) => void;
    isRecording: boolean;
    hotkeyParts: string[];
    updateHotkey: (key: string) => void;
    checkHotkeyConflict: (newHotkey: string, mode: 'main' | 'sequential' | 'rich' | 'search') => boolean;
    handleResetSettings: () => void;
}

const SettingsPanel = (props: SettingsPanelProps) => {
    const {
        t, autoStart, silentStart, persistent, persistentLimitEnabled, persistentLimit, deduplicate, captureFiles, captureRichText, richTextSnapshotPreview, deleteAfterPaste, moveToTopAfterPaste,
        sequentialMode, sequentialHotkey, isRecordingSequential,
        richPasteHotkey, isRecordingRich, searchHotkey, isRecordingSearch, quickPasteModifier, setQuickPasteModifier,
        privacyProtection, privacyProtectionKinds, setPrivacyProtectionKinds, privacyProtectionCustomRules, setPrivacyProtectionCustomRules, sensitiveMaskPrefixVisible, setSensitiveMaskPrefixVisible, sensitiveMaskSuffixVisible, setSensitiveMaskSuffixVisible, sensitiveMaskEmailDomain, setSensitiveMaskEmailDomain,
        hotkey,
        scrollTopButtonEnabled, setScrollTopButtonEnabled,
        hideTrayIcon, setHideTrayIcon,
        hideDockIcon, setHideDockIcon,
        dataPath,
        setAutoStart, setSilentStart, setPersistent, setPersistentLimitEnabled, setPersistentLimit, setDeduplicate, setCaptureFiles, setCaptureRichText, setRichTextSnapshotPreview, setDeleteAfterPaste, setMoveToTopAfterPaste, saveAppSetting,
        setSequentialModeState, setIsRecordingSequential, updateSequentialHotkey,
        setIsRecordingRich, updateRichPasteHotkey,
        setIsRecordingSearch, updateSearchHotkey,
        setPrivacyProtection,
        setIsRecording, isRecording, hotkeyParts, updateHotkey,
        checkHotkeyConflict,
        handleResetSettings
    } = props;

    const [activeTab, setActiveTab] = useState<SettingsTab>("general");
    const [emailCopied, setEmailCopied] = useState(false);
    const [appVersion, setAppVersion] = useState("");
    const [updateStatus, setUpdateStatus] = useState<string>("");
    const [openHints, setOpenHints] = useState<Set<string>>(new Set());
    const [privacyKindsOpen, setPrivacyKindsOpen] = useState(false);
    const [privacyRulesOpen, setPrivacyRulesOpen] = useState(false);

    const toggleHint = (key: string) => {
        setOpenHints(prev => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    };

    const LabelWithHint = ({ label, hint, hintKey }: { label: string; hint?: string | React.ReactNode; hintKey: string }) => (
        <div className="item-label-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="item-label">{label}</span>
                {hint && (
                    <button
                        type="button"
                        className="hint-icon-btn"
                        title={typeof hint === 'string' ? hint : undefined}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleHint(hintKey);
                        }}
                    >
                        <HelpCircle size={12} />
                    </button>
                )}
            </div>
            {hint && openHints.has(hintKey) && (
                typeof hint === 'string' ? <span className="hint">{hint}</span> : hint
            )}
        </div>
    );

    useEffect(() => {
        getVersion()
            .then(v => setAppVersion(v))
            .catch(err => {
                console.error("Failed to get version:", err);
                setAppVersion("0.2.0");
            });
    }, []);

    const tabs: Array<{ id: SettingsTab; label: string }> = [
        { id: "general", label: t("general_settings") },
        { id: "clipboard", label: t("clipboard_settings") },
        { id: "data", label: t("data_management") },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '4px', minHeight: '100%', flex: 1 }}
        >
            <div className="settings-tabs" role="tablist">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        className={`settings-tab-btn ${activeTab === tab.id ? "active" : ""}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === "general" && (
                <GeneralSettingsGroup
                    t={t}
                    LabelWithHint={LabelWithHint}
                    autoStart={autoStart}
                    setAutoStart={setAutoStart}
                    silentStart={silentStart}
                    setSilentStart={setSilentStart}
                    hideTrayIcon={hideTrayIcon}
                    setHideTrayIcon={setHideTrayIcon}
                    hideDockIcon={hideDockIcon}
                    setHideDockIcon={setHideDockIcon}
                    scrollTopButtonEnabled={scrollTopButtonEnabled}
                    setScrollTopButtonEnabled={setScrollTopButtonEnabled}
                    saveAppSetting={saveAppSetting}
                />
            )}

            {activeTab === "clipboard" && (
                <ClipboardSettingsGroup
                    t={t}
                    LabelWithHint={LabelWithHint}
                    persistent={persistent}
                    setPersistent={setPersistent}
                    persistentLimitEnabled={persistentLimitEnabled}
                    setPersistentLimitEnabled={setPersistentLimitEnabled}
                    persistentLimit={persistentLimit}
                    setPersistentLimit={setPersistentLimit}
                    saveAppSetting={saveAppSetting}
                    deduplicate={deduplicate}
                    setDeduplicate={setDeduplicate}
                    captureFiles={captureFiles}
                    setCaptureFiles={setCaptureFiles}
                    captureRichText={captureRichText}
                    setCaptureRichText={setCaptureRichText}
                    richTextSnapshotPreview={richTextSnapshotPreview}
                    setRichTextSnapshotPreview={setRichTextSnapshotPreview}
                    richPasteHotkey={richPasteHotkey}
                    isRecordingRich={isRecordingRich}
                    setIsRecordingRich={setIsRecordingRich}
                    updateRichPasteHotkey={updateRichPasteHotkey}
                    searchHotkey={searchHotkey}
                    isRecordingSearch={isRecordingSearch}
                    setIsRecordingSearch={setIsRecordingSearch}
                    updateSearchHotkey={updateSearchHotkey}
                    quickPasteModifier={quickPasteModifier}
                    setQuickPasteModifier={setQuickPasteModifier}
                    deleteAfterPaste={deleteAfterPaste}
                    setDeleteAfterPaste={setDeleteAfterPaste}
                    moveToTopAfterPaste={moveToTopAfterPaste}
                    setMoveToTopAfterPaste={setMoveToTopAfterPaste}
                    sequentialMode={sequentialMode}
                    setSequentialModeState={setSequentialModeState}
                    sequentialHotkey={sequentialHotkey}
                    isRecordingSequential={isRecordingSequential}
                    setIsRecordingSequential={setIsRecordingSequential}
                    updateSequentialHotkey={updateSequentialHotkey}
                    checkHotkeyConflict={checkHotkeyConflict}
                    privacyProtection={privacyProtection}
                    setPrivacyProtection={setPrivacyProtection}
                    privacyProtectionKinds={privacyProtectionKinds}
                    setPrivacyProtectionKinds={setPrivacyProtectionKinds}
                    privacyProtectionCustomRules={privacyProtectionCustomRules}
                    setPrivacyProtectionCustomRules={setPrivacyProtectionCustomRules}
                    sensitiveMaskPrefixVisible={sensitiveMaskPrefixVisible}
                    setSensitiveMaskPrefixVisible={setSensitiveMaskPrefixVisible}
                    sensitiveMaskSuffixVisible={sensitiveMaskSuffixVisible}
                    setSensitiveMaskSuffixVisible={setSensitiveMaskSuffixVisible}
                    sensitiveMaskEmailDomain={sensitiveMaskEmailDomain}
                    setSensitiveMaskEmailDomain={setSensitiveMaskEmailDomain}
                    privacyKindsOpen={privacyKindsOpen}
                    setPrivacyKindsOpen={setPrivacyKindsOpen}
                    privacyRulesOpen={privacyRulesOpen}
                    setPrivacyRulesOpen={setPrivacyRulesOpen}
                    isRecording={isRecording}
                    setIsRecording={setIsRecording}
                    hotkeyParts={hotkeyParts}
                    updateHotkey={updateHotkey}
                    hotkey={hotkey}
                    appSettings={{}}
                    theme=""
                    colorMode=""
                />
            )}

            {activeTab === "data" && (
                <DataSettingsGroup
                    t={t}
                    dataPath={dataPath}
                />
            )}

            <SettingsFooter
                t={t}
                appVersion={appVersion}
                updateStatus={updateStatus}
                setUpdateStatus={setUpdateStatus}
                onResetSettings={handleResetSettings}
                emailCopied={emailCopied}
                setEmailCopied={setEmailCopied}
            />
        </motion.div>
    );
};

export default memo(SettingsPanel);
