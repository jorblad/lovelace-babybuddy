class BabyBuddyAddNoteCard extends HTMLElement {
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
    let value = translations[lang];
    for (const key of path.split('.')) {
      value = value?.[key];
      if (!value) break;
    }
    return value || path;
  }

  _tReplace(path, replacements = {}) {
    let text = this._t(path);
    for (const [k, v] of Object.entries(replacements)) {
      text = text.replace(`{${k}}`, v);
    }
    return text;
  }

  setConfig(config = {}) {
    this.config = {
      title: String(config.title || ''),
      button_text: String(config.button_text || ''),
      device_id: String(config.device_id || ''),
      show_time: config.show_time ?? true,
      tags: Array.isArray(config.tags) ? config.tags.map(String) : []
    };
  }

  connectedCallback() {
    if (this._initialized) return;
    this.attachShadow({ mode: 'open' });

    const cardTitle = this.config.title || this._t('note.card.title');
    const buttonText = this.config.button_text || this._t('note.card.button_text');

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
        textarea {
          padding: 8px;
          border: 1px solid var(--divider-color);
          border-radius: 4px;
          min-height: 100px;
          font-family: inherit;
          background: var(--card-background-color);
          color: var(--primary-text-color);
        }
        .tags-container { display: flex; flex-wrap: wrap; gap: 8px; }
        .tag-toggle {
          padding: 10px 16px;
          border: 2px solid var(--divider-color);
          border-radius: 20px;
          background: transparent;
          cursor: pointer;
        }
        .tag-toggle.selected {
          background: var(--primary-color);
          color: var(--text-primary-color);
          border-color: var(--primary-color);
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
          ${this.config.show_time ? `
          <div class="form-group">
            <label>${this._t('note.form.time')}</label>
            <ha-textfield id="timeInput" type="time"></ha-textfield>
          </div>` : ''}

          <div class="form-group">
            <label>${this._t('note.form.note')}</label>
            <textarea id="noteInput"
              placeholder="${this._t('note.form.note_placeholder')}"></textarea>
          </div>

          ${this.config.tags.length ? `
          <div class="form-group">
            <label>${this._t('note.form.tags')}</label>
            <div class="tags-container" id="tagsContainer"></div>
          </div>` : ''}
        </div>

        <div slot="primaryAction">
          <ha-button id="submitBtn">${this._t('note.form.submit')}</ha-button>
        </div>
        <div slot="secondaryAction">
          <ha-button dialogAction="close" variant="outlined">
            ${this._t('note.form.cancel')}
          </ha-button>
        </div>
      </ha-dialog>
    `;

    this._openBtn = this.shadowRoot.getElementById('openBtn');
    this._dialog = this.shadowRoot.getElementById('dialog');
    this._noteInput = this.shadowRoot.getElementById('noteInput');
    this._timeInput = this.shadowRoot.getElementById('timeInput');
    this._tagsContainer = this.shadowRoot.getElementById('tagsContainer');
    this._submitBtn = this.shadowRoot.getElementById('submitBtn');

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

    this._openBtn.onclick = () => {
      // small visual feedback for the open button
      this._openBtn.classList.add('pressed');
      setTimeout(() => this._openBtn.classList.remove('pressed'), 150);
      if (this._timeInput) {
        const now = new Date();
        this._timeInput.value =
          `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      }
      // ensure submit button is enabled when dialog is opened
      if (this._submitBtn) {
        this._submitBtn.classList.remove('loading', 'success');
        this._submitBtn.disabled = false;
        this._submitBtn.textContent = this._originalSubmitText || this._t('note.form.submit');
      }
      this._dialog.show();
    };

    this._submitBtn.onclick = () => this._handleSubmit();
    this._initialized = true;
  }

  async _handleSubmit() {
    // prevent double submissions
    if (this._submitBtn && this._submitBtn.disabled) return;

    if (this._submitBtn) {
      this._submitBtn.disabled = true;
      this._originalSubmitText = this._submitBtn.textContent;
      this._submitBtn.textContent = this._t('note.form.submitting') || 'Submitting...';
      this._submitBtn.classList.add('loading');
      this._submitBtn.classList.remove('success');
    }

    try {
      const tags = [...(this._tagsContainer?.querySelectorAll('.selected') || [])]
        .map(b => b.value);

      const data = {
        note: this._noteInput.value,
        time: this._timeInput?.value,
        tags: tags.length ? tags : undefined
      };

      const target = {};
      if (this.config.device_id) target.device_id = this.config.device_id;

      await this._hass.callService('babybuddy', 'add_note', data, target);
      if (this._submitBtn) {
        this._submitBtn.classList.remove('loading');
        this._submitBtn.classList.add('success');
      }
      this._showNotification(this._t('note.notifications.success'), 'success');
      await new Promise(r => setTimeout(r, 350));
      this._dialog.close();
    } catch (err) {
      if (this._submitBtn) {
        this._submitBtn.classList.remove('loading');
        this._submitBtn.disabled = false;
        this._submitBtn.textContent = this._originalSubmitText || this._t('note.form.submit');
      }
      this._showNotification(
        this._tReplace('note.notifications.error', { error: err.message }),
        'error'
      );
    }
  }

  _showNotification(message, type) {
    this._hass?.notification?.create(message, { type, dismissable: true });
  }

  set hass(hass) { this._hass = hass; }
  getCardSize() { return 1; }

  static getConfigForm() {
    const hass = document.querySelector('home-assistant')?.hass;
    const t = p => BabyBuddyAddNoteCard.prototype._t(p, hass);

    return {
      schema: [
        { name: 'title', selector: { text: {} } },
        { name: 'button_text', selector: { text: {} } },
        { name: 'device_id', selector: { device: { integration: 'babybuddy' } } },
        { type: 'section', label: t('note.sections.options') },
        { name: 'show_time', selector: { boolean: {} } },
        { name: 'tags', selector: { text: { multiple: true } } }
      ],
      computeLabel: s => t(`note.config.${s.name}`),
      computeHelper: s => t(`note.config_helper.${s.name}`)
    };
  }
}

customElements.define('babybuddy-add-note-card', BabyBuddyAddNoteCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'babybuddy-add-note-card',
  name: 'BabyBuddy Add Note Card',
  description: 'Add a BabyBuddy note with optional time and tags',
  preview: true
});
