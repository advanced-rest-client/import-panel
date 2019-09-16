import { fixture, assert, html, nextFrame } from '@open-wc/testing';
import '@advanced-rest-client/arc-data-import/arc-data-import.js';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import { DataGenerator } from '@advanced-rest-client/arc-data-generator/arc-data-generator.js';
// import * as sinon from 'sinon/pkg/sinon-esm.js';
import { DataTestHelper } from './test-helper.js';
import '../import-panel.js';

describe('<import-panel>', function() {
  async function basicFixture() {
    return (await fixture(`<import-panel></import-panel>`));
  }

  async function importerFixture() {
    const area = (await fixture(html`
      <div>
        <import-panel></import-panel>
        <arc-data-import></arc-data-import>
      </div>
    `));
    return area.querySelector('import-panel');
  }

  describe('basics', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('data is not set', function() {
      assert.isUndefined(element.data);
    });

    it('hasData is not computed', function() {
      assert.isUndefined(element.hasData);
    });

    it('withDriveList is not set', function() {
      assert.isUndefined(element.withDriveList);
    });

    it('importing is undefined by default', function() {
      assert.isUndefined(element.importing);
    });

    it('paper-spinner is not in the DOM', function() {
      const node = element.shadowRoot.querySelector('paper-spinner');
      assert.notOk(node);
    });

    it('Opens Google Drive picker', function() {
      const button = element.shadowRoot.querySelector('[data-action="open-drive-picker"]');
      MockInteractions.tap(button);
      assert.equal(element.selectedPage, 1, 'selectedPage is 1');
    });

    it('Opens data manual entry', function() {
      const button = element.shadowRoot.querySelector('[data-action="open-text-entry"]');
      MockInteractions.tap(button);
      assert.equal(element.selectedPage, 2, 'selectedPage is 2');
    });

    it('Restores view from the Drive Picket', function() {
      element.selectedPage = 1;
      element.withDriveList = true;
      element.screenBack();
      assert.equal(element.selectedPage, 0, 'selectedPage is 0');
      assert.isFalse(element.withDriveList, 'withDriveList is false');
    });
  });

  describe('Data normalize', () => {
    let element;
    let importData;

    before(async () => {
      importData = await DataTestHelper.getFile('import-data-test.json');
    });

    beforeEach(async () => {
      element = await importerFixture();
      element.selectedPage = 2;
      await nextFrame();
      element.shadowRoot.querySelector('#manualInput').value = importData;
      await nextFrame();
    });

    function normalize() {
      const button = element.shadowRoot.querySelector('[data-action="import-text"]');
      MockInteractions.tap(button);
    }

    it('Sends the import-normalize custom event', function(done) {
      element.addEventListener('import-normalize', function f(e) {
        element.removeEventListener('import-normalize', f);
        assert.isTrue(e.cancelable, 'Event is cancelable.');
        assert.equal(e.detail.content, importData);
        done();
      });
      normalize();
    });

    it('_processContent returns a Promise', function() {
      return element._processContent(importData)
      .then(() => {});
    });

    it('Opens a table after normalization', function() {
      return element._processContent(importData)
      .then(() => {
        assert.equal(element.selectedPage, 3);
      });
    });

    it('Sets the data after normalization', function() {
      return element._processContent(importData)
      .then(() => {
        assert.typeOf(element.data, 'object');
      });
    });
  });

  describe('Data import', () => {
    let element;
    let importData;
    const importCallback = function(e) {
      e.detail.result = Promise.resolve();
    };

    before(function() {
      const saved = DataGenerator.generateSavedRequestData({
        requestsSize: 10,
        projectsSize: 1
      });
      const history = DataGenerator.generateHistoryRequestsData({
        requestsSize: 10
      });
      importData = {
        'kind': 'ARC#Import',
        'createdAt': '2017-09-28T19:43:09.491',
        'version': '9.14.64.305',
        'requests': saved.requests,
        'projects': saved.projects,
        'history': history,
        'variables': DataGenerator.generateVariablesData(),
        'headers-sets': DataGenerator.generateHeadersSetsData(),
        'cookies': DataGenerator.generateCookiesData(),
        'url-history': DataGenerator.generateUrlsData(),
        'websocket-url-history': DataGenerator.generateUrlsData()
      };
      document.body.addEventListener('import-data', importCallback);
    });

    after(function() {
      document.body.removeEventListener('import-data', importCallback);
    });

    beforeEach(async () => {
      element = await basicFixture();
      element.data = DataGenerator.clone(importData);
      element.selectedPage = 3;
      await nextFrame();
    });

    it('Sends the import-data custom event', function(done) {
      element.addEventListener('import-data', function f(e) {
        element.removeEventListener('import-data', f);
        assert.isTrue(e.cancelable, 'Event is cancelable.');
        assert.equal(e.detail.content, importData);
        done();
      });
      element._importData({
        detail: importData
      });
    });

    it('Sets the importing flag', function() {
      element._importData({
        detail: importData
      });
      assert.isTrue(element.importing, 'importing is set.');
    });

    it('Clears the state after import', function() {
      return element._importData({
        detail: importData
      })
      .then(() => {
        assert.isFalse(element.importing, 'importing is set.');
        assert.isUndefined(element.data, 'data is set.');
        assert.equal(element.selectedPage, 0, 'selected page is set.');
      });
    });
  });

  describe('File selection flow', () => {
    const content = `
    {
    "createdAt": "2019-02-03T04:24:34.060Z",
    "version": "13.0.0-alpha.3",
    "kind": "ARC#AllDataExport",
    "requests": []
    }`;

    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    function createFile() {
      return new Blob([content], { type: 'application/json' });
    }

    function createFileEvent() {
      return {
        target: {
          files: [createFile()]
        }
      };
    }

    it('sets readingFile flag', () => {
      element._onImportFile(createFileEvent());
      assert.isTrue(element.readingFile);
    });

    it('sets value of file reader', () => {
      element._onImportFile(createFileEvent());
      const node = element.shadowRoot.querySelector('#fileReader');
      assert.ok(node.blob);
    });

    it('eventually dispatches "import-normalize" event', (done) => {
      element._onImportFile(createFileEvent());
      element.addEventListener('import-normalize', () => {
        done();
      });
    });

    it('renders error when event not handled', (done) => {
      element._onImportFile(createFileEvent());
      element.addEventListener('import-normalize', () => {
        setTimeout(() => {
          const node = element.shadowRoot.querySelector('#error');
          assert.isTrue(node.opened);
          done();
        });
      });
    });

    it('sets processed data', (done) => {
      // const spy = sinon.spy();
      element._onImportFile(createFileEvent());
      element.addEventListener('import-normalize', (e) => {
        e.detail.result = Promise.resolve({
          test: true
        });
        setTimeout(() => {
          assert.deepEqual(element.data, {
            test: true
          });
          done();
        });
      });
    });
  });

});
