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
      mode: String(config.mode || 'diaper'), // 'diaper', 'feeding', or 'sleep'
      limit: Number(config.limit || 10),
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
        .event-item { padding: 16px; border-bottom: 1px solid var(--divider-color); display: flex; gap: 16px; align-items: flex-start; position: relative; }
        .event-item-wrapper { display: flex; gap: 16px; align-items: flex-start; flex: 1; }
        .event-item:last-child { border-bottom: none; }
        .event-time {
          min-width: 100px;
          color: var(--secondary-text-color);
          line-height: 1.3;
        }
        .event-time-absolute {
          display: flex;
          flex-direction: column;
          font-weight: 500;
          color: var(--primary-text-color);
        }
        .date-row {
          font-size: 0.8em;
          color: var(--secondary-text-color);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .time-row {
          font-size: 1em;
          white-space: nowrap;
        }
        .duration-row {
          font-size: 0.85em;
          color: var(--primary-color); /* Makes the duration pop */
          font-weight: 600;
        }
        .event-time-relative {
          font-size: 0.75em;
          color: var(--secondary-text-color);
          margin-top: 2px;
          font-style: italic;
        }
        .event-details { flex: 1; }
        .event-type { display: flex; gap: 8px; margin-bottom: 8px; flex-wrap: wrap; align-items: center; }
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
        .event-actions { display: flex; gap: 8px; align-items: center; margin-left: auto; }
        .edit-button, .delete-button { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; text-decoration: none; transition: background-color 0.2s; }
        .edit-button { background-color: var(--primary-color); color: var(--text-primary-color); }
        .edit-button ha-icon { color: var(--primary-text-color); }
        .delete-button { background-color: var(--error-color, #db4437); }
        .delete-button ha-icon { color: white; }
        .tags { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 8px; }
        .tag { display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 0.75em; color: #fff; font-weight: 500; }
        .notes { margin-top: 8px; font-size: 0.9em; color: var(--secondary-text-color); font-style: italic; }
        .empty { padding: 32px 16px; text-align: center; color: var(--secondary-text-color); }
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
        const label = this._t(`sleep.types.${typeKey}`); // This uses the translation file
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
              ${tagsHtml}${notesHtml}
            </div>
          </div>
          <div class="event-actions">${editButton}${deleteButton}</div>
        </li>`;
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
            { value: 'sleep', label: 'Sleeps' }
        ] } } },
        { name: 'limit', selector: { number: { min: 1, max: 50 } }, default: 10 },
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