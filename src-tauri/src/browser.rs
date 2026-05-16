use chromiumoxide::browser::{Browser, BrowserConfig};
use chromiumoxide::cdp::browser_protocol::page::CaptureScreenshotParamsBuilder;
use tauri::AppHandle;
use std::sync::Arc;
use tokio::sync::Mutex;

pub struct BrowserController {
    pub browser: Arc<Mutex<Browser>>,
}

pub async fn init_browser_controller(app: AppHandle) {
    let config = BrowserConfig::builder()
        .window_size(1280, 800)
        .build()
        .expect("Failed to build browser config");

    match Browser::launch(config).await {
        Ok((browser, mut handler)) => {
            tokio::spawn(async move {
                while let Some(event) = handler.next().await {
                    let _ = event;
                }
            });

            let controller = BrowserController {
                browser: Arc::new(Mutex::new(browser)),
            };

            app.manage(controller);
            tracing::info!("✅ CometX Browser Engine initialized");
        }
        Err(e) => {
            tracing::error!("❌ Failed to launch browser: {}", e);
        }
    }
}
