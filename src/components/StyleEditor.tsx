import { useState, useMemo } from 'react';
import { TokenPicker } from '../tokens/TokenPicker';
import { detectTokenSlot } from '../lib/cssProperties';

interface StyleEditorProps {
  tokens: Record<string, string>;
  code?: string;
  onTokenChange: (key: string, value: string) => void;
}

// Extract all inline styles from JSX code
function extractInlineStyles(code: string): Record<string, string> {
  const styles: Record<string, string> = {};
  // Match style={{ ... }} blocks
  const styleBlockRegex = /style=\{\{([^}]+)\}\}/g;
  let match;
  while ((match = styleBlockRegex.exec(code)) !== null) {
    const block = match[1];
    // Match individual properties: key: 'value' or key: "value"
    const propRegex = /(\w+)\s*:\s*['"]([^'"]+)['"]/g;
    let propMatch;
    while ((propMatch = propRegex.exec(block)) !== null) {
      styles[propMatch[1]] = propMatch[2];
    }
  }
  return styles;
}

// Group properties by category
function groupProperties(props: Record<string, string>): { title: string; items: [string, string][] }[] {
  const groups: Record<string, [string, string][]> = {
    'Layout': [],
    'Spacing': [],
    'Background': [],
    'Border': [],
    'Typography': [],
    'Other': [],
  };

  for (const [key, value] of Object.entries(props)) {
    const k = key.toLowerCase();
    if (k.includes('display') || k.includes('flex') || k.includes('grid') || k.includes('position') || k.includes('align') || k.includes('justify') || k.includes('width') || k.includes('height')) {
      groups['Layout'].push([key, value]);
    } else if (k.includes('padding') || k.includes('margin') || k.includes('gap')) {
      groups['Spacing'].push([key, value]);
    } else if (k.includes('background')) {
      groups['Background'].push([key, value]);
    } else if (k.includes('border') || k.includes('radius') || k.includes('outline')) {
      groups['Border'].push([key, value]);
    } else if (k.includes('font') || k.includes('color') || k.includes('text') || k.includes('letter') || k.includes('line')) {
      groups['Typography'].push([key, value]);
    } else {
      groups['Other'].push([key, value]);
    }
  }

  return Object.entries(groups)
    .filter(([, items]) => items.length > 0)
    .map(([title, items]) => ({ title, items }));
}

export function StyleEditor({ tokens, code, onTokenChange }: StyleEditorProps) {
  // Merge frontmatter tokens with inline styles from code
  const allProperties = useMemo(() => {
    const codeStyles = code ? extractInlineStyles(code) : {};
    return { ...codeStyles, ...tokens };
  }, [tokens, code]);

  const groups = useMemo(() => groupProperties(allProperties), [allProperties]);

  if (Object.keys(allProperties).length === 0) {
    return (
      <div style={{ padding: 20, textAlign: 'center', color: 'var(--color-fg-muted)', fontSize: 13 }}>
        No style properties found
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {groups.map((group) => (
        <section key={group.title} style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div style={{
            padding: '12px 16px 8px',
            fontSize: 11,
            color: 'var(--color-fg-muted)',
            fontWeight: 600,
          }}>
            {group.title}
          </div>
          <div style={{ padding: '0 16px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {group.items.map(([key, value]) => (
              <PropertyField
                key={key}
                propertyKey={key}
                value={value}
                isToken={tokens.hasOwnProperty(key)}
                onChange={(v) => onTokenChange(key, v)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function PropertyField({ propertyKey, value, isToken, onChange }: {
  propertyKey: string;
  value: string;
  isToken: boolean;
  onChange: (v: string) => void;
}) {
  const slot = detectTokenSlot(propertyKey, value);
  const isColor = slot === 'color';
  const colorPreview = isColor ? (value.startsWith('var(') ? getComputedVar(value) : value) : null;

  return (
    <div>
      <div style={{ fontSize: 11, color: isToken ? 'var(--color-primary)' : 'var(--color-fg-muted)', marginBottom: 4, fontWeight: isToken ? 600 : 400 }}>
        {propertyKey}{isToken ? ' (token)' : ''}
      </div>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {isColor && (
          <div style={{
            width: 24,
            height: 24,
            background: colorPreview || '#ffffff',
            border: '1px solid var(--color-border)',
            borderRadius: 6,
            flexShrink: 0,
          }} />
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={!isToken}
          style={{
            flex: 1,
            minWidth: 0,
            height: 28,
            padding: '0 8px',
            fontSize: 12,
            fontFamily: 'var(--font-code)',
            border: '1px solid var(--color-border)',
            borderRadius: 6,
            background: isToken ? '#ffffff' : '#f5f5f7',
            color: 'var(--color-fg)',
          }}
        />
        {isToken && slot && (
          <TokenPicker slot={slot} value={value} onPick={(cssVar) => onChange(cssVar)} />
        )}
      </div>
    </div>
  );
}

function getComputedVar(expr: string): string {
  const match = expr.match(/var\((--[^,)]+)/);
  if (!match) return expr;
  try {
    return getComputedStyle(document.documentElement).getPropertyValue(match[1]).trim() || expr;
  } catch {
    return expr;
  }
}
