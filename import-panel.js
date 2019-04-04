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
import {PolymerElement} from '../../@polymer/polymer/polymer-element.js';
import '../../@advanced-rest-client/google-drive-browser/google-drive-browser.js';
import '../../@advanced-rest-client/file-reader/file-reader.js';
import '../../@polymer/paper-button/paper-button.js';
import '../../@polymer/iron-pages/iron-pages.js';
import '../../@polymer/iron-icon/iron-icon.js';
import '../../@advanced-rest-client/arc-icons/arc-icons.js';
import '../../@polymer/paper-icon-button/paper-icon-button.js';
import '../../@polymer/iron-flex-layout/iron-flex-layout.js';
import '../../@polymer/paper-styles/shadow.js';
import '../../@polymer/paper-input/paper-textarea.js';
import '../../@polymer/paper-toast/paper-toast.js';
import './import-data-inspector.js';
import {html} from '../../@polymer/polymer/lib/utils/html-tag.js';
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
 * `--import-panel-card` | Mixin applied to a paper card like element | `{}`
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
 * @polymer
 * @demo demo/index.html
 * @memberof UiElements
 */
export class ImportPanel extends PolymerElement {
  static get template() {
    return html`
    <style>
    :host {
      display: block;
      height: inherit;
      @apply --arc-font-body1;
      @apply --import-panel;
      --google-drive-browser-title: {
        font-size: 20px;
      };
    }

    h2 {
      @apply --arc-font-headline;
    }

    input[type="file"] {
      display: none;
    }

    paper-button {
      color: var(--import-panel-action-button, var(--primary-color));
    }

    .primary-action {
      @apply --action-button;
    }

    .import-actions paper-button {
      margin-right: 24px;
      padding-top: 4px;
    }

    paper-button iron-icon {
      margin-left: 12px;
      color: var(--accent-color);
    }

    .title-action {
      @apply --layout-horizontal;
      @apply --layout-center;
    }

    iron-pages,
    iron-pages > * {
      height: inherit;
      min-height: inherit;
      @apply --layout-vertical;
    }

    iron-pages > * {
      @apply --layout-flex;
    }

    .drive-browser {
      @apply --layout-vertical;
    }

    google-drive-browser {
      @apply --layout-flex;
    }

    .text-import {
      padding-bottom: 20px;
      max-height: calc(100% - 64px);
    }

    .error-toast {
      background-color: var(--warning-primary-color, #FF7043);
      color: var(--warning-contrast-color, #fff);
      @apply --error-toast;
    }

    .form-actions {
      @apply --layout-flex;
      @apply --layout-end-justified;
      @apply --layout-horizontal;
    }
    </style>
    <template is="dom-if" if="[[_computeLoader(readingFile, importing)]]">
      <paper-spinner alt="Preparing data"></paper-spinner>
    </template>

    <iron-pages selected="[[selectedPage]]">
      <section class="import-actions">
        <h2>Import data</h2>
        <div class="content">
          <paper-button on-click="_selectFile" raised="" data-action="opend-file-picker">
            Open from file
            <iron-icon icon="arc:insert-drive-file"></iron-icon>
          </paper-button>
          <paper-button on-click="_importDrive" raised="" data-action="open-drive-picker">
            Open from Drive
            <iron-icon icon="arc:drive"></iron-icon>
          </paper-button>
          <paper-button on-click="_pasteData" raised="" data-action="open-text-entry">
            Paste text data
            <iron-icon icon="arc:short-text"></iron-icon>
          </paper-button>
        </div>
      </section>
      <section class="drive-browser">
        <div class="title-action">
          <paper-icon-button icon="arc:arrow-back" on-click="screenBack"></paper-icon-button>
          <h2>Import file from Google Drive</h2>
        </div>
        <google-drive-browser access-token="[[accessToken]]" api-key="[[apiKey]]" mime-type="[[mimeType]]" on-drive-file-picker-data="_driveContentReady"></google-drive-browser>
      </section>
      <section class="text-import">
        <div class="title-action">
          <paper-icon-button icon="arc:arrow-back" on-click="screenBack"></paper-icon-button>
          <h2>Paste data</h2>
        </div>
        <div class="content">
          <paper-textarea label="Import data" id="manualInput"></paper-textarea>
          <section class="form-actions">
            <paper-button on-click="screenBack" data-action="cancel-text">Cancel</paper-button>
            <paper-button class="primary-action" on-click="_importText" data-action="import-text">Next</paper-button>
          </section>
        </div>
      </section>
      <section>
        <div class="title-action">
          <paper-icon-button icon="arc:arrow-back" on-click="screenBack"></paper-icon-button>
          <h2>Inspect data</h2>
        </div>
        <import-data-inspector data="[[data]]" on-cancel="screenBack" on-import="_importData"></import-data-inspector>
      </section>
    </iron-pages>
    <input type="file" on-change="_onImportFile" hidden="">
    <file-reader id="fileReader" loading="{{readingFile}}" readas="text" on-file-read="_importFileReady" on-file-error="_importFileError" auto=""></file-reader>
    <paper-toast id="error" class="error-toast" duration="7000"></paper-toast>
    <paper-toast id="imported" text="Data are now saved in the data store."></paper-toast>
`;
  }

