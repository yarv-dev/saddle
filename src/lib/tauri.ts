import { invoke } from '@tauri-apps/api/core';
import type { Component, ProjectStructure } from '../types/component';

export interface FileInfo {
  path: string;
  name: string;
  is_dir: boolean;
}

export interface ParsedFile {
  frontmatter: any;
  code: string;
}

export async function scanProjectDirectory(path: string): Promise<FileInfo[]> {
  return invoke<FileInfo[]>('scan_project_directory', { path });
}

export async function readComponentFile(path: string): Promise<string> {
  return invoke<string>('read_component_file', { path });
}

export async function parseComponentFile(content: string): Promise<ParsedFile> {
  return invoke<ParsedFile>('parse_component_file', { content });
}

export async function loadProject(
  rootPath: string,
  componentPath: string = 'src/components',
  extensions: string[] = ['.tsx', '.jsx']
): Promise<ProjectStructure> {
  const fullComponentPath = `${rootPath}/${componentPath}`.replace(/\/+/g, '/');
  const files = await scanProjectDirectory(rootPath);

  console.log('Total files scanned:', files.length);
  console.log('Root path:', rootPath);
  console.log('Component path:', componentPath);
  console.log('Extensions:', extensions);

  // Find component directories within the specified path
  const componentDirs = files.filter(f => {
    const isInComponentPath = f.path.startsWith(fullComponentPath);
    const isDir = f.is_dir;
    const notRootDir = f.path !== fullComponentPath;
    return isDir && isInComponentPath && notRootDir;
  });

  console.log('Component directories found:', componentDirs.length, componentDirs.map(d => ({ name: d.name, path: d.path })));

  const components: Component[] = [];

  for (const dir of componentDirs) {
    const componentFiles = files.filter(f => {
      if (f.is_dir) return false;
      if (!f.path.startsWith(dir.path)) return false;
      return extensions.some(ext => f.name.endsWith(ext));
    });

    console.log(`Files in ${dir.name}:`, componentFiles.length, componentFiles.map(f => f.name));

    const variants = await Promise.all(
      componentFiles.map(async (file) => {
        const content = await readComponentFile(file.path);
        const parsed = await parseComponentFile(content);

        // Extract variant name from filename (e.g., "Button.Primary.tsx" -> "Primary")
        const fileNameParts = file.name.replace('.tsx', '').split('.');
        const variantName = fileNameParts.length > 1 ? fileNameParts[fileNameParts.length - 1] : 'Default';

        return {
          filePath: file.path,
          variantName,
          frontmatter: parsed.frontmatter,
          code: parsed.code,
        };
      })
    );

    components.push({
      name: dir.name,
      directory: dir.path,
      variants,
    });
  }

  console.log('Total components loaded:', components.length);

  return {
    rootPath,
    components,
  };
}
