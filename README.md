# Saddle

Component builder with AI design integration. Edit design tokens visually, see your running app update via HMR, let Claude Code modify components through MCP.

**Website:** https://saddleai.staplelab.com
**Quick Start:** https://saddleai.staplelab.com/quickstart.html
**Download:** https://github.com/yarv-dev/saddle/releases

## Features

- **Token-first design** — Figma-style property inspector with 200+ CSS properties, collapsible sections, token picker
- **Live preview** — Embed your localhost dev server inside Saddle. Edit tokens, file writes to disk, HMR updates your real app
- **Claude Code integration** — MCP server with 6 tools: list/get/update/create components, read global tokens
- **Element inspector** — Chrome DevTools-style DOM tree with computed styles per element
- **Responsive breakpoints** — Configurable device previewer (mobile, tablet, desktop, custom)
- **npm package export** — One-click build with conditional exports, generated CSS Modules, DTCG tokens
- **Deduplication analysis** — Detects duplicate token values and repeated DOM structures across components
- **design.md format** — YAML frontmatter with component metadata (tokens, props, usage guidelines) that AI can parse

## Quick Start

```bash
git clone https://github.com/yarv-dev/saddle.git
cd saddle
npm install
npm run tauri dev
```

Load the test project at `~/saddle-test` or point at any React component library with design.md frontmatter.

## Claude Code MCP Setup

One-click from Dashboard, or add to your Claude Code config:

```json
{
  "mcpServers": {
    "saddle": {
      "command": "node",
      "args": ["mcp-bridge.mjs"],
      "cwd": "/path/to/saddle"
    }
  }
}
```

MCP tools: `saddle_list_components`, `saddle_get_component`, `saddle_update_tokens`, `saddle_read_component`, `saddle_create_variant`, `saddle_get_global_tokens`

## Tech Stack

- **Frontend:** React 18, TypeScript, Monaco Editor, Lucide icons
- **Backend:** Tauri 2.x, Rust
- **AI:** MCP Protocol (stdio bridge + AWS Lambda)
- **CI/CD:** GitHub Actions (CI, website deploy, DMG release)

## Links

| Resource | URL |
|----------|-----|
| Website | https://saddleai.staplelab.com |
| Quick Start | https://saddleai.staplelab.com/quickstart.html |
| GitHub (staple-lab) | https://github.com/staple-lab/saddle |
| GitHub (yarv-dev) | https://github.com/yarv-dev/saddle |
| MCP Server (AWS) | https://nwkhrtp6qre2dna6muyfyztugu0kliiu.lambda-url.ap-southeast-2.on.aws/ |
| Releases | https://github.com/yarv-dev/saddle/releases |

## License

Apache-2.0
