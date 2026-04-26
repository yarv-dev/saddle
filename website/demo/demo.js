// Interactive Saddle Demo - live component editing
const TOKENS = {
  backgroundColor: '#007AFF',
  color: '#ffffff',
  padding: '12px 24px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '600',
  border: 'none',
};

const GLOBAL_TOKENS = {
  colors: {
    primary: '#007AFF', secondary: '#f5f5f7', brand: '#1d1d1f',
    accent: '#5856D6', success: '#34C759', danger: '#FF3B30',
    surface: '#ffffff', text: '#1d1d1f', muted: '#86868b',
  },
  spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px' },
  radius: { sm: '4px', md: '8px', lg: '12px', full: '9999px' },
};

let activeTokens = { ...TOKENS };

function init() {
  renderSidebar();
  renderStage();
  renderInspector();
  updatePreview();
  addTerminalEntry('info', 'Project loaded: demo-components');
  addTerminalEntry('success', 'Found 1 component with 2 variants');
  addTerminalEntry('info', 'File watcher started');
}

function renderSidebar() {
  document.getElementById('demo-sidebar').innerHTML = `
    <div class="demo-sidebar-header">
      <img src="../assets/saddle-logo.png" height="20" alt="Saddle">
      <span class="demo-project-name">demo-lib</span>
    </div>
    <div class="demo-sidebar-section">
      <div class="demo-section-label">Components</div>
      <button class="demo-nav-item active" onclick="selectVariant('Primary', this)">
        <span>Button</span>
        <span class="demo-nav-sub">2 variants</span>
      </button>
    </div>
    <div class="demo-sidebar-section">
      <div class="demo-section-label">Views</div>
      <button class="demo-nav-item">Hierarchy</button>
      <button class="demo-nav-item">Dashboard</button>
    </div>
  `;
}

function renderStage() {
  document.getElementById('demo-stage').innerHTML = `
    <div class="demo-variant-bar">
      <div class="demo-variant-tabs">
        <button class="demo-variant-tab active" onclick="selectVariant('Primary', this)">Primary</button>
        <button class="demo-variant-tab" onclick="selectVariant('Secondary', this)">Secondary</button>
      </div>
      <button class="demo-new-variant">+ New Variant</button>
    </div>
    <div class="demo-preview-area">
      <div id="demo-preview-component" class="demo-preview-component">
        Button
      </div>
    </div>
  `;
}

function renderInspector() {
  const inspector = document.getElementById('demo-inspector');
  let html = `
    <div class="demo-inspector-tabs">
      <button class="demo-tab active">Style</button>
      <button class="demo-tab">Code</button>
      <button class="demo-tab">AI</button>
    </div>
    <div class="demo-inspector-content">
      <div class="demo-prop-section">
        <div class="demo-prop-section-header" onclick="toggleSection(this)">
          <span class="demo-arrow">▶</span>
          <span class="demo-section-title">Fill</span>
          <span class="demo-prop-count">1</span>
        </div>
        <div class="demo-prop-section-body open">
          <div class="demo-prop-row">
            <div class="demo-color-swatch" id="swatch-bg" style="background:${activeTokens.backgroundColor}"></div>
            <span class="demo-prop-name">background</span>
            <input class="demo-prop-input" value="${activeTokens.backgroundColor}" onchange="updateToken('backgroundColor', this.value)" oninput="updateToken('backgroundColor', this.value)">
            <div class="demo-token-picker-wrap">
              <button class="demo-token-btn" onclick="togglePicker(this, 'backgroundColor', 'colors')">token</button>
            </div>
          </div>
        </div>
      </div>

      <div class="demo-prop-section">
        <div class="demo-prop-section-header" onclick="toggleSection(this)">
          <span class="demo-arrow">▶</span>
          <span class="demo-section-title">Typography</span>
          <span class="demo-prop-count">3</span>
        </div>
        <div class="demo-prop-section-body open">
          <div class="demo-prop-row">
            <div class="demo-color-swatch" id="swatch-color" style="background:${activeTokens.color}"></div>
            <span class="demo-prop-name">color</span>
            <input class="demo-prop-input" value="${activeTokens.color}" onchange="updateToken('color', this.value)" oninput="updateToken('color', this.value)">
            <div class="demo-token-picker-wrap">
              <button class="demo-token-btn" onclick="togglePicker(this, 'color', 'colors')">token</button>
            </div>
          </div>
          <div class="demo-prop-row">
            <span class="demo-prop-name" style="margin-left:20px">fontSize</span>
            <input class="demo-prop-input" value="${activeTokens.fontSize}" onchange="updateToken('fontSize', this.value)" oninput="updateToken('fontSize', this.value)">
          </div>
          <div class="demo-prop-row">
            <span class="demo-prop-name" style="margin-left:20px">fontWeight</span>
            <input class="demo-prop-input" value="${activeTokens.fontWeight}" onchange="updateToken('fontWeight', this.value)" oninput="updateToken('fontWeight', this.value)">
          </div>
        </div>
      </div>

      <div class="demo-prop-section">
        <div class="demo-prop-section-header" onclick="toggleSection(this)">
          <span class="demo-arrow">▶</span>
          <span class="demo-section-title">Spacing</span>
          <span class="demo-prop-count">1</span>
        </div>
        <div class="demo-prop-section-body open">
          <div class="demo-prop-row">
            <span class="demo-prop-name" style="margin-left:20px">padding</span>
            <input class="demo-prop-input" value="${activeTokens.padding}" onchange="updateToken('padding', this.value)" oninput="updateToken('padding', this.value)">
          </div>
        </div>
      </div>

      <div class="demo-prop-section">
        <div class="demo-prop-section-header" onclick="toggleSection(this)">
          <span class="demo-arrow">▶</span>
          <span class="demo-section-title">Stroke</span>
          <span class="demo-prop-count">1</span>
        </div>
        <div class="demo-prop-section-body open">
          <div class="demo-prop-row">
            <span class="demo-prop-name" style="margin-left:20px">borderRadius</span>
            <input class="demo-prop-input" value="${activeTokens.borderRadius}" onchange="updateToken('borderRadius', this.value)" oninput="updateToken('borderRadius', this.value)">
          </div>
        </div>
      </div>
    </div>
  `;
  inspector.innerHTML = html;
}

