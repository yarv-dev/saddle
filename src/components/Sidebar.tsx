import type { ProjectStructure, Component } from '../types/component';

interface SidebarProps {
  project: ProjectStructure | null;
  onSelectComponent: (component: Component) => void;
  selectedComponent: Component | null;
  onLoadProject: () => void;
  onConfigure: () => void;
  onExport: () => void;
  view: 'components' | 'export';
}

export function Sidebar({ project, onSelectComponent, selectedComponent, onLoadProject, onConfigure, onExport, view }: SidebarProps) {
  return (
    <aside style={{
      width: 260,
      flexShrink: 0,
      height: '100%',
      background: '#f5f5f7',
      borderRight: '1px solid var(--color-border)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <header style={{ padding: '16px', flexShrink: 0, borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            background: 'linear-gradient(135deg, #007AFF, #5856D6)',
            boxShadow: 'var(--elevation-1)',
          }} />
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-fg)' }}>Saddle</div>
            {project && (
              <div style={{ fontSize: 11, color: 'var(--color-fg-muted)', marginTop: 1 }}>
                {project.rootPath.split('/').pop()}
              </div>
            )}
          </div>
        </div>
      </header>

      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {!project ? (
          <div style={{ padding: '24px 4px', textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: 'var(--color-fg-muted)', lineHeight: 1.5 }}>
              No project loaded
            </div>
          </div>
        ) : (
          <Section label="Components">
            {project.components.length === 0 ? (
              <div style={{ padding: '4px', fontSize: 13, color: 'var(--color-fg-subtle)', fontStyle: 'italic' }}>
                No components found
              </div>
            ) : (
              project.components.map((component, idx) => (
                <NavItem
                  key={idx}
                  label={component.name}
                  subtitle={`${component.variants.length} variant${component.variants.length !== 1 ? 's' : ''}`}
                  active={selectedComponent?.name === component.name}
                  onClick={() => onSelectComponent(component)}
                />
              ))
            )}
          </Section>
        )}

        {project && (
          <>
            <Section label="Project">
              <NavItem label="Configure" active={false} onClick={onConfigure} />
            </Section>
            <Section label="Ship">
              <NavItem label="Export" active={view === 'export'} onClick={onExport} />
            </Section>
          </>
        )}
      </nav>

      <footer style={{ padding: '12px', borderTop: '1px solid var(--color-border)', flexShrink: 0 }}>
        <button
          onClick={onLoadProject}
          style={{
            width: '100%',
            height: 34,
            padding: '0 16px',
            background: project ? '#ffffff' : 'var(--color-primary)',
            color: project ? 'var(--color-fg)' : '#ffffff',
            border: project ? '1px solid var(--color-border)' : 'none',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            boxShadow: 'var(--elevation-1)',
            transition: 'all 100ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = project ? '#f5f5f7' : 'var(--color-primary-press)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = project ? '#ffffff' : 'var(--color-primary)';
          }}
        >
          {project ? 'Load Different Project' : 'Load Project'}
        </button>
      </footer>
    </aside>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <div style={{
        padding: '0 4px 4px',
        fontSize: 11,
        color: 'var(--color-fg-muted)',
        fontWeight: 600,
      }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function NavItem({ label, subtitle, active, onClick }: {
  label: string;
  subtitle?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        minHeight: 28,
        padding: '6px 8px',
        background: active ? 'rgba(0, 122, 255, 0.1)' : 'transparent',
        border: 'none',
        borderRadius: 6,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background 100ms ease',
        color: active ? 'var(--color-primary)' : 'var(--color-fg)',
        fontWeight: active ? 600 : 400,
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(0, 0, 0, 0.04)'; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = active ? 'rgba(0, 122, 255, 0.1)' : 'transparent'; }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13 }}>{label}</div>
        {subtitle && (
          <div style={{ fontSize: 11, color: active ? 'var(--color-primary)' : 'var(--color-fg-muted)', marginTop: 1 }}>
            {subtitle}
          </div>
        )}
      </div>
    </button>
  );
}
