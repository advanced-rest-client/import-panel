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
import '@polymer/iron-collapse/iron-collapse.js';
import '@advanced-rest-client/arc-icons/ArcIcons.js';
import '@anypoint-web-components/anypoint-button/anypoint-icon-button.js'
import '@api-components/http-method-label/http-method-label.js';
import styles from './CommonStyles.js';
/**
 * An element to display list of request objects to import.
 *
 * @customElement
 * @demo demo/index.html
 * @memberof UiElements
 */
export class ImportRequestsTable extends ImportBaseTable {
  static get styles() {
    return [
      styles,
      css`
      .selected-counter {
        margin-left: 32px;
      }

      .project-header {
        font-size: var(--arc-font-headline-font-size);
        font-weight: var(--arc-font-headline-font-weight);
        letter-spacing: var(--arc-font-headline-letter-spacing);
        line-height: var(--arc-font-headline-line-height);
        height: 48px;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-left: 12px;
      }

      .project-block {
        background-color: var(--import-table-title-request-project-background-color, #F5F5F5);
        margin-bottom: 12px;
      }
      `
    ];
  }

  render() {
    return html`
    ${this.headerTemplate}
    <iron-collapse .opened="${this.opened}">
      ${this.tableHeaderTemplate}
      <anypoint-selector
        multi
        toggle
        attrforselected="data-key"
        selectable="anypoint-icon-item"
        .selectedValues="${this.selectedIndexes}"
        @selectedvalues-changed="${this._selectedHandler}">
      ${this.projectsTemplate()}
      ${this.requestsTemplate()}
      </anypoint-selector>
    </iron-collapse>`;
  }

  projectsTemplate() {
    const { projectsData, projects } = this;
    if (!projectsData || !projectsData.length) {
      return '';
    }
    return projectsData.map((item, index) => html`
    <div class="project-block" data-project="${item.projectId}">
      <div class="project-header">Project: ${this._computeProjectLabel(item.projectId, projects)}</div>
    </div>
    ${this.repeaterTemplate(item.requests)}
    `);
  }

  requestsTemplate() {
    const { nonProjects } = this;
    return html`<div class="project-block">
      <div class="project-header">Default</div>
    </div>
    ${this.repeaterTemplate(nonProjects)}`;
  }

  _itemBodyTemplate(item) {
    return html`<div class="no-wrap">${item.name}</div>
    <div secondary class="no-wrap">${item.url}</div>`;
  }

  _itemBodyContentTemplate(item) {
    return html`
    <span class="method-label">
      <http-method-label method="${item.method}"></http-method-label>
    </span>
    <anypoint-item-body twoline>
      ${this._itemBodyTemplate(item)}
    </anypoint-item-body>`;
  }


  static get properties() {
    return {
      // List of projects included in the import
      projects: { type: Array },
      nonProjects: { type: Array },
      projectsData: { type: Array }
    };
  }

  _dataChanged(data) {
    super._dataChanged(data);
    if (!data) {
      return;
    }
    const nonProjects = [];
    let projectsData = {};
    data.forEach((item) => {
      if (item.legacyProject) {
        if (item.legacyProject in projectsData) {
          projectsData[item.legacyProject].push(item);
        } else {
          projectsData[item.legacyProject] = [item];
        }
      } else if (item.projects && item.projects.length) {
        for (let i = 0, len = item.projects.length; i < len; i++) {
          if (item.projects[i] in projectsData) {
            projectsData[item.projects[i]].push(item);
          } else {
            projectsData[item.projects[i]] = [item];
          }
        }
      } else {
        nonProjects.push(item);
      }
    });
    this.nonProjects = nonProjects;
    projectsData = Object.keys(projectsData).map((id) => {
      return {
        projectId: id,
        requests: projectsData[id]
      };
    });
    this.projectsData = projectsData;
  }
  // Computes lable for a project
  _computeProjectLabel(id, list) {
    if (!id || !list || !list.length) {
      return '';
    }
    const project = list.find((item) => item._id === id);
    if (!project) {
      return '';
    }
    return project.name;
  }
}
