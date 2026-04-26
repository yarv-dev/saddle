// Saddle MCP Server - AWS Lambda handler
// Handles MCP tool calls over HTTP for remote Claude connections

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync } from 'fs';
import { join, basename } from 'path';

// In Lambda, project files would be stored in EFS or S3
// For now this handles the MCP protocol over HTTP

const TOOLS = [
  {
    name: 'saddle_list_components',
    description: 'List all components in a Saddle project with their variants, tokens, and metadata',
    inputSchema: {
      type: 'object',
      properties: {
        project_root: { type: 'string', description: 'Project root path' },
        component_path: { type: 'string', default: 'src/components' },
      },
      required: ['project_root'],
    },
  },
  {
    name: 'saddle_get_component',
    description: 'Get full details for a component including all variants, tokens, props, and usage guidelines',
    inputSchema: {
      type: 'object',
      properties: {
        project_root: { type: 'string' },
        component_path: { type: 'string', default: 'src/components' },
        component_name: { type: 'string' },
      },
      required: ['project_root', 'component_name'],
    },
  },
  {
    name: 'saddle_update_tokens',
    description: 'Update design tokens in a component variant frontmatter. Saves immediately.',
    inputSchema: {
      type: 'object',
      properties: {
        file_path: { type: 'string' },
        tokens: { type: 'object' },
      },
      required: ['file_path', 'tokens'],
    },
  },
  {
    name: 'saddle_read_component',
    description: 'Read full source code of a component file including design.md frontmatter',
    inputSchema: {
      type: 'object',
      properties: { file_path: { type: 'string' } },
      required: ['file_path'],
    },
  },
  {
    name: 'saddle_create_variant',
    description: 'Create a new variant file with design.md frontmatter and boilerplate React code',
    inputSchema: {
      type: 'object',
      properties: {
        component_directory: { type: 'string' },
        component_name: { type: 'string' },
        variant_name: { type: 'string' },
        tokens: { type: 'object' },
        description: { type: 'string' },
      },
      required: ['component_directory', 'component_name', 'variant_name'],
    },
  },
  {
    name: 'saddle_get_global_tokens',
    description: 'Read global design tokens from saddle.config.json',
    inputSchema: {
      type: 'object',
      properties: { project_root: { type: 'string' } },
      required: ['project_root'],
    },
  },
];

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: null, code: content };
  try {
    // Simple YAML parse (key: value pairs)
    const fm = {};
    let currentKey = null;
    let currentObj = null;
    for (const line of match[1].split('\n')) {
      const kvMatch = line.match(/^(\w+):\s*(.+)?$/);
      if (kvMatch && !line.startsWith('  ')) {
        currentKey = kvMatch[1];
        const val = kvMatch[2]?.trim();
        if (val === '|') {
          fm[currentKey] = '';
          currentObj = null;
        } else if (val) {
          fm[currentKey] = val.replace(/^['"]|['"]$/g, '');
          currentObj = null;
        } else {
          fm[currentKey] = {};
          currentObj = currentKey;
        }
      } else if (currentObj && line.startsWith('  ')) {
        const subMatch = line.trim().match(/^(\w+):\s*['"]?(.+?)['"]?$/);
        if (subMatch) {
          if (typeof fm[currentObj] !== 'object') fm[currentObj] = {};
          fm[currentObj][subMatch[1]] = subMatch[2];
        } else if (line.trim().startsWith('- ')) {
          if (!Array.isArray(fm[currentObj])) fm[currentObj] = [];
          fm[currentObj].push(line.trim().substring(2));
        }
      } else if (currentKey && fm[currentKey] !== undefined && typeof fm[currentKey] === 'string' && line.startsWith('  ')) {
        fm[currentKey] += line.trim() + '\n';
      }
    }
    return { frontmatter: fm, code: match[2] };
  } catch {
    return { frontmatter: null, code: content };
  }
}

function scanComponents(rootPath, componentPath) {
  const fullPath = join(rootPath, componentPath);
  if (!existsSync(fullPath)) return [];

  const dirs = readdirSync(fullPath).filter(f => statSync(join(fullPath, f)).isDirectory());

  return dirs.map(dirName => {
    const dirPath = join(fullPath, dirName);
    const files = readdirSync(dirPath).filter(f => f.endsWith('.tsx') || f.endsWith('.jsx'));

    const variants = files.map(fileName => {
      const filePath = join(dirPath, fileName);
      const content = readFileSync(filePath, 'utf-8');
      const { frontmatter, code } = parseFrontmatter(content);
      const parts = fileName.replace(/\.(tsx|jsx)$/, '').split('.');
      const variantName = parts.length > 1 ? parts[parts.length - 1] : 'Default';

      return {
        name: variantName,
        file_path: filePath,
        tokens: frontmatter?.tokens || {},
        props: frontmatter?.props || [],
        description: frontmatter?.description || null,
        usage: frontmatter?.usage || null,
      };
    });

    return { name: dirName, directory: dirPath, variants };
  });
}

function handleToolCall(name, args) {
  switch (name) {
    case 'saddle_list_components': {
      const components = scanComponents(args.project_root, args.component_path || 'src/components');
      return { content: [{ type: 'text', text: JSON.stringify(components, null, 2) }] };
    }
    case 'saddle_get_component': {
      const components = scanComponents(args.project_root, args.component_path || 'src/components');
      const comp = components.find(c => c.name === args.component_name);
      if (!comp) return { content: [{ type: 'text', text: `Component "${args.component_name}" not found` }], isError: true };
      return { content: [{ type: 'text', text: JSON.stringify(comp, null, 2) }] };
    }
    case 'saddle_read_component': {
      if (!existsSync(args.file_path)) return { content: [{ type: 'text', text: 'File not found' }], isError: true };
      const content = readFileSync(args.file_path, 'utf-8');
      return { content: [{ type: 'text', text: content }] };
    }
    case 'saddle_update_tokens': {
      if (!existsSync(args.file_path)) return { content: [{ type: 'text', text: 'File not found' }], isError: true };
      const content = readFileSync(args.file_path, 'utf-8');
      const parts = content.split('---');
      if (parts.length < 3) return { content: [{ type: 'text', text: 'Invalid frontmatter' }], isError: true };
      const { frontmatter } = parseFrontmatter(content);
      if (!frontmatter) return { content: [{ type: 'text', text: 'Parse failed' }], isError: true };
      frontmatter.tokens = { ...(frontmatter.tokens || {}), ...args.tokens };
      // Rebuild YAML
      const lines = [];
      for (const [k, v] of Object.entries(frontmatter)) {
        if (typeof v === 'object' && !Array.isArray(v)) {
          lines.push(`${k}:`);
          for (const [ik, iv] of Object.entries(v)) lines.push(`  ${ik}: "${iv}"`);
        } else if (Array.isArray(v)) {
          lines.push(`${k}:`);
          v.forEach(i => lines.push(`  - ${i}`));
        } else if (typeof v === 'string' && v.includes('\n')) {
          lines.push(`${k}: |`);
          v.split('\n').filter(Boolean).forEach(l => lines.push(`  ${l}`));
        } else {
          lines.push(`${k}: ${v}`);
        }
      }
      const newContent = `---\n${lines.join('\n')}\n---${parts.slice(2).join('---')}`;
      writeFileSync(args.file_path, newContent);
      return { content: [{ type: 'text', text: `Updated tokens in ${basename(args.file_path)}` }] };
    }
    case 'saddle_create_variant': {
      const dir = args.component_directory;
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      const fileName = `${args.component_name}.${args.variant_name}.tsx`;
      const filePath = join(dir, fileName);
      const tokensYaml = args.tokens
        ? Object.entries(args.tokens).map(([k, v]) => `  ${k}: "${v}"`).join('\n')
        : '  backgroundColor: "#ffffff"';
      const desc = args.description || `${args.component_name} ${args.variant_name} variant`;
      const content = `---\nname: ${args.component_name} ${args.variant_name}\ndescription: ${desc}\ntokens:\n${tokensYaml}\nprops:\n  - label: string\nusage: |\n  Describe when to use the ${args.variant_name} variant.\n---\n\nimport React from 'react';\n\ninterface Props {\n  label: string;\n}\n\nexport const ${args.component_name}${args.variant_name}: React.FC<Props> = ({ label }) => {\n  return <div>{label}</div>;\n};\n`;
      writeFileSync(filePath, content);
      return { content: [{ type: 'text', text: `Created ${filePath}` }] };
    }
    case 'saddle_get_global_tokens': {
      const configPath = join(args.project_root, 'saddle.config.json');
      if (!existsSync(configPath)) return { content: [{ type: 'text', text: 'saddle.config.json not found' }], isError: true };
      const config = JSON.parse(readFileSync(configPath, 'utf-8'));
      return { content: [{ type: 'text', text: JSON.stringify(config.tokens, null, 2) }] };
    }
    default:
      return { content: [{ type: 'text', text: `Unknown tool: ${name}` }], isError: true };
  }
}

// Lambda handler
export const handler = async (event) => {
  const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
  const { method, id, params } = body;

  let result;

  switch (method) {
    case 'initialize':
      result = {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'saddle', version: '0.1.0' },
      };
      break;
    case 'tools/list':
      result = { tools: TOOLS };
      break;
    case 'tools/call':
      result = handleToolCall(params?.name, params?.arguments || {});
      break;
    default:
      return {
        statusCode: 400,
        body: JSON.stringify({ jsonrpc: '2.0', id, error: { code: -32601, message: `Unknown method: ${method}` } }),
      };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id, result }),
  };
};
