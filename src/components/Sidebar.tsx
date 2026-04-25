import { useState } from 'react';
import type { ProjectStructure, Component } from '../types/component';
import styles from './Sidebar.module.css';

interface SidebarProps {
  project: ProjectStructure | null;
  onSelectComponent: (component: Component) => void;
  selectedComponent: Component | null;
}

export function Sidebar({ project, onSelectComponent, selectedComponent }: SidebarProps) {
  if (!project) {
    return (
      <aside className={styles.sidebar}>
        <div className={styles.empty}>
          <p>No project loaded</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className={styles.sidebar}>
      <header className={styles.header}>
        <h2 className={styles.title}>Components</h2>
        <span className={styles.count}>
          {project.components.length}
        </span>
      </header>

      <nav className={styles.componentList}>
        {project.components.map((component, idx) => (
          <button
            key={idx}
            onClick={() => onSelectComponent(component)}
            className={`${styles.componentItem} ${selectedComponent?.name === component.name ? styles.active : ''}`}
          >
            <div className={styles.componentName}>{component.name}</div>
            <div className={styles.variantCount}>
              {component.variants.length} variant{component.variants.length !== 1 ? 's' : ''}
            </div>
          </button>
        ))}
      </nav>
    </aside>
  );
}
