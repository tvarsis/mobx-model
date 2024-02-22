"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _api = _interopRequireDefault(require("./api"));
var _base_model = _interopRequireDefault(require("./base_model"));
var _isString = _interopRequireDefault(require("lodash/isString"));
var _isFunction = _interopRequireDefault(require("lodash/isFunction"));
_base_model.default.addClassAction('create', function (attributes) {
  var _this = this;
  if ((0, _isString.default)(attributes)) {
    attributes = {
      name: attributes
    };
  }
  return _api.default.request({
    method: 'post',
    data: attributes,
    endpoint: this.urlRoot,
    onSuccess: function () {
      let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      const json = options.body;
      let model = _this.set({
        modelJson: json[_this.jsonKey],
        topLevelJson: json
      });
      if ((0, _isFunction.default)(model.afterCreate)) {
        model.afterCreate(options);
      }
    }
  });
});
_base_model.default.addClassAction('load', function (id, isIncludeDeleted) {
  var _this2 = this;
  return _api.default.request({
    endpoint: "".concat(this.urlRoot, "/").concat(id),
    data: {
      include_deleted: isIncludeDeleted
    },
    onSuccess: function () {
      let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      const json = options.body;
      _this2.set({
        modelJson: json[_this2.jsonKey],
        topLevelJson: json
      });
    }
  });
});
_base_model.default.addAction('update', function () {
  var _this3 = this;
  let attributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return _api.default.request({
    method: 'put',
    data: attributes,
    endpoint: "".concat(this.urlRoot, "/").concat(this.id),
    onSuccess: function () {
      let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      const json = options.body;
      _this3.set({
        modelJson: json[_this3.jsonKey],
        topLevelJson: json
      });
      if ((0, _isFunction.default)(_this3.afterUpdate)) {
        _this3.afterUpdate(options);
      }
    }
  });
});
_base_model.default.addAction('destroy', function () {
  var _this4 = this;
  return _api.default.request({
    method: 'del',
    endpoint: "".concat(this.urlRoot, "/").concat(this.id),
    onSuccess: function () {
      let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      _this4.onDestroy();
      if ((0, _isFunction.default)(_this4.afterDestroy)) {
        _this4.afterDestroy(options);
      }
    }
  });
});
//# sourceMappingURL=restful_actions_mixin.js.map