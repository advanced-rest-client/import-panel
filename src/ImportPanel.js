/**
@license
Copyright 2018 The Advanced REST client authors <arc@mulesoft.com>
Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
import { LitElement, html } from 'lit-element';
import '@advanced-rest-client/google-drive-browser/google-drive-browser.js';
import { insertDriveFile, drive, shortText, arrowBack } from '@advanced-rest-client/arc-icons/ArcIcons.js';
import '@advanced-rest-client/file-reader/file-reader.js';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';
import '@anypoint-web-components/anypoint-button/anypoint-icon-button.js';
import '@anypoint-web-components/anypoint-input/anypoint-textarea.js';
import '@polymer/paper-toast/paper-toast.js';
import '../import-data-inspector.js';
import styles from './PanelStyles.js';
/**
 * The data import view for ARC.
 *
 * Generates the UI and support logic for importing data from a file, Google Drive,
 * and copy / paste action.
 *
 * It requires the `arc-data-import` element to be present in the DOM to handle
 * `import-data` and `import-normalize` events.
 *
 * ### Example
 *
 * ```
 * <import-panel></import-panel>
 * ```
 *
 * ### Styling
 *
 * `<import-panel>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--import-panel` | Mixin applied to the element | `{}`
 * `--action-button` | MIxin applied to main action buttons | `{}`
 * `--error-toast` | Mixin applied to a toast with error message | `{}`
 * `--warning-primary-color` | Background color of error toast | `#FF7043`
 * `--warning-contrast-color`| Color of error toast | `#fff`
 * `--import-data-inspector` | Mixin applied to the element | `{}`
 * `--action-button` | Mixin applied to the primary acction button | `{}`
 * `--import-data-inspector-meta-color` | Color of the meta data property | `{}`
 * `--import-table` | Mixin applied to a table with data import | `{}`
 * `--import-table-opened` | Mixin applied to a table with data import when opened | `{}`
 * `--import-table-title` | Mixin applied to the title of the import table | `{}`
 * `--import-table-header` | Mixin applied to data table header with selecyion options | `{}`
 * `--import-table-method-label` | Mixin applied to the HTTP method label container | `{}`
 * `--import-table-selection-counter` | Mixin applied to a table selection counter label | `{}`
 * `--import-table-list-item` | Mixin applied to data table's items | `{}`
 *
 * @customElement
 * @demo demo/index.html
 * @memberof UiElements
 */
export class ImportPanel extends LitElement {
  static get styles() {
    return styles;
  }

