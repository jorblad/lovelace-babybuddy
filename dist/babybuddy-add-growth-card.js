class BabyBuddyAddGrowthCard extends HTMLElement {
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
      default_type: String(config.default_type || 'weight'),
      show_notes: !!config.show_notes,
      tags: Array.isArray(config.tags) ? config.tags.map(t => String(t)) : [],
    };
  }

  connectedCallback() {
    if (this._initialized) return;
    this.attachShadow({ mode: 'open' });

    const cardTitle = this.config.title || this._t('growth.card.title');
    const buttonText = this.config.button_text || this._t('growth.card.button_text');

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        ha-card { padding: 0; }
        .card-content { padding: 16px; display: flex; justify-content: center; }
        ha-button { width: 100%; min-width: 100px; position: relative; }
        ha-button.loading { pointer-events: none; color: transparent; }
        ha-button.loading::after { content: ''; position: absolute; left: 50%; right: auto; top: 50%; transform: translate(-50%, -50%); width: 16px; height: 16px; border: 2px solid var(--primary-text-color); border-top-color: transparent; border-radius: 50%; }
        ha-dialog { --mdc-dialog-max-width: 500px; }
        .dialog-content { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-weight: 500; }
        .tags-container { display: flex; flex-wrap: wrap; gap: 8px; }
        .tag-toggle {
          padding: 10px 16px;
          border: 2px solid var(--divider-color);
          border-radius: 20px;
          background: transparent;
          cursor: pointer;
        }
        .tag-toggle.selected {
          background-color: var(--primary-color);
          color: var(--text-primary-color);
          border-color: var(--primary-color);
        }
        textarea {
          min-height: 80px;
          padding: 8px;
          border-radius: 4px;
          border: 1px solid var(--divider-color);
          background: var(--card-background-color);
          color: var(--primary-text-color);
        }
        ha-button.pressed { transform: translateY(1px); opacity: 0.9; }
      </style>

        <ha-card>
        <div class="card-content">
          <ha-button id="openBtn">${buttonText}</ha-button>
        </div>
      </ha-card>

      <ha-dialog id="dialog" heading="${cardTitle}">
        <div class="dialog-content">
          <div class="form-group">
            <label>${this._t('growth.form.type')}</label>
            <ha-select id="typeSelect">
              <mwc-list-item value="weight">${this._t('growth.types.weight')}</mwc-list-item>
              <mwc-list-item value="height">${this._t('growth.types.height')}</mwc-list-item>
              <mwc-list-item value="head">${this._t('growth.types.head')}</mwc-list-item>
            </ha-select>
          </div>

          <div class="form-group">
            <label id="valueLabel"></label>
            <ha-textfield id="valueInput" type="number"></ha-textfield>
          </div>

          <div class="form-group">
            <label>${this._t('growth.form.date')}</label>
            <ha-textfield id="dateInput" type="date"></ha-textfield>
          </div>

          ${this.config.show_notes ? `
          <div class="form-group">
            <label>${this._t('growth.form.notes')}</label>
            <textarea id="notesInput"></textarea>
          </div>` : ''}

          ${this.config.tags.length ? `
          <div class="form-group">
            <label>${this._t('growth.form.tags')}</label>
            <div class="tags-container" id="tagsContainer"></div>
          </div>` : ''}
        </div>

        <div slot="primaryAction">
          <ha-button id="submitBtn">${this._t('growth.form.submit')}</ha-button>
        </div>
        <div slot="secondaryAction">
          <ha-button variant="outlined" dialogAction="close">${this._t('growth.form.cancel')}</ha-button>
        </div>
      </ha-dialog>
    `;

    this._openBtn = this.shadowRoot.getElementById('openBtn');
    this._dialog = this.shadowRoot.getElementById('dialog');
    this._typeSelect = this.shadowRoot.getElementById('typeSelect');
    this._valueInput = this.shadowRoot.getElementById('valueInput');
    this._valueLabel = this.shadowRoot.getElementById('valueLabel');
    this._dateInput = this.shadowRoot.getElementById('dateInput');
    this._notesInput = this.shadowRoot.getElementById('notesInput');
    this._tagsContainer = this.shadowRoot.getElementById('tagsContainer');
    this._submitBtn = this.shadowRoot.getElementById('submitBtn');

    this._typeSelect.value = this.config.default_type;
    this._updateValueLabel();

    this._typeSelect.addEventListener('selected', () => this._updateValueLabel());
    this._openBtn.addEventListener('click', () => {
      this._openBtn.classList.add('pressed');
      setTimeout(() => this._openBtn.classList.remove('pressed'), 150);
      this._dateInput.value = new Date().toISOString().split('T')[0];
      // reset submit button state when dialog opens
      if (this._submitBtn) {
        this._submitBtn.classList.remove('loading', 'success');
        this._submitBtn.disabled = false;
        this._submitBtn.textContent = this._originalSubmitText || this._t('growth.form.submit');
      }
      this._dialog.show();
    });
    this._submitBtn.addEventListener('click', () => this._handleSubmit());

    if (this._tagsContainer) {
      this.config.tags.forEach(tag => {
        const btn = document.createElement('button');
        btn.className = 'tag-toggle';
        btn.textContent = tag;
        btn.value = tag;
        btn.onclick = () => btn.classList.toggle('selected');
        this._tagsContainer.appendChild(btn);
      });
    }

    this._initialized = true;
  }

  _updateValueLabel() {
    const type = this._typeSelect.value;
    this._valueLabel.textContent = this._t(`growth.form.value_${type}`);
  }

  async _handleSubmit() {
    // prevent double submissions
    if (this._submitBtn && this._submitBtn.disabled) return;

    // show immediate feedback and lock submit
    if (this._submitBtn) {
      this._submitBtn.disabled = true;
      this._originalSubmitText = this._submitBtn.textContent;
      this._submitBtn.textContent = this._t('growth.form.submitting') || 'Submitting...';
      this._submitBtn.classList.add('loading');
      this._submitBtn.classList.remove('success');
    }

    const type = this._typeSelect.value;
    const value = Number(this._valueInput.value);
    const date = this._dateInput.value;
    const notes = this._notesInput?.value || '';

    const tags = this._tagsContainer
      ? [...this._tagsContainer.querySelectorAll('.selected')].map(b => b.value)
      : [];

    const serviceMap = {
      weight: { service: 'add_weight', key: 'weight' },
      height: { service: 'add_height', key: 'height' },
      head: { service: 'add_head_circumference', key: 'head_circumference' }
    };

    const svc = serviceMap[type];
    const data = {
      [svc.key]: value,
      date,
      notes,
      tags: tags.length ? tags : undefined
    };

    try {
      const target = this.config.device_id ? { device_id: this.config.device_id } : {};
      await this._hass.callService('babybuddy', svc.service, data, target);
      if (this._submitBtn) {
        this._submitBtn.classList.remove('loading');
        this._submitBtn.classList.add('success');
      }
      this._showNotification(this._t('growth.notifications.success'), 'success');
      await new Promise(r => setTimeout(r, 350));
      this._dialog.close();
    } catch (err) {
      if (this._submitBtn) {
        this._submitBtn.classList.remove('loading');
        this._submitBtn.disabled = false;
        this._submitBtn.textContent = this._originalSubmitText || this._t('growth.form.submit');
      }
      this._showNotification(this._tReplace('growth.notifications.error', { error: err.message }), 'error');
    }
  }

  _showNotification(message, type = 'info') {
    if (this._hass?.notification) {
      this._hass.notification.create(message, { type, dismissable: true });
    } else {
      this.dispatchEvent(new CustomEvent('hass-notification', {
        detail: { message, dismissable: true },
        bubbles: true,
        composed: true
      }));
    }
  }

  set hass(hass) { this._hass = hass; }
  getCardSize() { return 1; }

  static getConfigForm() {
    const hass = document.querySelector("home-assistant")?.hass;
    const t = (p) => BabyBuddyAddGrowthCard.prototype._t(p, hass);

    return {
      schema: [
        { name: 'title', selector: { text: {} } },
        { name: 'button_text', selector: { text: {} } },
        { name: 'device_id', selector: { device: { integration: 'babybuddy' } } },
        { name: 'default_type', selector: { select: {
          options: [
            { value: 'weight', label: t('growth.types.weight') },
            { value: 'height', label: t('growth.types.height') },
            { value: 'head', label: t('growth.types.head') }
          ]
        }}},
        { name: 'show_notes', selector: { boolean: {} } },
        { name: 'tags', selector: { text: { multiple: true } } }
      ],
      computeLabel: (s) => t(`growth.config.${s.name}`),
      computeHelper: (s) => t(`growth.config_helper.${s.name}`)
    };
  }
}

customElements.define('babybuddy-add-growth-card', BabyBuddyAddGrowthCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'babybuddy-add-growth-card',
  name: 'BabyBuddy Add Growth Card',
  description: 'Log weight, height or head circumference',
  preview: true
});
