[![Published on NPM](https://img.shields.io/npm/v/@advanced-rest-client/import-panel.svg)](https://www.npmjs.com/package/@advanced-rest-client/import-panel)
[![Build Status](https://travis-ci.org/advanced-rest-client/import-panel.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/import-panel)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/advanced-rest-client/import-panel)

# import-panel

Data import screen for Advanced REST Client.
Contains access to various import methods and data inspection view.


## Usage

### Installation
```
npm install --save @advanced-rest-client/import-panel
```

### In a LitElement

```js
import { LitElement, html } from 'lit-element';
import '@advanced-rest-client/import-panel/import-panel.js';

class SampleElement extends LitElement {
  render() {
    return html`
    <import-panel></import-panel>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

## Development

```sh
git clone https://github.com/advanced-rest-client/import-panel
cd import-panel
npm install
```

### Running the tests

```sh
npm test
```

### Running the demo locally

```sh
npm start
```

## API components

This components is a part of [API components ecosystem](https://elements.advancedrestclient.com/)
