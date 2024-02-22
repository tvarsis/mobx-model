"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = initAttributes;
var _mobx = require("mobx");
function initAttributes() {
  let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let {
    model
  } = options;
  (0, _mobx.extendObservable)(model, model.constructor.attributes);
}
//# sourceMappingURL=init_attributes.js.map