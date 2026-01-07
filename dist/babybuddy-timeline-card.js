class BabyBuddyTimelineCard extends HTMLElement {
  setConfig(config) {
    this.config = config || {};
  }

  connectedCallback() {
    if (this._initialized) return;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host { display:block; }
        #chart { width: 100%; height: 320px; }
        #controls { margin-top:8px; display:flex; gap:8px; flex-wrap:wrap; }
        .method-toggle { margin-right:6px; }
        #debug { font-size:12px; color:#444; margin-top:8px; white-space:pre-wrap; }
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

  _parseAttr(attr) {
    if (!attr) return [];
    if (typeof attr === 'string') {
      try { attr = JSON.parse(attr); } catch (e) { return []; }
    }
    if (!Array.isArray(attr)) return [];
    return attr.map(o => ({ x: Number(o.x) || 0, y: Number(o.y) || 1, meta: o }));
  }

  async updateChart(hass) {
    if (!this._initialized) this.connectedCallback();
    if (!this.isConnected) return;
    await this._loadApex();
    const feedEnt = this.config.feedings_entity;
    const diaperEnt = this.config.diaper_entity;

    const feedState = feedEnt ? hass.states[feedEnt] : null;
    const diaperState = diaperEnt ? hass.states[diaperEnt] : null;

    // Build feeding points: prefer attributes.series, otherwise build from attributes.results (start)
    // We'll split into method groups: left, right, bottle, other
    const feedGroups = { left: [], right: [], bottle: [], other: [] };
    // Configurable method labels/colors
    const methodLabels = Object.assign({ left: 'Left', right: 'Right', bottle: 'Bottle', other: 'Other' }, this.config.feed_labels || {});
    const methodColors = Object.assign({ left: '#1f77b4', right: '#ff7f0e', bottle: '#2ca02c', other: '#7f7f7f' }, this.config.feed_colors || {});
    // support per-field labels/colors from visual editor: label_left, color_left, etc.
    for (const k of ['left','right','bottle','other']) {
      const labKey = 'label_' + k;
      const colKey = 'color_' + k;
      if (this.config && this.config[labKey]) methodLabels[k] = this.config[labKey];
      if (this.config && this.config[colKey]) methodColors[k] = this.config[colKey];
    }
    if (feedState && feedState.attributes) {
      let res = feedState.attributes.series || feedState.attributes.results;
      if (typeof res === 'string') {
        try { res = JSON.parse(res); } catch (e) {
          // simple YAML-ish parse for start and method
          const items = res.split(/\n-\s+/).map(s => s.trim()).filter(Boolean);
          const parsed = [];
          for (const it of items) {
            const startMatch = it.match(/start:\s*"?([^"\n]+)"?/i) || it.match(/time:\s*"?([^"\n]+)"?/i) || it.match(/date:\s*"?([^"\n]+)"?/i);
            const methodMatch = it.match(/method:\s*"?([^"\n]+)"?/i) || it.match(/type:\s*"?([^"\n]+)"?/i);
            if (!startMatch) continue;
            parsed.push({ start: startMatch[1], method: methodMatch && methodMatch[1] });
          }
          res = parsed;
        }
      }
      if (Array.isArray(res)) {
        for (const item of res) {
          const ts = item.start || item.time || item.date || item.timestamp || item.created || item.recorded_at;
          const x = (typeof ts === 'number') ? ts : (ts ? Date.parse(ts) : null);
          if (!x) continue;
          const methodRaw = (item.method || item.type || '').toString().toLowerCase();
          let key = 'other';
          if (methodRaw.includes('left')) key = 'left';
          else if (methodRaw.includes('right')) key = 'right';
          else if (methodRaw.includes('bottle') || methodRaw.includes('formula') || methodRaw.includes('pump')) key = 'bottle';
          feedGroups[key].push([x, 1]);
        }
        for (const k of Object.keys(feedGroups)) feedGroups[k].sort((a,b)=>a[0]-b[0]);
      }
    }

    // Diaper: prefer series_wet/series_solid, otherwise build from results (time + wet/solid flags)
    let wetPoints = [];
    let solidPoints = [];
    if (diaperState && diaperState.attributes) {
      let res = null;
      if (diaperState.attributes.series_wet || diaperState.attributes.series_solid) {
        wetPoints = this._parseAttr(diaperState.attributes.series_wet).map(p => [p.x, 2]);
        solidPoints = this._parseAttr(diaperState.attributes.series_solid).map(p => [p.x, 3]);
      } else if (diaperState.attributes.results) {
        res = diaperState.attributes.results;
      }

      if (typeof res === 'string') {
        try { res = JSON.parse(res); } catch (e) {
          const items = res.split(/\n-\s+/).map(s => s.trim()).filter(Boolean);
          const parsed = [];
          for (const it of items) {
            const timeMatch = it.match(/time:\s*"?([^"\n]+)"?/i) || it.match(/start:\s*"?([^"\n]+)"?/i) || it.match(/date:\s*"?([^"\n]+)"?/i);
            const wetMatch = it.match(/wet:\s*(true|false)/i);
            const solidMatch = it.match(/solid:\s*(true|false)/i);
            if (!timeMatch) continue;
            parsed.push({ time: timeMatch[1], wet: wetMatch && wetMatch[1].toLowerCase()==='true', solid: solidMatch && solidMatch[1].toLowerCase()==='true' });
          }
          res = parsed;
        }
      }

      if (Array.isArray(res)) {
        for (const item of res) {
          const ts = item.time || item.start || item.date || item.timestamp || item.created || item.recorded_at;
          const x = (typeof ts === 'number') ? ts : (ts ? Date.parse(ts) : null);
          if (!x) continue;
          if (item.wet) wetPoints.push([x, 2]);
          if (item.solid) solidPoints.push([x, 3]);
        }
        wetPoints.sort((a,b)=>a[0]-b[0]);
        solidPoints.sort((a,b)=>a[0]-b[0]);
      }
    }

    const feedLens = Object.fromEntries(Object.keys(feedGroups).map(k=>[k, feedGroups[k].length]));
    console.debug('timeline-card feedGroups', feedLens, 'wetPoints', wetPoints.length, 'solidPoints', solidPoints.length);
    const info = [
      { key: 'left', len: feedLens.left },
      { key: 'right', len: feedLens.right },
      { key: 'bottle', len: feedLens.bottle },
      { key: 'other', len: feedLens.other },
      { key: 'wetPoints', len: wetPoints.length },
      { key: 'solidPoints', len: solidPoints.length }
    ];
    const series = [];
    // debug helpers: sample raw timestamps per method
    const feedSamples = {};
    for (const k of ['left','right','bottle','other']) {
      feedSamples[k] = (feedGroups[k] || []).slice(0,5).map(p => (new Date(p[0])).toISOString());
    }
    // Build feeding series per-method, respect filter state
    // Support optional offsets compare (e.g., [0,-1,-2] or "0,-1,-2" or ["0d","-1d"]) and compare_as_rows
    const offsetsRaw = this.config && this.config.offsets;
    const parseOffsetValue = (v) => {
      if (v == null) return null;
      if (typeof v === 'number') return { days: v, ms: v * 24 * 3600 * 1000, label: `${v}d` };
      const s = String(v).trim();
      const m = s.match(/^(-?\d+(?:\.\d+)?)\s*(d|h)?$/i);
      if (m) {
        const num = Number(m[1]);
        const unit = (m[2] || 'd').toLowerCase();
        if (unit === 'h') return { days: num / 24, ms: num * 3600 * 1000, label: `${num}h` };
        return { days: num, ms: num * 24 * 3600 * 1000, label: `${num}d` };
      }
      // try JSON
      try { const parsed = JSON.parse(s); return parseOffsetValue(parsed); } catch(e) {}
      return null;
    };
    let offsets = null;
    if (Array.isArray(offsetsRaw)) offsets = offsetsRaw.map(parseOffsetValue).filter(Boolean);
    else if (typeof offsetsRaw === 'string' && offsetsRaw.trim()) {
      const sRaw = offsetsRaw.trim();
      const tryJson = (() => { try { return JSON.parse(sRaw); } catch(e){ return null; } })();
      if (Array.isArray(tryJson)) {
        offsets = tryJson.map(parseOffsetValue).filter(Boolean);
      } else {
        // strip surrounding brackets/parentheses, then split by commas
        let inner = sRaw.replace(/^[\[\(]\s*|\s*[\]\)]$/g, '');
        const parts = inner.split(',').map(p => p.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
        offsets = parts.map(parseOffsetValue).filter(Boolean);
      }
    }
    const compareAsRows = !!(this.config && this.config.compare_as_rows);
    const forceMidnight = !!(this.config && this.config.force_midnight);
    const DAY_MS = 24 * 3600 * 1000;
    console.debug('timeline-card parsed offsets', offsets, 'compareAsRows', compareAsRows, 'forceMidnight', forceMidnight);
    // temporary holders for x-axis and y-axis bounds when compare-as-rows needs to fix to today's 24h window
    let compareXMin = null, compareXMax = null, compareYMin = null, compareYMax = null;
    if (offsets && offsets.length) {
      const offsetLabels = this.config && this.config.offset_labels ? (Array.isArray(this.config.offset_labels) ? this.config.offset_labels : (typeof this.config.offset_labels === 'string' ? (this.config.offset_labels.split(',').map(s=>s.trim())) : [])) : [];
      // determine band spacing
      const band = 10;
      const methodJitter = { left: 0.3, right: 0.1, bottle: -0.1, other: -0.3 };
      // For ordering: ensure offsets are used in order provided; we'll place today's offset (0) on top if first
      const offsetsCounts = [];
      for (let oi = 0; oi < offsets.length; oi++) {
        const offObj = offsets[oi];
        const offDays = offObj.days;
        const label = offsetLabels[oi] || (offDays === 0 ? 'Today' : (offDays < 0 ? `${Math.abs(offDays)}d ago` : `+${offDays}d`));
        const baseRow = (offsets.length - 1 - oi) * band; // today on top when offsets[0] === 0
        for (const k of ['left','right','bottle','other']) {
          const rawData = feedGroups[k];
          if (!rawData || !rawData.length) continue;
          const data = [];
          let included = 0;
          for (const pt of rawData) {
            const originalTs = pt[0];
            const todayStart = new Date(); todayStart.setHours(0,0,0,0);
            const targetStart = todayStart.getTime() + offObj.ms; // beginning of the day for this offset (local)
            // only include points that belong to this offset's day (avoid duplicating across offsets)
            if (!(originalTs >= targetStart && originalTs < (targetStart + DAY_MS))) continue;
            included++;
            // compute time-of-day in local timezone from original timestamp
            const od = new Date(originalTs);
            const timeOfDay = ((od.getHours() * 3600) + (od.getMinutes() * 60) + od.getSeconds()) * 1000 + od.getMilliseconds();
            const baseX = todayStart.getTime() + timeOfDay;
            if (compareAsRows) {
              const newY = baseRow + methodJitter[k];
              data.push([baseX, newY]);
            } else {
              // overlay: map each point to today's same time-of-day so different offsets overlay on the same 24h
              data.push([baseX, 1]);
            }
          }
          if (data.length) series.push({ name: `${label} — ${methodLabels[k]}`, type: 'scatter', data: data, color: methodColors[k] });
          offsetsCounts.push({ offset: label, method: k, included });
        }
      }
      // if compareAsRows, set xaxis to today's 24h window unless timespan overrides
      if (compareAsRows) {
        const todayStart = new Date(); todayStart.setHours(0,0,0,0);
        compareXMin = todayStart.getTime();
        compareXMax = todayStart.getTime() + DAY_MS;
        // set y bounds to contain all bands (with slight padding)
        compareYMin = -1;
        compareYMax = (band * offsets.length) + 1;
      }
      // attach offsetsCounts to info for debug
      info.push({ key: 'offsetsCounts', len: (offsetsCounts || []).length, details: offsetsCounts });
    } else {
      for (const k of ['left','right','bottle','other']) {
        if (feedGroups[k].length) {
          series.push({ name: methodLabels[k], type: 'scatter', data: feedGroups[k], color: methodColors[k] });
        }
      }
    }
    if (wetPoints.length) series.push({ name: (this.config && (this.config.wet_label || this.config.label_wet)) || 'Wet', type: 'scatter', data: wetPoints, color: (this.config && (this.config.color_wet || this.config.wet_color)) });
    if (solidPoints.length) series.push({ name: (this.config && (this.config.solid_label || this.config.label_solid)) || 'Solid', type: 'scatter', data: solidPoints, color: (this.config && (this.config.color_solid || this.config.solid_color)) });

    const zoomOpts = {
      enabled: true,
      type: 'x',
      allowMouseWheelZoom: !(this.config && this.config.disable_scroll_zoom),
      autoScaleYaxis: false
    };

    const options = {
      chart: { height: this.config.height || 320, type: 'scatter', zoom: zoomOpts },
      series: series,
      xaxis: { type: 'datetime' },
      yaxis: { labels: { show: false } },
      markers: { size: 6 },
      tooltip: { x: { format: 'dd MMM yyyy HH:mm' } },
      grid: { xaxis: { lines: { show: true } }, yaxis: { lines: { show: true } } }
    };

    // apply compare-as-rows x-axis bounds if set earlier
    // If forceMidnight is set, ensure we show today's midnight->midnight window
    if (forceMidnight && compareXMin === null) {
      const todayStart = new Date(); todayStart.setHours(0,0,0,0);
      compareXMin = todayStart.getTime();
      compareXMax = todayStart.getTime() + DAY_MS;
    }
    if (compareXMin !== null) {
      options.xaxis.min = compareXMin;
      options.xaxis.max = compareXMax;
      options.xaxis.tickAmount = 24;
      options.xaxis.tickPlacement = 'on';
      options.xaxis.labels = Object.assign({}, options.xaxis.labels, { datetimeUTC: false });
    }
    if (compareYMin !== null) {
      options.yaxis.min = compareYMin;
      options.yaxis.max = compareYMax;
      // reduce visible labels and ticks for clarity
      options.yaxis.labels = { show: false };
      options.yaxis.tickAmount = offsets ? offsets.length : undefined;
    } else {
      options.yaxis.min = 0;
      options.yaxis.max = 4;
    }

    // optional timespan (hours) -- set xaxis range to [max - timespan, max]
    try {
      const tsHours = this.config && (this.config.timespan_hours || Number(this.config.timespan_hours));
      if (tsHours && !isNaN(tsHours) && tsHours > 0 && compareXMin === null) {
        const allX = series.flatMap(s => (s.data||[]).map(d => d[0]));
        const maxX = allX.length ? Math.max(...allX) : Date.now();
        const minX = maxX - (tsHours * 3600 * 1000);
        options.xaxis.min = minX;
        options.xaxis.max = maxX;
      }
    } catch(e) { console.warn(e); }

    // disable scroll-to-zoom: if configured, install capture-phase wheel blocker
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

    try {
      const cfgOffsets = this.config && this.config.offsets;
      const parsedOffsetsStr = offsets ? JSON.stringify(offsets.map(o=>({days:o.days, label:o.label}))) : 'null';
      const seriesSummary = series.map(s => `${s.name} (${(s.data||[]).length})`).join('\n');
      const extra = `config.offsets: ${cfgOffsets}\nparsed offsets: ${parsedOffsetsStr}\ncompare_as_rows: ${!!compareAsRows}\nSeries:\n${seriesSummary}`;
      if (this.config && this.config.debug === false) {
        this._debugEl.style.display = 'none';
      } else {
        this._debugEl.style.display = 'block';
        this._debugEl.textContent = extra + '\n' + info.map(i => `${i.key}: ${i.len}`).join('\n');
      }
    } catch (e) { console.warn(e); }

    // no extra controls: rely on ApexCharts legend for show/hide

    if (!this._chart) {
      this._chart = new ApexCharts(this._chartEl, options);
      await this._chart.render();
      console.debug('timeline-card chart rendered, series lengths:', series.map(s=>({name:s.name, len:(s.data||[]).length}))); 
    } else {
      await this._chart.updateOptions(options, false, false);
      await this._chart.updateSeries(series, true);
      console.debug('timeline-card chart updated, series lengths:', series.map(s=>({name:s.name, len:(s.data||[]).length}))); 
    }
  }

  set hass(hass) {
    this._hass = hass;
    this.updateChart(hass).catch(err => console.error(err));
  }

  getCardSize() { return 4; }
}

