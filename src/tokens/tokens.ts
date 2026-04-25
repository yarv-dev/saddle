// Design tokens - will eventually load from saddle.config.json

export type TokenSlot = 'color' | 'space' | 'radius' | 'fontSize';

export type Token = {
  name: string;
  cssVar: string;
  value: string;
  slot: TokenSlot;
};

export const tokens: Record<TokenSlot, Token[]> = {
  color: [
    { name: 'primary', cssVar: '--colors-primary', value: '#7c3aed', slot: 'color' },
    { name: 'secondary', cssVar: '--colors-secondary', value: '#f8f8f8', slot: 'color' },
    { name: 'brand', cssVar: '--colors-brand', value: '#000000', slot: 'color' },
    { name: 'accent', cssVar: '--colors-accent', value: '#7c3aed', slot: 'color' },
    { name: 'background', cssVar: '--colors-background', value: '#ffffff', slot: 'color' },
    { name: 'surface', cssVar: '--colors-surface', value: '#f8f8f8', slot: 'color' },
    { name: 'text', cssVar: '--colors-text', value: '#2e3338', slot: 'color' },
    { name: 'subtext', cssVar: '--colors-subtext', value: '#6c7278', slot: 'color' },
    { name: 'border', cssVar: '--colors-border', value: '#e5e7eb', slot: 'color' },
    { name: 'error', cssVar: '--colors-error', value: '#dc2626', slot: 'color' },
    { name: 'success', cssVar: '--colors-success', value: '#16a34a', slot: 'color' },
    { name: 'warning', cssVar: '--colors-warning', value: '#ea580c', slot: 'color' },
  ],
  space: [
    { name: 'xs', cssVar: '--spacing-xs', value: '4px', slot: 'space' },
    { name: 'sm', cssVar: '--spacing-sm', value: '8px', slot: 'space' },
    { name: 'md', cssVar: '--spacing-md', value: '16px', slot: 'space' },
    { name: 'lg', cssVar: '--spacing-lg', value: '24px', slot: 'space' },
    { name: 'xl', cssVar: '--spacing-xl', value: '32px', slot: 'space' },
  ],
  radius: [
    { name: 'none', cssVar: '--rounded-none', value: '0px', slot: 'radius' },
    { name: 'sm', cssVar: '--rounded-sm', value: '4px', slot: 'radius' },
    { name: 'md', cssVar: '--rounded-md', value: '8px', slot: 'radius' },
    { name: 'lg', cssVar: '--rounded-lg', value: '16px', slot: 'radius' },
    { name: 'full', cssVar: '--rounded-full', value: '9999px', slot: 'radius' },
  ],
  fontSize: [
    { name: 'xs', cssVar: '--font-size-xs', value: '11px', slot: 'fontSize' },
    { name: 'sm', cssVar: '--font-size-sm', value: '13px', slot: 'fontSize' },
    { name: 'base', cssVar: '--font-size-base', value: '14px', slot: 'fontSize' },
    { name: 'lg', cssVar: '--font-size-lg', value: '16px', slot: 'fontSize' },
    { name: 'xl', cssVar: '--font-size-xl', value: '18px', slot: 'fontSize' },
  ],
};

export const tokenByCssVar: Record<string, Token> = Object.fromEntries(
  Object.values(tokens)
    .flat()
    .map((t) => [t.cssVar, t]),
);
