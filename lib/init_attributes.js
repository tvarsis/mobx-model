'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = initAttributes;

var _mobx = require('mobx');

function initAttributes() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var model = options.model;

  (0, _mobx.extendObservable)(model, model.constructor.attributes);
}
//# sourceMappingURL=init_attributes.js.map