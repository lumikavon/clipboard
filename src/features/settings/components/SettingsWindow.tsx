import { useCallback, useEffect, useMemo } from "react";
import { invoke } from "@tauri-apps/api/core";
import { translations } from "../../../locales";
import SettingsPanel from "./SettingsPanel";
import { useAppState } from "../../app/hooks/useAppState";
import { useSettingsInit } from "../../../shared/hooks/useSettingsInit";
import { useSettingsPostInit } from "../../../shared/hooks/useSettingsPostInit";
import { useAppBootstrap } from "../../../shared/hooks/useAppBootstrap";
import { useSettingsApply } from "../../../shared/hooks/useSettingsApply";
import { useCustomBackground } from "../../../shared/hooks/useCustomBackground";
import { useHotkeyConfig } from "../../../shared/hooks/useHotkeyConfig";
import { useSettingsPanelProps } from "../hooks/useSettingsPanelProps";
import { useOverlays } from "../../../shared/hooks/useOverlays";
import { useSettingsPanelReset } from "../../../shared/hooks/useSettingsPanelReset";
import ToastContainer from "../../../shared/components/ToastContainer";
import ConfirmDialog from "../../../shared/components/ConfirmDialog";
import ContextMenu from "../../../shared/components/ContextMenu";
import { useContextMenu } from "../../../shared/hooks/useContextMenu";

/**
 * Independent settings window root (`index.html?window=settings`).
 * Renders the full SettingsPanel inside its own OS window.
 */
