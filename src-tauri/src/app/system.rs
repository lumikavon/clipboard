use crate::global_state::TASKBAR_CREATED_MSG;
use std::sync::atomic::Ordering;
#[cfg(target_os = "windows")]
use windows::Win32::Foundation::{HWND, LPARAM, LRESULT, WPARAM};
#[cfg(target_os = "windows")]
use windows::Win32::UI::Shell::DefSubclassProc;

/// Window subclass procedure to handle taskbar recreation (explorer restart)
#[cfg(target_os = "windows")]
pub unsafe extern "system" fn tray_subclass_proc(
    hwnd: HWND,
    msg: u32,
    wparam: WPARAM,
    lparam: LPARAM,
    _id: usize,
    _data: usize,
) -> LRESULT {
    let _ = TASKBAR_CREATED_MSG.load(Ordering::Relaxed);
    DefSubclassProc(hwnd, msg, wparam, lparam)
}
