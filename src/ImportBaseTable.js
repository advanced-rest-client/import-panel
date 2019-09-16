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
import '@polymer/iron-collapse/iron-collapse.js';
import { keyboardArrowDown } from '@advanced-rest-client/arc-icons/ArcIcons.js';
import '@anypoint-web-components/anypoint-button/anypoint-icon-button.js';
import '@anypoint-web-components/anypoint-checkbox/anypoint-checkbox.js';
import '@anypoint-web-components/anypoint-item/anypoint-icon-item.js';
import '@anypoint-web-components/anypoint-item/anypoint-item-body.js';
import '@anypoint-web-components/anypoint-selector/anypoint-selector.js';
import styles from './CommonStyles.js';
/**
 * Base table class. Contains methods and templates to be
 * used by other tables.
 *
 * In most canses child classes should only define their own `itemBodyTemplate`
 * property that is insterted into `<anypoint-item-body>` element.
 *
 * @customElement
 * @demo demo/index.html
 * @memberof UiElements
 * @appliesMixin ImportTableMixin
 */
export class ImportBaseTable extends LitElement {
  static get styles() {
    return styles;
  }

  static get properties() {
    return {
      /**
       * Title of the table when using base tabel
       */
      tableTitle: { type: String },
      // Indicates if the table is displaying list of items
      opened: { type: Boolean, reflect: true },
      // The data to display.
      data: { type: Array },
      /**
       * List of IDs of selected items.
       * @type {Array<String>}
       */
      selectedIndexes: { type: Array },
      // True to select all elements from the list
      allSelected: { type: Boolean },
      /**
       * Enables compatibility with Anypoint platform
       */
      compatibility: { type: Boolean }
    };
  }
  /**
   * @return {Boolean} If true, the user selected some elements on list. Check the
   * `this.selectedIndexes` property to check for the selected elements.
   */
  get hasSelection() {
    const { selectedIndexes } = this;
    return !!(selectedIndexes && selectedIndexes.length);
  }

  get data() {
    return this._data;
  }

  set data(value) {
    const old = this._data;
    if (old === value) {
      return;
    }
    this._data = value;
    this.requestUpdate('data', old);
    this._dataChanged(value);
  }

  get list() {
    return this.shadowRoot.querySelector('anypoint-selector');
  }

  get selectedItems() {
    const indexes = this.selectedIndexes;
    const items = this.data;
    const result = [];
    if (!items || !indexes.length) {
      return result;
    }
    for (let i = 0, len = items.length; i < len; i++) {
      const id = items[i]._id;
      if (indexes.indexOf(id) !== -1) {
        result[result.length] = items[i];
      }
    }
    return result;
  }

  constructor() {
    super();
    this.selectedIndexes = [];
  }

  firstUpdated() {
    if (this.selectedIndexes.length) {
      this.__initializing = true;
      this.setSelected(this.selectedIndexes);
      this.__initializing = false;
    }
  }

  /**
   * Toggles opened state
   */
  toggleOpened() {
    this.opened = !this.opened;
  }

  _createSelectionArray(items) {
    return (items || []).map((item) => item._id);
  }

  _dataChanged(data) {
    this.__initializing = true;
    data = data || [];
    const arr = this._createSelectionArray(data);
    this.selectedIndexes = arr;
    this.setSelected(arr);
    this.allSelected = true;
    this.__initializing = false;
  }

  setSelected(values) {
    const node = this.list;
    if (!node) {
      return;
    }
    node.selectedValues = values;
  }

  _selectedHandler(e) {
    this.selectedIndexes = e.detail.value;
    this.requestUpdate();
  }

  _toggleSelectAll(e) {
    const { value } = e.detail;
    this.allSelected = value;
    let indexes = [];
    if (value) {
      indexes = this._createSelectionArray(this.data);
    }
    this.setSelected(indexes);
  }

  render() {
    return html`
    ${this.headerTemplate}
    ${this.contentTemplate}`;
  }

  get headerTemplate() {
    const { tableTitle, selectedIndexes, opened, compatibility } = this;
    const cnt = selectedIndexes ? selectedIndexes.length : 0;
    const iconClass = 'toggle-icon' + (opened ? ' opened' : '');
    return html`<header class="title" @click="${this.toggleOpened}">
      <h3>${tableTitle} (${cnt})</h3>
      <anypoint-icon-button
        class="${iconClass}"
        aria-label="Activate to toggle table opened"
        title="Toggle table opened"
        ?compatibility="${compatibility}"
      >
        <span class="icon">${keyboardArrowDown}</span>
      </anypoint-icon-button>
    </header>`;
  }

  _itemBodyContentTemplate(item, index) {
    return html`<anypoint-item-body>
      ${this._itemBodyTemplate(item, index)}
    </anypoint-item-body>`;
  }

  _itemBodyTemplate(item, index) {
    return '';
  }

  get tableHeaderTemplate() {
    const { hasSelection, allSelected, selectedIndexes } = this;
    const tableClass = 'table-options' + (hasSelection ? '' : ' inactive');
    const cnt = selectedIndexes ? selectedIndexes.length : 0;
    return html`
    <section class="${tableClass}">
      <anypoint-checkbox
        class="select-all"
        .checked="${allSelected}"
        title="Select / deselect all"
        aria-label="Activate to select or deselect all"
        @checked-changed="${this._toggleSelectAll}"
      ></anypoint-checkbox>
      <span class="selected-counter hiddable">${cnt} item(s) selected</span>
    </section>`;
  }

  repeaterTemplate(data) {
    if (!data || !data.length) {
      return '';
    }
    const { selectedIndexes } = this;
    return data.map((item, index) => html`
    <anypoint-icon-item data-index="${index}" data-key="${item._id}">
      <anypoint-checkbox
        data-index="${index}"
        .checked="${selectedIndexes.indexOf(item._id) !== -1}"
        slot="item-icon"
        aria-label="Toggle selection"
        tabindex="-1"
      ></anypoint-checkbox>
      ${this._itemBodyContentTemplate(item, index)}
    </anypoint-icon-item>`);
  }

  get contentTemplate() {
    return html`
    <iron-collapse .opened="${this.opened}">
      ${this.tableHeaderTemplate}
      <anypoint-selector
        multi
        toggle
        attrforselected="data-key"
        selectable="anypoint-icon-item"
        .selectedValues="${this.selectedIndexes}"
        @selectedvalues-changed="${this._selectedHandler}">
      ${this.repeaterTemplate(this.data)}
      </anypoint-selector>
    </iron-collapse>`;
  }
}
