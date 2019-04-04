import '../../@polymer/polymer/polymer-element.js';
import '../../@polymer/paper-styles/shadow.js';
import '../../@polymer/iron-flex-layout/iron-flex-layout.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="import-table-common-styles">
  <template>
    <style>
    :host {
      display: block;
      padding: 0 16px;
      margin-bottom: 24px;
      @apply --arc-font-body1;
      @apply --shadow-elevation-2dp;
      @apply --import-table;
    }

    :host([opened]) {
      padding-bottom: 16px;
      @apply --import-table-opened;
    }

    .title {
      @apply --layout-horizontal;
      @apply --layout-center;
      cursor: pointer;
    }

    h3 {
      @apply --layout-flex;
      @apply --arc-font-title;
      font-weight: 400;
      margin-left: 14px;
      @apply --import-table-title;
    }

    .toggle-icon {
      transition: transform 0.2s ease-in-out;
    }

    .toggle-icon.opened {
      transform: rotate(-180deg);
    }

    .table-options {
      @apply --layout-horizontal;
      @apply --layout-center;
      padding-left: 16px;
      margin: 24px 0;
      @apply --import-table-header;
    }

    .table-options .hiddable {
      opacity: 1;
      transition: opacity 0.2s cubic-bezier(0.47, 0, 0.75, 0.72);
    }

    .table-options.inactive .hiddable {
      pointer-events: none;
      opacity: 0;
    }

    .method-label {
      min-width: 90px;
      @apply --import-table-method-label;
    }

    .selected-counter {
      display: inline-block;
      margin-left: 28px;
      font-size: 16px;
      font-weight: 500;
      @apply --import-table-selection-counter;
    }

    http-method-label {
      font-size: 13px;
      padding: 8px;
    }

    .list-item {
      cursor: pointer;
      @apply --import-table-list-item;
    }
    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);

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
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
;