// src-tauri/src/file_operations.rs
use walkdir::WalkDir;

#[derive(serde::Serialize)]
pub struct FileInfo {
    pub path: String,
    pub name: String,
    pub is_dir: bool,
}

pub fn scan_directory(path: &str) -> Result<Vec<FileInfo>, String> {
    let mut files = Vec::new();

    for entry in WalkDir::new(path)
        .max_depth(5)
        .into_iter()
        .filter_map(|e| e.ok())
    {
        let path_str = entry.path().to_string_lossy().to_string();
        let name = entry.file_name().to_string_lossy().to_string();
        let is_dir = entry.path().is_dir();

        files.push(FileInfo {
            path: path_str,
            name,
            is_dir,
        });
    }

    Ok(files)
}

pub fn read_file(path: &str) -> Result<String, String> {
    std::fs::read_to_string(path)
        .map_err(|e| format!("Failed to read file: {}", e))
}
