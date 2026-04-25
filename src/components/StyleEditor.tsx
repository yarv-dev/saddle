import { TokenPicker } from '../tokens/TokenPicker';
import { detectTokenSlot } from '../lib/cssProperties';
import styles from './StyleEditor.module.css';

interface StyleEditorProps {
  tokens: Record<string, string>;
  onTokenChange: (key: string, value: string) => void;
}

export function StyleEditor({ tokens, onTokenChange }: StyleEditorProps) {
  if (!tokens || Object.keys(tokens).length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No style tokens defined</p>
        <p className={styles.hint}>Add tokens to the component frontmatter</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <section style={{ padding: '14px 16px', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ fontSize: 10, color: 'var(--color-subtext)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 10, fontWeight: 600 }}>
          Style Properties
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Object.entries(tokens).map(([key, value]) => (
            <PropertyField
              key={key}
              propertyKey={key}
              value={value}
              onChange={(v) => onTokenChange(key, v)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function PropertyField({
  propertyKey,
  value,
  onChange,
}: {
  propertyKey: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const slot = detectTokenSlot(propertyKey, value);
  const isColor = slot === 'color';
  const colorPreview = isColor && value ? (value.startsWith('var(') ? getComputedVar(value) : value) : null;

  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 10, color: 'var(--color-subtext)', marginBottom: 4 }}>{propertyKey}</div>
      <div style={{ display: 'flex', gap: 4, alignItems: 'stretch' }}>
        {isColor && (
          <div
            style={{
              width: 24,
              height: 24,
              background: colorPreview || '#ffffff',
              border: '1px solid var(--color-border)',
              borderRadius: 5,
              flexShrink: 0,
            }}
          />
        )}
        <input
          type="text"
          placeholder="value..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1,
            minWidth: 0,
            padding: '5px 8px',
            fontSize: 11,
            fontFamily: 'SF Mono, ui-monospace, monospace',
            border: '1px solid var(--color-border)',
            borderRadius: 6,
            background: '#ffffff',
            color: 'var(--color-text)',
          }}
        />
        {slot && <TokenPicker slot={slot} value={value} onPick={(cssVar) => onChange(cssVar)} />}
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
