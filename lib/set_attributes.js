'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setAttributes;

var _keys = require('lodash/keys');

var _keys2 = _interopRequireDefault(_keys);

var _inflection = require('inflection');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setAttributes() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var model = options.model,
      modelJson = options.modelJson;


  (0, _keys2.default)(model.constructor.attributes).forEach(function (attributeName) {
    model[attributeName] = modelJson[attributeName] ? modelJson[attributeName] : modelJson[(0, _inflection.underscore)(attributeName)];
  });
}
//# sourceMappingURL=set_attributes.js.map