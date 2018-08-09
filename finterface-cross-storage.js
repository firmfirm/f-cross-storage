import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
/**
 * `FInterface.CrossStorage` exposes public interface of `<f-cross-storage>`.
 *
 * To be used in it's wrappers, stubs or replacements.
 *
 * @polymerBehavior
 */
FInterface.CrossStorage = dedupingMixin(function(superClass) {
  return class CrossStorage extends superClass {
    static get properties() {
      return {
        /*
         * URL to your cross-storage hub
         */
        hubUrl: {
          type: String,
          reflectToAttribute: true
        },
      };
    }
  }
});
