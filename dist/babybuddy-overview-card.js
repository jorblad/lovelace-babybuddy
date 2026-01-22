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
    
    // Normalize tag_colors into { tagName: "#RRGGBB" }
    let tagColors = {};

    if (config.tag_colors) {
    // Case 1: Array (from UI editor OR legacy YAML)
    if (Array.isArray(config.tag_colors)) {
        config.tag_colors.forEach(item => {
        // UI editor format
        if (item.tag_name && item.color) {
            if (Array.isArray(item.color)) {
            // color_rgb → hex
            const [r, g, b] = item.color;
            tagColors[item.tag_name] =
                `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`;
            } else if (typeof item.color === 'string') {
            tagColors[item.tag_name] = item.color;
            }
        }

        // Legacy YAML format: { Formsydd: "#33AA57" }
        else if (typeof item === 'object') {
            Object.entries(item).forEach(([tag, color]) => {
            if (typeof color === 'string') {
                tagColors[tag] = color;
            }
            });
        }
        });
    }

    // Case 2: Object format
    else if (typeof config.tag_colors === 'object') {
        Object.entries(config.tag_colors).forEach(([tag, color]) => {
        if (typeof color === 'string') {
            tagColors[tag] = color;
        }
        });
    }
    }
    
    this.config = {
      title: String(config.title || ''),
      entity: String(config.entity || ''),
      mode: String(config.mode || 'diaper'), // 'diaper' or 'feeding'
      limit: Number(config.limit || 10),
      show_tags: !!config.show_tags !== false, // default true
      show_times: !!config.show_times !== false, // default true
      relative_times: !!config.relative_times !== false, // default true
      show_delete: !!config.show_delete === true, // default true
      babybuddy_base_url: String(config.babybuddy_base_url || ''),
      tag_colors: tagColors
    };
  }

  set hass(hass) {
    this._hass = hass;
    
    if (!this._initialized) {
      this.connectedCallback();
    }
    
    this._updateCard();
  }

  connectedCallback() {
    if (this._initialized) return;
    
    this.attachShadow({ mode: 'open' });
    
    const cardTitle = this.config.title || this._t(`overview.card.title_${this.config.mode}`);
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        ha-card {
          padding: 0;
        }
        .card-header {
          padding: 16px;
          border-bottom: 1px solid var(--divider-color);
        }
        .card-header h2 {
          margin: 0;
          font-size: 1.3em;
          color: var(--primary-text-color);
        }
        .card-content {
          padding: 0;
        }
        .event-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .event-item {
          padding: 16px;
          border-bottom: 1px solid var(--divider-color);
          display: flex;
          gap: 16px;
          align-items: flex-start;
          position: relative;
        }
        .event-item-wrapper {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          flex: 1;
        }
        .event-item:last-child {
          border-bottom: none;
        }
        .event-time {
          min-width: 100px;
          color: var(--secondary-text-color);
          font-size: 0.9em;
          white-space: nowrap;
        }
        .event-time-absolute {
          font-weight: 500;
          color: var(--primary-text-color);
          font-size: 0.95em;
        }
        .event-time-relative {
          font-size: 0.8em;
          color: var(--primary-color);
          margin-top: 2px;
          font-weight: 500;
        }
        .event-details {
          flex: 1;
        }
        .event-type {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
          flex-wrap: wrap;
          align-items: center;
        }
        .event-type-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.85em;
          font-weight: 500;
          background-color: var(--primary-color);
          color: var(--text-primary-color);
        }
        .event-type-badge.wet {
          background-color: #00bfff;
          color: #000;
        }
        .event-type-badge.solid {
          background-color: #ff8c00;
          color: #fff;
        }
        .event-type-badge.dry {
          background-color: #9e9e9e;
          color: #fff;
        }
        .event-type-badge.breast-milk {
          background-color: #ffc0cb;
          color: #000;
        }
        .event-type-badge.formula {
          background-color: #daa520;
          color: #fff;
        }
        .event-type-badge.fortified {
          background-color: #ff69b4;
          color: #fff;
        }
        .event-type-badge.solid-food {
          background-color: #8b4513;
          color: #fff;
        }
        .event-method {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 8px;
          font-size: 0.8em;
          background-color: var(--card-background-color);
          border: 1px solid var(--divider-color);
          margin-right: 4px;
        }
        .event-actions {
          display: flex;
          gap: 8px;
          align-items: center;
          margin-left: auto;
        }
        .edit-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: var(--primary-color);
          color: var(--text-primary-color);
          cursor: pointer;
          text-decoration: none;
          transition: background-color 0.2s;
        }
        .edit-button ha-icon {
            color: var(--primary-text-color);
        } 
        .edit-button:hover {
          background-color: var(--primary-text-color);
        }
        .delete-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color: var(--error-color, #db4437);
            color: #fff;
            cursor: pointer;
            text-decoration: none;
            transition: background-color 0.2s;
            padding: 2px;
        }

        .delete-button:hover {
            background-color: #b71c1c;
        }
        .delete-button ha-icon {
            color: var(--secondary-text-color);
        }

        .delete-button:hover ha-icon {
            color: var(--error-color);
        }
        .tags {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
          margin-top: 8px;
        }
        .tag {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.75em;
          color: #fff;
          font-weight: 500;
          border: none;
        }
        .notes {
          margin-top: 8px;
          font-size: 0.9em;
          color: var(--secondary-text-color);
          font-style: italic;
        }
        .empty {
          padding: 32px 16px;
          text-align: center;
          color: var(--secondary-text-color);
        }
      </style>

      <ha-card>
        <div class="card-header">
          <h2>${cardTitle}</h2>
        </div>
        <div class="card-content">
          <ul class="event-list" id="eventList"></ul>
        </div>
      </ha-card>
    `;

    this._eventList = this.shadowRoot.getElementById('eventList');
    this._initialized = true;
  }

  _formatTime(isoString, relativeTime = true) {
    if (!isoString) return '';

    const date = new Date(isoString);
    const now = new Date();

    const isToday =
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    if (isToday) {
        return `${hours}:${minutes}`; // Only show HH:MM
    } else {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`; // Show full date and time
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
    if (diffDays < 7) return `${diffDays}d ${this._t('overview.ago')}`;
    
    return this._formatTime(isoString, false);
  }

  _getTimeDisplay(event) {
    if (!this.config.show_times) return '';

    // Use `time` for diapers, `start` for feedings
    const start = event.time || event.start;
    const end = event.end;

    if (!start) return '';

    const absolute = this._formatTime(start, false);
    const relative = this.config.relative_times ? this._formatRelativeTime(start) : '';

    let durationStr = '';
    if (this.config.mode === 'feeding' && end) {
        const durationMs = new Date(end) - new Date(start);
        if (durationMs > 0) {
        const minutes = Math.floor(durationMs / 60000);
        const seconds = Math.floor((durationMs % 60000) / 1000);
        durationStr = minutes > 0 ? `${minutes}m${seconds ? ` ${seconds}s` : ''}` : `${seconds}s`;
        }
    }

    return `<div class="event-time">
        <div class="event-time-absolute">
        ${absolute}${durationStr ? ` (${durationStr})` : ''}
        </div>
        ${relative ? `<div class="event-time-relative">${relative}</div>` : ''}
    </div>`;
    }


  _updateCard() {
    const entity = this._hass.states[this.config.entity];
    
    // Use preview data if no entity is configured or entity doesn't exist
    let results = [];
    if (entity && entity.attributes?.results) {
      results = entity.attributes.results;
    } else if (!this.config.entity) {
      // Show preview data when no entity is selected
      results = this._getPreviewData();
    }
    
    if (!results || results.length === 0) {
      this._eventList.innerHTML = `<li class="empty">${this._t('overview.no_data')}</li>`;
      return;
    }
    
    // Limit results
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
        
        typeBadges = types.map(type => {
          const label = this._t(`diaper.types.${type}`);
          return `<span class="event-type-badge ${type}">${label}</span>`;
        }).join('');
      } else if (this.config.mode === 'feeding') {
        const typeClass = event.type?.toLowerCase().replace(/ /g, '-') || 'other';
        const typeLabel = this._t(`feeding.types.${this._mapFeedingType(event.type)}`);
        typeBadges = `<span class="event-type-badge ${typeClass}">${typeLabel}</span>`;
        
        if (event.method) {
          const methodClass = this._mapFeedingMethod(event.method);
          const methodLabel = this._t(`feeding.methods.${methodClass}`);
          methodSpan = `<span class="event-method">${methodLabel}</span>`;
        }
      }
      
      let tagsHtml = '';
      if (this.config.show_tags && event.tags && Array.isArray(event.tags) && event.tags.length > 0) {
        const tagElements = event.tags.map(tag => {
          const color = this._getTagColor(tag);
          return `<span class="tag" style="background-color: ${color}">${this._escapeHtml(tag)}</span>`;
        }).join('');
        tagsHtml = `<div class="tags">${tagElements}</div>`;
      }
      
      let notesHtml = '';
      if (event.notes) {
        notesHtml = `<div class="notes">${this._escapeHtml(event.notes)}</div>`;
      }
      
      const baseUrl = this.config.babybuddy_base_url || '';

        const editUrl =
        this.config.mode === 'diaper'
            ? `${baseUrl}/changes/${event.id}/`
            : `${baseUrl}/feedings/${event.id}/`;

        const deleteUrl =
        this.config.mode === 'diaper'
            ? `${baseUrl}/changes/${event.id}/delete/`
            : `${baseUrl}/feedings/${event.id}/delete/`;

        const editButton = `
            <a
                href="${editUrl}"
                class="edit-button"
                target="_blank"
                title="Edit in BabyBuddy"
            >
                <ha-icon icon="mdi:pencil"></ha-icon>
            </a>
        `;

        const deleteButton = this.config.show_delete
            ? `
                <a
                href="${deleteUrl}"
                class="delete-button"
                target="_blank"
                title="Delete in BabyBuddy"
                >
                <ha-icon icon="mdi:delete"></ha-icon>
                </a>
            `
            : '';

      
      return `
        <li class="event-item">
          <div class="event-item-wrapper">
            ${timeStr}
            <div class="event-details">
              <div class="event-type">
                ${typeBadges}
                ${methodSpan}
              </div>
              ${tagsHtml}
              ${notesHtml}
            </div>
          </div>
          <div class="event-actions">
            ${editButton}
            ${deleteButton}
          </div>
        </li>
      `;
    }).join('');
  }

  _mapFeedingType(type) {
    if (!type) return 'other';
    const mapping = {
      'breast milk': 'breast_milk',
      'formula': 'formula',
      'fortified breast milk': 'fortified_breast_milk',
      'solid food': 'solid_food'
    };
    return mapping[type.toLowerCase()] || type.toLowerCase().replace(/ /g, '_');
  }

  _mapFeedingMethod(method) {
    if (!method) return 'other';
    const mapping = {
      'left breast': 'left_breast',
      'right breast': 'right_breast',
      'both breasts': 'both_breasts',
      'parent fed': 'parent_fed',
      'self fed': 'self_fed'
    };
    return mapping[method.toLowerCase()] || method.toLowerCase().replace(/ /g, '_');
  }

  _getTagColor(tag) {
    // Check if user has configured a specific color for this tag
    if (this.config.tag_colors && this.config.tag_colors[tag]) {
      return this.config.tag_colors[tag];
    }
    
    // Generate a consistent color based on tag name using a hash
    const colors = [
      '#3498db', // blue
      '#e74c3c', // red
      '#2ecc71', // green
      '#f39c12', // orange
      '#9b59b6', // purple
      '#1abc9c', // teal
      '#e67e22', // dark orange
      '#34495e'  // dark gray
    ];
    
    // Hash the tag name to get a consistent index
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = ((hash << 5) - hash) + tag.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }

  _escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  static getStubConfig() {
    return {
      type: 'custom:babybuddy-overview-card',
      entity: '',
      mode: 'diaper',
      title: '',
      limit: 10,
      show_tags: true,
      show_times: true,
      relative_times: true
    };
  }

  getCardSize() {
    return 3 + (this.config.limit || 10);
  }

  _getPreviewData() {
    // Generate realistic preview data
    const now = new Date();
    const createTime = (minutesAgo) => {
      const d = new Date(now.getTime() - minutesAgo * 60000);
      return d.toISOString();
    };

    if (this.config.mode === 'diaper') {
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
    } else {
      return [
        {
          id: 1,
          child: 1,
          time: createTime(10),
          start: createTime(10),
          end: createTime(5),
          type: 'Breast milk',
          method: 'Left breast',
          amount: null,
          notes: '',
          tags: ['Left']
        },
        {
          id: 2,
          child: 1,
          time: createTime(90),
          start: createTime(95),
          end: createTime(90),
          type: 'Formula',
          method: 'Bottle',
          amount: 60,
          notes: 'After breastfeeding',
          tags: ['Bottle']
        },
        {
          id: 3,
          child: 1,
          time: createTime(240),
          start: createTime(245),
          end: createTime(240),
          type: 'Breast milk',
          method: 'Right breast',
          amount: null,
          notes: '',
          tags: ['Right']
        }
      ];
    }
  }

  static getConfigForm() {
    const hass =
        document.querySelector("home-assistant")?.hass;

    // Create a temporary instance just for translations
    const t = (path) =>
        BabyBuddyOverviewCard.prototype._t(path, hass);

    return {
      schema: [
        { name: 'title', selector: { text: { multiline: false } }, default: '' },
        { name: 'entity', selector: { entity: { domain: 'sensor' } }, default: '' },

        { type: 'section', label: 'Mode & Display' },
        {
          name: 'mode',
          selector: {
            select: {
              options: [
                { value: 'diaper', label: 'Diaper Changes' },
                { value: 'feeding', label: 'Feedings' }
              ]
            }
          },
          default: 'diaper'
        },
        { name: 'limit', selector: { number: { min: 1, max: 50, step: 1 } }, default: 10 },
        { name: 'show_tags', selector: { boolean: {} }, default: true },
        { name: 'show_times', selector: { boolean: {} }, default: true },
        { name: 'relative_times', selector: { boolean: {} }, default: true },
        { name: 'show_delete', selector: { boolean: {} }, default: true },
        
        { type: 'section', label: 'Tag Colors' },
        {
          name: 'tag_colors',
          selector: {
            object: {
              label_field: 'tag_name',
              fields: {
                tag_name: {
                  label: 'Tag Name',
                  selector: { text: { multiline: false } }
                },
                color: {
                  label: 'Color',
                  selector: { color_rgb: {} }
                }
              },
              multiple: true
            }
          },
          default: []
        },
        { type: 'section', label: 'BabyBuddy Integration' },
        { name: 'babybuddy_base_url', selector: { text: { multiline: false } }, default: '' },

      ],
      computeLabel: (schema) =>
      t(`overview.config.${schema.name}`),

    computeHelper: (schema) =>
      t(`overview.config_helper.${schema.name}`)
    };
  }

}


customElements.define('babybuddy-overview-card', BabyBuddyOverviewCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "babybuddy-overview-card",
  name: "BabyBuddy Overview Card",
  description: "Shows diaper changes or feedings overview from BabyBuddy.",
  preview: true
});