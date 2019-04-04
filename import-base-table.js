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
import '../../@polymer/iron-collapse/iron-collapse.js';
import '../../@advanced-rest-client/arc-icons/arc-icons.js';
import '../../@polymer/paper-icon-button/paper-icon-button.js';
import '../../@polymer/paper-checkbox/paper-checkbox.js';
import '../../@polymer/paper-item/paper-icon-item.js';
import '../../@polymer/paper-item/paper-item-body.js';
import './import-table-common-styles.js';
import {ImportTableMixin} from './import-table-mixin.js';
import {html} from '../../@polymer/polymer/lib/utils/html-tag.js';
/**
 * Base table class. Contains methods and templates to be
 * used by other tables.
 *
 * In most canses child classes should only define their own `itemBodyTemplate`
 * property that is insterted into `<paper-item-body>` element.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @memberof UiElements
 * @appliesMixin ImportTableMixin
 */
export class ImportBaseTable extends ImportTableMixin(PolymerElement) {
  static get properties() {
    return {
      /**
       * Title of the table when using base tabel
       */
      tableTitle: String,
    };
  }

  static get template() {
    return html`${this.styleTemplate}
    ${this.headerTemplate}
    ${this.contentTemplate}`;
  }

  static get styleTemplate() {
    return html`<style include="import-table-common-styles"></style>`;
  }

  static get headerTemplate() {
    return html`<header class="title" on-click="toggleOpened">
      <h3>[[tableTitle]] ([[selectedItems.length]])</h3>
      <paper-icon-button
        icon="arc:keyboard-arrow-down"
        class$="toggle-icon [[_computeToggleClass(opened)]]"></paper-icon-button>
    </header>`;
  }

  static get itemBodyTemplate() {
    return html``;
  }

  static get tableHeaderTemplate() {
    return html`<section class$="table-options [[_computeTableClass(hasSelection)]]">
      <paper-checkbox
        class="select-all"
        checked="{{allSelected}}"
        title="Select / deselect all"></paper-checkbox>
      <span class="selected-counter hiddable">[[selectedItems.length]] item(s) selected</span>
    </section>`;
  }

  static get paperItemBodyTemplate() {
    return html`<paper-item-body>
      ${this.itemBodyTemplate}
    </paper-item-body>`;
  }

  static get repeaterTemplate() {
    return html`<template is="dom-repeat" id="list" items="[[data]]">
      <div class="list-item">
        <paper-icon-item>
          <paper-checkbox
            checked="[[item.selected]]"
            slot="item-icon"
            aria-label="Toggle selection"></paper-checkbox>
          ${this.paperItemBodyTemplate}
        </paper-icon-item>
      </div>
    </template>`;
  }

  static get contentTemplate() {
    return html`<iron-collapse opened="[[opened]]">
      ${this.tableHeaderTemplate}
      ${this.repeaterTemplate}
    </iron-collapse>
    <array-selector
      id="selector"
      items="{{data}}"
      selected="{{selectedItems}}"
      multi toggle></array-selector>`;
  }
}
window.customElements.define('import-base-table', ImportBaseTable);
