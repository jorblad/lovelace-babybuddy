class BabyBuddyWeekFeedingsCard extends HTMLElement {
  setConfig(config) {
    if (!config) throw new Error('Configuration required');
    // Defaults in English, everything overridable/translateable
    this.config = {
      entity: config.entity || '',
      days: Math.max(1, Number(config.days ?? 7)),

      // Titles
      title: String(config.title || 'Breastfeeding'),
      subtitle: String(config.subtitle || 'Last week'),

      // Bar labels
      label_left: String(config.label_left || 'left'),
      label_right: String(config.label_right || 'right'),

      // Pluralization templates
      // Feedings
      label_feedings_singular: String(config.label_feedings_singular || 'feeding'),
      label_feedings_plural: String(config.label_feedings_plural || 'feedings'),
      // Minutes
      label_minutes_singular: String(config.label_minutes_singular || 'minute'),
      label_minutes_plural: String(config.label_minutes_plural || 'minutes'),

      // Relative day labels and formatter
      label_today: String(config.label_today || 'today'),
      label_yesterday: String(config.label_yesterday || 'yesterday'),
      label_days_ago_fmt: String(config.label_days_ago_fmt || '{n} days ago'),

      // Visibility
      show_minutes: config.show_minutes !== undefined ? !!config.show_minutes : true,

      // Colors and styles
      color_left: config.color_left || '#1f77b4',
      color_right: config.color_right || '#ff7f0e',
      bar_height: Math.max(20, Number(config.bar_height || 28)),

      // Icon (default: baby bottle)
      icon: String(config.icon || 'mdi:baby-bottle'),

      debug: !!config.debug
    };
  }

  connectedCallback() {
    if (this._initialized) return;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host { display:block; }
        .card {
          padding: 12px 12px 8px;
          box-sizing: border-box;
        }
        .title {
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 8px;
          display:flex; align-items:center; gap:8px;
        }
        .subtitle {
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 8px;
          color: var(--secondary-text-color);
        }
        .row { margin: 10px 0; }
        .bar {
          position: relative;
          width: 100%;
          height: var(--bar-height, 28px);
          background: rgba(255,255,255,0.08);
          border-radius: 14px;
          overflow: hidden;
          display:flex;
        }
        .leftSeg, .rightSeg {
          height: 100%;
          display:flex;
          align-items:center;
          justify-content:center;
          color: #fff;
          font-weight: 600;
          font-size: 14px;
          white-space: nowrap;
          padding: 0 8px;
        }
        .leftSeg { background: var(--color-left); }
        .rightSeg { background: var(--color-right); }
        .rowLabel {
          margin-top: 4px;
          font-size: 12px;
          color: var(--secondary-text-color);
        }
        .debug {
          margin-top: 8px;
          font-size: 12px;
          color: var(--secondary-text-color);
          white-space: pre-wrap;
        }
      </style>
      <ha-card>
        <div class="card">
          <div class="title">
            <ha-icon id="icon"></ha-icon>
            <span id="title"></span>
          </div>
          <div class="subtitle" id="subtitle"></div>
          <div id="rows"></div>
          <div id="debug" class="debug" style="display:none"></div>
        </div>
      </ha-card>
    `;
    this._iconEl = this.shadowRoot.getElementById('icon');
    this._titleEl = this.shadowRoot.getElementById('title');
    this._subtitleEl = this.shadowRoot.getElementById('subtitle');
    this._rowsEl = this.shadowRoot.getElementById('rows');
    this._debugEl = this.shadowRoot.getElementById('debug');
    this._initialized = true;
  }

  set hass(hass) {
    this._hass = hass;
    this._render().catch((e) => console.error(e));
  }

  getCardSize() { return 4; }

  _plural(val, singular, plural) {
    // Basic English rule; can be overridden by providing localized singular/plural strings
    return val === 1 ? singular : plural;
  }

  async _render() {
    if (!this._initialized) this.connectedCallback();
    const cfg = this.config;
    const entityId = cfg.entity;
    const state = entityId ? this._hass?.states?.[entityId] : null;
    const resultsRaw = state?.attributes?.results;

    // Icon and headers
    this._iconEl.setAttribute('icon', cfg.icon || 'mdi:baby-bottle');
    this._titleEl.textContent = cfg.title;
    this._subtitleEl.textContent = cfg.subtitle;

    // Normalize results
    let results = Array.isArray(resultsRaw) ? resultsRaw : [];
    if (!Array.isArray(resultsRaw) && typeof resultsRaw === 'string') {
      try { results = JSON.parse(resultsRaw); } catch(e) { results = []; }
    }

    // Helpers
    const DAY_MS = 24*3600*1000;
    const today = new Date(); today.setHours(0,0,0,0);
    const dateKey = (isoOrDate) => {
      const d = typeof isoOrDate === 'string' ? new Date(isoOrDate) : new Date(isoOrDate);
      d.setHours(0,0,0,0);
      const y = d.getFullYear();
      const m = String(d.getMonth()+1).padStart(2,'0');
      const dd = String(d.getDate()).padStart(2,'0');
      return `${y}-${m}-${dd}`;
    };
    const relDay = (idx) => {
      if (idx === 0) return cfg.label_today;
      if (idx === 1) return cfg.label_yesterday;
      return cfg.label_days_ago_fmt.replace('{n}', String(idx));
    };

    // Aggregate per day
    const byDay = new Map();
    for (const item of results) {
      const start = item.start || item.time || item.date;
      if (!start) continue;
      const key = dateKey(start);
      const rec = byDay.get(key) || { left:0, right:0, total:0, minutes:0 };
      const mth = (item.method || '').toLowerCase();
      if (mth.includes('left')) rec.left++;
      else if (mth.includes('right')) rec.right++;
      rec.total++;
      if (item.duration) {
        const dur = String(item.duration);
        const mm = dur.match(/^(\d+):(\d+):(\d+)(?:\.(\d+))?$/);
        if (mm) {
          const h = Number(mm[1]), m = Number(mm[2]);
          rec.minutes += (h*60 + m);
        }
      }
      byDay.set(key, rec);
    }

    // Build rows for last N days
    const rowsData = [];
    for (let i=0; i<cfg.days; i++) {
      const d = new Date(today.getTime() - i*DAY_MS);
      const key = dateKey(d.toISOString());
      const rec = byDay.get(key) || { left:0, right:0, total:0, minutes:0 };
      rowsData.push({ index: i, data: rec });
    }

    // Render rows
    this._rowsEl.innerHTML = '';
    for (const row of rowsData) {
      const left = row.data.left || 0;
      const right = row.data.right || 0;
      const totalForSplit = Math.max(1, left + right);
      const leftPct = (left / totalForSplit) * 100;
      const rightPct = (right / totalForSplit) * 100;

      const feedingsWord = this._plural(row.data.total, cfg.label_feedings_singular, cfg.label_feedings_plural);
      const minutesWord = this._plural(row.data.minutes, cfg.label_minutes_singular, cfg.label_minutes_plural);

      const subtitleBase = `${relDay(row.index)} (${row.data.total} ${feedingsWord}`;
      const subtitle = cfg.show_minutes ? `${subtitleBase} ${row.data.minutes} ${minutesWord})` : `${subtitleBase})`;

      const wrapper = document.createElement('div');
      wrapper.className = 'row';

      const bar = document.createElement('div');
      bar.className = 'bar';
      bar.style.setProperty('--bar-height', `${cfg.bar_height}px`);
      bar.style.setProperty('--color-left', cfg.color_left);
      bar.style.setProperty('--color-right', cfg.color_right);

      const leftSeg = document.createElement('div');
      leftSeg.className = 'leftSeg';
      leftSeg.style.width = `${leftPct}%`;
      leftSeg.textContent = `${left} ${cfg.label_left}`;

      const rightSeg = document.createElement('div');
      rightSeg.className = 'rightSeg';
      rightSeg.style.width = `${rightPct}%`;
      rightSeg.textContent = `${right} ${cfg.label_right}`;

      bar.appendChild(leftSeg);
      bar.appendChild(rightSeg);

      const rowLbl = document.createElement('div');
      rowLbl.className = 'rowLabel';
      rowLbl.textContent = subtitle;

      wrapper.appendChild(bar);
      wrapper.appendChild(rowLbl);
      this._rowsEl.appendChild(wrapper);
    }

    // Debug
    if (cfg.debug) {
      this._debugEl.style.display = 'block';
      const dbg = rowsData.map(r => `d${r.index}: L=${r.data.left} R=${r.data.right} T=${r.data.total} min=${r.data.minutes}`).join('\n');
      this._debugEl.textContent = dbg;
    } else {
      this._debugEl.style.display = 'none';
    }
  }

  static getConfigForm() {
    return {
      schema: [
        { name: 'entity', required: true, selector: { entity: { domain: 'sensor' } } },

        // Titles
        { name: 'title', selector: { text: { multiline: false } }, default: 'Breastfeeding' },
        { name: 'subtitle', selector: { text: { multiline: false } }, default: 'Last week' },
        { name: 'days', selector: { number: { min: 1, max: 14, step: 1 } }, default: 7 },

        // Bar labels
        { name: 'label_left', selector: { text: { multiline: false } }, default: 'left' },
        { name: 'label_right', selector: { text: { multiline: false } }, default: 'right' },

        // Pluralization templates
        { name: 'label_feedings_singular', selector: { text: { multiline: false } }, default: 'feeding' },
        { name: 'label_feedings_plural', selector: { text: { multiline: false } }, default: 'feedings' },
        { name: 'label_minutes_singular', selector: { text: { multiline: false } }, default: 'minute' },
        { name: 'label_minutes_plural', selector: { text: { multiline: false } }, default: 'minutes' },

        // Relative days
        { name: 'label_today', selector: { text: { multiline: false } }, default: 'today' },
        { name: 'label_yesterday', selector: { text: { multiline: false } }, default: 'yesterday' },
        { name: 'label_days_ago_fmt', selector: { text: { multiline: false } }, default: '{n} days ago' },

        // Visibility and appearance
        { name: 'show_minutes', selector: { boolean: {} }, default: true },
        { name: 'icon', selector: { icon: {} }, default: 'mdi:baby-bottle' },
        { name: 'color_left', selector: { color: { mode: 'hex' } }, default: '#1f77b4' },
        { name: 'color_right', selector: { color: { mode: 'hex' } }, default: '#ff7f0e' },
        { name: 'bar_height', selector: { number: { min: 20, max: 40, step: 1 } }, default: 28 },

        { name: 'debug', selector: { boolean: {} }, default: false }
      ],
      computeLabel: (schema) => {
        const m = {
          entity: 'Feedings sensor',
          title: 'Title',
          subtitle: 'Subtitle',
          days: 'Number of days',
          label_left: 'Left label',
          label_right: 'Right label',
          label_feedings_singular: 'Feedings (singular)',
          label_feedings_plural: 'Feedings (plural)',
          label_minutes_singular: 'Minutes (singular)',
          label_minutes_plural: 'Minutes (plural)',
          label_today: '“Today” label',
          label_yesterday: '“Yesterday” label',
          label_days_ago_fmt: '“Days ago” format ({n} = number)',
          show_minutes: 'Show total minutes',
          icon: 'Icon (mdi:...)',
          color_left: 'Left color',
          color_right: 'Right color',
          bar_height: 'Bar height',
          debug: 'Show debug'
        };
        return m[schema.name] || '';
      }
    };
  }
}

customElements.define('babybuddy-feedings-card', BabyBuddyWeekFeedingsCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "babybuddy-feedings-card",
  name: "BabyBuddy Feedings Card",
  description: "Shows left vs right feedings per day for the last week as split bars",
  preview: true,
  getEntitySuggestion: (_hass, entityId) => {
    if (!entityId || !entityId.startsWith('sensor.babybuddy_')) return null;
    if (!entityId.toLowerCase().includes('feeding')) return null;
    return {
      config: {
        type: 'custom:babybuddy-feedings-card',
        entity: entityId
      }
    };
  }
});