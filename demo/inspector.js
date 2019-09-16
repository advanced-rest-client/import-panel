import { html } from 'lit-html';
import { ArcDemoPage } from '@advanced-rest-client/arc-demo-helper/ArcDemoPage.js';
import { DataGenerator } from '@advanced-rest-client/arc-data-generator/arc-data-generator.js';
import '@advanced-rest-client/arc-demo-helper/arc-interactive-demo.js';
import '@polymer/paper-toast/paper-toast.js';
import '../import-data-inspector.js';

class DemoPage extends ArcDemoPage {
  constructor() {
    super();
    this.initObservableProperties([
      'compatibility',
      'outlined',
      'data'
    ]);
    this._componentName = 'import-data-inspector';
    this.demoStates = ['Filled', 'Outlined', 'Anypoint'];
    this._demoStateHandler = this._demoStateHandler.bind(this);
    this._toggleMainOption = this._toggleMainOption.bind(this);

    this.generate();
  }

  get aware() {
    return document.getElementById('aware');
  }

  _toggleMainOption(e) {
    const { name, checked } = e.target;
    this[name] = checked;
  }

  _demoStateHandler(e) {
    const state = e.detail.value;
    this.outlined = state === 1;
    this.compatibility = state === 2;
  }

  generate() {
    const saved = DataGenerator.generateSavedRequestData({
      requestsSize: 50,
      projectsSize: 3
    });
    const history = DataGenerator.generateHistoryRequestsData({
      requestsSize: 120
    });
    this.data = {
      'kind': 'ARC#import',
      'createdAt': '2017-09-28T19:43:09.491',
      'version': '9.14.64.305',
      'requests': saved.requests,
      'projects': saved.projects,
      'history': history,
      'variables': DataGenerator.generateVariablesData(),
      'headers-sets': DataGenerator.generateHeadersSetsData(),
      'cookies': DataGenerator.generateCookiesData(),
      'url-history': DataGenerator.generateUrlsData(),
      'websocket-url-history': DataGenerator.generateUrlsData(),
      'auth-data': DataGenerator.generateBasicAuthData()
    };
  }

  cancelled() {
    document.getElementById('cancelToast').opened = true;
  }

  imported() {
    document.getElementById('importToast').opened = true;
  }

  _demoTemplate() {
    const {
      demoStates,
      darkThemeActive,
      compatibility,
      outlined,
      data
    } = this;
    return html`
      <section class="documentation-section">
        <h3>Interactive demo</h3>
        <p>
          This demo lets you preview the Google Drive browser element with various
          configuration options.
        </p>

        <arc-interactive-demo
          .states="${demoStates}"
          @state-chanegd="${this._demoStateHandler}"
          ?dark="${darkThemeActive}"
        >
          <import-data-inspector
            ?compatibility="${compatibility}"
            .outlined="${outlined}"
            .data="${data}"
            slot="content"
            @cancel="${this.cancelled}"
            @import="${this.imported}"
          ></import-data-inspector>
        </arc-interactive-demo>
      </section>

      <paper-toast text="Cancel has been pressed" id="cancelToast"></paper-toast>
      <paper-toast text="Import data has been pressed" id="importToast"></paper-toast>
    `;
  }

  contentTemplate() {
    return html`
      <h2>Import data inspector</h2>
      ${this._demoTemplate()}
    `;
  }
}

const instance = new DemoPage();
instance.render();
window._demo = instance;
