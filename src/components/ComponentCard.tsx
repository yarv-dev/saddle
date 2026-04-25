import type { Component } from '../types/component';
import styles from './ComponentCard.module.css';

interface ComponentCardProps {
  component: Component;
  onClick?: () => void;
}

export function ComponentCard({ component, onClick }: ComponentCardProps) {
  return (
    <div className={styles.card} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className={styles.header}>
        <h3 className={styles.name}>{component.name}</h3>
        <span className={styles.variantCount}>
          {component.variants.length} variant{component.variants.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className={styles.variants}>
        {component.variants.map((variant, idx) => (
          <div key={idx} className={styles.variant}>
            <span className={styles.variantName}>{variant.variantName}</span>
            {variant.frontmatter && (
              <p className={styles.description}>
                {variant.frontmatter.description || 'No description'}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
