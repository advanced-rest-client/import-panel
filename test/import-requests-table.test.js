import { fixture, assert, html } from '@open-wc/testing';
import '@advanced-rest-client/arc-data-import/arc-data-import.js';
import { DataGenerator } from '@advanced-rest-client/arc-data-generator/arc-data-generator.js';
import '../import-requests-table.js';

describe('ImportBaseTable', function() {
  async function basicFixture(data) {
    return (await fixture(html`
      <import-requests-table
        .data="${data}"></import-requests-table>
    `));
  }

  describe('_dataChanged()', () => {
    let element;
    let data;
    beforeEach(async () => {
      data = DataGenerator.generateSavedRequestData({
        requestsSize: 15,
        projectsSize: 2
      });
      data.requests[0].legacyProject = data.projects[0]._id;
      data.projects[0].requests = [data.requests[0]._id];
      element = await basicFixture(data.requests);
    });

    it('computes project data', () => {
      assert.typeOf(element.projectsData, 'array');
    });

    it('computes nonProjects data', () => {
      assert.typeOf(element.nonProjects, 'array');
    });
  });
});