  static get properties() {
    return {
      // Loadded and normalized import data
      data: { type: Object },
      // Treue when file is being loaded.
      readingFile: { type: Boolean },
      /**
       * Currently selected import page.
       *
       * -   0 is import options selector
       * -   1 is Google Drive file picker
       * -   2 is paste data
       * -   3 is import table preview
       */
      selectedPage: { type: Number },
      // True when file is being imported.
      importing: { type: Boolean },
      // True if user selected Drive import
      withDriveList: { type: Boolean },
      /**
       * Drive API api key value to be passed to the Drive picker.
       */
      apiKey: { type: String },
      // OAuth 2 access token for Drive Panel
      accessToken: { type: String },
      /**
       * A mime type to be passed to Google Drive browser.
       */
      mimeType: { type: String },
      /**
       * Enables compatibility with Anypoint platform
       */
      compatibility: { type: Boolean },
      /**
       * Enables material design outlined theme for inputs.
       */
      outlined: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.selectedPage = 0;
  }

  // Opens the file selector. It must be done in user related action.
  _selectFile() {
    this.shadowRoot.querySelector('input[type="file"]').click();
  }
  /**
   * Handler called when file has been added by the user.
   *
   * @param {Event} e
   */
  _onImportFile(e) {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    this.readingFile = true;
    const node = this.shadowRoot.querySelector('#fileReader');
    node.blob = file;
  }

  _resetFileDrop() {
    this.shadowRoot.querySelector('input[type="file"]').value = null;
  }
  /**
   * Notifies the user about error.
   *
   * @param {String} message Message to display
   */
  _notifyError(message) {
    const node = this.shadowRoot.querySelector('#error');
    node.text = message;
    node.opened = true;
  }
  /**
   * A handler called when the file can't be read.
   *
   * @param {CustomEvent} e
   */
  _importFileError(e) {
    const value = e.detaill && e.detaill.value;
    if (!value) {
      return;
    }
    const message = 'The application was unable to read the file.';
    this.readingFile = false;
    this._notifyError(message);
    this._resetFileDrop();
  }
  // Moves the view to previous screen.
  screenBack() {
    const page = this.selectedPage;
    if (page === 0) {
      return;
    }
    this.selectedPage = 0;
    if (this.withDriveList) {
      this.withDriveList = false;
    }
  }
  // Opend import from Google Drive view
  _importDrive() {
    this.selectedPage = 1;
    this.withDriveList = true;
  }
  // Opens paste from clipboard view
  _pasteData() {
    this.selectedPage = 2;
  }
  // Handler for the `drive-file-picker-data` event with drive file data
  _driveContentReady(e) {
    e.stopPropagation();
    e.preventDefault();
    this._processContent(e.detail.content);
  }
  /**
   * Handler called when the files has been read.
   *
   * @param {CustomEvent} e
   */
  _importFileReady(e) {
    this._resetFileDrop();
    this.readingFile = false;
    this._processContent(e.detail.result);
  }
  // Handles import from text action.
  _importText() {
    const value = this.shadowRoot.querySelector('#manualInput').value;
    if (!value) {
      return;
    }
    return this._processContent(value);
  }
  /**
   * Processes import file content by sending `import-normalize` custom
   * event that should be handled by `arc-data-import` element.
   *
   * When data are normalized it switches to data table view.
   *
   * @param {String} content Read data content
   * @return {Promise} A promise resolved when data were processed.
   */
  async _processContent(content) {
    const e = new CustomEvent('import-normalize', {
      cancelable: true,
      bubbles: true,
      composed: true,
      detail: {
        content
      }
    });
    this.dispatchEvent(e);
    if (!e.detail.result) {
      const err = 'Data importer not in the DOM.';
      this._notifyError(err);
      return;
    }
    try {
      this.data = await e.detail.result;
      this.selectedPage = 3;
    } catch (e) {
      this.data = undefined;
      this._notifyError(e.message);
      this._sendError(e.message);
    }
  }
  /**
   * Sends the `import-data` custom event to the import element to save the data
   * @param {CustomEvent} e
   * @return {Promise}
   */
  async _importData(e) {
    const data = e.detail;
    this.importing = true;
    const ev = new CustomEvent('import-data', {
      cancelable: true,
      bubbles: true,
      composed: true,
      detail: {
        content: data
      }
    });
    this.dispatchEvent(ev);
    if (!ev.detail.result) {
      const err = 'Data importer not in the DOM.';
      this._notifyError(err);
      this._sendError(err);
      return;
    }
    try {
      // const errors = await ev.detail.result;
      await ev.detail.result;
      this.data = undefined;
      this.selectedPage = 0;
      const node = this.shadowRoot.querySelector('#imported');
      node.opened = true;
    } catch (cause) {
      this._notifyError(cause.message);
      this._sendError(cause.message);
    }
    this.importing = false;
  }

  _sendError(message) {
    this.dispatchEvent(new CustomEvent('send-analytics', {
      cancelable: true,
      bubbles: true,
      composed: true,
      detail: {
        type: 'exception',
        description: message,
        fatal: true
      }
    }));
  }

  _readingHandler(e) {
    this.readingFile = e.detail.value;
  }

  _busyTemplate() {
    const { readingFile, importing } = this;
    if (readingFile || importing) {
      return html`<paper-spinner alt="Preparing data"></paper-spinner>`;
    }
  }

  _pageTemplate() {
    const { selectedPage } = this;
    switch (selectedPage) {
      case 0: return this._actionSelectorTemplate();
      case 1: return this._driveTemplate();
      case 2: return this._textInputTemplate();
      case 3: return this._inspectorTemplate();
    }
  }

  _actionSelectorTemplate() {
    const { compatibility } = this;
    return html`
    <section class="import-actions">
      <h2>Import data</h2>
      <div class="content">
        <anypoint-button
          @click="${this._selectFile}"
          emphasis="high"
          data-action="opend-file-picker"
          ?compatibility="${compatibility}"
        >
          Open from file
          <span class="icon">${insertDriveFile}</span>
        </anypoint-button>
        <anypoint-button
          @click="${this._importDrive}"
          emphasis="high"
          data-action="open-drive-picker"
          ?compatibility="${compatibility}"
        >
          Open from Drive
          <span class="icon">${drive}</span>
        </anypoint-button>
        <anypoint-button
          @click="${this._pasteData}"
          emphasis="high"
          data-action="open-text-entry"
          ?compatibility="${compatibility}"
        >
          Paste text data
          <span class="icon">${shortText}</span>
        </anypoint-button>
      </div>
    </section>`;
  }

  _backButtonTemplate(compatibility) {
    return html`
    <anypoint-icon-button
      icon="arc:arrow-back"
      @click="${this.screenBack}"
      ?compatibility="${compatibility}"
      aria-label="Activate to go to the previous screen"
    >
      <span class="icon">${arrowBack}</span>
    </anypoint-icon-button>`;
  }

  _driveTemplate() {
    const {
      compatibility,
      outlined,
      accessToken,
      apiKey,
      mimeType
    } = this;
    return html`<section class="drive-browser">
      <div class="title-action">
        ${this._backButtonTemplate(compatibility)}
        <h2>Import file from Google Drive</h2>
      </div>
      <google-drive-browser
        .accessToken="${accessToken}"
        .apiKey="${apiKey}"
        .mimeType="${mimeType}"
        @drive-file="${this._driveContentReady}"
        ?compatibility="${compatibility}"
        ?outlined="${outlined}"
      ></google-drive-browser>
    </section>`;
  }

  _textInputTemplate() {
    const {
      compatibility,
      outlined
    } = this;
    return html`<section class="text-import">
      <div class="title-action">
        ${this._backButtonTemplate(compatibility)}
        <h2>Paste data</h2>
      </div>
      <div class="content">
        <anypoint-textarea
          id="manualInput"
          ?compatibility="${compatibility}"
          ?outlined="${outlined}"
        >
          <label slot="label">Import data</label>
        </anypoint-textarea>
        <section class="form-actions">
          <anypoint-button
            @click="${this.screenBack}"
            data-action="cancel-text"
            ?compatibility="${compatibility}"
          >Cancel</anypoint-button>
          <anypoint-button
            class="primary-action"
            @click="${this._importText}"
            data-action="import-text"
            ?compatibility="${compatibility}"
          >Next</anypoint-button>
        </section>
      </div>
    </section>`;
  }

  _inspectorTemplate() {
    const {
      compatibility,
      outlined,
      data
    } = this;
    return html`
    <section class="inspector">
      <div class="title-action">
        ${this._backButtonTemplate(compatibility)}
        <h2>Inspect data</h2>
      </div>
      <import-data-inspector
        .data="${data}"
        @cancel="${this.screenBack}"
        @import="${this._importData}"
        ?compatibility="${compatibility}"
        ?outlined="${outlined}"
      ></import-data-inspector>
    </section>`;
  }

  render() {
    return html`
    ${this._busyTemplate()}
    <div class="page-content">
    ${this._pageTemplate()}
    </div>
    <input type="file" @change="${this._onImportFile}" hidden>
    <file-reader
      id="fileReader"
      @loading="${this._readingHandler}"
      readas="text"
      @read="${this._importFileReady}"
      @error="${this._importFileError}"
      auto></file-reader>
    <paper-toast id="error" class="error-toast" duration="7000"></paper-toast>
    <paper-toast id="imported" text="Data are now saved in the data store."></paper-toast>`;
  }
}
