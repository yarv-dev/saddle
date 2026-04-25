import { useState } from 'react';
import type { ProjectStructure } from '../types/component';

interface ExportViewProps {
  project: ProjectStructure;
  onBack: () => void;
}

export function ExportView({ project, onBack }: ExportViewProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    // TODO: Implement actual export logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    setExporting(false);
    alert('Export complete! (Coming soon)');
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--color-stage)' }}>
      <header
        style={{
          padding: '18px 28px',
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-surface-elev)',
          backdropFilter: 'saturate(180%) blur(18px)',
          WebkitBackdropFilter: 'saturate(180%) blur(18px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <button
            onClick={onBack}
            style={{
              padding: '4px 10px',
              background: 'transparent',
              color: 'var(--color-primary)',
              border: 'none',
              fontSize: 12,
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            ← Back
          </button>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-0.015em', color: 'var(--color-fg)' }}>
            Export
          </h2>
        </div>
      </header>

      <div style={{ flex: 1, padding: 40, maxWidth: 800, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 600, color: 'var(--color-fg)' }}>
            Build npm Package
          </h3>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--color-fg-muted)', lineHeight: 1.6 }}>
            Export your component library as a publishable npm package with conditional exports for development and production.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
          <div style={{ padding: 16, background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-fg)', marginBottom: 4 }}>
              Package Name
            </div>
            <input
              type="text"
              defaultValue="@myorg/components"
              style={{
                width: '100%',
                padding: '8px 10px',
                fontSize: 13,
                fontFamily: 'var(--font-code)',
                border: '1px solid var(--color-border)',
                borderRadius: 6,
                background: '#f5f5f7',
                color: 'var(--color-fg)',
              }}
            />
          </div>

          <div style={{ padding: 16, background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-fg)', marginBottom: 8 }}>
              Output Directory
            </div>
            <div style={{ fontSize: 12, fontFamily: 'var(--font-code)', color: 'var(--color-fg-muted)' }}>
              {project.rootPath}/dist
            </div>
          </div>

          <div style={{ padding: 16, background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-fg)', marginBottom: 8 }}>
              Components
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-fg-muted)' }}>
              {project.components.length} component{project.components.length !== 1 ? 's' : ''} will be exported
            </div>
          </div>
        </div>

        <button
          onClick={handleExport}
          disabled={exporting}
          style={{
            width: '100%',
            padding: '12px 20px',
            background: exporting ? 'var(--color-fg-muted)' : 'var(--color-primary)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: exporting ? 'not-allowed' : 'pointer',
            boxShadow: 'var(--elevation-1)',
          }}
        >
          {exporting ? 'Exporting...' : 'Export Package'}
        </button>

        <div style={{ marginTop: 32, padding: 16, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#1e40af', marginBottom: 6 }}>
            📦 What gets exported
          </div>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: '#1e40af', lineHeight: 1.6 }}>
            <li>React components with TypeScript types</li>
            <li>Generated CSS Modules from tokens</li>
            <li>Global CSS variables from saddle.config.json</li>
            <li>package.json with conditional exports</li>
            <li>design.md frontmatter (for AI consumption in dev)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
