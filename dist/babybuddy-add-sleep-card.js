class BabyBuddyAddSleepCard extends HTMLElement {
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
      default_nap: !!config.default_nap,
      show_notes: !!config.show_notes,
      tags: Array.isArray(config.tags) ? config.tags.map(t => String(t)) : [],
      default_duration: config.default_duration ?? 10,
    };
  }

  connectedCallback() {
    if (this._initialized) return;

    this.attachShadow({ mode: 'open' });

    const cardTitle = this.config.title || this._t('sleep.card.title');
    const buttonText = this.config.button_text || this._t('sleep.card.button_text');

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        ha-card { padding: 0; }
        .card-content { padding: 16px; display: flex; justify-content: center; }
        ha-button { width: 100%; min-width: 100px; }
        ha-dialog { --mdc-dialog-max-width: 500px; }
        .dialog-content { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .time-group { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .form-group label { font-weight: 500; color: var(--primary-text-color); }
        ha-textfield, textarea { width: 100%; }
        textarea { padding: 8px; border: 1px solid var(--divider-color); border-radius: 4px; font-family: inherit; font-size: inherit; color: var(--primary-text-color); background-color: var(--card-background-color); resize: vertical; min-height: 80px; }
        .tags-container { display: flex; flex-wrap: wrap; gap: 8px; }
        .tag-toggle { padding: 10px 16px; border: 2px solid var(--divider-color); border-radius: 20px; background-color: transparent; color: var(--primary-text-color); cursor: pointer; user-select: none; font-size: inherit; font-family: inherit; transition: all 0.2s ease; min-height: 44px; display: flex; align-items: center; }
        .tag-toggle:hover { border-color: var(--primary-color); background-color: rgba(var(--rgb-primary-color), 0.1); }
        .tag-toggle.selected { background-color: var(--primary-color); color: var(--text-primary-color); border-color: var(--primary-color); }
      </style>

      <ha-card>
        <div class="card-content">
          <ha-button raised id="openBtn">${buttonText}</ha-button>
        </div>
      </ha-card>

      <ha-dialog id="dialog" heading="${cardTitle}">
        <div class="dialog-content">
          <div class="form-group">
            <label>${this._t('sleep.form.start_time')}</label>
            <div class="time-group">
              <ha-textfield id="startTimeInput" type="time"></ha-textfield>
              <ha-textfield id="endTimeInput" type="time"></ha-textfield>
            </div>
            <small style="color: var(--secondary-text-color);">${this._t('sleep.form.time_help')}</small>
          </div>

          <div class="form-group">
            <label>${this._t('sleep.form.nap')}</label>
            <ha-select id="napSelect">
              <mwc-list-item value="true">${this._t('sleep.nap.yes')}</mwc-list-item>
              <mwc-list-item value="false">${this._t('sleep.nap.no')}</mwc-list-item>
            </ha-select>
          </div>

          ${this.config.show_notes ? `
          <div class="form-group">
            <label>${this._t('sleep.form.notes')}</label>
            <textarea id="notesInput" placeholder="${this._t('sleep.form.notes_placeholder')}"></textarea>
          </div>` : ''}

          ${this.config.tags.length > 0 ? `
          <div class="form-group">
            <label>${this._t('sleep.form.tags')}</label>
            <div class="tags-container" id="tagsContainer"></div>
          </div>` : ''}
        </div>

        <div slot="primaryAction">
          <ha-button id="submitBtn">${this._t('sleep.form.submit')}</ha-button>
        </div>
        <div slot="secondaryAction">
          <ha-button id="cancelBtn" variant="outlined" dialogAction="close">${this._t('sleep.form.cancel')}</ha-button>
        </div>
      </ha-dialog>
    `;

    // Element references
    this._openBtn = this.shadowRoot.getElementById('openBtn');
    this._dialog = this.shadowRoot.getElementById('dialog');
    this._startTimeInput = this.shadowRoot.getElementById('startTimeInput');
    this._endTimeInput = this.shadowRoot.getElementById('endTimeInput');
    this._napSelect = this.shadowRoot.getElementById('napSelect');
    this._notesInput = this.shadowRoot.getElementById('notesInput');
    this._tagsContainer = this.shadowRoot.getElementById('tagsContainer');
    this._submitBtn = this.shadowRoot.getElementById('submitBtn');
    this._cancelBtn = this.shadowRoot.getElementById('cancelBtn');

    this._setCurrentTimes();
    this._napSelect.value = this.config.default_nap ? 'true' : 'false';

    // Populate tags
    if (this._tagsContainer) {
      this.config.tags.forEach(tag => {
        const button = document.createElement('button');
        button.className = 'tag-toggle';
        button.textContent = tag;
        button.value = tag;
        button.addEventListener('click', () => button.classList.toggle('selected'));
        this._tagsContainer.appendChild(button);
      });
    }

    // Event listeners
    this._openBtn.addEventListener('click', () => {
      this._setCurrentTimes();
      this._dialog.show();
    });

    this._submitBtn.addEventListener('click', () => this._handleSubmit());
    this._cancelBtn.addEventListener('click', () => this._dialog.close());

    this._initialized = true;
  }

  _setCurrentTimes() {
    const now = new Date();
    const durationMs = this.config.default_duration * 60000;
    const startTime = new Date(now.getTime() - durationMs);
    const hours = String(startTime.getHours()).padStart(2, '0');
    const minutes = String(startTime.getMinutes()).padStart(2, '0');
    this._startTimeInput.value = `${hours}:${minutes}`;

    
    const endTime = new Date(now.getTime());
    const endHours = String(endTime.getHours()).padStart(2, '0');
    const endMinutes = String(endTime.getMinutes()).padStart(2, '0');
    this._endTimeInput.value = `${endHours}:${endMinutes}`;
  }

  async _handleSubmit() {
    const startTime = this._startTimeInput.value || '00:00';
    const endTime = this._endTimeInput.value || '00:00';
    const nap = this._napSelect.value === 'true';
    const notes = this._notesInput?.value || '';

    const selectedTags = [];
    if (this._tagsContainer) {
      this._tagsContainer.querySelectorAll('button.tag-toggle.selected').forEach(btn => selectedTags.push(btn.value));
    }

    const actionData = {
      start: `${startTime}:00`,
      end: `${endTime}:00`,
      nap,
      notes,
      tags: selectedTags.length ? selectedTags : undefined
    };

    try {
      const target = {};
      if (this.config.device_id) {
        target.device_id = this.config.device_id;
      } else {
        const devices = await this._hass.callWS({ type: 'config/device_registry/list' });
        const babyDevice = devices.find(d => d.manufacturer === 'babybuddy');
        if (babyDevice) target.device_id = babyDevice.id;
      }

      await this._hass.callService('babybuddy', 'add_sleep', actionData, target);
      this._dialog.close();
      this._showNotification(this._t('sleep.notifications.success'), 'success');
    } catch (error) {
      this._showNotification(this._tReplace('sleep.notifications.error', { error: error.message }), 'error');
    }
  }

  _showNotification(message, type = 'info') {
    if (this._hass?.notification) {
      this._hass.notification.create(message, { type, dismissable: true });
    } else {
      const event = new CustomEvent('hass-notification', { detail: { message, dismissable: true }, composed: true, bubbles: true });
      this.dispatchEvent(event);
    }
  }

  set hass(hass) { this._hass = hass; }
  getCardSize() { return 1; }
  static getConfigForm() {
    const hass = document.querySelector("home-assistant")?.hass;

    // Temporary translation helper
    const t = (path) => BabyBuddyAddSleepCard.prototype._t(path, hass);

    return {
        schema: [
        { name: 'title', selector: { text: { multiline: false } }, default: '' },
        { name: 'button_text', selector: { text: { multiline: false } }, default: '' },
        { 
            name: 'device_id', 
            selector: { 
            device: { integration: 'babybuddy' } 
            }, 
            default: '' 
        },

        { type: 'section', label: t('sleep.sections.defaults') },
        { name: 'default_nap', selector: { boolean: {} }, default: false },
        { 
            name: 'default_duration', 
            selector: { number: { min: 0, max: 240, step: 1 } }, 
            default: 10 
        },

        { type: 'section', label: t('sleep.sections.notes_tags') },
        { name: 'show_notes', selector: { boolean: {} }, default: false },
        { name: 'tags', selector: { text: { multiple: true } }, default: [] }
        ],
        computeLabel: (schema) => t(`sleep.config.${schema.name}`),
        computeHelper: (schema) => t(`sleep.config_helper.${schema.name}`)
    };
    };

}

customElements.define('babybuddy-add-sleep-card', BabyBuddyAddSleepCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'babybuddy-add-sleep-card',
  name: 'BabyBuddy Add Sleep Card',
  description: 'Log sleep with a configurable popup form',
  preview: true
});