function updateToken(key, value) {
  activeTokens[key] = value;
  updatePreview();
  addTerminalEntry('success', `Token updated: ${key} = ${value}`);

  // Update swatches
  if (key === 'backgroundColor') {
    const s = document.getElementById('swatch-bg');
    if (s) s.style.background = value;
  }
  if (key === 'color') {
    const s = document.getElementById('swatch-color');
    if (s) s.style.background = value;
  }
}

function updatePreview() {
  const el = document.getElementById('demo-preview-component');
  if (!el) return;
  Object.assign(el.style, {
    backgroundColor: activeTokens.backgroundColor,
    color: activeTokens.color,
    padding: activeTokens.padding,
    borderRadius: activeTokens.borderRadius,
    fontSize: activeTokens.fontSize,
    fontWeight: activeTokens.fontWeight,
    border: activeTokens.border,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    transition: 'all 150ms ease',
  });
}

function selectVariant(name, el) {
  if (name === 'Secondary') {
    activeTokens = {
      backgroundColor: '#f5f5f7',
      color: '#1d1d1f',
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      border: '1px solid #d1d1d6',
    };
  } else {
    activeTokens = { ...TOKENS };
  }

  document.querySelectorAll('.demo-variant-tab').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');

  renderInspector();
  updatePreview();
  addTerminalEntry('info', `Switched to ${name} variant`);
}

function toggleSection(header) {
  const body = header.nextElementSibling;
  const arrow = header.querySelector('.demo-arrow');
  body.classList.toggle('open');
  arrow.style.transform = body.classList.contains('open') ? 'rotate(90deg)' : 'rotate(0)';
}

function togglePicker(btn, tokenKey, category) {
  // Close any open pickers
  document.querySelectorAll('.demo-token-dropdown').forEach(d => d.remove());

  const dropdown = document.createElement('div');
  dropdown.className = 'demo-token-dropdown';

  const tokens = GLOBAL_TOKENS[category] || {};
  dropdown.innerHTML = `
    <div class="demo-picker-header">${category} tokens</div>
    ${Object.entries(tokens).map(([name, val]) => `
      <button class="demo-picker-item" onclick="pickToken('${tokenKey}', '${val}', this)">
        ${category === 'colors' ? `<span class="demo-picker-swatch" style="background:${val}"></span>` : ''}
        <span class="demo-picker-name">${name}</span>
        <span class="demo-picker-value">${val}</span>
      </button>
    `).join('')}
  `;

  btn.parentElement.appendChild(dropdown);

  setTimeout(() => {
    document.addEventListener('click', function close(e) {
      if (!dropdown.contains(e.target) && e.target !== btn) {
        dropdown.remove();
        document.removeEventListener('click', close);
      }
    });
  }, 0);
}

function pickToken(key, value, el) {
  updateToken(key, value);
  renderInspector();
  document.querySelectorAll('.demo-token-dropdown').forEach(d => d.remove());
}

// Terminal
const MAX_ENTRIES = 50;
function addTerminalEntry(type, message) {
  const terminal = document.getElementById('demo-terminal-log');
  if (!terminal) return;

  const now = new Date();
  const time = now.toTimeString().split(' ')[0];
  const colors = { info: '#86868b', success: '#34C759', warning: '#FF9500', error: '#FF3B30' };

  const entry = document.createElement('div');
  entry.className = 'demo-terminal-entry';
  entry.innerHTML = `<span class="demo-t-time">${time}</span> <span style="color:${colors[type] || '#fff'}">${message}</span>`;
  terminal.appendChild(entry);
  terminal.scrollTop = terminal.scrollHeight;

  if (terminal.children.length > MAX_ENTRIES) {
    terminal.removeChild(terminal.firstChild);
  }
}

document.addEventListener('DOMContentLoaded', init);
