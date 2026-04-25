use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize)]
pub struct ComponentSchema {
    pub name: String,
    pub variants: Vec<VariantSchema>,
    pub directory: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct VariantSchema {
    pub name: String,
    pub file_path: String,
    pub tokens: HashMap<String, String>,
    pub props: Vec<String>,
    pub description: Option<String>,
    pub usage: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MCPTool {
    pub name: String,
    pub description: String,
    pub input_schema: serde_json::Value,
}

// MCP Tool definitions that Saddle exposes
pub fn get_available_tools() -> Vec<MCPTool> {
    vec![
        MCPTool {
            name: "get_component_schema".to_string(),
            description: "Get the schema (tokens, props, variants) for a component".to_string(),
            input_schema: serde_json::json!({
                "type": "object",
                "properties": {
                    "component_name": {
                        "type": "string",
                        "description": "Name of the component"
                    }
                },
                "required": ["component_name"]
            }),
        },
        MCPTool {
            name: "list_components".to_string(),
            description: "List all components in the loaded project".to_string(),
            input_schema: serde_json::json!({
                "type": "object",
                "properties": {}
            }),
        },
        MCPTool {
            name: "update_tokens".to_string(),
            description: "Update design tokens for a component variant".to_string(),
            input_schema: serde_json::json!({
                "type": "object",
                "properties": {
                    "file_path": {
                        "type": "string",
                        "description": "Path to the component file"
                    },
                    "tokens": {
                        "type": "object",
                        "description": "Token key-value pairs"
                    }
                },
                "required": ["file_path", "tokens"]
            }),
        },
        MCPTool {
            name: "get_global_tokens".to_string(),
            description: "Get global design tokens from saddle.config.json".to_string(),
            input_schema: serde_json::json!({
                "type": "object",
                "properties": {
                    "project_root": {
                        "type": "string",
                        "description": "Project root directory"
                    }
                },
                "required": ["project_root"]
            }),
        },
    ]
}

// MCP server state
pub struct MCPServer {
    pub project_root: Option<String>,
    pub components: Vec<ComponentSchema>,
}

impl MCPServer {
    pub fn new() -> Self {
        MCPServer {
            project_root: None,
            components: Vec::new(),
        }
    }

    pub fn set_project(&mut self, root: String, components: Vec<ComponentSchema>) {
        self.project_root = Some(root);
        self.components = components;
    }

    pub fn get_component(&self, name: &str) -> Option<&ComponentSchema> {
        self.components.iter().find(|c| c.name == name)
    }
}
