use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SessionState {
    pub cookies: HashMap<String, String>,
    pub local_storage: HashMap<String, String>,
    pub current_url: String,
    pub tab_id: String,
}

impl SessionState {
    pub fn new() -> Self {
        Self {
            cookies: HashMap::new(),
            local_storage: HashMap::new(),
            current_url: String::from("about:blank"),
            tab_id: uuid::Uuid::new_v4().to_string(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgentAction {
    pub action: String,         // "click", "type", "navigate", "scroll"
    pub selector: Option<String>,
    pub text: Option<String>,
    pub url: Option<String>,
    pub coordinates: Option<(f64, f64)>,
    pub submit: Option<bool>,
}
