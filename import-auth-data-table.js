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
import {ImportBaseTable} from './import-base-table.js';
import {html} from '@polymer/polymer/lib/utils/html-tag.js';
/**
 * An element to display list of authorization data to import.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @memberof UiElements
 * @appliesMixin ImportTableMixin
 * @extends {ImportBaseTable}
 */
class ImportAuthDataTable extends ImportBaseTable {
  static get styleTemplate() {
    return html`<style include="import-table-common-styles">
    .no-data {
      margin-left: 16px;
      color: var(--import-table-auth-no-info-color, rgba(0, 0, 0, 0.54));
      font-size: 16px;
      @apply --import-table-auth-no-info;
    }
    </style>`;
  }

  static get repeaterTemplate() {
    return html`<p class="no-data">This data is intentionally hidden</p>`;
  }
}
window.customElements.define('import-auth-data-table', ImportAuthDataTable);
