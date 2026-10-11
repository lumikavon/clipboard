import type { ComponentType, ReactNode } from "react";
import { invoke } from "@tauri-apps/api/core";

const isMacPlatform =
    /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent) || /Mac/i.test(navigator.platform);

interface LabelWithHintProps {
    label: string;
    hint?: string | ReactNode;
    hintKey: string;
}

interface GeneralSettingsGroupProps {
    t: (key: string) => string;
    LabelWithHint: ComponentType<LabelWithHintProps>;
    autoStart: boolean;
    setAutoStart: (val: boolean) => void;
    silentStart: boolean;
    setSilentStart: (val: boolean) => void;
    hideDockIcon: boolean;
    setHideDockIcon: (val: boolean) => void;
}

const GeneralSettingsGroup = ({
    t,
    LabelWithHint,
    autoStart,
    setAutoStart,
    silentStart,
    setSilentStart,
    hideDockIcon,
    setHideDockIcon,
}: GeneralSettingsGroupProps) => (
    <div className="settings-group">
        <div className="group-content">
            <div className="setting-item">
                <div className="item-label-group">
                    <span className="item-label">{t('autostart')}</span>
                </div>
                <label className="switch">
                    <input
                        className="cb"
                        type="checkbox"
                        checked={autoStart}
                        onChange={(e) => {
                            const enabled = e.target.checked;
                            setAutoStart(enabled);
                            invoke("toggle_autostart", { enabled }).catch(console.error);
                        }}
                    />
                    <div className="toggle"><div className="left" /><div className="right" /></div>
                </label>
            </div>

            {isMacPlatform && (
                <div className="setting-item">
                    <LabelWithHint
                        label={t('hide_dock_icon')}
                        hint={t('hide_dock_icon_hint')}
                        hintKey="hide_dock_icon"
                    />
                    <label className="switch">
                        <input
                            className="cb"
                            type="checkbox"
                            checked={hideDockIcon}
                            onChange={(e) => {
                                const val = e.target.checked;
                                setHideDockIcon(val);
                                invoke("set_dock_visible", { visible: !val }).catch(console.error);
                            }}
                        />
                        <div className="toggle"><div className="left" /><div className="right" /></div>
                    </label>
                </div>
            )}

            <div className="setting-item">
                <LabelWithHint
                    label={t('silent_start')}
                    hint={t('silent_start_hint')}
                    hintKey="silent_start"
                />
                <label className="switch">
                    <input
                        className="cb"
                        type="checkbox"
                        checked={silentStart}
                        onChange={(e) => {
                            const enabled = e.target.checked;
                            setSilentStart(enabled);
                            invoke("set_silent_start", { enabled }).catch(console.error);
                        }}
                    />
                    <div className="toggle"><div className="left" /><div className="right" /></div>
                </label>
            </div>
        </div>
    </div>
);

export default GeneralSettingsGroup;
