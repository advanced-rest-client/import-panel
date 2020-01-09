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
import { ImportBaseTable } from './ImportBaseTable.js';
import { html, css } from 'lit-element';
/**
 * An element to display list of authorization data to import.
 *
 * @customElement
 * @demo demo/index.html
 * @memberof UiElements
 * @extends {ImportBaseTable}
 */
export class ImportCcTable extends ImportBaseTable {
  static get styles() {
    return [
      ImportBaseTable.styles,
      css``
    ];
  }

  get selectedItems() {
    const indexes = this.selectedIndexes;
    const items = this.data;
    const result = [];
    if (!items || !indexes.length) {
      return result;
    }
    for (let i = 0, len = items.length; i < len; i++) {
      const id = items[i][0]._id;
      if (indexes.indexOf(id) !== -1) {
        result[result.length] = items[i];
      }
    }
    return result;
  }

  repeaterTemplate(data) {
    if (!data || !data.length) {
      return '';
    }
    const { selectedIndexes } = this;
    return data.map((item, index) => this._outerTemplate(item, index, selectedIndexes));
  }

  _outerTemplate(item, index, selectedIndexes) {
    const [indexData] = item;
    return html`
    <anypoint-icon-item data-index="${index}" data-key="${indexData._id}">
      <anypoint-checkbox
        data-index="${index}"
        .checked="${selectedIndexes.indexOf(indexData._id) !== -1}"
        slot="item-icon"
        aria-label="Toggle selection"
        tabindex="-1"
      ></anypoint-checkbox>
      ${this._itemBodyContentTemplate(indexData, index)}
    </anypoint-icon-item>`;
  }

  _itemBodyContentTemplate(item) {
    return html`
    <anypoint-item-body twoline>
      <span class="name-label">${item.name}</span>
      <span class="type-label">Type: ${item.type}</span>
    </anypoint-item-body>`;
  }

  _createSelectionArray(items) {
    return (items || []).map((item) => item[0]._id);
  }
}
