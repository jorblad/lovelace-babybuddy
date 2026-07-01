class BabyBuddySleepTimelineCard extends HTMLElement {
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

    this.config = {
      sleep_entity: String(config.sleep_entity || ''),
      offsets: config.offsets ?? '0,-1,-2',
      offset_labels: parseOffsetLabels(config.offset_labels),
      label_time: String(config.label_time || 'Tid'),
      label_duration: String(config.label_duration || 'Längd'),
      tooltip_update_debounce_ms: Number(config.tooltip_update_debounce_ms ?? 500),
      height: config.height || 320,
      sleep_color: typeof config.sleep_color === 'string' && config.sleep_color.trim() ? config.sleep_color : '#6a5acd',
      debug: !!config.debug,
      // New configuration options
      disable_scroll_zoom: !!config.disable_scroll_zoom,
      enable_selection: !!config.enable_selection
    };
  }

  connectedCallback() {
    if (this._initialized) return;
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <style>
        :host { display:block; }
        #chart { width: 100%; height: 320px; }
        #debug { font-size: 12px; color: var(--secondary-text-color); margin-top: 8px; white-space: pre-wrap; display:none; }
        .apexcharts-xaxis text, .apexcharts-yaxis text, .apexcharts-legend-text { fill: var(--primary-text-color) !important; color: var(--primary-text-color) !important; }
        .apexcharts-gridline { stroke: rgba(255,255,255,0.15) !important; }
        .apexcharts-tooltip { color: var(--primary-text-color) !important; background: rgba(0,0,0,0.6) !important; border: 1px solid rgba(255,255,255,0.15) !important; }
        .apexcharts-tooltip-title { background: transparent !important; }
      </style>
      <div id="chart"></div>
      <div id="debug"></div>
    `;
    this._chartEl = this.shadowRoot.getElementById('chart');
    this._debugEl = this.shadowRoot.getElementById('debug');

    // --- ADD THIS BLOCK ---
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
    // -----------------------

    this._initialized = true;
  }

  async _loadApex() {
    if (window.ApexCharts) return;
    if (this._loadingApex) return this._loadingApex;
    this._loadingApex = new Promise((resolve) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/apexcharts';
      s.onload = () => resolve();
      s.onerror = () => resolve();
      document.head.appendChild(s);
    });
    return this._loadingApex;
  }

  // Build one series per offset day. Each datum:
  // { x: "<day label>", y: [mappedStart, mappedEnd] }
  // mappedStart/mappedEnd are today’s midnight + time-of-day delta from the offset day.
  _buildSleepSeriesCategorical(ranges, offsets, color) {
    const DAY_MS = 24 * 3600 * 1000;
    const todayStart = new Date(); todayStart.setHours(0,0,0,0);
    const base = todayStart.getTime();

    const series = [];

    // Render last day (e.g. Idag if offsets[0]=0) on top
    for (let oi = 0; oi < offsets.length; oi++) {
      const off = offsets[oi];
      const label = off.label || String(off.days);

      const dayStart = base + off.days * DAY_MS;
      const dayEnd   = dayStart + DAY_MS;

      const data = ranges
        .filter(r => r.start < dayEnd && r.end > dayStart)
        .map(r => {
          const s = Math.max(r.start, dayStart);
          const e = Math.min(r.end,   dayEnd);
          const startDelta = s - dayStart;
          const endDelta   = e - dayStart;
          return {
            x: label,                               // category row
            y: [base + startDelta, base + endDelta] // mapped into today's time-of-day window
          };
        });

      if (data.length) {
        series.push({
          name: `${label} — Sleep`,
          type: 'rangeBar',
          data,
          color
        });
      }
    }

    return series;
  }

  // Programmatically triggers the tooltip at the last known position
  _restoreTooltip() {
    try {
      if (!this._chart || !this._lastActive) return;
      const w = this._chart.w;
      const s = this._lastActive.seriesIndex;
      const i = this._lastActive.dataPointIndex;
      const sx = w?.globals?.seriesX?.[s]?.[i];
      const sy = w?.globals?.seriesY?.[s]?.[i];
      if (sx != null && sy != null) {
        const rect = this._chartEl.getBoundingClientRect();
        const evt = new MouseEvent('mousemove', { bubbles: true, clientX: rect.left + sx, clientY: rect.top + sy });
        this._chartEl.dispatchEvent(evt);
      }
    } catch (e) {}
  }

  // Prevents the chart from flickering/updating while you are looking at it
  async _applyChartUpdate(series, options) {
    const runUpdate = async () => {
      if (!this._chart) {
        this._chart = new ApexCharts(this._chartEl, options);
        await this._chart.render();
      } else {
        await this._chart.updateOptions(options, false, false);
        await this._chart.updateSeries(series, true);
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

    // Parse offsets -> [{days,label}]
    let offsets = [];
    if (typeof this.config.offsets === 'string') {
      offsets = this.config.offsets.split(',')
        .map(v => v.trim())
        .filter(Boolean)
        .map(v => Number(v))
        .filter(v => !isNaN(v))
        .map(v => ({ days: v, label: String(v) }));
    } else if (Array.isArray(this.config.offsets)) {
      offsets = this.config.offsets
        .map(v => typeof v === 'number' ? v : Number(String(v).trim()))
        .filter(v => !isNaN(v))
        .map(v => ({ days: v, label: String(v) }));
    } else {
      offsets = [{ days: 0, label: '0' }];
    }

    // Apply custom labels if present
    if (this.config.offset_labels && Array.isArray(this.config.offset_labels) && this.config.offset_labels.length) {
      for (let i = 0; i < offsets.length; i++) {
        const lbl = this.config.offset_labels[i];
        if (typeof lbl === 'string' && lbl.trim()) offsets[i].label = lbl.trim();
      }
    }

    const sleepEnt = this.config.sleep_entity;
    const sleepState = sleepEnt ? hass.states[sleepEnt] : null;
    let sleepRanges = [];
    if (sleepState?.attributes?.results) {
      let arr = sleepState.attributes.results;
      if (typeof arr === 'string') {
        try { arr = JSON.parse(arr); } catch { arr = []; }
      }
      if (Array.isArray(arr)) {
        sleepRanges = arr.map(item => ({
          start: Date.parse(item.start),
          end: Date.parse(item.end)
        })).filter(r => r.start && r.end && r.end > r.start);
      }
    }

    if (this.config.debug) {
      this._debugEl.style.display = 'block';
      this._debugEl.textContent = `Offsets: ${JSON.stringify(offsets)}\nSleep ranges:\n${JSON.stringify(sleepRanges,null,2)}`;
    } else {
      this._debugEl.style.display = 'none';
    }

    // Build series
    const series = this._buildSleepSeriesCategorical(sleepRanges, offsets, this.config.sleep_color);

    // X-axis: still clamp to today’s midnight..midnight+24h for the mapped times
    const todayStart = new Date(); todayStart.setHours(0,0,0,0);
    const xMin = todayStart.getTime();
    const xMax = xMin + DAY_MS;

    const options = {
      chart: {
        type: 'rangeBar',
        height: this.config.height,
        events: {
          dataPointMouseEnter: (event, chartContext, config) => {
            this._tooltipActive = true;
            this._lastActive = { seriesIndex: config.seriesIndex, dataPointIndex: config.dataPointIndex };
          },
          dataPointMouseLeave: () => {
            clearTimeout(this._leaveTimer);
            this._leaveTimer = setTimeout(() => { 
              this._tooltipActive = false; 
            }, this.config.tooltip_update_debounce_ms);
          }
        },
        toolbar: { show: false },
        animations: { enabled: false },
        zoom: { 
            enabled: !this.config.disable_scroll_zoom,
            type: 'x',
            allowMouseWheelZoom: !this.config.disable_scroll_zoom,
            autoScaleYaxis: false 
        },
        selection: { 
            enabled: this.config.enable_selection 
        }
      },
      series,
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '45%',
          rangeBarGroupRows: true
        }
      },
      // X-axis: This is where the TIME (00:00 to 23:59) should go
        xaxis: {
            type: 'datetime',
            min: xMin,
            max: xMax,
            labels: { 
            datetimeUTC: false, // Ensure it uses your local timezone
            format: 'HH:mm',
            style: { colors: 'var(--primary-text-color)' }
            }
        },
        // Y-axis: This is where the LABELS (Idag, Igår) go
        yaxis: {
            type: 'category',
            reversed: true,
            labels: {
            style: { colors: 'var(--primary-text-color)' }
            }
        },
      legend: { show: true, position: 'bottom' },
      tooltip: {
        custom: ({ series, seriesIndex, dataPointIndex, w }) => { // Changed to arrow function to keep 'this'
            try {
            const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
            if (!data || !data.y) return '';

            const start = data.y[0];
            const end = data.y[1];
            const label = data.x;

            const sStr = new Date(start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const eStr = new Date(end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            const diffMs = end - start;
            const diffHrs = Math.floor(diffMs / 3600000);
            const diffMins = Math.round((diffMs % 3600000) / 60000);
            const duration = diffHrs > 0 ? `${diffHrs}h ${diffMins}m` : `${diffMins}m`;

            return `
                <div style="padding: 8px; font-size: 12px; line-height: 1.4;">
                <div style="font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.2); margin-bottom: 4px; padding-bottom: 2px;">
                    ${label}
                </div>
                <div><b>${this.config.label_time}:</b> ${sStr} – ${eStr}</div>
                <div><b>${this.config.label_duration}:</b> ${duration}</div>
                </div>
            `;
            } catch (e) {
              return '';
            }
        }
      },
      grid: {
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } }
      },
      dataLabels: { enabled: false }
    };

    await this._applyChartUpdate(series, options);
  }

  set hass(hass) {
    this._hass = hass;
    if (!hass) return;
    this.updateChart(hass).catch(console.error);
  }

  getCardSize() { return 3; }

  static getConfigForm() {
    return {
      schema: [
        { name: 'sleep_entity', required: true, selector: { entity: { domain: 'sensor' } } },
        { name: 'offsets', selector: { text: {} }, default: '0,-1,-2' },
        { name: 'offset_labels', selector: { text: {} }, default: 'Idag,Igår,Förrgår' },
        { name: 'label_time', selector: { text: {} }, default: 'Tid' },
        { name: 'label_duration', selector: { text: {} }, default: 'Längd' },
        { name: 'tooltip_update_debounce_ms', selector: { number: { min: 0, max: 5000, step: 100 } }, default: 500 },
        { name: 'height', selector: { number: { min: 200, max: 800, step: 10 } }, default: 320 },
        { name: 'sleep_color', selector: { text: {} }, default: '#6a5acd' },
        { name: 'disable_scroll_zoom', selector: { boolean: {} }, default: false },
        { name: 'enable_selection', selector: { boolean: {} }, default: false },
        { name: 'debug', selector: { boolean: {} }, default: false }
      ],
      computeLabel: (schema) => {
        const labels = {
            label_time: 'Time Label',
            label_duration: 'Duration Label',
            disable_scroll_zoom: 'Disable scroll-to-zoom',
            enable_selection: 'Enable data selection',
            debug: 'Debug Mode'
        };
        return labels[schema.name] || schema.label || schema.name;
        }
    };
  }

  static getStubConfig() {
    return {
      sleep_entity: '',
      offsets: '0,-1,-2',
      offset_labels: 'Idag,Igår,Förrgår',
      height: 320,
      sleep_color: '#6a5acd',
      debug: true
    };
  }
}

customElements.define('babybuddy-sleep-timeline-card', BabyBuddySleepTimelineCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "babybuddy-sleep-timeline-card",
  name: "BabyBuddy Sleep Timeline Card",
  description: "Displays sleep ranges with one row per offset day (category rows, time-of-day in range)",
  preview: true,
  getEntitySuggestion: (_hass, entityId) => {
    if (!entityId || !entityId.startsWith('sensor.babybuddy_')) return null;
    if (!entityId.toLowerCase().includes('sleep')) return null;
    return { config: { type: 'custom:babybuddy-sleep-timeline-card', sleep_entity: entityId } };
  }
});