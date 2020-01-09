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
import '@advanced-rest-client/date-time/date-time.js';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';
import '../import-requests-table.js';
import '../import-history-table.js';
import '../import-variables-table.js';
import '../import-headers-sets-table.js';
import '../import-cookies-table.js';
import '../import-auth-data-table.js';
import '../import-url-history-table.js';
import '../import-websocket-url-history-table.js';
import '../import-cc-table.js';
import styles from './InspectorStyles.js';
/**
 * An element to display tables of import data.
 *
 * It accept normalized ARC import object received from `arc-data-import`
 * element.
 *
 * ### Example
 *
 * ```html
 * <import-data-inspector
 *  data="[[arcImport]]"
 *  on-cancel="cancel"
 *  on-import="importData"></import-data-inspector>
 * ```
 *
 * ### Styling
 * `<import-panel>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
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
export class ImportDataInspector extends LitElement {
  static get styles() {
    return styles;
  }

  static get properties() {
    return {
      // Imported data.
      data: { type: Object },
      /**
       * Enables compatibility with Anypoint platform
       */
      compatibility: { type: Boolean }
    };
  }

  // Handles the cancel action.
  _cancel() {
    this.dispatchEvent(new CustomEvent('cancel', {
      composed: true
    }));
  }

  // Handles "import" action.
  _import() {
    const data = this.collectData();
    this.dispatchEvent(new CustomEvent('import', {
      composed: true,
      detail: data
    }));
  }

  /**
   * Collects information about selected data in the data table.
   *
   * @param {String} name Data table element name to check data for.
   * @return {Array|undefined} List of items or undefined if the table is
   * not in the DOM, the table is hidden or selection is empty.
   */
  _getTableData(name) {
    const table = this.shadowRoot.querySelector(name);
    if (!table) {
      return;
    }
    const selected = table.selectedItems;
    if (!selected || !selected.length) {
      return;
    }
    return selected;
  }
  /**
   * Collects import data from the tables.
   * Only selected items are in the final object.
   *
   * @return {Object} ARC import object with updated arrays.
   * Note, the object is a shallow copy of the original data object.
   */
  collectData() {
    const result = Object.assign({}, this.data);
    result.requests = this._getTableData('import-requests-table');
    if (!result.requests && result.projects) {
      delete result.projects;
    }
    result.history = this._getTableData('import-history-table');
    result.variables = this._getTableData('import-variables-table');
    result.cookies = this._getTableData('import-cookies-table');
    result['headers-sets'] = this._getTableData('import-headers-sets-table');
    result['auth-data'] = this._getTableData('import-auth-data-table');
    result['url-history'] = this._getTableData('import-url-history-table');
    result['websocket-url-history'] = this._getTableData('import-websocket-url-history-table');
    result['client-certificates'] = this._getTableData('import-cc-table');
    return result;
  }

  render() {
    const { compatibility } = this;
    const data = this.data || {};
    return html`
    ${this._createdTemplate(data)}
    ${this._requestsTableTemplate(data, compatibility)}
    ${this._historyTableTemplate(data, compatibility)}
    ${this._variablesTableTemplate(data, compatibility)}
    ${this._headersSetsTableTemplate(data, compatibility)}
    ${this._cookiesTableTemplate(data, compatibility)}
    ${this._authDataTableTemplate(data, compatibility)}
    ${this._urlsTableTemplate(data, compatibility)}
    ${this._socketUrlsTableTemplate(data, compatibility)}
    ${this._ccTableTemplate(data, compatibility)}

    <section class="form-actions">
      <anypoint-button
        @click="${this._cancel}"
        data-action="cancel-import"
        @compatibility="${compatibility}"
      >Cancel</anypoint-button>
      <anypoint-button
        class="primary-action"
        @click="${this._import}"
        data-action="import-data"
        emphasis="high"
      >Import data</anypoint-button>
    </section>`;
  }

  _createdTemplate(data) {
    if (isNaN(data.createdAt)) {
      return '';
    }
    return html`<p class="meta">Exported at:
      <date-time
        year="numeric"
        month="long"
        day="numeric"
        hour="2-digit"
        minute="2-digit"
        second="2-digit"
        .date="${data.createdAt}"
      ></date-time>
      ${data.version ? html` from ARC version: ${data.version}` : ''}
    </p>`;
  }

  _requestsTableTemplate(data, compatibility) {
    if (!data.requests || !data.requests.length) {
      return '';
    }
    return html`
    <import-requests-table
      tableTitle="Requests"
      .data="${data.requests}"
      .projects="${data.projects}"
      ?compatibility="${compatibility}"
    ></import-requests-table>`;
  }

  _historyTableTemplate(data, compatibility) {
    if (!data.history || !data.history.length) {
      return '';
    }
    return html`
    <import-history-table
      tabletitle="History"
      .data="${data.history}"
      ?compatibility="${compatibility}"
    ></import-history-table>`;
  }

  _variablesTableTemplate(data, compatibility) {
    if (!data.variables || !data.variables.length) {
      return '';
    }
    return html`
    <import-variables-table
      tabletitle="Variables"
      .data="${data.variables}"
      ?compatibility="${compatibility}"
    ></import-variables-table>`;
  }

  _headersSetsTableTemplate(data, compatibility) {
    const items = data['headers-sets'];
    if (!items || !items.length) {
      return '';
    }
    return html`
    <import-headers-sets-table
      tabletitle="Headers sets"
      .data="${items}"
      ?compatibility="${compatibility}"
    ></import-headers-sets-table>`;
  }

  _cookiesTableTemplate(data, compatibility) {
    if (!data.cookies || !data.cookies.length) {
      return '';
    }
    return html`
    <import-cookies-table
      tabletitle="Cookies"
      .data="${data.cookies}"
      ?compatibility="${compatibility}"
    ></import-cookies-table>`;
  }

  _authDataTableTemplate(data, compatibility) {
    const items = data['auth-data'];
    if (!items || !items.length) {
      return '';
    }
    return html`
    <import-auth-data-table
      tabletitle="Auth data"
      .data="${items}"
      ?compatibility="${compatibility}"
    ></import-auth-data-table>`;
  }

  _urlsTableTemplate(data, compatibility) {
    const items = data['url-history'];
    if (!items || !items.length) {
      return '';
    }
    return html`
    <import-url-history-table
      tabletitle="URL history for autocomplete"
      .data="${items}"
      ?compatibility="${compatibility}"
    ></import-url-history-table>`;
  }

  _socketUrlsTableTemplate(data, compatibility) {
    const items = data['websocket-url-history'];
    if (!items || !items.length) {
      return '';
    }
    return html`
    <import-websocket-url-history-table
      tabletitle="Web socket URL history for autocomplete"
      .data="${items}"
      ?compatibility="${compatibility}"
    ></import-websocket-url-history-table>`;
  }

  _ccTableTemplate(data, compatibility) {
    const items = data['client-certificates'];
    if (!items || !items.length) {
      return '';
    }
    return html`
    <import-cc-table
      tabletitle="Client certificates"
      .data="${items}"
      ?compatibility="${compatibility}"
    ></import-cc-table>`;
  }
  /**
   * Fired when the user accepts the import
   * Event's detail object is ARC import data object.
   *
   * The event does not bubbles.
   *
   * @event import
   */
  /**
   * Fired when the user cancels the import action.
   *
   * The event does not bubbles.
   *
   * @event cancel
   */
}
