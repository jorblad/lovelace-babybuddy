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
          return { x: baseX, y: newY, meta: { originalX: x } };  // store original timestamp
        });

      if (data.length) mappedSeries.push({ name: `${label} — ${seriesLabel}`, type: 'scatter', data, color });
    }

    return mappedSeries;
  }

  async updateChart(hass) {
    if (!this._initialized) this.connectedCallback();
    if (!this.isConnected) return;
    await this._loadApex();

    const feedEnt = this.config.feedings_entity;
    const diaperEnt = this.config.diaper_entity;
    const feedState = feedEnt ? hass.states[feedEnt] : null;
    const diaperState = diaperEnt ? hass.states[diaperEnt] : null;

    /* ----------------- CONFIGURATION ----------------- */
    const methodLabels = Object.assign({ left: 'Left', right: 'Right', bottle: 'Bottle', other: 'Other' }, this.config.feed_labels || {});
    const methodColors = Object.assign({ left: '#1f77b4', right: '#ff7f0e', bottle: '#2ca02c', other: '#7f7f7f' }, this.config.feed_colors || {});
    ['left','right','bottle','other'].forEach(k => {
      const labKey = 'label_' + k; const colKey = 'color_' + k;
      if (this.config[labKey]) methodLabels[k] = this.config[labKey];
      if (this.config[colKey]) methodColors[k] = this.config[colKey];
    });
    const wetColor = this.config.color_wet || '#00bfff';
    const solidColor = this.config.color_solid || '#ff8c00';
    const compareAsRows = !!this.config.compare_as_rows;
    const forceMidnight = !!this.config.force_midnight;
    const DAY_MS = 24*3600*1000;

    /* ----------------- PARSE OFFSETS ----------------- */
    const parseOffset = (v) => {
      if (v == null) return null;
      if (typeof v === 'number') return { days: v, ms: v*DAY_MS, label: `${v}d` };
      const s = String(v).trim();
      const m = s.match(/^(-?\d+(?:\.\d+)?)\s*(d|h)?$/i);
      if (m) {
        const num = Number(m[1]); const unit = (m[2] || 'd').toLowerCase();
        if (unit==='h') return { days: num/24, ms: num*3600*1000, label: `${num}h` };
        return { days: num, ms: num*DAY_MS, label: `${num}d` };
      }
      try { const parsed = JSON.parse(s); return parseOffset(parsed); } catch(e) {}
      return null;
    };
    let offsets = null;
    if (Array.isArray(this.config.offsets)) offsets = this.config.offsets.map(parseOffset).filter(Boolean);
    else if (typeof this.config.offsets === 'string' && this.config.offsets.trim()) {
      let s = this.config.offsets.trim();
      const jsonTry = (()=>{ try { return JSON.parse(s); } catch(e){ return null; } })();
      if (Array.isArray(jsonTry)) offsets = jsonTry.map(parseOffset).filter(Boolean);
      else offsets = s.replace(/^[\[\(]\s*|\s*[\]\)]$/g,'').split(',').map(p=>p.trim().replace(/^['"]|['"]$/g,'')).map(parseOffset).filter(Boolean);
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
    series.push(...this._mapSeriesWithOffsets(wetPoints, offsets, 'Wet', compareAsRows, 2, wetColor));
    series.push(...this._mapSeriesWithOffsets(solidPoints, offsets, 'Solid', compareAsRows, 3, solidColor));

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
      chart:{height:this.config.height||320,type:'scatter',zoom:zoomOpts},
      series,
      xaxis:{type:'datetime'},
      yaxis:{labels:{show:false}},
      markers:{size:6},
      tooltip: {
        x: {
          formatter: function(val, opts) {
            // opts.dataPointIndex gives the index in the series
            const meta = opts?.seriesIndex != null && opts?.w?.config?.series[opts.seriesIndex]?.data?.[opts.dataPointIndex]?.meta;
            if (meta && meta.originalX) return new Date(meta.originalX).toLocaleString();
            return new Date(val).toLocaleString();
          }
        }
      },
      grid:{xaxis:{lines:{show:true}},yaxis:{lines:{show:true}}}
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

  set hass(hass) { this._hass=hass; this.updateChart(hass).catch(console.error); }
  getCardSize() { return 4; }
}

customElements.define('babybuddy-timeline-card', BabyBuddyTimelineCard);
window.customCards = window.customCards||[];
window.customCards.push({
  type:"babybuddy-timeline-card",
  name:"BabyBuddy Timeline Card",
  description:"Displays timeline data using ApexCharts",
  preview:true
});

BabyBuddyTimelineCard.getStubConfig = () => ({ feedings_entity:'', diaper_entity:'', debug:true });