customElements.define('babybuddy-timeline-card', BabyBuddyTimelineCard);

/* Lovelace UI editor support removed; use built-in form editor */
BabyBuddyTimelineCard.getStubConfig = function() { return { feedings_entity: '', diaper_entity: '', debug: true }; };

BabyBuddyTimelineCard.getConfigForm = function() {
    return {
      schema: [
        { name: 'feedings_entity', required: true, selector: { entity: {} } },
        { name: 'diaper_entity', selector: { entity: {} } },
        { name: 'height', selector: { number: {} } },
        { name: 'disable_scroll_zoom', selector: { boolean: {} } },
        { name: 'label_left', selector: { text: {} } },
        { name: 'label_right', selector: { text: {} } },
        { name: 'label_bottle', selector: { text: {} } },
        { name: 'label_other', selector: { text: {} } },
        { name: 'color_left', selector: { color: {} } },
        { name: 'color_right', selector: { color: {} } },
        { name: 'color_bottle', selector: { color: {} } },
        { name: 'color_other', selector: { color: {} } },
        { name: 'wet_label', selector: { text: {} } },
        { name: 'solid_label', selector: { text: {} } },
        { name: 'color_wet', selector: { color: {} } },
        { name: 'color_solid', selector: { color: {} } },
        { name: 'timespan_hours', selector: { number: {} } },
        { name: 'offsets', selector: { text: {} } },
        { name: 'offset_labels', selector: { text: {} } },
        { name: 'compare_as_rows', selector: { boolean: {} } },
        { name: 'force_midnight', selector: { boolean: {} } },
        { name: 'debug', selector: { boolean: {} } }
      ],
      computeLabel: (schema) => {
        const m = { feedings_entity: 'Feedings entity', diaper_entity: 'Diaper entity', height: 'Chart height', debug: 'Show debug panel', label_left: 'Left label', label_right: 'Right label', label_bottle: 'Bottle label', label_other: 'Other label', color_left: 'Left color', color_right: 'Right color', color_bottle: 'Bottle color', color_other: 'Other color', wet_label: 'Wet label', solid_label: 'Solid label', color_wet: 'Wet color', color_solid: 'Solid color', timespan_hours: 'Timespan (hours)', disable_scroll_zoom: 'Disable scroll zoom', force_midnight: 'Force midnight->midnight range', offsets: 'Offsets (CSV or JSON array)', compare_as_rows: 'Show each offset as separate rows', offset_labels: 'Offset labels (CSV)'};
        return m[schema.name];
      }
    };
  };
