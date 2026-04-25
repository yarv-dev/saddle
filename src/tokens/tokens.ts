// Design tokens - loaded from saddle.config.json

export type TokenSlot = 'color' | 'space' | 'radius' | 'fontSize';

export type Token = {
  name: string;
  cssVar: string;
  value: string;
  slot: TokenSlot;
};

// Default tokens (fallback if no config loaded)
const defaultTokens: Record<TokenSlot, Token[]> = {
  color: [
    { name: 'primary', cssVar: '--colors-primary', value: '#7c3aed', slot: 'color' },
    { name: 'secondary', cssVar: '--colors-secondary', value: '#f8f8f8', slot: 'color' },
    { name: 'brand', cssVar: '--colors-brand', value: '#000000', slot: 'color' },
    { name: 'accent', cssVar: '--colors-accent', value: '#007aff', slot: 'color' },
    { name: 'background', cssVar: '--colors-background', value: '#ffffff', slot: 'color' },
    { name: 'surface', cssVar: '--colors-surface', value: '#f5f5f7', slot: 'color' },
    { name: 'text', cssVar: '--colors-text', value: '#1d1d1f', slot: 'color' },
    { name: 'subtext', cssVar: '--colors-subtext', value: '#6e6e73', slot: 'color' },
    { name: 'border', cssVar: '--colors-border', value: '#e5e7eb', slot: 'color' },
    { name: 'error', cssVar: '--colors-error', value: '#ff3b30', slot: 'color' },
    { name: 'success', cssVar: '--colors-success', value: '#34c759', slot: 'color' },
    { name: 'warning', cssVar: '--colors-warning', value: '#ff9500', slot: 'color' },
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
    { name: 'sm', cssVar: '--rounded-sm', value: '6px', slot: 'radius' },
    { name: 'md', cssVar: '--rounded-md', value: '8px', slot: 'radius' },
    { name: 'lg', cssVar: '--rounded-lg', value: '12px', slot: 'radius' },
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

// Mutable token store
export let tokens: Record<TokenSlot, Token[]> = { ...defaultTokens };

// Load tokens from global config
export function loadTokensFromConfig(config: {
  colors: Record<string, string>;
  spacing: Record<string, string>;
  rounded: Record<string, string>;
  fontSize: Record<string, string>;
}) {
  tokens = {
    color: Object.entries(config.colors).map(([name, value]) => ({
      name,
      cssVar: `--colors-${name}`,
      value,
      slot: 'color' as TokenSlot,
    })),
    space: Object.entries(config.spacing).map(([name, value]) => ({
      name,
      cssVar: `--spacing-${name}`,
      value,
      slot: 'space' as TokenSlot,
    })),
    radius: Object.entries(config.rounded).map(([name, value]) => ({
      name,
      cssVar: `--rounded-${name}`,
      value,
      slot: 'radius' as TokenSlot,
    })),
    fontSize: Object.entries(config.fontSize).map(([name, value]) => ({
      name,
      cssVar: `--font-size-${name}`,
      value,
      slot: 'fontSize' as TokenSlot,
    })),
  };
}

export const tokenByCssVar: Record<string, Token> = Object.fromEntries(
  Object.values(tokens)
    .flat()
    .map((t) => [t.cssVar, t]),
);
