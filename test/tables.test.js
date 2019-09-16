import { fixture, assert, nextFrame, html } from '@open-wc/testing';
import '@advanced-rest-client/arc-data-import/arc-data-import.js';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import { DataGenerator } from '@advanced-rest-client/arc-data-generator/arc-data-generator.js';
import '../import-history-table.js';

describe('ImportBaseTable', function() {
  async function basicFixture(data) {
    return (await fixture(html`
      <import-history-table
        .data="${data}"></import-history-table>
    `));
  }

  describe('toggleOpened()', function() {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Toggles "opened"', function() {
      element.toggleOpened();
      assert.isTrue(element.opened);
    });
  });

  describe('Selection', () => {
    let element;
    beforeEach(async () => {
      const data = DataGenerator.generateHistoryRequestsData({
        requestsSize: 5
      });
      element = await basicFixture(data);
    });

    it('sets all selected by default', () => {
      assert.isTrue(element.allSelected, 'all selected flag is set');
      assert.lengthOf(element.selectedIndexes, 5, 'selected indexes contains all items');
      const nodes = element.shadowRoot.querySelectorAll('anypoint-icon-item.selected');
      assert.lengthOf(nodes, 5, 'all list items are selected');
    });

    it('hasSelection is true when selected', () => {
      assert.isTrue(element.hasSelection);
    });

    it('deselects all items with checkbox', async () => {
      const button = element.shadowRoot.querySelector('.select-all');
      MockInteractions.tap(button);
      await nextFrame();
      assert.isFalse(element.allSelected, 'all selected flag is updated');
      assert.lengthOf(element.selectedIndexes, 0, 'selected has no items');
      const nodes = element.shadowRoot.querySelectorAll('anypoint-icon-item.selected');
      assert.lengthOf(nodes, 0, 'all list items are deselected');
    });

    it('hasSelection is false when none selected', async () => {
      const button = element.shadowRoot.querySelector('.select-all');
      MockInteractions.tap(button);
      await nextFrame();
      assert.isFalse(element.hasSelection);
    });

    it('deselects an item via checkbox', async () => {
      const button = element.shadowRoot.querySelector('anypoint-icon-item anypoint-checkbox');
      MockInteractions.tap(button);
      await nextFrame();
      assert.isFalse(button.parentElement.classList.contains('selected'), 'item has no selected styles');
      assert.isFalse(button.checked, 'checkbox is not selected');
      assert.lengthOf(element.selectedIndexes, 4, 'table has partial selection');
    });

    it('deselects an item via item click', async () => {
      const item = element.shadowRoot.querySelector('anypoint-icon-item');
      MockInteractions.tap(item);
      await nextFrame();
      assert.isFalse(item.classList.contains('selected'), 'item has no selected styles');
      const button = item.querySelector('anypoint-checkbox');
      assert.isFalse(button.checked, 'checkbox is not selected');
      assert.lengthOf(element.selectedIndexes, 4, 'table has partial selection');
    });
  });

  describe('#selectedItems', () => {
    let element;
    let data;
    beforeEach(async () => {
      data = DataGenerator.generateHistoryRequestsData({
        requestsSize: 5
      });
      element = await basicFixture(data);
    });

    it('returns all items', () => {
      assert.deepEqual(element.selectedItems, data);
    });

    it('returns only selected items', async () => {
      const item = element.shadowRoot.querySelector('anypoint-icon-item');
      MockInteractions.tap(item);
      await nextFrame();
      assert.lengthOf(element.selectedItems, 4);
    });

    it('returns empty array when no selection', async () => {
      const button = element.shadowRoot.querySelector('.select-all');
      MockInteractions.tap(button);
      await nextFrame();
      assert.lengthOf(element.selectedItems, 0);
    });
  });
});
