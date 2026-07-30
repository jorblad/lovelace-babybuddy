class BabyBuddyTimelineCard extends HTMLElement {
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
    config = config || {};

    const parseOffsetLabels = (v) => {
      if (v == null) return [];
      if (Array.isArray(v)) return v.map((x) => String(x));
      const s = String(v).trim();
      if (!s) return [];
      try {
        const arr = JSON.parse(s);
        if (Array.isArray(arr)) return arr.map((x) => String(x));
      } catch (e) {}
      return s
        .replace(/^[\[\(]\s*|\s*[\]\)]$/g, '')
        .split(',')
        .map((p) => p.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean)
        .map((x) => String(x));
    };

    // Hex color defaults
    const defaultHex = {
      color_left:   '#1f77b4',
      color_right:  '#ff7f0e',
      color_both:   '#d62728',
      color_bottle: '#2ca02c',
      color_other:  '#7f7f7f',
      color_feed_solid: '#9467bd',
      color_wet:    '#00bfff',
      color_solid:  '#ff8c00',
      color_dry:    '#9e9e9e'
    };

    const isValidHex = (v) => {
      if (typeof v !== 'string') return false;
      return /^#[0-9a-fA-F]{6}$/.test(v);
    };

    // Build config object
    const cfg = {
      feedings_entity: String(config.feedings_entity || ''),
      diaper_entity: String(config.diaper_entity || ''),
      offsets: config.offsets ?? '',
      offset_labels: parseOffsetLabels(config.offset_labels),

      label_left: config.label_left != null ? String(config.label_left) : null,
      label_right: config.label_right != null ? String(config.label_right) : null,
      label_both: config.label_both != null ? String(config.label_both) : null,
      label_bottle: config.label_bottle != null ? String(config.label_bottle) : null,
      label_other: config.label_other != null ? String(config.label_other) : null,
      label_feed_solid: config.label_feed_solid != null ? String(config.label_feed_solid) : null,

      label_wet: config.label_wet != null ? String(config.label_wet) : null,
      label_solid: config.label_solid != null ? String(config.label_solid) : null,
      label_dry: config.label_dry != null ? String(config.label_dry) : null,

      // Hex colors - use defaults if not provided or invalid
      color_left:   isValidHex(config.color_left)   ? config.color_left   : defaultHex.color_left,
      color_right:  isValidHex(config.color_right)  ? config.color_right  : defaultHex.color_right,
      color_both:   isValidHex(config.color_both)   ? config.color_both   : defaultHex.color_both,
      color_bottle: isValidHex(config.color_bottle) ? config.color_bottle : defaultHex.color_bottle,
      color_other:  isValidHex(config.color_other)  ? config.color_other  : defaultHex.color_other,
      color_feed_solid: isValidHex(config.color_feed_solid) ? config.color_feed_solid : defaultHex.color_feed_solid,
      color_wet:    isValidHex(config.color_wet)    ? config.color_wet    : defaultHex.color_wet,
      color_solid:  isValidHex(config.color_solid)  ? config.color_solid  : defaultHex.color_solid,
      color_dry:    isValidHex(config.color_dry)    ? config.color_dry    : defaultHex.color_dry,

      debug: !!config.debug,
      compare_as_rows: !!config.compare_as_rows,
      force_midnight: !!config.force_midnight,
      disable_scroll_zoom: !!config.disable_scroll_zoom,
      height: config.height || 320,
      tooltip_update_debounce_ms: Number(config.tooltip_update_debounce_ms ?? 500),

      feed_colors: config.feed_colors || {},
      feed_labels: config.feed_labels || {}
    };

    this.config = cfg;
    this._defaultHex = defaultHex;
  }


  _rgbToHex(rgbOrHex) {
    if (!rgbOrHex) return '#000000';
    if (Array.isArray(rgbOrHex)) {
      return '#' + rgbOrHex
        .map(x => Math.max(0, Math.min(255, x)))
        .map(x => x.toString(16).padStart(2,'0'))
        .join('');
    }
    if (typeof rgbOrHex === 'string') return rgbOrHex.startsWith('#') ? rgbOrHex : '#000000';
    return '#000000';
  }

  _hexToRGB(hex) {
    if (!hex || typeof hex !== 'string') return [0,0,0];
    let h = hex.replace(/^#/, '');
    if (h.length === 3) h = h.split('').map(c => c+c).join('');
    if (h.length !== 6) return [0,0,0];
    const r = parseInt(h.slice(0,2),16);
    const g = parseInt(h.slice(2,4),16);
    const b = parseInt(h.slice(4,6),16);
    return [r,g,b];
  }

  connectedCallback() {
    if (this._initialized) return;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host { display:block; }
        ha-card, .card, #chart, #debug { color: var(--primary-text-color); }
        #debug { font-size: 12px; color: var(--secondary-text-color); margin-top: 8px; white-space: pre-wrap; }
        #chart { width: 100%; height: 320px; }
        .apexcharts-xaxis text, .apexcharts-yaxis text, .apexcharts-legend-text { fill: var(--primary-text-color) !important; color: var(--primary-text-color) !important; }
        .apexcharts-gridline { stroke: rgba(255,255,255,0.15) !important; }
        .apexcharts-tooltip { color: var(--primary-text-color) !important; background: rgba(0,0,0,0.6) !important; border: 1px solid rgba(255,255,255,0.15) !important; box-shadow: 0 4px 12px rgba(0,0,0,0.35) !important; }
        .apexcharts-tooltip-title { background: transparent !important; color: var(--primary-text-color) !important; border-bottom: 1px solid rgba(255,255,255,0.15) !important; }
        .apexcharts-xaxis text, .apexcharts-yaxis text, .apexcharts-legend-text, .apexcharts-tooltip { text-shadow: 0 1px 2px rgba(0,0,0,0.35); }
      </style>
      <div id="chart"></div>
      <div id="debug"></div>
    `;
    this._chartEl = this.shadowRoot.getElementById('chart');
    this._debugEl = this.shadowRoot.getElementById('debug');

    this._isTouching = false;
    this._tooltipActive = false;
    this._lastActive = null;
    this._pendingUpdate = null;
    this._debounceTimer = null;

    const onTouchStart = () => { this._isTouching = true; };
    const onTouchEnd = () => {
      this._isTouching = false;
      if (this._pendingUpdate) {
        const fn = this._pendingUpdate;
        this._pendingUpdate = null;
        fn();
      }
    };
    this._chartEl.addEventListener('touchstart', onTouchStart, { passive: true });
    this._chartEl.addEventListener('touchend', onTouchEnd, { passive: true });
    this._chartEl.addEventListener('touchcancel', onTouchEnd, { passive: true });

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
      s.onload = () => resolve();
      s.onerror = () => { tryLocal(); };
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

  _mapSeriesWithOffsets(rawPoints, offsets, seriesLabel, compareAsRows, baseY, color) {
    const DAY_MS = 24 * 3600 * 1000;
    const band = 10;
    const methodJitter = baseY || 0;
    const todayStart = new Date(); todayStart.setHours(0,0,0,0);
    const mappedSeries = [];

    if (!offsets || !offsets.length) {
      if (rawPoints && rawPoints.length) mappedSeries.push({ name: seriesLabel, type: 'scatter', data: rawPoints, color });
      return mappedSeries;
    }

    for (let oi = 0; oi < offsets.length; oi++) {
      const off = offsets[oi];
      const label = off.label || (off.days === 0 ? 'Today' : `${Math.abs(off.days)}d ago`);
      const targetStart = todayStart.getTime() + off.ms;
      const targetEnd = targetStart + DAY_MS;

      const data = rawPoints
        .filter(([x]) => x >= targetStart && x < targetEnd)
        .map(([x, y]) => {
          const tod = new Date(x);
          const timeOfDay = tod.getHours()*3600000 + tod.getMinutes()*60000 + tod.getSeconds()*1000 + tod.getMilliseconds();
          const baseX = todayStart.getTime() + timeOfDay;
          const newY = compareAsRows ? (band * (offsets.length - 1 - oi) + methodJitter) : y;
          return { x: baseX, y: newY, meta: { originalX: x } };
        });

      if (data.length) mappedSeries.push({ name: `${label} — ${seriesLabel}`, type: 'scatter', data, color });
    }

    return mappedSeries;
  }

  _bindChartEvents(options) {
    options.chart = options.chart || {};
    const existingEvents = options.chart.events || {};
    const self = this;

    options.chart.events = Object.assign({}, existingEvents, {
      dataPointMouseEnter: function(event, chartContext, config) {
        self._tooltipActive = true;
        self._lastActive = { seriesIndex: config.seriesIndex, dataPointIndex: config.dataPointIndex };
      },
      dataPointMouseLeave: function() {
        clearTimeout(self._leaveTimer);
        self._leaveTimer = setTimeout(() => { self._tooltipActive = false; }, self.config.tooltip_update_debounce_ms);
      },
      dataPointSelection: function(event, chartContext, config) {
        self._tooltipActive = true;
        self._lastActive = { seriesIndex: config.seriesIndex, dataPointIndex: config.dataPointIndex };
      }
    });

    return options;
  }

  _restoreTooltip() {
    try {
      if (!this._chart || !this._lastActive) return;
      const w = this._chart.w;
      const s = this._lastActive.seriesIndex;
      const i = this._lastActive.dataPointIndex;
      const p = w?.config?.series?.[s]?.data?.[i];
      if (!p) return;
      const sx = w?.globals?.seriesX?.[s]?.[i];
      const sy = w?.globals?.seriesY?.[s]?.[i];
      if (sx != null && sy != null) {
        const rect = this._chartEl.getBoundingClientRect();
        const evt = new MouseEvent('mousemove', { bubbles: true, clientX: rect.left + sx, clientY: rect.top + sy });
        this._chartEl.dispatchEvent(evt);
      }
    } catch (e) {}
  }

  async _applyChartUpdate(series, options) {
    const runUpdate = async () => {
      if (!this._chart) {
        this._chart = new ApexCharts(this._chartEl, options);
        await this._chart.render();
      } else {
        await this._chart.updateOptions(options,false,false);
        await this._chart.updateSeries(series,true);
      }
      if (this._tooltipActive && this._lastActive) {
        this._restoreTooltip();
      }
    };

    if (this._isTouching || this._tooltipActive) {
      clearTimeout(this._debounceTimer);
      this._pendingUpdate = async () => { await runUpdate(); };
      this._debounceTimer = setTimeout(async () => {
        if (this._isTouching) return;
        const fn = this._pendingUpdate;
        this._pendingUpdate = null;
        if (fn) await fn();
      }, this.config.tooltip_update_debounce_ms);
      return;
    }

    await runUpdate();
  }

  async updateChart(hass) {
    if (!this._initialized) this.connectedCallback();
    if (!this.isConnected) return;
    await this._loadApex();

    const DAY_MS = 24 * 3600 * 1000;

    const feedEnt = this.config.feedings_entity;
    const diaperEnt = this.config.diaper_entity;
    const feedState = feedEnt ? hass.states[feedEnt] : null;
    const diaperState = diaperEnt ? hass.states[diaperEnt] : null;

    const methodLabels = Object.assign(
      {
        left: this.config.label_left || this._t('timeline.labels.left', hass),
        right: this.config.label_right || this._t('timeline.labels.right', hass),
        both: this.config.label_both || this._t('timeline.labels.both', hass),
        bottle: this.config.label_bottle || this._t('timeline.labels.bottle', hass),
        other: this.config.label_other || this._t('timeline.labels.other', hass),
        solid_food: this.config.label_feed_solid || this._t('timeline.labels.solid_food', hass)
      },
      this.config.feed_labels || {}
    );

    const resolveHexFromConfigOrDefault = (fieldName, defHex) => {
      const v = this.config[fieldName];
      if (typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v)) return v;
      return defHex;
    };

    let methodColors = {
      left:   resolveHexFromConfigOrDefault('color_left',   this._defaultHex.left),
      right:  resolveHexFromConfigOrDefault('color_right',  this._defaultHex.right),
      both:   resolveHexFromConfigOrDefault('color_both',   this._defaultHex.both),
      bottle: resolveHexFromConfigOrDefault('color_bottle', this._defaultHex.bottle),
      other:  resolveHexFromConfigOrDefault('color_other',  this._defaultHex.other),
      solid_food: resolveHexFromConfigOrDefault('color_feed_solid', this._defaultHex.color_feed_solid)
    };

    const feedColorKeyMap = {
      left_breast: 'left',
      right_breast: 'right',
      both_breasts: 'both',
      left: 'left',
      right: 'right',
      both: 'both',
      bottle: 'bottle',
      other: 'other',
      solid: 'solid_food',
      solid_food: 'solid_food'
    };
    if (this.config.feed_colors && typeof this.config.feed_colors === 'object') {
      for (const [extKey, hex] of Object.entries(this.config.feed_colors)) {
        const k = feedColorKeyMap[extKey];
        if (k && typeof hex === 'string' && hex.trim()) {
          methodColors[k] = hex;
        }
      }
    }

    const diaperLabels = {
      wet: this.config.label_wet || this._t('timeline.labels.wet', hass),
      solid: this.config.label_solid || this._t('timeline.labels.solid', hass),
      dry: this.config.label_dry || this._t('timeline.labels.dry', hass)
    };

    const wetColor   = resolveHexFromConfigOrDefault('color_wet',   this._defaultHex.wet);
    const solidColor = resolveHexFromConfigOrDefault('color_solid', this._defaultHex.solid);
    const dryColor   = resolveHexFromConfigOrDefault('color_dry',   this._defaultHex.dry);

    const compareAsRows = !!this.config.compare_as_rows;
    const forceMidnight = !!this.config.force_midnight;

    const parseOffset = (v) => {
      if (v == null) return null;
      if (typeof v === 'number') return { days: v, ms: v * DAY_MS, label: `${v}d` };
      const s = String(v).trim();
      const m = s.match(/^(-?\d+(?:\.\d+)?)\s*(d|h)?$/i);
      if (m) {
        const num = Number(m[1]); const unit = (m[2] || 'd').toLowerCase();
        if (unit === 'h') return { days: num / 24, ms: num * 3600 * 1000, label: `${num}h` };
        return { days: num, ms: num * DAY_MS, label: `${num}d` };
      }
      try { const parsed = JSON.parse(s); return parseOffset(parsed); } catch(e) {}
      return null;
    };

    let offsets = null;
    if (Array.isArray(this.config.offsets)) {
      offsets = this.config.offsets.map(parseOffset).filter(Boolean);
    } else if (typeof this.config.offsets === 'string' && this.config.offsets.trim()) {
      let s = this.config.offsets.trim();
      const jsonTry = (() => { try { return JSON.parse(s); } catch(e) { return null; } })();
      if (Array.isArray(jsonTry)) offsets = jsonTry.map(parseOffset).filter(Boolean);
      else {
        offsets = s
          .replace(/^[\[\(]\s*|\s*[\]\)]$/g, '')
          .split(',')
          .map((p) => p.trim().replace(/^['"]|['"]$/g, ''))
          .map(parseOffset)
          .filter(Boolean);
      }
    }

    const customOffsetLabels = Array.isArray(this.config.offset_labels) ? this.config.offset_labels : [];
    if (offsets && offsets.length && customOffsetLabels.length) {
      for (let i = 0; i < offsets.length; i++) {
        const lbl = customOffsetLabels[i];
        if (typeof lbl === 'string' && lbl.trim()) {
          offsets[i].label = lbl.trim();
        }
      }
    }

    const feedGroups = { left: [], right: [], both: [], bottle: [], other: [], solid_food: [] };
    if (feedState && feedState.attributes) {
      let res = feedState.attributes.series || feedState.attributes.results;
      if (typeof res === 'string') {
        try { res = JSON.parse(res); } catch(e) { res = []; }
      }
      if (Array.isArray(res)) {
        for (const item of res) {
          const ts = item.start || item.time || item.date;
          const x = ts ? Date.parse(ts) : null;
          if (!x) continue;
          const methodRaw = (item.method || '').toString().toLowerCase();
          const typeRaw = (item.type || item.type_name || item.feeding_type || '').toString().toLowerCase();
          let key='other';
          if (typeRaw.includes('solid')) key='solid_food';
          else if (methodRaw.includes('both')) key='both';
          else if (methodRaw.includes('left')) key='left';
          else if (methodRaw.includes('right')) key='right';
          else if (methodRaw.includes('bottle')||methodRaw.includes('formula')||methodRaw.includes('pump')) key='bottle';
          feedGroups[key].push([x,1]);
        }
      }
    }

    let wetPoints = [];
    let solidPoints = [];
    let dryPoints = [];
    if (diaperState && diaperState.attributes) {
      if (diaperState.attributes.series_wet) wetPoints = this._parseAttr(diaperState.attributes.series_wet).map(p => [p.x,2]);
      if (diaperState.attributes.series_solid) solidPoints = this._parseAttr(diaperState.attributes.series_solid).map(p => [p.x,3]);
      if (diaperState.attributes.results && (!wetPoints.length || !solidPoints.length)) {
        let res = diaperState.attributes.results;
        if (typeof res === 'string') try { res=JSON.parse(res); } catch(e){ res=[]; }
        if (Array.isArray(res)) {
          for (const item of res) {
            const ts = item.time || item.start || item.date;
            const x = ts ? Date.parse(ts) : null;
            if (!x) continue;

            if (item.wet) {
              wetPoints.push([x, 2]);
            } 
            if (item.solid) {
              solidPoints.push([x, 3]);
            } 
            if (!item.wet && !item.solid) {
              dryPoints.push([x, 4]);
            }
          }
        }
      }
    }

    let series=[];
    for (const k of ['left','right','both','bottle','other','solid_food']) {
      series.push(...this._mapSeriesWithOffsets(feedGroups[k], offsets, methodLabels[k], compareAsRows, 0, methodColors[k]));
    }
    series.push(...this._mapSeriesWithOffsets(
      wetPoints,
      offsets,
      diaperLabels.wet,
      compareAsRows, 2,
      wetColor
    ));
    series.push(...this._mapSeriesWithOffsets(
      solidPoints,
      offsets,
      diaperLabels.solid,
      compareAsRows, 3,
      solidColor
    ));
    series.push(...this._mapSeriesWithOffsets(
      dryPoints,
      offsets,
      diaperLabels.dry,
      compareAsRows,
      4,
      dryColor
    ));

    let compareXMin=null, compareXMax=null, compareYMin=null, compareYMax=null;
    if (compareAsRows && offsets && offsets.length) {
      const band = 10;
      const todayStart = new Date(); todayStart.setHours(0,0,0,0);
      compareXMin=todayStart.getTime(); compareXMax=todayStart.getTime()+DAY_MS;
      compareYMin=-1; compareYMax=band*offsets.length+1;
    }

    const options = this._bindChartEvents({
      chart: {
        height: this.config.height || 320,
        type: 'scatter',
        zoom: { enabled: false, type: 'x', allowMouseWheelZoom: !(this.config.disable_scroll_zoom), autoScaleYaxis: false },
        selection: { enabled: false },
        toolbar: { show: false },
        animations: { enabled: true }
      },
      series,
      xaxis: { type: 'datetime' },
      yaxis: { labels: { show: false } },
      markers: {
        size: 7,
        hover: { size: 12, sizeOffset: 4 },
        strokeWidth: 2
      },
      tooltip: {
        shared: false,
        intersect: false,
        followCursor: true,
        fixed: { enabled: false },
        x: {
          formatter: function(val, opts) {
            const meta = opts?.seriesIndex != null && opts?.w?.config?.series[opts.seriesIndex]?.data?.[opts.dataPointIndex]?.meta;
            if (meta && meta.originalX) return new Date(meta.originalX).toLocaleString();
            return new Date(val).toLocaleString();
          }
        },
        y: { formatter: () => '' },
        onDatasetHover: { highlightDataSeries: true }
      },
      states: {
        hover: { filter: { type: 'none' } },
        active: { filter: { type: 'none' } }
      },
      stroke: { width: 0 },
      grid: { xaxis: { lines: { show: true } }, yaxis: { lines: { show: true } } },
      dataLabels: { enabled: false }
    });

    if (forceMidnight && compareXMin===null) { const d=new Date(); d.setHours(0,0,0,0); compareXMin=d.getTime(); compareXMax=d.getTime()+DAY_MS; }
    if (compareXMin!==null) { options.xaxis.min=compareXMin; options.xaxis.max=compareXMax; options.xaxis.tickAmount=24; options.xaxis.tickPlacement='on'; options.xaxis.labels={datetimeUTC:false}; }
    if (compareYMin!==null) { options.yaxis.min=compareYMin; options.yaxis.max=compareYMax; options.yaxis.labels={show:false}; options.yaxis.tickAmount=offsets.length; } else { options.yaxis.min=0; options.yaxis.max=5; }

    await this._applyChartUpdate(series, options);

    if (this.config.debug!==false) {
      this._debugEl.style.display='block';
      this._debugEl.textContent = `Series built:\n${series.map(s=>s.name+' ('+(s.data||[]).length+')').join('\n')}`;
    } else this._debugEl.style.display='none';
  }

  set hass(hass) {
    this._hass = hass;
    if (!hass) {
      const now = Date.now();
      const stub = [
        [now-3600*1000*2,1],
        [now-3600*1000,1],
        [now,1]
      ];
      this._chart && this._chart.destroy();
      this._chart = new ApexCharts(this._chartEl, {
        chart: { height:320, type:'scatter' },
        series: [{ name:'Preview', type:'scatter', data:stub }],
        dataLabels: { enabled:true, formatter:(val,opts)=>opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].meta?.emoji || '', style:{fontSize:'24px'} },
        xaxis:{ type:'datetime' },
        markers:{ size:1 },
        tooltip:{ enabled:false }
      });
      this._chart.render().catch(console.warn);
      return;
    }
    this.updateChart(hass).catch(console.error);
  }

  getCardSize() { return 4; }

  _getPreviewData() {
    // Generate realistic preview data
    const now = new Date();
    const createTime = (minutesAgo) => {
      const d = new Date(now.getTime() - minutesAgo * 60000);
      return d.toISOString();
    };

      return [
        {
          id: 1,
          child: 1,
          time: createTime(5),
          wet: true,
          solid: false,
          color: '',
          amount: null,
          notes: '',
          tags: ['Bomull', 'Formsydd']
        },
        {
          id: 2,
          child: 1,
          time: createTime(45),
          wet: true,
          solid: true,
          color: '',
          amount: null,
          notes: 'Test note',
          tags: ['Engångsblöja']
        },
        {
          id: 3,
          child: 1,
          time: createTime(150),
          wet: true,
          solid: false,
          color: '',
          amount: null,
          notes: '',
          tags: ['Automatisk registrering']
        }
      ];
  }

  static getConfigForm() {
    const hass = document.querySelector("home-assistant")?.hass;
    const t = (path) => BabyBuddyTimelineCard.prototype._t(path, hass);
    return {
      schema: [
        { name: 'feedings_entity', required: false, selector: { entity: { domain: 'sensor' } } },
        { name: 'diaper_entity', required: false, selector: { entity: { domain: 'sensor' } } },

        { type: 'section', label: t('timeline.config.feed_labels_section') || 'Feed Labels' },
        { name: 'label_left', selector: { text: { multiline: false } } },
        { name: 'label_right', selector: { text: { multiline: false } } },
        { name: 'label_both', selector: { text: { multiline: false } } },
        { name: 'label_bottle', selector: { text: { multiline: false } } },
        { name: 'label_other', selector: { text: { multiline: false } } },
        { name: 'label_feed_solid', selector: { text: { multiline: false } } },

        { type: 'section', label: t('timeline.config.feed_colors_section') || 'Feed Colors' },
        { name: 'color_left', selector: { text: { multiline: false } }, default: '#1f77b4' },
        { name: 'color_right', selector: { text: { multiline: false } }, default: '#ff7f0e' },
        { name: 'color_both', selector: { text: { multiline: false } }, default: '#d62728' },
        { name: 'color_bottle', selector: { text: { multiline: false } }, default: '#2ca02c' },
        { name: 'color_other', selector: { text: { multiline: false } }, default: '#7f7f7f' },
        { name: 'color_feed_solid', selector: { text: { multiline: false } }, default: '#9467bd' },

        { type: 'section', label: t('timeline.config.diaper_labels_section') || 'Diaper Labels' },
        { name: 'label_wet', selector: { text: { multiline: false } } },
        { name: 'label_solid', selector: { text: { multiline: false } } },
        { name: 'label_dry', selector: { text: {} } },

        { type: 'section', label: t('timeline.config.diaper_colors_section') || 'Diaper Colors' },
        { name: 'color_wet', selector: { text: { multiline: false } }, default: '#00bfff' },
        { name: 'color_solid', selector: { text: { multiline: false } }, default: '#ff8c00' },
        { name: 'color_dry', selector: { text: { multiline: false } }, default: '#9e9e9e' },

        { type: 'section', label: t('timeline.config.offsets_section') || 'Offsets' },
        { name: 'offsets', selector: { text: { multiline: false } }, default: '' },
        { name: 'offset_labels', selector: { text: { multiline: false } }, default: '' },

        { type: 'section', label: t('timeline.config.options_section') || 'Options' },
        { name: 'compare_as_rows', selector: { boolean: {} }, default: false },
        { name: 'force_midnight', selector: { boolean: {} }, default: false },
        { name: 'height', selector: { number: { min: 200, max: 800, step: 10 } }, default: 320 },
        { name: 'disable_scroll_zoom', selector: { boolean: {} }, default: false },
        { name: 'tooltip_update_debounce_ms', selector: { number: { min: 100, max: 5000, step: 50 } }, default: 1500 },
        { name: 'debug', selector: { boolean: {} }, default: false }
      ],
      computeLabel: (schema) => {
        if (schema.name) return t(`timeline.config.${schema.name}`);
        return schema.label || '';
      },
      computeHelper: (schema) => {
        if (schema && typeof schema.name === 'string') {
          return t(`timeline.config_helper.${schema.name}`);
        }
        return undefined;
      }
    };
  }
}

customElements.define('babybuddy-timeline-card', BabyBuddyTimelineCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "babybuddy-timeline-card",
  name: "BabyBuddy Timeline Card",
  description: "Displays timeline data using ApexCharts",
  preview: true,
  getEntitySuggestion: (_hass, entityId) => {
    if (!entityId || !entityId.startsWith('sensor.babybuddy_')) return null;
    const lowerId = entityId.toLowerCase();
    if (lowerId.includes('feeding')) {
      return { config: { type: 'custom:babybuddy-timeline-card', feedings_entity: entityId } };
    }
    if (lowerId.includes('diaper')) {
      return { config: { type: 'custom:babybuddy-timeline-card', diaper_entity: entityId } };
    }
    return null;
  }
});

BabyBuddyTimelineCard.getStubConfig = () => ({ feedings_entity:'', diaper_entity:'', debug:true });