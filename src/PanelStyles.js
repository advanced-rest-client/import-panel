import { css } from 'lit-element';
export default css`
:host {
  display: block;
  height: inherit;
}

h2 {
  font-size: var(--arc-font-headline-font-size);
  font-weight: var(--arc-font-headline-font-weight);
  letter-spacing: var(--arc-font-headline-letter-spacing);
  line-height: var(--arc-font-headline-line-height);
}

input[type="file"] {
  display: none;
}

.title-action {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.page-content,
.page-content > section {
  height: inherit;
  min-height: inherit;
}

.drive-browser {
  display: flex;
  flex-direction: column;
}

google-drive-browser,
import-data-inspector {
  flex: 1;
  overflow: auto;
}

.text-import {
  padding-bottom: 20px;
  max-height: calc(100% - 64px);
}

.error-toast {
  background-color: var(--warning-primary-color, #FF7043);
  color: var(--warning-contrast-color, #fff);
}

.form-actions {
  flex: 1;
  justify-content: flex-end;
  display: flex;
  flex-direction: row;;
}

.icon {
  display: block;
  fill: currentColor;
  width: 24px;
  height: 24px;
}

.inspector {
  display: flex;
  flex-direction: column;
}`;
