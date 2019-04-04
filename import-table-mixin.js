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
import {dedupingMixin} from '../../@polymer/polymer/lib/utils/mixin.js';
/**
 * A set of common functions for import panel
 *
 * @polymer
 * @mixinFunction
 * @memberof ArcComponents
 */
export const ImportTableMixin = dedupingMixin((base) => {
  /**
   * @polymer
   * @mixinClass
   */
  class ArcAppMixinImpl extends base {
    static get properties() {
      return {
        // Indicates if the table is displaying list of items
        opened: {
          type: Boolean,
          reflectToAttribute: true
        },
        // The data to display.
        data: {type: Array, observer: '_updateSelected'},
        // Computed value, true if data are set.
        hasData: {
          type: Boolean,
          computed: '_computeHasData(data)'
        },
        // List of selected items on the list.
        selectedItems: Array,
        /**
         * If true, the user selected some elements on list. Check the
         * `this.selectedItems` property to check for the selected elements.
         */
        hasSelection: {
          type: Boolean,
          computed: '_computeHasSelection(selectedItems.length)'
        },
        // True to select all elements from the list
        allSelected: {type: Boolean, observer: '_toggleSelectAll'}
      };
    }

    static get observers() {
      return [
        '_selectedLengthChanged(selectedItems.length)'
      ];
    }

    constructor() {
      super();
      this._onSelectItem = this._onSelectItem.bind(this);
    }

    connectedCallback() {
      super.connectedCallback();
      this.addEventListener('click', this._onSelectItem);
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      this.removeEventListener('click', this._onSelectItem);
    }

    /**
     * Computes value for `hasData`
     * @param {Array} data
     * @return {Boolean}
     */
    _computeHasData(data) {
      return !!data;
    }
    /**
     * Toggles opened state
     */
    toggleOpened() {
      this.opened = !this.opened;
    }
    /**
     * Computes class for toggle icon
     * @param {Boolean} opened
     * @return {String}
     */
    _computeToggleClass(opened) {
      return opened ? 'opened' : '';
    }
    /**
     * Computes the `hasSelection` property value
     * @param {Number} length
     * @return {Boolean}
     */
    _computeHasSelection(length) {
      return !!length;
    }
    /**
     * Computes table header class.
     * @param {Boolean} hasSelection
     * @return {String}
     */
    _computeTableClass(hasSelection) {
      return hasSelection ? '' : 'inactive';
    }

    _updateSelected(data) {
      if (!data) {
        this.set('selectedItems', undefined);
        return;
      }
      if (!this.allSelected) {
        this.allSelected = true;
      } else {
        this._selectAll();
      }
    }

    _selectAll() {
      const selector = this.$.selector;
      this.data.forEach((i, index) => {
        selector.select(i);
        this.set(['data', index, 'selected'], true);
      });
    }

    /**
     * Toggles selection of of all itmes on the list.
     * @param {Boolean} allSelected Current state of the `allSelected` property.
     */
    _toggleSelectAll(allSelected) {
      const selectedItems = this.selectedItems || [];
      const items = this.data;
      if (!selectedItems || !items) {
        return;
      }
      const selector = this.$.selector;
      if (allSelected) {
        if (selectedItems.length === items.length) {
          return;
        }

        items.forEach((i, index) => {
          selector.select(i);
          this.set(['data', index, 'selected'], true);
        });
      } else {
        if (selectedItems.length === 0) {
          return;
        }
        items.forEach((i, index) => {
          selector.deselect(i);
          this.set(['data', index, 'selected'], false);
        });
      }
    }

    // Handler for the selection related events.
    _onSelectItem(e) {
      if (!this.$.list) {
        return;
      }
      const target = e.composedPath()[0];
      const model = this.$.list.modelForElement(target);
      if (!model) {
        return;
      }
      const item = model.get('item');
      const state = !item.selected;
      const index = model.get('index');
      if (state) {
        this.$.selector.select(item);
      } else {
        this.$.selector.deselect(item);
      }
      this.set(['data', index, 'selected'], state);
    }

    _selectedLengthChanged(size) {
      if (!size && this.allSelected) {
        this.allSelected = false;
      }
    }
  }
  return ArcAppMixinImpl;
});