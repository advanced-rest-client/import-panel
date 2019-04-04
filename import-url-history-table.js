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
import {html} from '../../@polymer/polymer/lib/utils/html-tag.js';
/**
 * An element to display list of URLs hsitory to import.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @memberof UiElements
 * @appliesMixin ImportTableMixin
 * @extends {ImportBaseTable}
 */
class ImportUrlHistoryTable extends ImportBaseTable {
  static get itemBodyTemplate() {
    return html`<div>[[item._id]]</div>`;
  }
}
window.customElements.define('import-url-history-table', ImportUrlHistoryTable);
