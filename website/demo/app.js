// Saddle Demo - Stripped down version of the real app
// Same layout, same components, same rendering - just no Tauri backend

const DEMO_COMPONENT = {
  name: 'Button',
  variants: [
    {
      name: 'Primary',
      tokens: {
        backgroundColor: '#2563eb',
        color: '#ffffff',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: '600',
        border: 'none',
      },
      code: `export const ButtonPrimary = ({ label }) => (
  <button style={{
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 600,
    border: 'none',
  }}>
    {label}
  </button>
);`,
    },
    {
      name: 'Secondary',
      tokens: {
        backgroundColor: '#ffffff',
        color: '#1d1d1f',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: '500',
        border: '1px solid #d1d1d6',
      },
      code: `export const ButtonSecondary = ({ label }) => (
  <button style={{
    backgroundColor: '#ffffff',
    color: '#1d1d1f',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 500,
    border: '1px solid #d1d1d6',
  }}>
    {label}
  </button>
);`,
    },
  ],
};

const COMPONENTS = [
  { name: 'Button', variants: 2 },
  { name: 'Card', variants: 1 },
  { name: 'Input', variants: 1 },
  { name: 'Badge', variants: 2 },
  { name: 'Toggle', variants: 1 },
];

const SECTIONS = [
  { name: 'Fill', keys: ['backgroundColor', 'background', 'opacity'] },
  { name: 'Typography', keys: ['color', 'fontSize', 'fontWeight', 'fontFamily', 'lineHeight', 'letterSpacing', 'textAlign', 'textDecoration', 'textTransform'] },
  { name: 'Spacing', keys: ['padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'margin', 'gap'] },
  { name: 'Stroke', keys: ['border', 'borderWidth', 'borderStyle', 'borderColor', 'borderRadius', 'outline', 'boxShadow'] },
  { name: 'Size', keys: ['width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight'] },
  { name: 'Effects', keys: ['boxShadow', 'filter', 'transform', 'transition', 'cursor'] },
];

let state = {
  selectedVariant: 0,
  tokens: { ...DEMO_COMPONENT.variants[0].tokens },
  expandedSections: new Set(['Fill', 'Typography', 'Spacing', 'Stroke']),
  breakpoint: 0,
  terminalEntries: [],
};

function addLog(type, msg) {
  const t = new Date().toTimeString().split(' ')[0];
  state.terminalEntries.push({ time: t, type, msg });
  if (state.terminalEntries.length > 30) state.terminalEntries.shift();
}

addLog('ok', 'Project loaded: demo-lib (5 components)');
addLog('info', 'File watcher started');
addLog('ok', 'Global tokens loaded from saddle.config.json');

function render() {
  const root = document.getElementById('saddle-demo');
  if (!root) return;

  const v = DEMO_COMPONENT.variants[state.selectedVariant];
  const tokens = state.tokens;

  root.innerHTML = `
    <div class="sd">
      <!-- Sidebar -->
      <div class="sd-sidebar">
        <div class="sd-sidebar-hd">
          <img src="assets/saddle-logo.png" height="16">
          <span class="sd-muted">demo-lib</span>
        </div>
        <div class="sd-label">Components</div>
        ${COMPONENTS.map((c, i) => `
          <div class="sd-nav ${i === 0 ? 'active' : ''}">
            <span>${c.name}</span>
            <span class="sd-count">${c.variants}</span>
          </div>
        `).join('')}
        <div class="sd-label" style="margin-top:12px">Views</div>
        <div class="sd-nav">Hierarchy</div>
        <div class="sd-nav">Dashboard</div>
      </div>

      <!-- Elements Panel -->
      <div class="sd-elements">
        <div class="sd-elements-hd">Elements</div>
        <div class="sd-elements-tree">
          <div class="sd-el-node selected">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="transform:rotate(90deg)"><path d="M9 18l6-6-6-6"/></svg>
            <span class="sd-el-tag">&lt;button&gt;</span>
            <span class="sd-el-badge">${Object.keys(tokens).length} styles</span>
          </div>
          <div class="sd-el-styles">
            ${Object.entries(tokens).map(([k,v]) => `<div class="sd-el-style"><span class="sd-el-k">${k}</span><span class="sd-el-v">${v}</span></div>`).join('')}
          </div>
          <div class="sd-el-node" style="padding-left:28px">
            <span class="sd-el-tag">"Get Started"</span>
          </div>
          <div class="sd-el-node">
            <span class="sd-el-tag">&lt;/button&gt;</span>
          </div>
        </div>
      </div>

      <!-- Stage -->
      <div class="sd-stage">
        <div class="sd-variant-bar">
          <div class="sd-variants">
            ${DEMO_COMPONENT.variants.map((va, i) => `
              <button class="sd-vbtn ${i === state.selectedVariant ? 'active' : ''}" onclick="selectVariant(${i})">${va.name}</button>
            `).join('')}
          </div>
          <button class="sd-newvar">+ New Variant</button>
        </div>
        <div class="sd-bp-bar">
          <div class="sd-bp ${state.breakpoint === 0 ? 'active' : ''}" onclick="setBp(0)" title="Full">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          </div>
          <div class="sd-bp ${state.breakpoint === 768 ? 'active' : ''}" onclick="setBp(768)" title="Tablet">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/></svg>
          </div>
          <div class="sd-bp ${state.breakpoint === 375 ? 'active' : ''}" onclick="setBp(375)" title="Mobile">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/></svg>
          </div>
        </div>
        <div class="sd-preview">
          <div class="sd-component-preview" style="${state.breakpoint > 0 ? 'max-width:'+state.breakpoint+'px' : ''}">
            <button id="sd-btn" style="
              background-color:${tokens.backgroundColor};
              color:${tokens.color};
              padding:${tokens.padding};
              border-radius:${tokens.borderRadius};
              font-size:${tokens.fontSize};
              font-weight:${tokens.fontWeight};
              border:${tokens.border};
              font-family:inherit;
              cursor:pointer;
              transition:all 0.15s ease;
            ">Get Started</button>
          </div>
        </div>
        <div class="sd-terminal">
          <div class="sd-term-hd">
            <span>Terminal</span>
            <span class="sd-term-count">${state.terminalEntries.length}</span>
          </div>
          <div class="sd-term-log" id="sd-log">
            ${state.terminalEntries.map(e => `<div><span class="sd-t-time">${e.time}</span> <span class="sd-t-${e.type}">${e.msg}</span></div>`).join('')}
          </div>
        </div>
      </div>

      <!-- Inspector -->
      <div class="sd-inspector">
        <div class="sd-tabs">
          <button class="sd-tab active">Style</button>
          <button class="sd-tab">Code</button>
          <button class="sd-tab">AI</button>
        </div>
        <div class="sd-insp-body">
          ${SECTIONS.map(section => {
            const active = Object.keys(tokens).filter(k => section.keys.includes(k));
            const isOpen = state.expandedSections.has(section.name);
            return `
              <div class="sd-acc ${isOpen ? 'open' : ''}">
                <div class="sd-acc-hd" onclick="toggleSection('${section.name}')">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="sd-chev"><path d="M9 18l6-6-6-6"/></svg>
                  <span>${section.name}</span>
                  ${active.length > 0 ? `<span class="sd-acc-count">${active.length}</span>` : ''}
                </div>
                ${isOpen ? `<div class="sd-acc-body">
                  ${active.map(key => {
                    const isColor = key.toLowerCase().includes('color') || key === 'backgroundColor';
                    return `<div class="sd-prop">
                      ${isColor ? `<input type="color" value="${tokens[key]}" class="sd-cpick" oninput="updateToken('${key}',this.value)">` : ''}
                      <span class="sd-prop-name" ${!isColor ? 'style="margin-left:22px"' : ''}>${key}</span>
                      <input class="sd-prop-val" value="${tokens[key]}" oninput="updateToken('${key}',this.value)">
                      ${isColor ? `<button class="sd-tok-btn" onclick="cycleToken('${key}')">token</button>` : ''}
                    </div>`;
                  }).join('')}
                  <button class="sd-add-btn" onclick="addProp('${section.name}')">+ Add</button>
                </div>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  // Scroll terminal
  const log = document.getElementById('sd-log');
  if (log) log.scrollTop = log.scrollHeight;
}

window.updateToken = function(key, value) {
  state.tokens[key] = value;
  addLog('ok', `Token saved: ${key} → Button.${DEMO_COMPONENT.variants[state.selectedVariant].name}.tsx`);
  render();
  syncAppPreview();
};

function syncAppPreview() {
  const btn = document.getElementById('asp-btn');
  if (!btn) return;
  const t = state.tokens;
  btn.style.backgroundColor = t.backgroundColor || '';
  btn.style.color = t.color || '';
  btn.style.padding = t.padding || '';
  btn.style.borderRadius = t.borderRadius || '';
  btn.style.fontSize = t.fontSize || '';
  btn.style.fontWeight = t.fontWeight || '';
  btn.style.border = t.border || 'none';
}

window.selectVariant = function(idx) {
  state.selectedVariant = idx;
  state.tokens = { ...DEMO_COMPONENT.variants[idx].tokens };
  addLog('info', `Switched to ${DEMO_COMPONENT.variants[idx].name}`);
  render();
  syncAppPreview();
};

window.toggleSection = function(name) {
  if (state.expandedSections.has(name)) state.expandedSections.delete(name);
  else state.expandedSections.add(name);
  render();
};

window.setBp = function(w) {
  state.breakpoint = w;
  render();
};

const DESIGN_TOKENS = {
  colors: [
    { name: 'primary', value: '#2563eb' },
    { name: 'danger', value: '#dc2626' },
    { name: 'success', value: '#16a34a' },
    { name: 'violet', value: '#7c3aed' },
    { name: 'warning', value: '#ea580c' },
    { name: 'teal', value: '#0891b2' },
    { name: 'brand', value: '#1d1d1f' },
    { name: 'amber', value: '#f59e0b' },
    { name: 'surface', value: '#f5f5f7' },
    { name: 'white', value: '#ffffff' },
  ],
};

window.cycleToken = function(key) {
  // Show dropdown
  const existing = document.getElementById('sd-token-dropdown');
  if (existing) existing.remove();

  const btn = event.currentTarget;
  const rect = btn.getBoundingClientRect();
  const dropdown = document.createElement('div');
  dropdown.id = 'sd-token-dropdown';
  dropdown.className = 'sd-dropdown';
  dropdown.style.top = (rect.bottom + 4) + 'px';
  dropdown.style.left = Math.min(rect.left, window.innerWidth - 180) + 'px';

  dropdown.innerHTML = `
    <div class="sd-dd-label">Color tokens</div>
    ${DESIGN_TOKENS.colors.map(t => `
      <button class="sd-dd-item" onclick="pickToken('${key}','${t.value}')">
        <span class="sd-dd-swatch" style="background:${t.value}"></span>
        <span class="sd-dd-name">${t.name}</span>
        <span class="sd-dd-val">${t.value}</span>
      </button>
    `).join('')}
  `;

  document.body.appendChild(dropdown);
  setTimeout(() => {
    document.addEventListener('click', function close(e) {
      if (!dropdown.contains(e.target)) { dropdown.remove(); document.removeEventListener('click', close); }
    });
  }, 0);
};

window.pickToken = function(key, value) {
  state.tokens[key] = value;
  addLog('ok', `Token picked: ${key} = ${value}`);
  const dd = document.getElementById('sd-token-dropdown');
  if (dd) dd.remove();
  render();
  syncAppPreview();
};

window.addProp = function(sectionName) {
  const section = SECTIONS.find(s => s.name === sectionName);
  if (!section) return;
  const available = section.keys.filter(k => !state.tokens[k]);
  if (available.length === 0) return;
  state.tokens[available[0]] = '';
  render();
};

document.addEventListener('DOMContentLoaded', render);
