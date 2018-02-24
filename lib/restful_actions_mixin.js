'use strict';

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

var _base_model = require('./base_model');

var _base_model2 = _interopRequireDefault(_base_model);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_base_model2.default.addClassAction('create', function (attributes) {
  var _this = this;

  if ((0, _isString2.default)(attributes)) {
    attributes = { name: attributes };
  }

  return _api2.default.request({
    method: 'post',
    data: attributes,
    endpoint: this.urlRoot,
    onSuccess: function onSuccess() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var json = options.body;

      var model = _this.set({
        modelJson: json[_this.jsonKey],
        topLevelJson: json
      });

      if ((0, _isFunction2.default)(model.afterCreate)) {
        model.afterCreate(options);
      }
    }
  });
});

_base_model2.default.addClassAction('load', function (id, isIncludeDeleted) {
  var _this2 = this;

  return _api2.default.request({
    endpoint: this.urlRoot + '/' + id,
    data: {
      include_deleted: isIncludeDeleted
    },
    onSuccess: function onSuccess() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var json = options.body;

      _this2.set({
        modelJson: json[_this2.jsonKey],
        topLevelJson: json
      });
    }
  });
});

_base_model2.default.addAction('update', function () {
  var _this3 = this;

  var attributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _api2.default.request({
    method: 'put',
    data: attributes,
    endpoint: this.urlRoot + '/' + this.id,
    onSuccess: function onSuccess() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var json = options.body;

      _this3.set({
        modelJson: json[_this3.jsonKey],
        topLevelJson: json
      });

      if ((0, _isFunction2.default)(_this3.afterUpdate)) {
        _this3.afterUpdate(options);
      }
    }
  });
});

_base_model2.default.addAction('destroy', function () {
  var _this4 = this;

  return _api2.default.request({
    method: 'del',
    endpoint: this.urlRoot + '/' + this.id,
    onSuccess: function onSuccess() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _this4.onDestroy();

      if ((0, _isFunction2.default)(_this4.afterDestroy)) {
        _this4.afterDestroy(options);
      }
    }
  });
});
//# sourceMappingURL=restful_actions_mixin.js.map