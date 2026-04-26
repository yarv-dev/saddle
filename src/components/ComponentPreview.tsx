import { useState, useMemo } from 'react';

interface ComponentPreviewProps {
  code: string;
  frontmatter?: any;
  liveTokens?: Record<string, string>;
  devServerUrl?: string;
}

// Parse JSX into renderable HTML, preserving the full DOM hierarchy
function jsxToHtml(code: string, tokens: Record<string, string>): string {
  const returnMatch = code.match(/return\s*\(\s*([\s\S]*?)\s*\)\s*;?\s*\}?\s*$/);
  if (!returnMatch) return '<div>No renderable JSX found</div>';

  let jsx = returnMatch[1].trim();

  jsx = jsx.replace(/\{label\}/g, 'Label');
  jsx = jsx.replace(/\{title\}/g, 'Title');
  jsx = jsx.replace(/\{children\s*\|\|\s*['"]([^'"]+)['"]\}/g, '$1');
  jsx = jsx.replace(/\{children\}/g, 'Content goes here');
  jsx = jsx.replace(/\{initials\}/g, 'AB');
  jsx = jsx.replace(/\{placeholder\}/g, '');
  jsx = jsx.replace(/\{[\w.]+\s*&&\s*\(([\s\S]*?)\)\}/g, '$1');
  jsx = jsx.replace(/\{[\w.]+\s*\?\s*<[\s\S]*?:\s*([\s\S]*?)\}/g, '$1');
  jsx = jsx.replace(/\{(\w+)\}/g, '$1');
  jsx = jsx.replace(/\s*on\w+={[^}]*}/g, '');
  jsx = jsx.replace(/\s*(?:ref|key)={[^}]*}/g, '');
  jsx = jsx.replace(/className={[^}]*}/g, '');
  jsx = jsx.replace(/className="([^"]*)"/g, 'class="$1"');

  jsx = jsx.replace(/style=\{\{([\s\S]*?)\}\}/g, (_, styleBlock) => {
    const pairs: string[] = [];
    const propRegex = /(\w+)\s*:\s*(?:['"]([^'"]*?)['"]|(\d+))/g;
    let m;
    while ((m = propRegex.exec(styleBlock)) !== null) {
      const prop = m[1].replace(/([A-Z])/g, '-$1').toLowerCase();
      pairs.push(`${prop}: ${m[2] || m[3]}`);
    }
    const ternaryRegex = /(\w+)\s*:\s*\w+\s*\?\s*['"]([^'"]*)['"]\s*:\s*['"]([^'"]*)['"]/g;
    while ((m = ternaryRegex.exec(styleBlock)) !== null) {
      const prop = m[1].replace(/([A-Z])/g, '-$1').toLowerCase();
      pairs.push(`${prop}: ${m[3]}`);
    }
    return `style="${pairs.join('; ')}"`;
  });

  if (Object.keys(tokens).length > 0) {
    const tokenStyle = Object.entries(tokens)
      .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}`)
      .join('; ');
    const firstStyleMatch = jsx.match(/style="([^"]*)"/);
    if (firstStyleMatch) {
      jsx = jsx.replace(firstStyleMatch[0], `style="${firstStyleMatch[1]}; ${tokenStyle}"`);
    } else {
      jsx = jsx.replace(/<(\w+)/, `<$1 style="${tokenStyle}"`);
    }
  }

  jsx = jsx.replace(/<(\w+)([^>]*)\/>/g, '<$1$2></$1>');
  jsx = jsx.replace(/<>/g, '').replace(/<\/>/g, '');
  jsx = jsx.replace(/\{[^}]*\}/g, '');
  jsx = jsx.replace(/import\s+.*?;/g, '');

  return jsx;
}

export function ComponentPreview({ code, frontmatter, liveTokens, devServerUrl }: ComponentPreviewProps) {
  const tokens = liveTokens || frontmatter?.tokens || {};
  const [mode, setMode] = useState<'isolated' | 'devserver'>(devServerUrl ? 'devserver' : 'isolated');

  const renderedHtml = useMemo(() => jsxToHtml(code, tokens), [code, tokens]);

  const isolatedSrcdoc = useMemo(() => `<!DOCTYPE html>
<html>
<head>
<style>
  * { box-sizing: border-box; }
  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    -webkit-font-smoothing: antialiased;
  }
  button { font-family: inherit; cursor: pointer; }
  input, select, textarea { font-family: inherit; }
  img { display: block; }
</style>
</head>
<body>
  ${renderedHtml}
</body>
</html>`, [renderedHtml]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* Mode Toggle */}
      {devServerUrl && (
        <div style={{
          display: 'flex', gap: 4, padding: '8px 0', flexShrink: 0,
        }}>
          <button
            onClick={() => setMode('isolated')}
            style={{
              height: 24, padding: '0 10px',
              background: mode === 'isolated' ? 'var(--color-primary)' : '#fff',
              color: mode === 'isolated' ? '#fff' : 'var(--color-fg)',
              border: mode === 'isolated' ? 'none' : '1px solid var(--color-border)',
              borderRadius: 4, fontSize: 11, fontWeight: 500, cursor: 'pointer',
            }}
          >
            Isolated
          </button>
          <button
            onClick={() => setMode('devserver')}
            style={{
              height: 24, padding: '0 10px',
              background: mode === 'devserver' ? 'var(--color-primary)' : '#fff',
              color: mode === 'devserver' ? '#fff' : 'var(--color-fg)',
              border: mode === 'devserver' ? 'none' : '1px solid var(--color-border)',
              borderRadius: 4, fontSize: 11, fontWeight: 500, cursor: 'pointer',
            }}
          >
            Dev Server
          </button>
          {mode === 'devserver' && (
            <span style={{ fontSize: 11, color: 'var(--color-fg-muted)', alignSelf: 'center', marginLeft: 8 }}>
              {devServerUrl}
            </span>
          )}
        </div>
      )}

      {/* Preview */}
      {mode === 'devserver' && devServerUrl ? (
        <iframe
          src={devServerUrl}
          style={{
            flex: 1, width: '100%',
            border: '1px solid var(--color-border)',
            borderRadius: 10, background: '#ffffff',
          }}
          title="Dev Server Preview"
        />
      ) : (
        <iframe
          srcDoc={isolatedSrcdoc}
          style={{
            flex: 1, width: '100%',
            border: '1px solid var(--color-border)',
            borderRadius: 10, background: '#ffffff',
          }}
          sandbox="allow-scripts"
          title="Component Preview"
        />
      )}
    </div>
  );
}
