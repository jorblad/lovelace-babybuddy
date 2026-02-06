class BabyBuddyAddFeedingCard extends HTMLElement {
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
      default_type: String(config.default_type || 'Breast milk'),
      default_method: String(config.default_method || 'Bottle'),
      default_amount: Number(config.default_amount || 1),
      default_duration: Number(config.default_duration ?? 10),
      tags: Array.isArray(config.tags) ? config.tags.map(t => String(t)) : [],
      show_notes: !!config.show_notes,
      show_amount: !!config.show_amount
    };
  }

  connectedCallback() {
    if (this._initialized) return;

    this.attachShadow({ mode: 'open' });
    
    // Get translated strings
    const cardTitle = this.config.title || this._t('feeding.card.title');
    const buttonText = this.config.button_text || this._t('feeding.card.button_text');

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
          min-width: 100px;
          position: relative;
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
        ha-button.loading { pointer-events: none; color: transparent; }
        ha-button.loading::after { content: ''; position: absolute; left: 50%; right: auto; top: 50%; transform: translate(-50%, -50%); width: 16px; height: 16px; border: 2px solid var(--primary-text-color); border-top-color: transparent; border-radius: 50%; }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .time-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
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
        ha-button.pressed {
          transform: translateY(1px);
          opacity: 0.9;
        }
      </style>

      <ha-card>
        <div class="card-content">
          <ha-button raised id="openBtn">${buttonText}</ha-button>
        </div>
      </ha-card>

      <ha-dialog id="dialog" heading="${cardTitle}" scrimClickAction="close" escapeKeyAction="close">
        <div class="dialog-content">
          <div class="form-group">
            <label>${this._t('feeding.form.start_time')}</label>
            <div class="time-group">
              <ha-textfield id="startTimeInput" type="time"></ha-textfield>
              <ha-textfield id="endTimeInput" type="time"></ha-textfield>
            </div>
            <small style="color: var(--secondary-text-color);">${this._t('feeding.form.time_help')}</small>
          </div>

          <div class="form-group">
            <label>${this._t('feeding.form.type')}</label>
            <ha-select id="typeSelect">
              <mwc-list-item value="Breast milk">${this._t('feeding.types.breast_milk')}</mwc-list-item>
              <mwc-list-item value="Formula">${this._t('feeding.types.formula')}</mwc-list-item>
              <mwc-list-item value="Fortified breast milk">${this._t('feeding.types.fortified_breast_milk')}</mwc-list-item>
              <mwc-list-item value="Solid food">${this._t('feeding.types.solid_food')}</mwc-list-item>
            </ha-select>
          </div>

          <div class="form-group">
            <label>${this._t('feeding.form.method')}</label>
            <ha-select id="methodSelect">
              <mwc-list-item value="Bottle">${this._t('feeding.methods.bottle')}</mwc-list-item>
              <mwc-list-item value="Left breast">${this._t('feeding.methods.left_breast')}</mwc-list-item>
              <mwc-list-item value="Right breast">${this._t('feeding.methods.right_breast')}</mwc-list-item>
              <mwc-list-item value="Both breasts">${this._t('feeding.methods.both_breasts')}</mwc-list-item>
              <mwc-list-item value="Parent fed">${this._t('feeding.methods.parent_fed')}</mwc-list-item>
              <mwc-list-item value="Self fed">${this._t('feeding.methods.self_fed')}</mwc-list-item>
            </ha-select>
          </div>

          ${this.config.show_amount ? `
          <div class="form-group">
            <label>${this._t('feeding.form.amount')}</label>
            <ha-textfield id="amountInput" type="number" value="${this.config.default_amount}" min="0" step="0.1"></ha-textfield>
          </div>
          ` : ''}

          ${this.config.show_notes ? `
          <div class="form-group">
            <label>${this._t('feeding.form.notes')}</label>
            <textarea id="notesInput" placeholder="Add any notes..."></textarea>
          </div>
          ` : ''}

          ${this.config.tags.length > 0 ? `
          <div class="form-group">
            <label>${this._t('feeding.form.tags')}</label>
            <div class="tags-container" id="tagsContainer"></div>
          </div>
          ` : ''}
        </div>

        <div slot="primaryAction">
          <ha-button id="submitBtn">${this._t('feeding.form.submit')}</ha-button>
        </div>
        <div slot="secondaryAction">
          <ha-button id="cancelBtn" variant="outlined" dialogAction="close">${this._t('feeding.form.cancel')}</ha-button>
        </div>
      </ha-dialog>
    `;

    this._openBtn = this.shadowRoot.getElementById('openBtn');
    this._dialog = this.shadowRoot.getElementById('dialog');
    this._startTimeInput = this.shadowRoot.getElementById('startTimeInput');
    this._endTimeInput = this.shadowRoot.getElementById('endTimeInput');
    this._typeSelect = this.shadowRoot.getElementById('typeSelect');
    this._methodSelect = this.shadowRoot.getElementById('methodSelect');
    this._amountInput = this.shadowRoot.getElementById('amountInput');
    this._notesInput = this.shadowRoot.getElementById('notesInput');
    this._tagsContainer = this.shadowRoot.getElementById('tagsContainer');
    this._submitBtn = this.shadowRoot.getElementById('submitBtn');
    this._cancelBtn = this.shadowRoot.getElementById('cancelBtn');

    // Set initial times to now
    this._setCurrentTimes();

    // Set default values
    this._typeSelect.value = this.config.default_type;
    this._methodSelect.value = this.config.default_method;

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
      // small visual feedback for the open button
      this._openBtn.classList.add('pressed');
      setTimeout(() => this._openBtn.classList.remove('pressed'), 150);
      this._setCurrentTimes();
      // reset submit button state when dialog opens
      if (this._submitBtn) {
        this._submitBtn.classList.remove('loading', 'success');
        this._submitBtn.disabled = false;
        this._submitBtn.textContent = this._originalSubmitText || this._t('feeding.form.submit');
      }
      // close any other open dialogs to avoid stray backdrops
      document.querySelectorAll('ha-dialog[open]').forEach(d => { try { if (d !== this._dialog) d.close(); } catch (e) {} });
      this._dialog.show();
    });

    this._submitBtn.addEventListener('click', () => this._handleSubmit());
    this._cancelBtn.addEventListener('click', () => this._closeDialog());

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
    // prevent double submissions
    if (this._submitBtn && this._submitBtn.disabled) return;

    // show immediate feedback and lock the submit button
    if (this._submitBtn) {
      this._submitBtn.disabled = true;
      this._originalSubmitText = this._submitBtn.textContent;
      this._submitBtn.textContent = this._t('feeding.form.submitting') || 'Submitting...';
      this._submitBtn.classList.add('loading');
      this._submitBtn.classList.remove('success');
    }

    const startTime = this._startTimeInput.value;
    const endTime = this._endTimeInput.value;
    const type = this._typeSelect.value;
    const method = this._methodSelect.value;
    const amount = this._amountInput ? Number(this._amountInput.value) : 0;
    const notes = this._notesInput ? this._notesInput.value : '';

    // Get selected tags
    const selectedTags = [];
    if (this._tagsContainer) {
      this._tagsContainer.querySelectorAll('button.tag-toggle.selected').forEach(button => {
        selectedTags.push(button.value);
      });
    }

    // Format times to HH:MM:SS
    const startStr = startTime ? `${startTime}:00` : '00:00:00';
    const endStr = endTime ? `${endTime}:00` : '00:00:00';

    // Build action data
    const actionData = {
      start: startStr,
      end: endStr,
      type: type,
      method: method
    };

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
      await this._hass.callService('babybuddy', 'add_feeding', actionData, target);
      if (this._submitBtn) {
        this._submitBtn.classList.remove('loading');
        this._submitBtn.classList.add('success');
      }
      this._showNotification(this._t('feeding.notifications.success'), 'success');
      await new Promise(r => setTimeout(r, 350));
      this._closeDialog();
    } catch (error) {
      // re-enable submit button on error so user can retry
      if (this._submitBtn) {
        this._submitBtn.classList.remove('loading');
        this._submitBtn.disabled = false;
        this._submitBtn.textContent = this._originalSubmitText || this._t('feeding.form.submit');
      }
      this._showNotification(this._tReplace('feeding.notifications.error', { error: error.message }), 'error');
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

  _closeDialog() {
    try {
      if (this._dialog && typeof this._dialog.close === 'function') {
        this._dialog.close();
        return;
      }
    } catch (e) {}
    try {
      if (this._dialog) {
        this._dialog.open = false;
        if (this._dialog.removeAttribute) this._dialog.removeAttribute('open');
      }
    } catch (e) {}
  }

  set hass(hass) {
    this._hass = hass;
  }

  getCardSize() {
    return 1;
  }

  static getConfigForm() {
    const hass =
      document.querySelector("home-assistant")?.hass;

    // Create a temporary instance just for translations
    const t = (path) =>
      BabyBuddyAddFeedingCard.prototype._t(path, hass);

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
        
        { type: 'section' },
        { 
          name: 'default_type', 
          selector: { 
            select: { 
              options: [
                { value: 'Breast milk', label: t('feeding.types.breast_milk') },
                { value: 'Formula', label: t('feeding.types.formula') },
                { value: 'Fortified breast milk', label: t('feeding.types.fortified_breast_milk') },
                { value: 'Solid food', label: t('feeding.types.solid_food') }
              ]
            } 
          }, 
          default: 'Breast milk' 
        },
        { 
          name: 'default_method', 
          selector: { 
            select: { 
              options: [
                { value: 'Bottle', label: t('feeding.methods.bottle') },
                { value: 'Left breast', label: t('feeding.methods.left_breast') },
                { value: 'Right breast', label: t('feeding.methods.right_breast') },
                { value: 'Both breasts', label: t('feeding.methods.both_breasts') },
                { value: 'Parent fed', label: t('feeding.methods.parent_fed') },
                { value: 'Self fed', label: t('feeding.methods.self_fed') }
              ]
            } 
          }, 
          default: 'Bottle' 
        },
        { 
          name: 'default_duration', 
          selector: { 
            number: { min: 0, max: 120, step: 1 } 
          }, 
          default: 10 
        },

        { type: 'section' },
        { name: 'show_amount', selector: { boolean: {} }, default: false },
        { name: 'default_amount', selector: { number: { min: 0, step: 0.1 } }, default: 1 },
        { name: 'show_notes', selector: { boolean: {} }, default: false },

        { type: 'section', label: t('feeding.sections.tags') },
        { name: 'tags', selector: { text: { multiple: true } }, default: [] }
      ],
      computeLabel: (schema) =>
        t(`feeding.config.${schema.name}`),

      computeHelper: (schema) =>
        t(`feeding.config_helper.${schema.name}`)
    };
  }
}

customElements.define('babybuddy-add-feeding-card', BabyBuddyAddFeedingCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'babybuddy-add-feeding-card',
  name: 'BabyBuddy Add Feeding Card',
  description: 'Log feedings with a configurable popup form',
  preview: true
});

BabyBuddyAddFeedingCard.getStubConfig = () => ({
  button_text: 'Log Feeding',
  default_type: 'Breast milk',
  default_method: 'Bottle',
  show_amount: true,
  default_amount: 1,
  tags: ['Left side', 'Right side']
});
