import { useState } from 'react';
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
    <aside
      style={{
        width: 260,
        flexShrink: 0,
        height: '100%',
        background: 'var(--color-surface-elev)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}
    >
      {/* Header */}
      <header style={{ padding: '14px 14px 6px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 4px 4px' }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              background: 'linear-gradient(135deg, #0a84ff, #5e5ce6)',
              boxShadow: 'var(--elevation-1)',
            }}
          />
          <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em' }}>
            {project ? 'Components' : 'Saddle'}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '6px 10px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {!project ? (
          <div style={{ padding: '20px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: 'var(--color-fg-muted)', marginBottom: 14, lineHeight: 1.5 }}>
              No project loaded. Select a component library to get started.
            </div>
          </div>
        ) : (
          <Section label="Components">
            {project.components.length === 0 ? (
              <div style={{ padding: '4px 10px', fontSize: 12, color: 'var(--color-fg-subtle)', fontStyle: 'italic' }}>
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
              <NavItem
                label="Configure"
                icon="⚙"
                active={false}
                onClick={onConfigure}
              />
            </Section>

            <Section label="Ship">
              <NavItem
                label="Export"
                icon="↗"
                active={view === 'export'}
                onClick={onExport}
              />
            </Section>
          </>
        )}
      </nav>

      {/* Footer */}
      <footer style={{ padding: 10, borderTop: '1px solid var(--color-border)', flexShrink: 0 }}>
        <button
          onClick={onLoadProject}
          style={{
            width: '100%',
            padding: '8px 12px',
            background: project ? 'transparent' : 'var(--color-primary)',
            color: project ? 'var(--color-primary)' : '#ffffff',
            border: project ? '1px solid var(--color-border)' : 'none',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            boxShadow: project ? 'none' : 'var(--elevation-1)',
            transition: 'all 120ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = project ? 'var(--color-surface)' : 'var(--color-primary-press)';
            if (project) e.currentTarget.style.borderColor = 'var(--color-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = project ? 'transparent' : 'var(--color-primary)';
            if (project) e.currentTarget.style.borderColor = 'var(--color-border)';
          }}
        >
          {project ? 'Load Different Project' : '+ Load Project'}
        </button>
      </footer>
    </aside>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <div
        style={{
          padding: '4px 10px 4px',
          fontSize: 10,
          color: 'var(--color-fg-subtle)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function NavItem({
  icon,
  label,
  subtitle,
  active,
  onClick,
}: {
  icon?: string;
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
        gap: 8,
        width: '100%',
        padding: '6px 10px',
        background: active ? 'rgba(10, 132, 255, 0.12)' : 'transparent',
        border: 'none',
        borderRadius: 6,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background 120ms ease',
        color: active ? 'var(--color-primary)' : 'var(--color-fg)',
        fontWeight: active ? 600 : 500,
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = 'var(--color-surface)';
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = 'transparent';
      }}
    >
      {icon && (
        <span style={{ fontSize: 14, lineHeight: 1, opacity: 0.7 }}>
          {icon}
        </span>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, letterSpacing: '-0.01em' }}>
          {label}
        </div>
        {subtitle && (
          <div style={{ fontSize: 11, color: active ? 'var(--color-primary)' : 'var(--color-fg-muted)', opacity: active ? 0.8 : 1, marginTop: 1 }}>
            {subtitle}
          </div>
        )}
      </div>
    </button>
  );
}
