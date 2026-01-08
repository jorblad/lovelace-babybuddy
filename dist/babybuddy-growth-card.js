class BabyBuddyGrowthCard extends HTMLElement {
  setConfig(config) {
    if (!config) throw new Error('Configuration required');
    this.config = config;
  }

  connectedCallback() {
    if (this._initialized) return;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host { display:block; }
        #chart { width: 100%; height: 320px; }
        #debug { font-size: 12px; color: #444; margin-top:8px; white-space:pre-wrap; }
      </style>
      <div id="chart"></div>
      <div id="debug"></div>
    `;
    this._chartEl = this.shadowRoot.getElementById('chart');
    this._debugEl = this.shadowRoot.getElementById('debug');
    this._initialized = true;
  }

  async _loadApex() {
    if (window.ApexCharts) return;
    if (this._loadingApex) return this._loadingApex;
    this._loadingApex = new Promise((resolve, reject) => {
      const tryLocal = () => {
        const s2 = document.createElement('script');
        s2.src = '/local/custom_cards/libs/apexcharts.min.js';
        s2.onload = () => resolve();
        s2.onerror = (e) => reject(e);
        document.head.appendChild(s2);
      };

      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/apexcharts';
      s.onload = () => { console.debug('ApexCharts loaded from CDN'); resolve(); };
      s.onerror = (e) => {
        console.warn('ApexCharts CDN failed to load, attempting local fallback');
        tryLocal();
      };
      document.head.appendChild(s);
    });
    return this._loadingApex;
  }

  _normalizeSeries(attr) {
    if (!attr) return [];
    if (typeof attr === 'string') {
      try { attr = JSON.parse(attr); } catch (e) { return []; }
    }
    if (!Array.isArray(attr)) return [];
    return attr.map(o => [Number(o.x) || 0, Number(o.y) || 0]);
  }

  async updateChart(hass) {
    if (!this._initialized) this.connectedCallback();
    if (!this.isConnected) return;
    await this._loadApex();

    const entities = this.config.entities || [];
    const series = [];

    // Parse optional labels/colors/units from config (allow JSON string or object)
    let labelMap = {};
    let colorMap = {};
    let unitMap = {};
    try {
      if (this.config && this.config.entity_labels) {
        labelMap = typeof this.config.entity_labels === 'string' ? JSON.parse(this.config.entity_labels) : this.config.entity_labels;
      }
    } catch (e) { console.warn('Invalid entity_labels JSON', e); }
    try {
      if (this.config && this.config.entity_colors) {
        colorMap = typeof this.config.entity_colors === 'string' ? JSON.parse(this.config.entity_colors) : this.config.entity_colors;
      }
    } catch (e) { console.warn('Invalid entity_colors JSON', e); }
    try {
      if (this.config && this.config.entity_units) {
        unitMap = typeof this.config.entity_units === 'string' ? JSON.parse(this.config.entity_units) : this.config.entity_units;
      }
    } catch (e) { console.warn('Invalid entity_units JSON', e); }

    const info = [];
    for (const ent of entities) {
      const state = hass.states[ent];
      const name = (state && state.attributes && (state.attributes.friendly_name || state.attributes.friendlyName)) || ent;

      // Prefer explicit attributes.series if present
      let raw = state && state.attributes && state.attributes.series;
      let data = this._normalizeSeries(raw);

      // If no series, build from attributes.results
      if ((!data || data.length === 0) && state && state.attributes && state.attributes.results) {
        let results = state.attributes.results;
        if (typeof results === 'string') {
          try {
            results = JSON.parse(results);
          } catch (e) {
            // Fallback: YAML-ish parser
            const items = results.split(/\n-\s+/).map(s => s.trim()).filter(Boolean);
            const parsed = [];
            for (const it of items) {
              const startMatch = it.match(/start:\s*"?([^"\n]+)"?/i) || it.match(/time:\s*"?([^"\n]+)"?/i) || it.match(/date:\s*"?([^"\n]+)"?/i);
              const weightMatch = it.match(/weight:\s*([0-9.]+)/i);
              const heightMatch = it.match(/height:\s*([0-9.]+)/i);
              const headMatch = it.match(/head_circumference:\s*([0-9.]+)/i);
              const amountMatch = it.match(/amount:\s*([0-9.]+)/i);
              const ts = startMatch && startMatch[1];
              if (!ts) continue;
              const obj = { _ts: ts };
              if (weightMatch) obj.weight = Number(weightMatch[1]);
              if (heightMatch) obj.height = Number(heightMatch[1]);
              if (headMatch) obj.head_circumference = Number(headMatch[1]);
              if (amountMatch) obj.amount = Number(amountMatch[1]);
              parsed.push(obj);
            }
            results = parsed;
          }
        }

        if (Array.isArray(results)) {
          const built = [];
          for (const item of results) {
            const ts = item.start || item.time || item.date || item.timestamp || item.created || item.recorded_at || item._ts;
            const x = (typeof ts === 'number') ? ts : (ts ? Date.parse(ts) : null);
            if (!x) continue;
            let y = 1;
            if ('weight' in item && item.weight != null) y = Number(item.weight);
            else if ('height' in item && item.height != null) y = Number(item.height);
            else if ('head_circumference' in item && item.head_circumference != null) y = Number(item.head_circumference);
            else if ('amount' in item && item.amount != null) y = Number(item.amount);
            built.push([x, y]);
          }
          built.sort((a, b) => a[0] - b[0]);
          data = built;
        }
      }

      const len = (data && data.length) || 0;
      const dispName = labelMap[ent] || name;
      const unit = unitMap[ent] || ''; // per-entity unit (e.g., "kg", "cm")
      const seriesObj = { name: unit ? `${dispName} (${unit})` : dispName, data };
      if (colorMap[ent]) seriesObj.color = colorMap[ent];

      console.debug('growth-card entity', ent, 'stateExists', !!state, 'seriesLen', len);
      series.push(seriesObj);
      info.push({ entity: ent, found: !!state, seriesLen: len, unit });
    }

    const zoomOpts = {
      enabled: true,
      type: 'x',
      allowMouseWheelZoom: !(this.config && this.config.disable_scroll_zoom),
      autoScaleYaxis: false
    };

    // If you want a single y-axis title, pick the first non-empty unit
    const axisUnitTitle = series.find(s => /\(([^)]+)\)$/.test(s.name));
    const yUnit = axisUnitTitle ? axisUnitTitle.name.match(/\(([^)]+)\)$/)[1] : (this.config.graph_unit || '');

    const options = {
      chart: { type: this.config.chart_type || 'line', height: this.config.height || 320, zoom: zoomOpts },
      stroke: { width: 3 },
      series: series,
      xaxis: { type: 'datetime' },
      legend: { show: true },
      tooltip: {
        x: { format: 'dd MMM yyyy HH:mm' },
        y: {
          formatter: (val) => {
            if (!isFinite(val)) return val;
            // Tooltip unit preference: if graph_unit is set, use it; else use first unit found
            const unit = this.config.graph_unit || yUnit || '';
            return unit ? `${val} ${unit}` : String(val);
          }
        }
      },
      yaxis: {
        title: { text: yUnit || this.config.graph_unit || undefined }
      }
    };

    // optional timespan (hours)
    try {
      const tsHours = this.config && (this.config.timespan_hours || Number(this.config.timespan_hours));
      if (tsHours && !isNaN(tsHours) && tsHours > 0) {
        const allX = series.flatMap(s => (s.data||[]).map(d => d[0]));
        const maxX = allX.length ? Math.max(...allX) : Date.now();
        const minX = maxX - (tsHours * 3600 * 1000);
        options.xaxis.min = minX;
        options.xaxis.max = maxX;
      }
    } catch(e) { console.warn(e); }

    // disable scroll-to-zoom
    try {
      const shouldBlock = this.config && this.config.disable_scroll_zoom;
      const installBlocker = () => {
        if (this._wheelBlocker) return;
        const handler = (ev) => {
          try {
            const path = ev.composedPath ? ev.composedPath() : (ev.path || []);
            if (path && (path.indexOf(this._chartEl) !== -1 || path.indexOf(this.shadowRoot) !== -1)) {
              ev.preventDefault();
              ev.stopImmediatePropagation();
            }
          } catch (e) { /* ignore */ }
        };
        this._wheelBlocker = handler;
        if (this.shadowRoot) this.shadowRoot.addEventListener('wheel', handler, { passive: false, capture: true });
        if (this._chartEl) this._chartEl.addEventListener('wheel', handler, { passive: false, capture: true });
        document.addEventListener('wheel', handler, { passive: false, capture: true });
      };
      const removeBlocker = () => {
        if (!this._wheelBlocker) return;
        try { if (this.shadowRoot) this.shadowRoot.removeEventListener('wheel', this._wheelBlocker, { capture: true }); } catch(e) {}
        try { if (this._chartEl) this._chartEl.removeEventListener('wheel', this._wheelBlocker, { capture: true }); } catch(e) {}
        try { document.removeEventListener('wheel', this._wheelBlocker, { capture: true }); } catch(e) {}
        this._wheelBlocker = null;
      };
      if (shouldBlock) installBlocker(); else removeBlocker();
    } catch(e) { console.warn(e); }

    // debug info
    try {
      if (this.config && this.config.debug === false) {
        this._debugEl.style.display = 'none';
      } else {
        this._debugEl.style.display = 'block';
        this._debugEl.textContent = 'Entities:\n' + info.map(i => `${i.entity}: found=${i.found}, seriesLen=${i.seriesLen}, unit=${i.unit||'-'}`).join('\n');
      }
    } catch (e) { console.warn(e); }

    if (!this._chart) {
      this._chart = new ApexCharts(this._chartEl, options);
      await this._chart.render();
      console.debug('growth-card chart rendered, series:', series.map(s=>({name:s.name, len:(s.data||[]).length}))); 
    } else {
      await this._chart.updateOptions(options, false, false);
      await this._chart.updateSeries(series, true);
      console.debug('growth-card chart updated, series:', series.map(s=>({name:s.name, len:(s.data||[]).length}))); 
    }
  }

  set hass(hass) {
    this._hass = hass;
    this.updateChart(hass).catch(err => console.error(err));
  }

  getCardSize() { return 4; }

  static getConfigForm() {
    return {
      schema: [
        { name: 'entities', required: true, selector: { entity: { multiple: true } } },
        { name: 'entity_labels', selector: { text: {} } },
        { name: 'entity_colors', selector: { text: {} } },
        { name: 'entity_units', selector: { text: {} } },  // NEW
        { name: 'graph_unit', selector: { text: {} } },    // optional global unit for tooltip/axis
        { name: 'height', selector: { number: {} } },
        { name: 'chart_type', selector: { select: { options: [ { value: 'line', label: 'Line' }, { value: 'area', label: 'Area' }, { value: 'scatter', label: 'Scatter' } ] } } },
        { name: 'timespan_hours', selector: { number: {} } },
        { name: 'disable_scroll_zoom', selector: { boolean: {} } },
        { name: 'debug', selector: { boolean: {} }, default: false }
      ],
      computeLabel: (schema) => {
        const m = {
          entities: 'Entities',
          height: 'Chart height',
          chart_type: 'Chart type',
          debug: 'Show debug panel',
          entity_labels: 'Entity labels (JSON)',
          entity_colors: 'Entity colors (JSON)',
          entity_units: 'Entity units (JSON)',       // NEW
          graph_unit: 'Global unit (optional)',      // NEW
          timespan_hours: 'Timespan (hours)',
          disable_scroll_zoom: 'Disable scroll zoom'
        };
        return m[schema.name];
      },
      computeHelper: (schema) => {
        if (schema.name === 'entity_labels') return 'JSON: {"sensor.weight":"Weight","sensor.height":"Height"}';
        if (schema.name === 'entity_colors') return 'JSON: {"sensor.weight":"#ff0000","sensor.height":"#00aa00"}';
        if (schema.name === 'entity_units') return 'JSON: {"sensor.weight":"kg","sensor.height":"cm","sensor.head":"cm"}';
        if (schema.name === 'graph_unit') return 'Single unit applied to tooltip and y-axis title if per-entity units are not specified.';
        if (schema.name === 'timespan_hours') return 'Initial timespan to show in hours (optional)';
        if (schema.name === 'disable_scroll_zoom') return 'Disable zooming with mouse wheel';
        return undefined;
      },
      assertConfig: (config) => {
        if (config.entity_labels) { try { JSON.parse(config.entity_labels); } catch (e) { throw new Error('entity_labels must be valid JSON'); } }
        if (config.entity_colors) { try { JSON.parse(config.entity_colors); } catch (e) { throw new Error('entity_colors must be valid JSON'); } }
        if (config.entity_units) { try { JSON.parse(config.entity_units); } catch (e) { throw new Error('entity_units must be valid JSON'); } }
      }
    };
  }
}

customElements.define('babybuddy-growth-card', BabyBuddyGrowthCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "babybuddy-growth-card",
  name: "BabyBuddy Growth Card",
  description: "Displays growth metrics using ApexCharts",
  preview: true,
});

BabyBuddyGrowthCard.getStubConfig = function() { return { entities: [], debug: true }; };