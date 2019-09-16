import { fixture, assert, nextFrame } from '@open-wc/testing';
import '@advanced-rest-client/arc-data-import/arc-data-import.js';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import { DataGenerator } from '@advanced-rest-client/arc-data-generator/arc-data-generator.js';
import '../import-data-inspector.js';

describe('<import-data-inspector>', function() {
  async function basicFixture() {
    return (await fixture(`<import-data-inspector></import-data-inspector>`));
  }

  function getImportData() {
    const saved = DataGenerator.generateSavedRequestData({
      requestsSize: 10,
      projectsSize: 1
    });
    const historyData = DataGenerator.generateHistoryRequestsData({
      requestsSize: 10
    });
    return {
      'kind': 'ARC#Import',
      'createdAt': '2017-09-28T19:43:09.491',
      'version': '9.14.64.305',
      'requests': saved.requests,
      'projects': saved.projects,
      'history': historyData,
      'variables': DataGenerator.generateVariablesData(),
      'headers-sets': DataGenerator.generateHeadersSetsData(),
      'cookies': DataGenerator.generateCookiesData(),
      'url-history': DataGenerator.generateUrlsData({
        size: 10
      }),
      'websocket-url-history': DataGenerator.generateUrlsData({
        size: 5
      }),
      'auth-data': [{ _id: 'test', encoded: 'test' }]
    };
  }

  describe('import table test', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      element.data = getImportData();
      await nextFrame();
    });

    it('Fires "cancel" event', function(done) {
      element.addEventListener('cancel', function f() {
        element.removeEventListener('cancel', f);
        done();
      });
      const button = element.shadowRoot.querySelector('[data-action="cancel-import"]');
      MockInteractions.tap(button);
    });

    it('Fires "import" event', function(done) {
      element.addEventListener('import', function f(e) {
        element.removeEventListener('import', f);
        assert.typeOf(e.detail, 'object', 'Detail is an object');
        assert.equal(e.detail.kind, 'ARC#Import', 'Detail is an import object');
        done();
      });
      const button = element.shadowRoot.querySelector('[data-action="import-data"]');
      MockInteractions.tap(button);
    });

    it('renders history table', () => {
      const node = element.shadowRoot.querySelector('import-history-table');
      assert.ok(node, 'table is rendered');
      assert.typeOf(node.data, 'array', 'table has data');
    });

    it('renders requests table', () => {
      const node = element.shadowRoot.querySelector('import-requests-table');
      assert.ok(node, 'table is rendered');
      assert.typeOf(node.data, 'array', 'table has data');
    });

    it('renders variables table', () => {
      const node = element.shadowRoot.querySelector('import-variables-table');
      assert.ok(node, 'table is rendered');
      assert.typeOf(node.data, 'array', 'table has data');
    });

    it('renders headers-sets table', () => {
      const node = element.shadowRoot.querySelector('import-headers-sets-table');
      assert.ok(node, 'table is rendered');
      assert.typeOf(node.data, 'array', 'table has data');
    });

    it('renders cookies table', () => {
      const node = element.shadowRoot.querySelector('import-cookies-table');
      assert.ok(node, 'table is rendered');
      assert.typeOf(node.data, 'array', 'table has data');
    });

    it('renders url-history table', () => {
      const node = element.shadowRoot.querySelector('import-url-history-table');
      assert.ok(node, 'table is rendered');
      assert.typeOf(node.data, 'array', 'table has data');
    });

    it('renders websocket-url-history table', () => {
      const node = element.shadowRoot.querySelector('import-websocket-url-history-table');
      assert.ok(node, 'table is rendered');
      assert.typeOf(node.data, 'array', 'table has data');
    });
  });

  describe('_getTableData()', function() {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      element.data = getImportData();
      await nextFrame();
    });

    it('Computes list of selected requests', function() {
      const result = element._getTableData('import-websocket-url-history-table');
      assert.typeOf(result, 'array');
      assert.lengthOf(result, 5);
    });

    it('Returns undefined if selection is empty', function() {
      const table = element.shadowRoot.querySelector('import-websocket-url-history-table');
      table.selectedIndexes = [];
      const result = element._getTableData('import-websocket-url-history-table');
      assert.isUndefined(result);
    });
  });

  describe('collectData()', function() {
    let element;
    let result;
    beforeEach(async () => {
      element = await basicFixture();
      element.data = getImportData();
      await nextFrame();
    });

    it('Returns an object', function() {
      result = element.collectData();
      assert.typeOf(result, 'object');
    });

    it('Returned data is the ARC import object', function() {
      result = element.collectData();
      assert.equal(result.kind, 'ARC#Import');
    });

    it('Has all data', function() {
      result = element.collectData();
      assert.lengthOf(Object.keys(result), 12);
    });

    it('Will contain partial import', function() {
      const table = element.shadowRoot.querySelector('import-websocket-url-history-table');
      table.selectedIndexes = [table.selectedIndexes[0]];
      result = element.collectData();
      assert.lengthOf(result['websocket-url-history'], 1);
    });
  });
});
