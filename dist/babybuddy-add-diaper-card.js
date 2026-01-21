class BabyBuddyAddDiaperCard extends HTMLElement {
  _getLanguage() {
    if (this._hass && this._hass.language) {
      const lang = this._hass.language.split('-')[0];
      const translations = window.BabyBuddyTranslations || BabyBuddyTranslations;
      return translations[lang] ? lang : 'en';
    }
    return 'en';
  }

  _t(path) {
    const lang = this._getLanguage();
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

  _tReplace(path, replacements = {}) {
    let text = this._t(path);
    for (const [key, value] of Object.entries(replacements)) {
      text = text.replace(`{${key}}`, value);
    }
    return text;
  }

  setConfig(config) {
    config = config || {};

    this.config = {
      title: String(config.title || ''),
      button_text: String(config.button_text || ''),
      device_id: String(config.device_id || ''),
      default_type: String(config.default_type || 'Wet'),
      default_color: String(config.default_color || 'Black'),
      default_amount: Number(config.default_amount || 1),
      tags: Array.isArray(config.tags) ? config.tags.map(t => String(t)) : [],
      show_notes: !!config.show_notes,
      show_amount: !!config.show_amount,
      show_color: !!config.show_color
    };
  }

  connectedCallback() {
    if (this._initialized) return;

    this.attachShadow({ mode: 'open' });
    
    // Get translated strings
    const cardTitle = this.config.title || this._t('diaper.card.title');
    const buttonText = this.config.button_text || this._t('diaper.card.button_text');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        ha-card {
          padding: 0;
        }
        .card-content {
          padding: 16px;
          display: flex;
          justify-content: center;
        }
        ha-button {
          width: 100%;
        }
        ha-dialog {
          --mdc-dialog-max-width: 500px;
        }
        .dialog-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .form-group label {
          font-weight: 500;
          color: var(--primary-text-color);
        }
        ha-select, ha-textfield, textarea {
          width: 100%;
        }
        textarea {
          padding: 8px;
          border: 1px solid var(--divider-color);
          border-radius: 4px;
          font-family: inherit;
          font-size: inherit;
          color: var(--primary-text-color);
          background-color: var(--card-background-color);
          resize: vertical;
          min-height: 80px;
        }
        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .tag-toggle {
          padding: 10px 16px;
          border: 2px solid var(--divider-color);
          border-radius: 20px;
          background-color: transparent;
          color: var(--primary-text-color);
          cursor: pointer;
          user-select: none;
          font-size: inherit;
          font-family: inherit;
          transition: all 0.2s ease;
          min-height: 44px;
          display: flex;
          align-items: center;
        }
        .tag-toggle:hover {
          border-color: var(--primary-color);
          background-color: rgba(var(--rgb-primary-color), 0.1);
        }
        .tag-toggle.selected {
          background-color: var(--primary-color);
          color: var(--text-primary-color);
          border-color: var(--primary-color);
        }
        .dialog-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          padding-top: 16px;
          border-top: 1px solid var(--divider-color);
        }
        ha-button {
          min-width: 100px;
        }
        #submitBtn {
          --mdc-button-raised-box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2);
        }
        #cancelBtn {
          --mdc-theme-primary: var(--primary-text-color);
        }
      </style>

      <ha-card>
        <div class="card-content">
          <ha-button raised id="openBtn">${buttonText}</ha-button>
        </div>
      </ha-card>

      <ha-dialog id="dialog" heading="${cardTitle}">
        <div class="dialog-content">
          <div class="form-group">
            <label>${this._t('diaper.form.time')}</label>
            <ha-textfield id="timeInput" type="time"></ha-textfield>
          </div>

          <div class="form-group">
            <label>${this._t('diaper.form.type')}</label>
            <ha-select id="typeSelect">
              <mwc-list-item value="Wet">${this._t('diaper.types.wet')}</mwc-list-item>
              <mwc-list-item value="Solid">${this._t('diaper.types.solid')}</mwc-list-item>
              <mwc-list-item value="Wet and Solid">${this._t('diaper.types.wet_and_solid')}</mwc-list-item>
              <mwc-list-item value="Dry">${this._t('diaper.types.dry')}</mwc-list-item>
            </ha-select>
          </div>

          ${this.config.show_color ? `
          <div class="form-group">
            <label>${this._t('diaper.form.color')}</label>
            <ha-select id="colorSelect">
              <mwc-list-item value="Black">${this._t('diaper.colors.black')}</mwc-list-item>
              <mwc-list-item value="Brown">${this._t('diaper.colors.brown')}</mwc-list-item>
              <mwc-list-item value="Green">${this._t('diaper.colors.green')}</mwc-list-item>
              <mwc-list-item value="Yellow">${this._t('diaper.colors.yellow')}</mwc-list-item>
            </ha-select>
          </div>
          ` : ''}

          ${this.config.show_amount ? `
          <div class="form-group">
            <label>${this._t('diaper.form.amount')}</label>
            <ha-textfield id="amountInput" type="number" value="${this.config.default_amount}" min="1"></ha-textfield>
          </div>
          ` : ''}

          ${this.config.show_notes ? `
          <div class="form-group">
            <label>${this._t('diaper.form.notes')}</label>
            <textarea id="notesInput" placeholder="Add any notes..."></textarea>
          </div>
          ` : ''}

          ${this.config.tags.length > 0 ? `
          <div class="form-group">
            <label>${this._t('diaper.form.tags')}</label>
            <div class="tags-container" id="tagsContainer"></div>
          </div>
          ` : ''}
        </div>

        <div slot="primaryAction">
          <ha-button id="submitBtn">${this._t('diaper.form.submit')}</ha-button>
        </div>
        <div slot="secondaryAction">
          <ha-button id="cancelBtn" variant="outlined" dialogAction="close">${this._t('diaper.form.cancel')}</ha-button>
        </div>
      </ha-dialog>
    `;

    this._openBtn = this.shadowRoot.getElementById('openBtn');
    this._dialog = this.shadowRoot.getElementById('dialog');
    this._timeInput = this.shadowRoot.getElementById('timeInput');
    this._typeSelect = this.shadowRoot.getElementById('typeSelect');
    this._colorSelect = this.shadowRoot.getElementById('colorSelect');
    this._amountInput = this.shadowRoot.getElementById('amountInput');
    this._notesInput = this.shadowRoot.getElementById('notesInput');
    this._tagsContainer = this.shadowRoot.getElementById('tagsContainer');
    this._submitBtn = this.shadowRoot.getElementById('submitBtn');
    this._cancelBtn = this.shadowRoot.getElementById('cancelBtn');

    // Set initial time to now
    this._setCurrentTime();

    // Set default values
    this._typeSelect.value = this.config.default_type;
    if (this._colorSelect) {
      this._colorSelect.value = this.config.default_color;
    }

    // Populate tags
    if (this._tagsContainer) {
      this.config.tags.forEach(tag => {
        const button = document.createElement('button');
        button.className = 'tag-toggle';
        button.textContent = tag;
        button.value = tag;
        button.addEventListener('click', () => {
          button.classList.toggle('selected');
        });
        this._tagsContainer.appendChild(button);
      });
    }

    // Event listeners
    this._openBtn.addEventListener('click', () => {
      this._setCurrentTime();
      this._dialog.show();
    });

    this._submitBtn.addEventListener('click', () => this._handleSubmit());
    this._cancelBtn.addEventListener('click', () => this._dialog.close());

    this._initialized = true;
  }

  _setCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    this._timeInput.value = `${hours}:${minutes}`;
  }

  async _handleSubmit() {
    const time = this._timeInput.value;
    const type = this._typeSelect.value;
    const color = this._colorSelect ? this._colorSelect.value : null;
    const amount = this._amountInput ? Number(this._amountInput.value) : 1;
    const notes = this._notesInput ? this._notesInput.value : '';

    // Get selected tags
    const selectedTags = [];
    if (this._tagsContainer) {
      this._tagsContainer.querySelectorAll('button.tag-toggle.selected').forEach(button => {
        selectedTags.push(button.value);
      });
    }

    // Format time to HH:MM:SS
    const timeStr = time ? `${time}:00` : '00:00:00';

    // Build action data
    const actionData = {
      time: timeStr,
      type: type
    };

    // Only include color if show_color is enabled and color is selected
    if (this.config.show_color && color) {
      actionData.color = color;
    }

    if (amount && this.config.show_amount) {
      actionData.amount = amount;
    }

    if (notes && this.config.show_notes) {
      actionData.notes = notes;
    }

    if (selectedTags.length > 0) {
      actionData.tags = selectedTags;
    }

    // Call the service with target device_id
    try {
      const target = {};
      if (this.config.device_id) {
        target.device_id = this.config.device_id;
      } else {
        // Try to find a babybuddy device
        const devices = await this._hass.callWS({
          type: 'config/device_registry/list'
        });
        const babyDevice = devices.find(d => d.manufacturer === 'babybuddy');
        if (babyDevice) {
          target.device_id = babyDevice.id;
        }
      }
      await this._hass.callService('babybuddy', 'add_diaper_change', actionData, target);
      this._dialog.close();
      
      // Show success notification
      this._showNotification(this._t('diaper.notifications.success'), 'success');
    } catch (error) {
      this._showNotification(this._tReplace('diaper.notifications.error', { error: error.message }), 'error');
    }
  }

  _showNotification(message, type = 'info') {
    // Use Home Assistant's built-in notification system
    if (this._hass && this._hass.notification) {
      this._hass.notification.create(message, {
        type: type,
        dismissable: true
      });
    } else {
      // Fallback: dispatch custom event
      const event = new CustomEvent('hass-notification', {
        detail: {
          message: message,
          dismissable: true
        },
        composed: true,
        bubbles: true
      });
      this.dispatchEvent(event);
    }
  }

  set hass(hass) {
    this._hass = hass;
  }

  getCardSize() {
    return 1;
  }

  static getConfigForm() {
    // Create a helper instance to access translations
    const t = (path) => {
      const lang = (typeof BabyBuddyTranslations !== 'undefined') ? 'en' : 'en';
      const translations = (typeof BabyBuddyTranslations !== 'undefined') ? BabyBuddyTranslations[lang] : {};
      const keys = path.split('.');
      let value = translations;
      for (const key of keys) {
        value = value?.[key];
        if (!value) break;
      }
      return value || path;
    };

    return {
      schema: [
        { name: 'title', selector: { text: { multiline: false } }, default: '' },
        { name: 'button_text', selector: { text: { multiline: false } }, default: '' },
        { 
          name: 'device_id', 
          selector: { 
            device: { 
              integration: 'babybuddy'
            } 
          }, 
          default: '' 
        },
        
        { type: 'section', label: t('diaper.sections.defaults') },
        { 
          name: 'default_type', 
          selector: { 
            select: { 
              options: [
                { value: 'Wet', label: t('diaper.types.wet') },
                { value: 'Solid', label: t('diaper.types.solid') },
                { value: 'Wet and Solid', label: t('diaper.types.wet_and_solid') },
                { value: 'Dry', label: t('diaper.types.dry') }
              ]
            } 
          }, 
          default: 'Wet' 
        },
        { name: 'show_color', selector: { boolean: {} }, default: false },
        { 
          name: 'default_color', 
          selector: { 
            select: { 
              options: [
                { value: 'Black', label: t('diaper.colors.black') },
                { value: 'Brown', label: t('diaper.colors.brown') },
                { value: 'Green', label: t('diaper.colors.green') },
                { value: 'Yellow', label: t('diaper.colors.yellow') }
              ]
            } 
          }, 
          default: 'Black' 
        },

        { type: 'section', label: t('diaper.sections.optional_fields') },
        { name: 'show_amount', selector: { boolean: {} }, default: false },
        { name: 'default_amount', selector: { number: { min: 1, max: 10, step: 1 } }, default: 1 },
        { name: 'show_notes', selector: { boolean: {} }, default: false },

        { type: 'section', label: t('diaper.sections.tags') },
        { name: 'tags', selector: { text: { multiple: true } }, default: [] }
      ],
      computeLabel: (schema) => {
        const lang = (typeof BabyBuddyTranslations !== 'undefined') ? 'en' : 'en';
        const translations = (typeof BabyBuddyTranslations !== 'undefined') ? BabyBuddyTranslations[lang] : {};
        const labels = translations.diaper?.config || {};
        return labels[schema.name] || schema.label || '';
      },
      computeHelper: (schema) => {
        const lang = (typeof BabyBuddyTranslations !== 'undefined') ? 'en' : 'en';
        const translations = (typeof BabyBuddyTranslations !== 'undefined') ? BabyBuddyTranslations[lang] : {};
        const helpers = {
          tags: translations.diaper?.config?.tags_helper || 'Enter tag names (one per line) that will appear as toggles in the popup'
        };
        return helpers[schema.name];
      }
    };
  }
}

customElements.define('babybuddy-add-diaper-card', BabyBuddyAddDiaperCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'babybuddy-add-diaper-card',
  name: 'BabyBuddy Add Diaper Card',
  description: 'Log diaper changes with a configurable popup form',
  preview: true
});

BabyBuddyAddDiaperCard.getStubConfig = () => ({
  button_text: 'Log Diaper',
  default_type: 'Wet',
  default_color: 'Black',
  tags: ['Tag 1', 'Tag 2', 'Tag 3']
});
