/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/tools/tree/master/packages/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   import-panel.html
 */

/// <reference path="../polymer/types/polymer-element.d.ts" />
/// <reference path="../google-drive-browser/google-drive-browser.d.ts" />
/// <reference path="../file-reader/file-reader.d.ts" />
/// <reference path="../paper-button/paper-button.d.ts" />
/// <reference path="../iron-pages/iron-pages.d.ts" />
/// <reference path="../iron-icon/iron-icon.d.ts" />
/// <reference path="../arc-icons/arc-icons.d.ts" />
/// <reference path="../paper-icon-button/paper-icon-button.d.ts" />
/// <reference path="../iron-flex-layout/iron-flex-layout.d.ts" />
/// <reference path="../paper-styles/shadow.d.ts" />
/// <reference path="../paper-input/paper-textarea.d.ts" />
/// <reference path="../paper-toast/paper-toast.d.ts" />
/// <reference path="import-data-inspector.d.ts" />

declare namespace UiElements {

  /**
   * The data import view for ARC.
   *
   * Generates the UI and support logic for importing data from a file, Google Drive,
   * and copy / paste action.
   *
   * It requires the `arc-data-import` element to be present in the DOM to handle
   * `import-data` and `import-normalize` events.
   *
   * ### Example
   *
   * ```
   * <import-panel></import-panel>
   * ```
   *
   * ### Styling
   *
   * `<import-panel>` provides the following custom properties and mixins for styling:
   *
   * Custom property | Description | Default
   * ----------------|-------------|----------
   * `--import-panel` | Mixin applied to the element | `{}`
   * `--action-button` | MIxin applied to main action buttons | `{}`
   * `--error-toast` | Mixin applied to a toast with error message | `{}`
   * `--warning-primary-color` | Background color of error toast | `#FF7043`
   * `--warning-contrast-color`| Color of error toast | `#fff`
   * `--import-panel-card` | Mixin applied to a paper card like element | `{}`
   * `--import-data-inspector` | Mixin applied to the element | `{}`
   * `--action-button` | Mixin applied to the primary acction button | `{}`
   * `--import-data-inspector-meta-color` | Color of the meta data property | `{}`
   * `--import-table` | Mixin applied to a table with data import | `{}`
   * `--import-table-opened` | Mixin applied to a table with data import when opened | `{}`
   * `--import-table-title` | Mixin applied to the title of the import table | `{}`
   * `--import-table-header` | Mixin applied to data table header with selecyion options | `{}`
   * `--import-table-method-label` | Mixin applied to the HTTP method label container | `{}`
   * `--import-table-selection-counter` | Mixin applied to a table selection counter label | `{}`
   * `--import-table-list-item` | Mixin applied to data table's items | `{}`
   */
  class ImportPanel extends Polymer.Element {

    /**
     * Loadded and normalized import data
     */
    data: object|null|undefined;

    /**
     * Computed value, true if import data are present.
     */
    readonly hasData: boolean|null|undefined;

    /**
     * Treue when file is being loaded.
     */
    readingFile: boolean|null|undefined;

    /**
     * Currently selected import page.
     *
     * -   0 is import options selector
     * -   1 is Google Drive file picker
     * -   2 is paste data
     * -   3 is import table preview
     */
    selectedPage: number|null|undefined;

    /**
     * True when file is being imported.
     */
    readonly importing: boolean|null|undefined;

    /**
     * True if user selected Drive import
     */
    withDriveList: boolean|null|undefined;

    /**
     * Drive API api key value to be passed to the Drive picker.
     */
    apiKey: string|null|undefined;

    /**
     * OAuth 2 access token for Drive Panel
     */
    accessToken: string|null|undefined;
    _computeLoader(readingFile: any, importing: any): any;

    /**
     * Computes if data preview table should be hidden.
     */
    _computeTable(hasData: any, importing: any): any;
    _computeFileSelector(hasData: any, withDriveList: any): any;
    _computeHasData(data: any): any;

    /**
     * Opens the file selector. It must be done in user related action.
     */
    _selectFile(): void;

    /**
     * Handler called when file has been added by the user.
     */
    _onImportFile(e: Event|null): void;
    _resetFileDrop(): void;

    /**
     * Notifies the user about error.
     *
     * @param message Message to display
     */
    _notifyError(message: String|null): void;

    /**
     * A handler called when the file can't be read.
     */
    _importFileError(e: CustomEvent|null): void;

    /**
     * Moves the view to previous screen.
     */
    screenBack(): void;

    /**
     * Opend import from Google Drive view
     */
    _importDrive(): void;

    /**
     * Opens paste from clipboard view
     */
    _pasteData(): void;

    /**
     * Handler for the `drive-file-picker-data` event with drive file data
     */
    _driveContentReady(e: any): void;

    /**
     * Handler called when the files has been read.
     */
    _importFileReady(e: CustomEvent|null): void;

    /**
     * Handles import from text action.
     */
    _importText(): any;

    /**
     * Processes import file content by sending `import-normalize` custom
     * event that should be handled by `arc-data-import` element.
     *
     * When data are normalized it switches to data table view.
     *
     * @param content Read data content
     * @returns A promise resolved when data were processed.
     */
    _processContent(content: String|null): Promise<any>|null;

    /**
     * Sends the `import-data` custom event to the import element to save the data
     */
    _importData(e: CustomEvent|null): Promise<any>|null;
    _sendError(message: any): void;
  }
}

interface HTMLElementTagNameMap {
  "import-panel": UiElements.ImportPanel;
}