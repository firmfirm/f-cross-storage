/**
The following imports are available:

  - [f-cross-storage.html](#f-cross-storage)
  - [finterface-cross-storage.html](#FInterface.CrossStorage)

@pseudoElement Documentation
@demo demo/index.html
*/
/**
`<f-cross-storage>` is a wrapper element for [cross-storage](https://github.com/zendesk/cross-storage) client,
built with Polymer.

Example:

    <f-cross-storage hub-url="https://..." key="mySetting" value="{{myProperty}}"></f-cross-storage>

@demo demo/index.html
@hero hero.svg
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';
import {html} from "@polymer/polymer/polymer-element.js"

import 'f-singleton/f-singleton.js';
import 'promise-to-retry/promise-to-retry.js';
import 'cross-storage/dist/client.js';
import './finterface-cross-storage.js';
FirmFirm.CrossStorage = (function() {
  var clients = {};
  class FCrossStorage extends FInterface.CrossStorage(FirmFirm.FSingleton) {
    static get template() {
      return html`
    <f-singleton key="{{key}}" value="{{value}}"></f-singleton>
`;
    }

    static get is() { return 'f-cross-storage'; }
    static get properties() {
      return {
        _client: Object,
      };
    }
    static get observers() {
      return [
        '_connect(hubUrl)',
        '_pull(_client, key)',
        '_push(_client, key, value)'
      ];
    }

    _connect(url) {
      if (!clients[url]) {
        clients[url] = new CrossStorageClient(url);
      }
      this._client = clients[url];
    }

    _pull(client, key) {
      if (client && key) {
        PromiseToRetry.ensure(() =>
                client.onConnect()
                      .then(() => client.get(key))
                      .then((val) => this.value = this._lastValue = val),
                this._fail.bind(this));
      }
    }

    _push(client, key, value) {
      if (client && key && typeof value !== "undefined" && value !== this._lastValue) {
        this._lastValue = value;
        PromiseToRetry.ensure(
          () => client.onConnect().then(() => client.set(key, value)),
          this._fail.bind(this));
      }
    }

    /**
     * The `f-cross-storage-error` event is fired whenever element fails to
     * retrieve of set value in cross-storage. Will automatically retry after
     * `time` specified in event's `detail` (in milliseconds).
     *
     * @event f-cross-storage-error
     * @detail {{tries: Number, wait: Number, error: Object}}
     */

    _fail(detail) {
      const e = new CustomEvent('f-cross-storage-error', {detail});
      this.dispatchEvent(e, {bubbles: true});
    }
  }
  customElements.define(FCrossStorage.is, FCrossStorage);
  return FCrossStorage;
})();