  static get is() {return 'import-panel';}
  static get properties() {
    return {
      // Loadded and normalized import data
      data: {
        type: Object,
        notify: true
      },
      // Computed value, true if import data are present.
      hasData: {
        type: Boolean,
        computed: '_computeHasData(data)'
      },
      // Treue when file is being loaded.
      readingFile: Boolean,
      /**
       * Currently selected import page.
       *
       * -   0 is import options selector
       * -   1 is Google Drive file picker
       * -   2 is paste data
       * -   3 is import table preview
       */
      selectedPage: {
        type: Number,
        value: 0,
        notify: true
      },
      // True when file is being imported.
      importing: {
        type: Boolean,
        value: false,
        readOnly: true
      },
      // True if user selected Drive import
      withDriveList: Boolean,
      /**
       * Drive API api key value to be passed to the Drive picker.
       */
      apiKey: String,
      // OAuth 2 access token for Drive Panel
      accessToken: String,
      /**
       * A mime type to be passed to Google Drive browser.
       */
      mimeType: String
    };
  }
  _computeLoader(readingFile, importing) {
    return !!(readingFile || importing);
  }
  // Computes if data preview table should be hidden.
  _computeTable(hasData, importing) {
    return !!(hasData && !importing);
  }
  _computeFileSelector(hasData, withDriveList) {
    return !hasData && !withDriveList;
  }
  _computeHasData(data) {
    return !!data;
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
    this.$.fileReader.blob = file;
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
    this.$.error.text = message;
    this.$.error.opened = true;
  }
  /**
   * A handler called when the file can't be read.
   *
   * @param {CustomEvent} e
   */
  _importFileError(e) {
    const message = e.message || e.detail.message;
    this.readingFile = false;
    this._notifyError('The application was unable to read the file. ' + message);
    console.error(e);
    this._resetFileDrop();
    this._sendError(message);
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
  _processContent(content) {
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
      return Promise.reject(new Error(err));
    }

    return e.detail.result
    .then((result) => {
      this.data = result;
      this.selectedPage = 3;
    })
    .catch((cause) => {
      this.data = undefined;
      this._notifyError(cause.message);
      console.error(cause);
      this._sendError(cause.message);
      throw cause;
    });
  }
  /**
   * Sends the `import-data` custom event to the import element to save the data
   * @param {CustomEvent} e
   * @return {Promise}
   */
  _importData(e) {
    const data = e.detail;
    this._setImporting(true);
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
      throw new Error(err);
    }

    // Returns value for tests.
    return ev.detail.result
    .then((errors) => {
      this.data = undefined;
      this.selectedPage = 0;
      this.$.imported.opened = true;
      this._setImporting(false);
      if (errors) {
        console.error(errors);
      }
    })
    .catch((cause) => {
      this._notifyError(cause.message);
      console.error(cause);
      this._setImporting(false);
      this._sendError(cause.message);
      throw cause;
    });
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
}
window.customElements.define(ImportPanel.is, ImportPanel);