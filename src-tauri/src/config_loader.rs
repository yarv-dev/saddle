use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::Path;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SaddleConfig {
    pub name: String,
    pub version: String,
    pub tokens: TokenGroups,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TokenGroups {
    #[serde(default)]
    pub colors: HashMap<String, String>,
    #[serde(default)]
    pub spacing: HashMap<String, String>,
    #[serde(default)]
    pub rounded: HashMap<String, String>,
    #[serde(rename = "fontSize", default)]
    pub font_size: HashMap<String, String>,
}

pub fn load_config(project_root: &str) -> Result<SaddleConfig, String> {
    let config_path = Path::new(project_root).join("saddle.config.json");

    if !config_path.exists() {
        return Err("saddle.config.json not found".to_string());
    }

    let content = fs::read_to_string(&config_path)
        .map_err(|e| format!("Failed to read config: {}", e))?;

    let config: SaddleConfig = serde_json::from_str(&content)
        .map_err(|e| format!("Failed to parse config: {}", e))?;

    Ok(config)
}

pub fn save_config(project_root: &str, config: &SaddleConfig) -> Result<(), String> {
    let config_path = Path::new(project_root).join("saddle.config.json");

    let json = serde_json::to_string_pretty(config)
        .map_err(|e| format!("Failed to serialize config: {}", e))?;

    fs::write(&config_path, json)
        .map_err(|e| format!("Failed to write config: {}", e))?;

    Ok(())
}
