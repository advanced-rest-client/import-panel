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
import '../../@api-components/http-method-label/http-method-label.js';
import '../../@advanced-rest-client/date-time/date-time.js';
import {ImportBaseTable} from './import-base-table.js';
import {html} from '../../@polymer/polymer/lib/utils/html-tag.js';
/**
 * An element to display list of history objects to import.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @memberof UiElements
 * @appliesMixin ImportTableMixin
 * @extends {ImportBaseTable}
 */
export class ImportHistoryTable extends ImportBaseTable {
  static get styleTemplate() {
    return html`<style include="import-table-common-styles">
    .selected-counter {
      margin-left: 32px;
    }
    </style>`;
  }

  static get itemBodyTemplate() {
    return html`<div>[[item.url]]</div>
    <div secondary>
      <date-time date="[[item.updated]]" day="numeric" month="numeric" year="numeric"></date-time>
    </div>`;
  }

  static get paperItemBodyTemplate() {
    return html`<span class="method-label">
      <http-method-label method="[[item.method]]"></http-method-label>
    </span>
    <paper-item-body two-line>
      ${this.itemBodyTemplate}
    </paper-item-body>`;
  }
}
window.customElements.define('import-history-table', ImportHistoryTable);