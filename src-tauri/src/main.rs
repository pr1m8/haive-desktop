// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::collections::HashMap;
use std::sync::Mutex;
use tauri::{AppHandle, Manager, State};
use uuid::Uuid;

mod terminal;
mod file_system;

// State for managing terminal sessions
type TerminalSessions = Mutex<HashMap<String, terminal::TerminalSession>>;

// Main entry point
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_window::init())
        .plugin(tauri_plugin_os::init())
        .manage(TerminalSessions::default())
        .invoke_handler(tauri::generate_handler![
            // Terminal commands
            terminal::create_terminal,
            terminal::write_to_terminal,
            terminal::resize_terminal,
            terminal::close_terminal,

            // File system commands
            file_system::read_directory,
            file_system::get_file_info,
            file_system::watch_directory,
        ])
        .setup(|app| {
            // Setup window and initial state
            let window = app.get_webview_window("main").unwrap();
            window.set_title("Haive Desktop")?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
