'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.BaseModel = exports.API = undefined;

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

var _base_model = require('./base_model');

var _base_model2 = _interopRequireDefault(_base_model);

require('./restful_actions_mixin');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.API = _api2.default;
exports.BaseModel = _base_model2.default;

// Add default RESTful actions to BaseModel
//# sourceMappingURL=index.js.map