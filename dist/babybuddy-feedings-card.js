class BabyBuddyWeekFeedingsCard extends HTMLElement {
  _getLanguage(hass = this._hass) {
    if (hass?.language) {
      const lang = hass.language.split('-')[0];
      const translations = window.BabyBuddyTranslations || BabyBuddyTranslations;
      return translations[lang] ? lang : 'en';
    }
    return 'en';
  }

  _t(path, hass = this._hass) {
    const lang = this._getLanguage(hass);
    const translations = window.BabyBuddyTranslations || BabyBuddyTranslations;
    const langs = translations[lang];
    const keys = path.split('.');
    let value = langs;
    for (const key of keys) {
      value = value?.[key];
      if (!value) break;
    }
    return value || path;
  }

  setConfig(config) {
    if (!config) throw new Error('Configuration required');
    this.config = {
      entity: config.entity || '',
      days: Math.max(1, Number(config.days ?? 7)),

      title: config.title != null ? String(config.title) : null,
      subtitle: config.subtitle != null ? String(config.subtitle) : null,

      label_left: config.label_left != null ? String(config.label_left) : null,
      label_right: config.label_right != null ? String(config.label_right) : null,
      label_both: config.label_both != null ? String(config.label_both) : null,

      label_feedings_singular: config.label_feedings_singular != null ? String(config.label_feedings_singular) : null,
      label_feedings_plural: config.label_feedings_plural != null ? String(config.label_feedings_plural) : null,
      label_minutes_singular: config.label_minutes_singular != null ? String(config.label_minutes_singular) : null,
      label_minutes_plural: config.label_minutes_plural != null ? String(config.label_minutes_plural) : null,

      label_today: config.label_today != null ? String(config.label_today) : null,
      label_yesterday: config.label_yesterday != null ? String(config.label_yesterday) : null,
      label_days_ago_fmt: config.label_days_ago_fmt != null ? String(config.label_days_ago_fmt) : null,

      show_minutes: config.show_minutes !== undefined ? !!config.show_minutes : true,

      color_left: config.color_left || '#1f77b4',
      color_right: config.color_right || '#ff7f0e',
      color_both: config.color_both || '#d62728',
      bar_height: Math.max(20, Number(config.bar_height || 28)),

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

    const title = cfg.title || this._t('feedings.title');
    const subtitle = cfg.subtitle || this._t('feedings.subtitle');
    const labelLeft = cfg.label_left || this._t('feedings.labels.left');
    const labelRight = cfg.label_right || this._t('feedings.labels.right');
    const labelBoth = cfg.label_both || this._t('feedings.labels.both');
    const labelFeedingsSingular = cfg.label_feedings_singular || this._t('feedings.feedings_singular');
    const labelFeedingsPlural = cfg.label_feedings_plural || this._t('feedings.feedings_plural');
    const labelMinutesSingular = cfg.label_minutes_singular || this._t('feedings.minutes_singular');
    const labelMinutesPlural = cfg.label_minutes_plural || this._t('feedings.minutes_plural');
    const labelToday = cfg.label_today || this._t('feedings.today');
    const labelYesterday = cfg.label_yesterday || this._t('feedings.yesterday');
    const labelDaysAgoFmt = cfg.label_days_ago_fmt || this._t('feedings.days_ago_fmt');

    // Icon and headers
    this._iconEl.setAttribute('icon', cfg.icon || 'mdi:baby-bottle');
    this._titleEl.textContent = title;
    this._subtitleEl.textContent = subtitle;

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
      if (idx === 0) return labelToday;
      if (idx === 1) return labelYesterday;
      return labelDaysAgoFmt.replace('{n}', String(idx));
    };

    // Aggregate per day
    const byDay = new Map();
    for (const item of results) {
      const start = item.start || item.time || item.date;
      if (!start) continue;
      const key = dateKey(start);
      const rec = byDay.get(key) || { left:0, right:0, total:0, minutes:0 };
      const mth = (item.method || '').toLowerCase();
      if (mth.includes('both')) { rec.left++; rec.right++; }
      else if (mth.includes('left')) rec.left++;
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

      const feedingsWord = this._plural(row.data.total, labelFeedingsSingular, labelFeedingsPlural);
      const minutesWord = this._plural(row.data.minutes, labelMinutesSingular, labelMinutesPlural);

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
      leftSeg.textContent = `${left} ${labelLeft}`;

      const rightSeg = document.createElement('div');
      rightSeg.className = 'rightSeg';
      rightSeg.style.width = `${rightPct}%`;
      rightSeg.textContent = `${right} ${labelRight}`;

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
    const hass = document.querySelector("home-assistant")?.hass;
    const t = (path) => BabyBuddyWeekFeedingsCard.prototype._t(path, hass);
    return {
      schema: [
        { name: 'entity', required: true, selector: { entity: { domain: 'sensor' } } },

        { name: 'title', selector: { text: { multiline: false } } },
        { name: 'subtitle', selector: { text: { multiline: false } } },
        { name: 'days', selector: { number: { min: 1, max: 14, step: 1 } }, default: 7 },

        { name: 'label_left', selector: { text: { multiline: false } } },
        { name: 'label_right', selector: { text: { multiline: false } } },
        { name: 'label_both', selector: { text: { multiline: false } } },

        { name: 'label_feedings_singular', selector: { text: { multiline: false } } },
        { name: 'label_feedings_plural', selector: { text: { multiline: false } } },
        { name: 'label_minutes_singular', selector: { text: { multiline: false } } },
        { name: 'label_minutes_plural', selector: { text: { multiline: false } } },

        { name: 'label_today', selector: { text: { multiline: false } } },
        { name: 'label_yesterday', selector: { text: { multiline: false } } },
        { name: 'label_days_ago_fmt', selector: { text: { multiline: false } } },

        { name: 'show_minutes', selector: { boolean: {} }, default: true },
        { name: 'icon', selector: { icon: {} }, default: 'mdi:baby-bottle' },
        { name: 'color_left', selector: { color: { mode: 'hex' } }, default: '#1f77b4' },
        { name: 'color_right', selector: { color: { mode: 'hex' } }, default: '#ff7f0e' },
        { name: 'color_both', selector: { color: { mode: 'hex' } }, default: '#d62728' },
        { name: 'bar_height', selector: { number: { min: 20, max: 40, step: 1 } }, default: 28 },

        { name: 'debug', selector: { boolean: {} }, default: false }
      ],
      computeLabel: (schema) => {
        if (schema.name) return t(`feedings.config.${schema.name}`);
        return '';
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