const SettingsWindow = () => {
    const appState = useAppState();
    const {
        setAppSettings,
        setHotkey,
        setTheme,
        setColorMode,
        setCompactMode,
        language,
        setLanguage,
        theme,
        colorMode,
        compactMode,
        settingsLoaded,
        clipboardItemFontSize,
        hotkey,
        sequentialHotkey,
        setSequentialHotkey,
        richPasteHotkey,
        setRichPasteHotkey,
        searchHotkey,
        setSearchHotkey,
        sequentialMode,
        isRecording,
        setIsRecording,
        isRecordingSequential,
        setIsRecordingSequential,
        isRecordingRich,
        setIsRecordingRich,
        isRecordingSearch,
        setIsRecordingSearch,
        customBackground,
        setCustomBackground,
        customBackgroundOpacity,
        setCustomBackgroundOpacity,
        surfaceOpacity,
        setSurfaceOpacity,
        setDataPath,
        setInstalledApps,
        setAutoStart,
        setDefaultApps,
        setWinClipboardDisabled,
        setCollapsedGroups,
        setSettingsSubpage
    } = appState;

    const t = useCallback((key: string) => {
        const k = key as keyof typeof translations["zh"];
        return translations[language][k] || translations["en"][k] || key;
    }, [language]);

    const { toasts, pushToast, confirmDialog, openConfirm, closeConfirm } = useOverlays();

    const openDevtools = useCallback(() => {
        invoke("open_devtools").catch((err) => {
            console.error("Failed to open devtools:", err);
            pushToast(String(err) || t("devtools_unavailable"), 3000);
        });
    }, [pushToast, t]);

    const contextMenuItems = useMemo(
        () => [{ label: t("open_devtools"), onClick: openDevtools }],
        [t, openDevtools]
    );

    const { contextMenu, closeContextMenu } = useContextMenu(contextMenuItems);

    const settings = useSettingsInit({
        setAppSettings,
        setHotkey,
        setTheme,
        setColorMode,
        setCompactMode,
        setLanguage
    });

    useSettingsPostInit({
        settings,
        setCustomBackground,
        setCustomBackgroundOpacity,
        setSurfaceOpacity,
        setPersistent: appState.setPersistent,
        setPersistentLimitEnabled: appState.setPersistentLimitEnabled,
        setPersistentLimit: appState.setPersistentLimit,
        setDeduplicate: appState.setDeduplicate,
        setCaptureFiles: appState.setCaptureFiles,
        setCaptureRichText: appState.setCaptureRichText,
        setRichTextSnapshotPreview: appState.setRichTextSnapshotPreview,
        setPrivacyProtection: appState.setPrivacyProtection,
        setPrivacyProtectionKinds: appState.setPrivacyProtectionKinds,
        setPrivacyProtectionCustomRules: appState.setPrivacyProtectionCustomRules,
        setSensitiveMaskPrefixVisible: appState.setSensitiveMaskPrefixVisible,
        setSensitiveMaskSuffixVisible: appState.setSensitiveMaskSuffixVisible,
        setSensitiveMaskEmailDomain: appState.setSensitiveMaskEmailDomain,
        setCleanupRules: appState.setCleanupRules,
        setAppCleanupPolicies: appState.setAppCleanupPolicies,
        setSilentStart: appState.setSilentStart,
        setFollowMouse: appState.setFollowMouse,
        setShowAppBorder: appState.setShowAppBorder,
        setRegistryWinVEnabled: appState.setRegistryWinVEnabled,
        setPasteMethod: appState.setPasteMethod,
        setShowSourceAppIcon: appState.setShowSourceAppIcon,
        setDeleteAfterPaste: appState.setDeleteAfterPaste,
        setMoveToTopAfterPaste: appState.setMoveToTopAfterPaste,
        setHideTrayIcon: appState.setHideTrayIcon,
        setHideDockIcon: appState.setHideDockIcon,
        setEdgeDocking: appState.setEdgeDocking,
        setShowSearchBox: appState.setShowSearchBox,
        setScrollTopButtonEnabled: appState.setScrollTopButtonEnabled,
        setArrowKeySelection: appState.setArrowKeySelection,
        setSequentialHotkey,
        setRichPasteHotkey,
        setSearchHotkey,
        setQuickPasteModifier: appState.setQuickPasteModifier,
        setSequentialModeState: appState.setSequentialModeState,
        setSoundEnabled: appState.setSoundEnabled,
        setPasteSoundEnabled: appState.setPasteSoundEnabled,
        setSoundVolume: appState.setSoundVolume,
        setIsWindowPinned: appState.setIsWindowPinned,
        setSettingsLoaded: appState.setSettingsLoaded,
        setClipboardItemFontSize: appState.setClipboardItemFontSize,
        setEmojiPanelEnabled: appState.setEmojiPanelEnabled,
        setEmojiPanelTab: appState.setEmojiPanelTab,
        setEmojiFavorites: appState.setEmojiFavorites
    });

    useAppBootstrap({
        setDataPath,
        setInstalledApps,
        setAutoStart,
        setDefaultApps,
        setWinClipboardDisabled
    });

    useSettingsApply({
        theme,
        colorMode,
        showAppBorder: appState.showAppBorder,
        compactMode,
        settingsLoaded,
        clipboardItemFontSize,
        surfaceOpacity
    });

    useCustomBackground({
        customBackground,
        customBackgroundOpacity,
        theme
    });

    const saveAppSetting = useCallback(async (type: string, path: string) => {
        const key = `app.${type}`;
        setAppSettings(prev => ({ ...prev, [key]: path }));
        try {
            await invoke("save_setting", { key, value: path });
        } catch (err) {
            console.error("保存设置失败", err);
        }
    }, [setAppSettings]);

    const saveSetting = useCallback((key: string, val: string) => {
        invoke("save_setting", { key, value: val }).catch(console.error);
    }, []);

    const { checkHotkeyConflict, updateHotkey, updateSequentialHotkey, updateRichPasteHotkey, updateSearchHotkey } =
        useHotkeyConfig({
            hotkey,
            setHotkey,
            sequentialHotkey,
            setSequentialHotkey,
            richPasteHotkey,
            setRichPasteHotkey,
            searchHotkey,
            setSearchHotkey,
            sequentialMode,
            isRecording,
            setIsRecording,
            isRecordingSequential,
            setIsRecordingSequential,
            isRecordingRich,
            setIsRecordingRich,
            isRecordingSearch,
            setIsRecordingSearch,
            saveAppSetting,
            t,
            pushToast
        });

    const toggleGroup = useCallback((group: string) => {
        setCollapsedGroups(prev => ({
            ...prev,
            [group]: !prev[group]
        }));
    }, [setCollapsedGroups]);

    useSettingsPanelReset({ showSettings: true, setCollapsedGroups, setSettingsSubpage });

    // Keep the main window visible while this standalone settings window is open.
    // Backend also skips auto-hide when the settings window exists; this covers
    // the race where main blurs before the settings window is visible, and
    // resets the flag when settings closes.
    useEffect(() => {
        invoke("set_ignore_blur", { ignore: true }).catch(() => {});
        const handleBeforeUnload = () => {
            // Fire-and-forget: page is being torn down.
            try {
                void invoke("set_ignore_blur", { ignore: false });
            } catch {
                // Ignore teardown errors.
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            invoke("set_ignore_blur", { ignore: false }).catch(() => {});
        };
    }, []);

    const handleResetSettings = useCallback(() => {
        openConfirm({
            title: t("reset_confirm"),
            message: t("reset_confirm"),
            onConfirm: async () => {
                try {
                    await invoke("reset_settings");
                    window.location.reload();
                } catch (err) {
                    const errorMsg = t("reset_failed") + (err?.toString() || "");
                    pushToast(errorMsg, 3000);
                }
                closeConfirm();
            }
        });
    }, [closeConfirm, openConfirm, pushToast, t]);

    const hotkeyParts = useMemo(
        () => (hotkey || '').split('+').map((part) => part.trim()).filter(Boolean),
        [hotkey]
    );

    const settingsPanelProps = useSettingsPanelProps({
        t,
        theme,
        language,
        colorMode,
        hotkeyParts,
        checkHotkeyConflict,
        updateHotkey,
        updateSequentialHotkey,
        updateRichPasteHotkey,
        updateSearchHotkey,
        saveAppSetting,
        saveSetting,
        handleResetSettings,
        toggleGroup,
        state: appState
    });

    return (
        <div className="settings-window-shell">
            <div className="settings-window-content">
                <SettingsPanel {...settingsPanelProps} />
            </div>
            <ToastContainer toasts={toasts} />

            <ContextMenu state={contextMenu} onClose={closeContextMenu} />
            <ConfirmDialog
                open={confirmDialog.show}
                title={confirmDialog.title}
                message={confirmDialog.message}
                theme={theme}
                confirmLabel={t('confirm')}
                cancelLabel={t('cancel')}
                onClose={closeConfirm}
                onConfirm={confirmDialog.onConfirm}
            />
        </div>
    );
};

export default SettingsWindow;
