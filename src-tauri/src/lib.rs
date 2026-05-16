use tauri::Manager;

mod browser;
mod session;
mod commands;

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            commands::navigate,
            commands::execute_action,
            commands::get_dom_snapshot,
            commands::take_screenshot,
            commands::get_session_state,
        ])
        .setup(|app| {
            let handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                browser::init_browser_controller(handle).await;
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("CometX failed to start");
}
