class BabyBuddyOverviewCard extends HTMLElement {
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
    let tagColors = {};

    if (config.tag_colors) {
      if (Array.isArray(config.tag_colors)) {
        config.tag_colors.forEach(item => {
          if (item.tag_name && item.color) {
            if (Array.isArray(item.color)) {
              const [r, g, b] = item.color;
              tagColors[item.tag_name] = `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`;
            } else if (typeof item.color === 'string') {
              tagColors[item.tag_name] = item.color;
            }
          } else if (typeof item === 'object') {
            Object.entries(item).forEach(([tag, color]) => {
              if (typeof color === 'string') tagColors[tag] = color;
            });
          }
        });
      } else if (typeof config.tag_colors === 'object') {
        Object.entries(config.tag_colors).forEach(([tag, color]) => {
          if (typeof color === 'string') tagColors[tag] = color;
        });
      }
    }

    this.config = {
      title: String(config.title || ''),
      entity: String(config.entity || ''),
      mode: String(config.mode || 'diaper'), // 'diaper', 'feeding', 'sleep' or 'sleep_daily'
      limit: Number(config.limit || 10),
      sleep_target: config.sleep_target !== undefined ? Number(config.sleep_target) : 14,
      days_to_show: Number(config.days_to_show || 7),
      show_tags: !!config.show_tags !== false,
      show_times: !!config.show_times !== false,
      relative_times: !!config.relative_times !== false,
      show_delete: !!config.show_delete === true,
      babybuddy_base_url: String(config.babybuddy_base_url || ''),
      tag_colors: tagColors
    };
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._initialized) this.connectedCallback();
    this._updateCard();
  }

  connectedCallback() {
    if (this._initialized) return;
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        ha-card { padding: 0; }
        .card-header { padding: 16px; border-bottom: 1px solid var(--divider-color); }
        .card-header h2 { margin: 0; font-size: 1.3em; color: var(--primary-text-color); }
        .card-content { padding: 0; }
        .event-list { list-style: none; padding: 0; margin: 0; }
        .event-item {
          padding: 12px 16px;
          border-bottom: 1px solid var(--divider-color);
          display: flex;
          gap: 16px;
          align-items: center; /* Vertically aligns time, details, and buttons */
        }
        /* Make the wrapper fill the space next to the actions */
        .event-item-wrapper {
          display: flex;
          flex: 1; 
          align-items: center;
          gap: 12px;
          min-width: 0; /* Critical for flexbox text wrapping */
        }
        .event-time {
          min-width: 90px; /* Adjusted width */
          flex-shrink: 0; /* Prevents time from squishing */
        }
        .event-time-absolute {
          display: flex;
          flex-direction: column;
          font-weight: 500;
          color: var(--primary-text-color);
        }
        .date-row {
          font-weight: 700;
          font-size: 1.1em;
          color: var(--primary-text-color);
        }
        .time-row {
          font-size: 1em;
          white-space: nowrap;
        }
        .duration-row {
          color: var(--primary-color);
          font-size: 1.2em;
          font-weight: 800;
        }
        .event-time-relative {
          font-size: 0.75em;
          color: var(--secondary-text-color);
          margin-top: 2px;
          font-style: italic;
        }
        .event-details {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 6px; /* Space between types, tags, and notes */
          justify-content: center;
        }
        .event-type {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin: 0;
        }
        .event-type-badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 0.85em; font-weight: 500; background-color: var(--primary-color); color: var(--text-primary-color); }
        .event-type-badge.wet { background-color: #00bfff; color: #000; }
        .event-type-badge.solid { background-color: #ff8c00; color: #fff; }
        .event-type-badge.dry { background-color: #9e9e9e; color: #fff; }
        .event-type-badge.breast-milk { background-color: #ffc0cb; color: #000; }
        .event-type-badge.formula { background-color: #daa520; color: #fff; }
        .event-type-badge.fortified { background-color: #ff69b4; color: #fff; }
        .event-type-badge.solid-food { background-color: #8b4513; color: #fff; }
        .event-type-badge.sleep { background-color: #673ab7; color: #fff; }
        .event-type-badge.nap { background-color: #3f51b5; color: #fff; }
        .event-method { display: inline-block; padding: 2px 8px; border-radius: 8px; font-size: 0.8em; background-color: var(--card-background-color); border: 1px solid var(--divider-color); margin-right: 4px; }
        /* Action Container - Still vertical but spaced nicely */
        .event-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex-shrink: 0;
          align-self: center; /* Keeps buttons centered relative to the whole row */
        }

        /* The Friendly Circular Buttons */
        .edit-button, .delete-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          text-decoration: none;
          transition: transform 0.1s ease-in-out, filter 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        /* Button Colors */
        .edit-button {
          background-color: var(--primary-color);
        }
        .edit-button ha-icon {
          color: white; /* Contrast for the pencil */
          --mdc-icon-size: 18px;
        }

        .delete-button {
          background-color: var(--error-color, #db4437);
        }
        .delete-button ha-icon {
          color: white;
          --mdc-icon-size: 18px;
        }

        /* Hover & Tap Effects */
        .edit-button:active, .delete-button:active {
          transform: scale(0.9);
          filter: brightness(0.9);
        }
        .tags {
          display: flex;
          flex-wrap: wrap; /* Allows tags to wrap to the next line if many exist */
          gap: 6px;
          margin-top: 2px;
        }

        .tag {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px; /* Matching badge padding */
          border-radius: 12px;
          font-size: 0.75em;
          font-weight: 500;
          color: #fff;
          white-space: nowrap; /* Keeps tag text on one line */
          width: fit-content; /* Only as wide as the text */
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }

        .notes {
          margin-top: 2px;
          font-size: 0.85em;
          color: var(--secondary-text-color);
          font-style: italic;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .empty { padding: 32px 16px; text-align: center; color: var(--secondary-text-color); }
        /* Summary Mode Specifics */
        .summary-item {
          flex-direction: column !important;
          align-items: stretch !important;
          padding: 12px 16px !important;
        }
        .summary-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 4px;
        }
        .summary-date-group {
          display: flex;
          gap: 12px;
          align-items: baseline;
        }
        .summary-date-group .date-row {
          font-size: 0.9em;
          opacity: 0.7;
          font-weight: normal;
        }
        .summary-date-group .duration-row {
          font-size: 1.1em;
          font-weight: 700;
          color: var(--primary-text-color);
        }
        .sleep-count-badge {
          font-size: 0.8em;
          background: var(--secondary-background-color);
          padding: 2px 8px;
          border-radius: 10px;
          color: var(--secondary-text-color);
        }
        .progress-container {
          height: 6px; /* Thinner bar for condensed look */
          background-color: var(--secondary-background-color);
          border-radius: 3px;
          margin: 4px 0;
          overflow: hidden;
        }
        .progress-stats {
          display: flex;
          justify-content: space-between;
          font-size: 0.75em;
          opacity: 0.6;
        }
        .progress-container {
          height: 8px;
          width: 100%;
          background-color: var(--secondary-background-color);
          border-radius: 4px;
          margin-top: 8px;
          overflow: hidden;
        }
        .progress-bar {
          height: 100%;
          background-color: var(--primary-color);
          border-radius: 4px;
          transition: width 0.5s ease-in-out;
        }
        .progress-stats {
          display: flex;
          justify-content: space-between;
          font-size: 0.8em;
          color: var(--secondary-text-color);
          margin-top: 4px;
        }
        .trend {
          font-size: 0.7em;
          margin-left: 4px;
          vertical-align: middle;
        }
        .trend.up {
          color: #4caf50; /* Green for more sleep */
        }
        .trend.down {
          color: #f44336; /* Red for less sleep */
        }
      </style>
      <ha-card>
        <div class="card-header"><h2 id="headerText"></h2></div>
        <div class="card-content"><ul class="event-list" id="eventList"></ul></div>
      </ha-card>
    `;
    this._eventList = this.shadowRoot.getElementById('eventList');
    this._headerText = this.shadowRoot.getElementById('headerText');
    this._initialized = true;
  }

  _formatTime(isoString) {
    if (!isoString) return { date: '', time: '' };

    const date = new Date(isoString);
    const now = new Date();

    const isToday =
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;

    if (isToday) {
        return { date: '', time: timeStr };
    } else {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return { date: `${year}-${month}-${day}`, time: timeStr };
    }
  }

  _formatRelativeTime(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return this._t('overview.just_now');
    if (diffMins < 60) return `${diffMins}m ${this._t('overview.ago')}`;
    if (diffHours < 24) return `${diffHours}h ${this._t('overview.ago')}`;
    return `${diffDays}d ${this._t('overview.ago')}`;
  }

  _getTimeDisplay(event) {
    if (!this.config.show_times) return '';

    const start = event.time || event.start;
    const end = event.end;
    if (!start) return '';

    const startObj = this._formatTime(start);
    const relative = this.config.relative_times ? this._formatRelativeTime(start) : '';

    let timeRange = startObj.time;
    let durationStr = '';

    if ((this.config.mode === 'sleep' || this.config.mode === 'feeding') && end) {
        const endObj = this._formatTime(end);
        timeRange = `${startObj.time} - ${endObj.time}`;

        const durationMs = new Date(end) - new Date(start);
        if (durationMs > 0) {
            const totalMinutes = Math.floor(durationMs / 60000);
            const h = Math.floor(totalMinutes / 60);
            const m = totalMinutes % 60;
            // Translating duration labels if you wish, or keep h/m
            durationStr = h > 0 ? `${h}h ${m}m` : `${m}m`;
        }
    }

    return `
      <div class="event-time">
        <div class="event-time-absolute">
          ${startObj.date ? `<div class="date-row">${startObj.date}</div>` : ''}
          <div class="time-row">${timeRange}</div>
          ${durationStr ? `<div class="duration-row">${durationStr}</div>` : ''}
        </div>
        ${relative ? `<div class="event-time-relative">${relative}</div>` : ''}
      </div>`;
  }

  _updateCard() {
    const entity = this._hass.states[this.config.entity];
    this._headerText.innerText = this.config.title || this._t(`overview.card.title_${this.config.mode}`);

    let results = (entity && entity.attributes?.results) ? entity.attributes.results : (!this.config.entity ? this._getPreviewData() : []);

    if (!results || results.length === 0) {
      this._eventList.innerHTML = `<li class="empty">${this._t('overview.no_data')}</li>`;
      return;
    }

    // --- CASE 1: Daily Summary Mode ---
    if (this.config.mode === 'sleep_daily') {
      this._renderDailySleep(results);
      return; // Exit here so we don't run the list-rendering code below
    }

    // --- CASE 2: List Mode (Diaper, Feeding, Sleep) ---
    const limited = results.slice(0, this.config.limit);

    this._eventList.innerHTML = limited.map(event => {
      const timeStr = this._getTimeDisplay(event);
      let typeBadges = '';
      let methodSpan = '';

      if (this.config.mode === 'diaper') {
        const types = [];
        if (event.wet) types.push('wet');
        if (event.solid) types.push('solid');
        if (!event.wet && !event.solid) types.push('dry');
        typeBadges = types.map(t => `<span class="event-type-badge ${t}">${this._t(`diaper.types.${t}`)}</span>`).join('');
      } else if (this.config.mode === 'feeding') {
        const typeClass = event.type?.toLowerCase().replace(/ /g, '-') || 'other';
        typeBadges = `<span class="event-type-badge ${typeClass}">${this._t(`feeding.types.${this._mapFeedingType(event.type)}`)}</span>`;
        if (event.method) {
          methodSpan = `<span class="event-method">${this._t(`feeding.methods.${this._mapFeedingMethod(event.method)}`)}</span>`;
        }
      } else if (this.config.mode === 'sleep') {
        const typeKey = event.nap ? 'nap' : 'sleep';
        const label = this._t(`sleep.types.${typeKey}`);
        typeBadges = `<span class="event-type-badge ${typeKey}">${label}</span>`;
      }

      const tagsHtml = (this.config.show_tags && event.tags?.length) ? 
        `<div class="tags">${event.tags.map(tag => `<span class="tag" style="background-color: ${this._getTagColor(tag)}">${this._escapeHtml(tag)}</span>`).join('')}</div>` : '';
      
      const notesHtml = event.notes ? `<div class="notes">${this._escapeHtml(event.notes)}</div>` : '';

      const baseUrl = this.config.babybuddy_base_url || '';
      const pathMap = { diaper: 'changes', feeding: 'feedings', sleep: 'sleep' };
      const path = pathMap[this.config.mode];
      
      const editButton = `<a href="${baseUrl}/${path}/${event.id}/" class="edit-button" target="_blank"><ha-icon icon="mdi:pencil"></ha-icon></a>`;
      const deleteButton = this.config.show_delete ? `<a href="${baseUrl}/${path}/${event.id}/delete/" class="delete-button" target="_blank"><ha-icon icon="mdi:delete"></ha-icon></a>` : '';

      return `<li class="event-item">
          <div class="event-item-wrapper">
            ${timeStr}
            <div class="event-details">
              <div class="event-type">${typeBadges}${methodSpan}</div>
              ${tagsHtml}
              ${notesHtml}
            </div>
          </div>
          <div class="event-actions">
            ${editButton}
            ${deleteButton}
          </div>
        </li>`;
    }).join('');
  }

  _renderDailySleep(results) {
    const dailyTotals = {};
    const sleepTarget = this.config.sleep_target || 14;
    const targetMs = sleepTarget * 3600000;
    
    // Get the user's language/locale from Hass (default to 'en-US' if not found)
    const userLocale = this._hass.locale?.language || this._hass.language || 'en-US';

    results.forEach(event => {
        const startTime = event.start || event.time;
        if (!startTime || !event.end) return;
        
        let currentStart = new Date(startTime);
        const overallEnd = new Date(event.end);

        while (currentStart < overallEnd) {
            // Using Intl.DateTimeFormat with Hass locale to get YYYY-MM-DD reliably
            const dateKey = new Intl.DateTimeFormat('en-CA', { 
                year: 'numeric', month: '2-digit', day: '2-digit' 
            }).format(currentStart); 
            // Note: 'en-CA' is used above as a trick to get YYYY-MM-DD regardless of locale 
            // to keep the keys consistent for sorting, but we display it nicely later.

            const endOfDay = new Date(currentStart);
            endOfDay.setHours(23, 59, 59, 999);

            const segmentEnd = overallEnd < endOfDay ? overallEnd : endOfDay;
            const durationMs = segmentEnd - currentStart;

            if (durationMs > 0) {
                if (!dailyTotals[dateKey]) dailyTotals[dateKey] = { ms: 0, count: 0 };
                dailyTotals[dateKey].ms += durationMs;
                
                if (currentStart.getTime() === new Date(startTime).getTime()) {
                    dailyTotals[dateKey].count += 1;
                }
            }

            if (overallEnd > endOfDay) {
                currentStart = new Date(endOfDay.getTime() + 1);
            } else {
                break; 
            }
        }
    });

    const sortedDates = Object.keys(dailyTotals)
        .sort((a, b) => b.localeCompare(a))
        .slice(0, this.config.days_to_show || 7);

    this._eventList.innerHTML = sortedDates.map((date, index) => {
        const data = dailyTotals[date];
        const totalMinutes = Math.floor(data.ms / 60000);
        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;
        const percentage = Math.min((data.ms / targetMs) * 100, 100);

        // Trend Logic: Compare to the previous day (next item in sorted array)
        let trendHtml = '';
        const yesterdayDate = sortedDates[index + 1];
        if (yesterdayDate) {
            const yesterdayMs = dailyTotals[yesterdayDate].ms;
            const diffMs = data.ms - yesterdayMs;
            const diffMins = Math.abs(Math.floor(diffMs / 60000));
            const diffH = Math.floor(diffMins / 60);
            const diffM = diffMins % 60;
            const diffStr = diffH > 0 ? `${diffH}h ${diffM}m` : `${diffM}m`;

            if (diffMs > 300000) { // More than 5 min difference
                trendHtml = `<span class="trend up" title="${diffStr} more than yesterday">▲</span>`;
            } else if (diffMs < -300000) {
                trendHtml = `<span class="trend down" title="${diffStr} less than yesterday">▼</span>`;
            }
        }

        const displayDate = new Date(date).toLocaleDateString(userLocale, {
            weekday: 'short', month: 'short', day: 'numeric'
        });

        const sleepLabel = data.count === 1 ? this._t('sleep.types.sleep') : this._t('overview.config.mode_sleep');
        const ofGoalLabel = this._t('overview.stats.of_goal');
        const targetLabel = this._t('overview.config.sleep_target');

        return `
            <li class="event-item summary-item">
                <div class="summary-header">
                    <div class="summary-date-group">
                        <span class="date-row">${displayDate}</span>
                        <span class="duration-row">${h}h ${m}m ${trendHtml}</span>
                    </div>
                    <div class="sleep-count-badge">${data.count} ${sleepLabel}</div>
                </div>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${percentage}%"></div>
                </div>
                <div class="progress-stats">
                    <span>${Math.round((data.ms / targetMs) * 100)}% ${ofGoalLabel}</span>
                    <span>${targetLabel}: ${sleepTarget}h</span>
                </div>
            </li>
        `;
    }).join('');
  }

  _mapFeedingType(type) {
    if (!type) return 'other';
    const mapping = { 'breast milk': 'breast_milk', 'formula': 'formula', 'fortified breast milk': 'fortified_breast_milk', 'solid food': 'solid_food' };
    return mapping[type.toLowerCase()] || type.toLowerCase().replace(/ /g, '_');
  }

  _mapFeedingMethod(method) {
    if (!method) return 'other';
    const mapping = { 'left breast': 'left_breast', 'right breast': 'right_breast', 'both breasts': 'both_breasts', 'parent fed': 'parent_fed', 'self fed': 'self_fed' };
    return mapping[method.toLowerCase()] || method.toLowerCase().replace(/ /g, '_');
  }

  _getTagColor(tag) {
    if (this.config.tag_colors?.[tag]) return this.config.tag_colors[tag];
    const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e'];
    let hash = 0;
    for (let i = 0; i < tag.length; i++) hash = ((hash << 5) - hash) + tag.charCodeAt(i);
    return colors[Math.abs(hash) % colors.length];
  }

  _escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  _getPreviewData() {
    const now = new Date();
    const createTime = (m) => new Date(now.getTime() - m * 60000).toISOString();
    if (this.config.mode === 'sleep') {
        return [
            { id: 1, start: createTime(120), end: createTime(60), nap: true, notes: 'Morning nap', tags: ['Crib'] },
            { id: 2, start: createTime(600), end: createTime(300), nap: false, notes: 'Night sleep', tags: ['Night'] }
        ];
    }
    // ... (Keep existing diaper/feeding preview data logic here)
    return [];
  }

  static getConfigForm() {
    const hass =
      document.querySelector("home-assistant")?.hass;
    // Temporary translation helper
    const t = (path) => BabyBuddyOverviewCard.prototype._t(path, hass);
    return {
      schema: [
        { name: 'title', selector: { text: {} } },
        { name: 'entity', selector: { entity: { domain: 'sensor' } } },
        { name: 'mode', selector: { select: { options: [
            { value: 'diaper', label: 'Diaper Changes' },
            { value: 'feeding', label: 'Feedings' },
            { value: 'sleep', label: 'Sleeps' },
            { value: 'sleep_daily', label: 'Sleeps (Daily Totals)' }
        ] } } },
        { name: 'limit', selector: { number: { min: 1, max: 50 } }, default: 10 },
        { 
          name: 'sleep_target', 
          label: 'Daily Sleep Target (Hours)',
          selector: { number: { min: 1, max: 24, step: 0.5 } }, 
          default: 14 
        },
        { name: 'days_to_show', selector: { number: { min: 1, max: 30 } }, default: 7 },
        { name: 'show_tags', selector: { boolean: {} }, default: true },
        { name: 'show_times', selector: { boolean: {} }, default: true },
        { name: 'relative_times', selector: { boolean: {} }, default: true },
        { name: 'show_delete', selector: { boolean: {} }, default: true },
        { name: 'babybuddy_base_url', selector: { text: {} } }
      ],
      computeLabel: (schema) => t(`overview.config.${schema.name}`),
      computeHelper: (schema) => t(`overview.config_helper.${schema.name}`)
    };
  }
}

customElements.define('babybuddy-overview-card', BabyBuddyOverviewCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "babybuddy-overview-card",
  name: "BabyBuddy Overview Card",
  description: "Displays an overview of babybuddy data",
  preview: true
});

BabyBuddyOverviewCard.getStubConfig = () => ({ mode:'diaper', limit:3, entity:'sensor.babybuddy_api_diaper_changes' });