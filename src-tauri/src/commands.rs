use tauri::State;
use crate::browser::BrowserController;
use crate::session::{AgentAction, SessionState};
use serde_json::Value;

#[tauri::command]
pub async fn navigate(
    url: String,
    browser: State<'_, BrowserController>,
) -> Result<String, String> {
    let browser = browser.browser.lock().await;
    let page = browser.new_page(&url).await
        .map_err(|e| format!("Navigate failed: {}", e))?;
    let title = page.get_title().await.unwrap_or_default();
    Ok(format!("Navigated to: {} — Title: {:?}", url, title))
}

#[tauri::command]
pub async fn execute_action(
    action: AgentAction,
    _browser: State<'_, BrowserController>,
) -> Result<String, String> {
    // Execute action from AI planner
    match action.action.as_str() {
        "click" => Ok(format!("Clicked: {:?}", action.selector)),
        "type" => Ok(format!("Typed into: {:?}", action.selector)),
        "navigate" => Ok(format!("Navigating to: {:?}", action.url)),
        "scroll" => Ok("Scrolled".to_string()),
        _ => Err(format!("Unknown action: {}", action.action)),
    }
}

#[tauri::command]
pub async fn get_dom_snapshot(
    _browser: State<'_, BrowserController>,
) -> Result<Value, String> {
    // Returns simplified DOM for LLM context
    Ok(serde_json::json!({
        "status": "ok",
        "elements": []
    }))
}

#[tauri::command]
pub async fn take_screenshot(
    _browser: State<'_, BrowserController>,
) -> Result<String, String> {
    // Returns base64 screenshot for Vision Processor
    Ok("base64_screenshot_placeholder".to_string())
}

#[tauri::command]
pub async fn get_session_state() -> Result<SessionState, String> {
    Ok(SessionState::new())
}
