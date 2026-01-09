class BabyBuddyTimelineCard extends HTMLElement {
  setConfig(config) {
    config = config || {};

    // Parse offset_labels into an array of strings
    const parseOffsetLabels = (v) => {
      if (v == null) return [];
      if (Array.isArray(v)) return v.map((x) => String(x));
      const s = String(v).trim();
      if (!s) return [];
      // Try JSON first
      try {
        const arr = JSON.parse(s);
        if (Array.isArray(arr)) return arr.map((x) => String(x));
      } catch (e) {
        // Not JSON, fall back to comma-separated
      }
      return s
        .replace(/^[\[\(]\s*|\s*[\]\)]$/g, '') // trim [] or ()
        .split(',')
        .map((p) => p.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean)
        .map((x) => String(x));
    };

    this.config = {
      feedings_entity: String(config.feedings_entity || ''),
      diaper_entity: String(config.diaper_entity || ''),
      offsets: config.offsets ?? '',
      offset_labels: parseOffsetLabels(config.offset_labels),

      // Feeding labels
      label_left: String(config.label_left || 'Left'),
      label_right: String(config.label_right || 'Right'),
      label_bottle: String(config.label_bottle || 'Bottle'),
      label_other: String(config.label_other || 'Other'),

      // Diaper labels
      label_wet: String(config.label_wet || 'Wet'),
      label_solid: String(config.label_solid || 'Solid'),

      // Colors
      color_left: config.color_left || '#1f77b4',
      color_right: config.color_right || '#ff7f0e',
      color_bottle: config.color_bottle || '#2ca02c',
      color_other: config.color_other || '#7f7f7f',
      color_wet: config.color_wet || '#00bfff',
      color_solid: config.color_solid || '#ff8c00',

      debug: !!config.debug,
      compare_as_rows: !!config.compare_as_rows,
      force_midnight: !!config.force_midnight,
      disable_scroll_zoom: !!config.disable_scroll_zoom,
      height: config.height || 320
    };
  }

  connectedCallback() {
    if (this._initialized) return;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host { display:block; }
        /* Card text follows theme colors */
        ha-card, .card, #chart, #debug {
          color: var(--primary-text-color);
        }

        /* Debug text and secondary labels */
        #debug {
          font-size: 12px;
          color: var(--secondary-text-color);
          margin-top: 8px;
          white-space: pre-wrap;
        }

        #chart {
          width: 100%; 
          height: 320px;
        }

        /* ApexCharts readability and contrast */
        /* Axis labels and legend text use theme color */
        .apexcharts-xaxis text,
        .apexcharts-yaxis text,
        .apexcharts-legend-text {
          fill: var(--primary-text-color) !important;
          color: var(--primary-text-color) !important;
        }

        /* Grid lines softened (optional) */
        .apexcharts-gridline {
          stroke: rgba(255,255,255,0.15) !important;
        }

        /* Tooltip contrast and theme integration */
        .apexcharts-tooltip {
          color: var(--primary-text-color) !important;
          background: rgba(0,0,0,0.6) !important; /* good contrast on light/dark themes */
          border: 1px solid rgba(255,255,255,0.15) !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.35) !important;
        }

        /* Tooltip title/date line */
        .apexcharts-tooltip-title {
          background: transparent !important;
          color: var(--primary-text-color) !important;
          border-bottom: 1px solid rgba(255,255,255,0.15) !important;
        }

        /* Optional subtle text-shadow to aid contrast on dark backgrounds */
        .apexcharts-xaxis text,
        .apexcharts-yaxis text,
        .apexcharts-legend-text,
        .apexcharts-tooltip {
          text-shadow: 0 1px 2px rgba(0,0,0,0.35);
        }
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
        console.warn('ApexCharts CDN failed, using local fallback');
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

  /* ----------------- SHARED OFFSET MAPPER ----------------- */
  _mapSeriesWithOffsets(rawPoints, offsets, seriesLabel, compareAsRows, baseY, color) {
    const DAY_MS = 24 * 3600 * 1000;
    const band = 10;
    const methodJitter = baseY || 0;
    const todayStart = new Date(); todayStart.setHours(0,0,0,0);

    const mappedSeries = [];

    if (!offsets || !offsets.length) {
      if (rawPoints && rawPoints.length)
        mappedSeries.push({ name: seriesLabel, type: 'scatter', data: rawPoints, color });
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

  async updateChart(hass) {
    if (!this._initialized) this.connectedCallback();
    if (!this.isConnected) return;
    await this._loadApex();

    // Define DAY_MS before any function that uses it
    const DAY_MS = 24 * 3600 * 1000;

    const feedEnt = this.config.feedings_entity;
    const diaperEnt = this.config.diaper_entity;
    const feedState = feedEnt ? hass.states[feedEnt] : null;
    const diaperState = diaperEnt ? hass.states[diaperEnt] : null;

    /* ----------------- CONFIGURATION ----------------- */
    const methodLabels = Object.assign(
      { left: 'Left', right: 'Right', bottle: 'Bottle', other: 'Other' },
      this.config.feed_labels || {}
    );
    const methodColors = Object.assign(
      { left: '#1f77b4', right: '#ff7f0e', bottle: '#2ca02c', other: '#7f7f7f' },
      this.config.feed_colors || {}
    );
    ['left','right','bottle','other'].forEach(k => {
      const labKey = 'label_' + k; const colKey = 'color_' + k;
      if (this.config[labKey]) methodLabels[k] = this.config[labKey];
      if (this.config[colKey]) methodColors[k] = this.config[colKey];
    });

    // Diaper labels
    const diaperLabels = {
      wet: this.config.label_wet || 'Wet',
      solid: this.config.label_solid || 'Solid'
    };

    const wetColor = this.config.color_wet || '#00bfff';
    const solidColor = this.config.color_solid || '#ff8c00';
    const compareAsRows = !!this.config.compare_as_rows;
    const forceMidnight = !!this.config.force_midnight;

    /* ----------------- PARSE OFFSETS ----------------- */
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

    // Apply custom offset labels by index
    const customOffsetLabels = Array.isArray(this.config.offset_labels) ? this.config.offset_labels : [];
    if (offsets && offsets.length && customOffsetLabels.length) {
      for (let i = 0; i < offsets.length; i++) {
        const lbl = customOffsetLabels[i];
        if (typeof lbl === 'string' && lbl.trim()) {
          offsets[i].label = lbl.trim();
        }
      }
    }

    /* ----------------- FEEDINGS ----------------- */
    const feedGroups = { left: [], right: [], bottle: [], other: [] };
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
          const methodRaw = (item.method||item.type||'').toString().toLowerCase();
          let key='other';
          if (methodRaw.includes('left')) key='left';
          else if (methodRaw.includes('right')) key='right';
          else if (methodRaw.includes('bottle')||methodRaw.includes('formula')||methodRaw.includes('pump')) key='bottle';
          feedGroups[key].push([x,1]);
        }
      }
    }

    /* ----------------- DIAPERS ----------------- */
    let wetPoints=[], solidPoints=[];
    if (diaperState && diaperState.attributes) {
      if (diaperState.attributes.series_wet) wetPoints = this._parseAttr(diaperState.attributes.series_wet).map(p => [p.x,2]);
      if (diaperState.attributes.series_solid) solidPoints = this._parseAttr(diaperState.attributes.series_solid).map(p => [p.x,3]);
      if (diaperState.attributes.results && (!wetPoints.length || !solidPoints.length)) {
        let res = diaperState.attributes.results;
        if (typeof res === 'string') try { res=JSON.parse(res); } catch(e){ res=[]; }
        if (Array.isArray(res)) {
          for (const item of res) {
            const ts = item.time||item.start||item.date; const x = ts ? Date.parse(ts):null;
            if (!x) continue;
            if (item.wet) wetPoints.push([x,2]);
            if (item.solid) solidPoints.push([x,3]);
          }
        }
      }
    }

    /* ----------------- BUILD SERIES USING SHARED MAPPER ----------------- */
    let series=[];
    for (const k of ['left','right','bottle','other']) {
      series.push(...this._mapSeriesWithOffsets(feedGroups[k], offsets, methodLabels[k], compareAsRows, 0, methodColors[k]));
    }
    // Diaper labels configurable
    series.push(...this._mapSeriesWithOffsets(wetPoints, offsets, diaperLabels.wet, compareAsRows, 2, wetColor));
    series.push(...this._mapSeriesWithOffsets(solidPoints, offsets, diaperLabels.solid, compareAsRows, 3, solidColor));

    /* ----------------- X/Y AXIS ----------------- */
    let compareXMin=null, compareXMax=null, compareYMin=null, compareYMax=null;
    if (compareAsRows && offsets && offsets.length) {
      const band = 10;
      const todayStart = new Date(); todayStart.setHours(0,0,0,0);
      compareXMin=todayStart.getTime(); compareXMax=todayStart.getTime()+DAY_MS;
      compareYMin=-1; compareYMax=band*offsets.length+1;
    }

    const zoomOpts = { enabled:true, type:'x', allowMouseWheelZoom:!(this.config.disable_scroll_zoom), autoScaleYaxis:false };

    const options = {
      chart: {
        height: this.config.height || 320,
        type: 'scatter',
        zoom: zoomOpts,
        animations: { enabled: true },
        toolbar: { 
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          },
          autoSelected: 'pan'
        },
      },
      series,
      xaxis: { type: 'datetime' },
      yaxis: { labels: { show: false } },

      // Improve hit area and visibility on mobile
      markers: {
        size: 6,           // base marker size
        hover: { size: 10, sizeOffset: 3 }, // larger on hover/touch
        strokeWidth: 0
      },

      // Make tooltips easier to trigger: no need to intersect exactly
      tooltip: {
        shared: false,        // scatter works best per-point
        intersect: false,     // allow hovering near the point to trigger
        x: {
          formatter: function(val, opts) {
            const meta = opts?.seriesIndex != null && opts?.w?.config?.series[opts.seriesIndex]?.data?.[opts.dataPointIndex]?.meta;
            if (meta && meta.originalX) return new Date(meta.originalX).toLocaleString();
            return new Date(val).toLocaleString();
          }
        },
        y: {
          formatter: function(val, opts) {
            // you can customize per-series text here if desired
            return '';
          }
        },
        onDatasetHover: { highlightDataSeries: true }
      },

      // Make the hover target a bit more forgiving
      states: {
        hover: { filter: { type: 'none' } }, // don't dim others, keeps visibility
        active: { filter: { type: 'none' } }
      },

      // Slightly bigger selection area around markers
      stroke: {
        width: 0
      },

      grid: { xaxis: { lines: { show: true } }, yaxis: { lines: { show: true } } },

      // Optional: show small labels when a point is tapped/hovered (mobile feedback)
      dataLabels: {
        enabled: false
      }
    };

    if (forceMidnight && compareXMin===null) { const d=new Date(); d.setHours(0,0,0,0); compareXMin=d.getTime(); compareXMax=d.getTime()+DAY_MS; }
    if (compareXMin!==null) { options.xaxis.min=compareXMin; options.xaxis.max=compareXMax; options.xaxis.tickAmount=24; options.xaxis.tickPlacement='on'; options.xaxis.labels={datetimeUTC:false}; }
    if (compareYMin!==null) { options.yaxis.min=compareYMin; options.yaxis.max=compareYMax; options.yaxis.labels={show:false}; options.yaxis.tickAmount=offsets.length; } else { options.yaxis.min=0; options.yaxis.max=4; }

    /* ----------------- RENDER CHART ----------------- */
    if (!this._chart) {
      this._chart = new ApexCharts(this._chartEl, options);
      await this._chart.render();
    } else {
      await this._chart.updateOptions(options,false,false);
      await this._chart.updateSeries(series,true);
    }

    /* ----------------- DEBUG ----------------- */
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

  static getConfigForm() {
    return {
      schema: [
        { name: 'feedings_entity', required: false, selector: { entity: { domain: 'sensor' } } },
        { name: 'diaper_entity', required: false, selector: { entity: { domain: 'sensor' } } },

        { type: 'section', label: 'Feed Labels' },
        { name: 'label_left', selector: { text: { multiline: false } }, default: 'Left' },
        { name: 'label_right', selector: { text: { multiline: false } }, default: 'Right' },
        { name: 'label_bottle', selector: { text: { multiline: false } }, default: 'Bottle' },
        { name: 'label_other', selector: { text: { multiline: false } }, default: 'Other' },

        { type: 'section', label: 'Feed Colors' },
        { name: 'color_left', selector: { color: { mode: 'hex' } }, default: '#1f77b4' },
        { name: 'color_right', selector: { color: { mode: 'hex' } }, default: '#ff7f0e' },
        { name: 'color_bottle', selector: { color: { mode: 'hex' } }, default: '#2ca02c' },
        { name: 'color_other', selector: { color: { mode: 'hex' } }, default: '#7f7f7f' },

        { type: 'section', label: 'Diaper Labels' },
        { name: 'label_wet', selector: { text: { multiline: false } }, default: 'Wet' },
        { name: 'label_solid', selector: { text: { multiline: false } }, default: 'Solid' },

        { type: 'section', label: 'Diaper Colors' },
        { name: 'color_wet', selector: { color: { mode: 'hex' } }, default: '#00bfff' },
        { name: 'color_solid', selector: { color: { mode: 'hex' } }, default: '#ff8c00' },

        { type: 'section', label: 'Offsets' },
        { name: 'offsets', selector: { text: { multiline: false } }, default: '' },
        { name: 'offset_labels', selector: { text: { multiline: false } }, default: '' },

        { type: 'section', label: 'Options' },
        { name: 'compare_as_rows', selector: { boolean: {} }, default: false },
        { name: 'force_midnight', selector: { boolean: {} }, default: false },
        { name: 'height', selector: { number: { min: 200, max: 800, step: 10 } }, default: 320 },
        { name: 'disable_scroll_zoom', selector: { boolean: {} }, default: false },
        { name: 'debug', selector: { boolean: {} }, default: false }
      ],
      computeLabel: (schema) => {
        const labels = {
          feedings_entity: 'Feedings Entity',
          diaper_entity: 'Diaper Entity',
          label_left: 'Left Label',
          label_right: 'Right Label',
          label_bottle: 'Bottle Label',
          label_other: 'Other Label',
          color_left: 'Left Color',
          color_right: 'Right Color',
          color_bottle: 'Bottle Color',
          color_other: 'Other Color',
          label_wet: 'Wet Label',
          label_solid: 'Solid Label',
          color_wet: 'Wet Color',
          color_solid: 'Solid Color',
          offsets: 'Offsets',
          offset_labels: 'Offset Labels',
          compare_as_rows: 'Compare as Rows',
          force_midnight: 'Force Midnight X-Axis',
          height: 'Chart height',
          disable_scroll_zoom: 'Disable scroll-to-zoom',
          debug: 'Show Debug Info'
        };
        return labels[schema.name] || schema.label || '';
      },
      computeHelper: (schema) => {
        if (schema.name === 'offsets') return 'Example: [0,1,2] or "0,1,2" or "24h,48h". Units: d (days) or h (hours).';
        if (schema.name === 'offset_labels') return 'Comma-separated or JSON array. Mapped by index to offsets: e.g. "Today,Yesterday,2d ago" or ["Today","Yesterday","2d ago"].';
        if (schema.name === 'disable_scroll_zoom') return 'Prevents mouse wheel zoom when inside the card.';
        return undefined;
      },
      assertConfig: (config) => {
        if (typeof config.offsets === 'string' && config.offsets.trim()) {
          const s = config.offsets.trim();
          try {
            const parsed = JSON.parse(s);
            if (!Array.isArray(parsed)) throw new Error('offsets JSON must be an array');
          } catch (e) {
            // not JSON: acceptable (comma-separated), do nothing
          }
        }
        if (typeof config.offset_labels === 'string' && config.offset_labels.trim()) {
          const s = config.offset_labels.trim();
          try {
            const parsed = JSON.parse(s);
            if (!Array.isArray(parsed)) throw new Error('offset_labels JSON must be an array of strings');
          } catch (e) {
            // not JSON: acceptable (comma-separated), do nothing
          }
        }
        return config;
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
  preview: true
});

BabyBuddyTimelineCard.getStubConfig = () => ({ feedings_entity:'', diaper_entity:'', debug:true });