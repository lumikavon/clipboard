import { RotateCcw, X, ArrowUpCircle } from "lucide-react";
import type { Update } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { useState } from "react";

interface SettingsFooterProps {
    t: (key: string) => string;
    appVersion: string;
    updateStatus: string;
    setUpdateStatus: (val: string) => void;
    onResetSettings: () => void;
}

const SettingsFooter = ({
    t,
    appVersion,
    updateStatus,
    setUpdateStatus,
    onResetSettings
}: SettingsFooterProps) => {
    const [pendingUpdate, setPendingUpdate] = useState<Update | null>(null);

    const handleInstallUpdate = async () => {
        if (!pendingUpdate) return;
        setUpdateStatus(`${t('downloading')} (0%)`);
        
        let downloaded = 0;
        let total = 0;

        try {
            await pendingUpdate.downloadAndInstall((event) => {
                switch (event.event) {
                    case 'Started':
                        total = event.data.contentLength || 0;
                        break;
                    case 'Progress':
                        downloaded += event.data.chunkLength;
                        if (total > 0) {
                            const percent = Math.round((downloaded / total) * 100);
                            setUpdateStatus(`${t('downloading')} (${percent}%)`);
                        }
                        break;
                    case 'Finished':
                        setUpdateStatus(t('relaunching') || '正在重启...');
                        break;
                }
            });
            await relaunch();
        } catch (err) {
            console.error('Update failed:', err);
            setUpdateStatus(t('checking_failed'));
            setTimeout(() => setUpdateStatus(''), 3000);
        }
    };

    return (
        <>
            {/* Update Confirmation Modal */}
            {pendingUpdate && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px'
                }}>
                    <div className="settings-group" style={{
                        maxWidth: '320px',
                        width: '100%',
                        padding: '16px',
                        background: 'var(--bg-secondary)',
                        borderRadius: '16px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                        border: '1px solid var(--border-color)',
                        animation: 'modalSlideUp 0.3s ease-out'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ArrowUpCircle size={20} color="var(--accent-color)" />
                                <h3 style={{ margin: 0, fontSize: '16px' }}>{t('update_available') || '发现新版本'}</h3>
                            </div>
                            <button
                                onClick={() => setPendingUpdate(null)}
                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div style={{
                            fontSize: '14px',
                            color: 'var(--text-primary)',
                            fontWeight: 600,
                            marginBottom: '8px'
                        }}>
                            v{pendingUpdate.version}
                        </div>

                        {pendingUpdate.body && (
                            <div style={{
                                maxHeight: '160px',
                                overflowY: 'auto',
                                fontSize: '12px',
                                color: 'var(--text-secondary)',
                                background: 'rgba(0,0,0,0.1)',
                                padding: '10px',
                                borderRadius: '8px',
                                marginBottom: '16px',
                                whiteSpace: 'pre-wrap',
                                lineHeight: '1.5'
                            }}>
                                {pendingUpdate.body}
                            </div>
                        )}

                        {/* Progress Bar in the Middle */}
                        {updateStatus.includes('%') && (
                            <div style={{ marginTop: '16px', marginBottom: '8px' }}>
                                <div style={{ 
                                    height: '8px', 
                                    background: 'var(--bg-element)', 
                                    borderRadius: '4px', 
                                    overflow: 'hidden',
                                    border: '1px solid var(--line-soft)',
                                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
                                }}>
                                    <div style={{ 
                                        width: `${updateStatus.split('(')[1].split('%')[0]}%`,
                                        height: '100%',
                                        background: 'linear-gradient(90deg, var(--accent-color) 0%, var(--accent-hover) 100%)',
                                        transition: 'width 0.3s ease-out'
                                    }} />
                                </div>
                                <div style={{ 
                                    textAlign: 'center', 
                                    fontSize: '11px', 
                                    marginTop: '6px', 
                                    color: 'var(--accent-color)',
                                    fontWeight: 700,
                                    letterSpacing: '1px'
                                }}>
                                    {updateStatus.split('(')[1].split(')')[0]}
                                </div>
                                <div style={{ 
                                    textAlign: 'center', 
                                    fontSize: '10px', 
                                    color: 'var(--text-muted)',
                                    marginTop: '2px'
                                }}>
                                    正在同步 0.3.4 核心资源...
                                </div>
                            </div>
                        )}

                        <div style={{ 
                            display: 'flex', 
                            gap: '10px', 
                            marginTop: updateStatus.includes('%') ? '0' : '0',
                            maxHeight: updateStatus.includes('%') ? '0' : '100px',
                            opacity: updateStatus.includes('%') ? 0 : 1,
                            pointerEvents: updateStatus.includes('%') ? 'none' : 'auto',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease'
                        }}>
                            <button
                                className="update-modal-cancel-btn"
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    justifyContent: 'center',
                                    margin: 0,
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    borderRadius: '12px'
                                }}
                                onClick={() => setPendingUpdate(null)}
                            >
                                {t('later') || '稍后再说'}
                            </button>
                            <button
                                className="update-install-btn"
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    justifyContent: 'center',
                                    margin: 0,
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    borderRadius: '12px'
                                }}
                                onClick={handleInstallUpdate}
                            >
                                {t('install_now') || '立即安装'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer Actions */}
            <div style={{
                marginTop: '16px',
                display: 'flex',
                justifyContent: 'center',
                gap: '12px',
                flexWrap: 'wrap'
            }}>
                {/* Reset Card */}
                <div
                    className="settings-group"
                    style={{
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        margin: 0,
                        width: 'auto',
                        padding: '10px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '0'
                    }}
                    onClick={() => onResetSettings()}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <RotateCcw size={16} />
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>{t('reset_defaults')}</span>
                    </div>
                </div>
            </div>

            {/* Version Info */}
            <div style={{
                marginTop: '16px',
                marginBottom: '32px',
                textAlign: 'center',
                opacity: 1
            }}>
                <div style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    letterSpacing: '0.5px',
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                }}>
                    <span>Clipboard {appVersion ? `v${appVersion}` : "v0.2.0"}</span>
                </div>
                <div style={{
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                    fontWeight: 500,
                    marginBottom: '0'
                }}>
                    {t('slogan')}
                </div>
            </div>
        </>
    );
};

export default SettingsFooter;
