"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _superagent = require("superagent");

var _superagent2 = _interopRequireDefault(_superagent);

var _qs = require("qs");

var _qs2 = _interopRequireDefault(_qs);

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

var _pick = require("lodash/pick");

var _pick2 = _interopRequireDefault(_pick);

var _isFunction = require("lodash/isFunction");

var _isFunction2 = _interopRequireDefault(_isFunction);

var _isEmpty = require("lodash/isEmpty");

var _isEmpty2 = _interopRequireDefault(_isEmpty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bluebird2.default.config({
  warnings: true,
  longStackTraces: true,
  cancellation: true
});

var API = {
  config: function config() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    Object.assign(this, (0, _pick2.default)(options, ["onRequestError", "onRequestCompleted", "requestData", "requestHeaders", "urlRoot", "superagent"]));
  },
  request: function request() {
    var _this = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var method = options.method,
        data = options.data,
        endpoint = options.endpoint,
        onSuccess = options.onSuccess,
        onError = options.onError,
        fileData = options.fileData,
        superagent = options.superagent;

    var requestData = void 0,
        requestHeaders = void 0,
        doRequest = void 0;
    var request = superagent || this.superagent || _superagent2.default;

    if (!method) {
      method = "get";
    }
    if (!data) {
      data = {};
    }
    if (!endpoint) {
      throw new Error("Please provide an endpoint for an API call");
    }

    if (!onSuccess) {
      onSuccess = function onSuccess(options) {};
    }

    if (!onError) {
      onError = function onError(options) {};
    }

    // set headers
    doRequest = request[method](this.urlRoot + endpoint);

    if ((0, _isEmpty2.default)(fileData)) {
      doRequest.accept("json");
    }

    if ((0, _isFunction2.default)(this.requestHeaders)) {
      requestHeaders = this.requestHeaders();
    } else {
      requestHeaders = this.requestHeaders;
    }

    Object.keys(requestHeaders).forEach(function (header) {
      doRequest = doRequest.set(header, requestHeaders[header]);
    });

    // for now do not send any data except files if they are passed
    if (!(0, _isEmpty2.default)(fileData)) {
      // merge default requestData with object passed with this request
      if ((0, _isFunction2.default)(this.requestData)) {
        requestData = this.requestData();
      } else {
        requestData = this.requestData;
      }

      Object.assign(data, requestData);
    }

    // just send as POST or prepare data for GET request
    if (method === "post" || method === "put" || method === "patch") {
      if (!(0, _isEmpty2.default)(fileData)) {
        var formData = new FormData();
        formData.append(fileData.attibuteName, fileData.file);
        doRequest.send(formData);
      } else {
        doRequest.send(data);
      }
    } else if (method === "get" || method == "del") {
      doRequest.retry(3).query(_qs2.default.stringify(data, { arrayFormat: "brackets" }));
    }

    return new _bluebird2.default(function (resolve) {
      // send request and act upon result
      doRequest.end(function (err, response) {
        if (_this.onRequestCompleted) _this.onRequestCompleted(response);

        if (!response || !response.ok) {
          //let errors = response.body ? response.body.errors : 'Something bad happened';
          //let statusCode = response.status;

          if (_this.onRequestError) _this.onRequestError(response, err);

          onError(response);
        } else {
          onSuccess(response);
        }

        /*
          we resolve promise even if request
          was not successfull to reduce boilerplat
          + because we  typically don't want ui do
          have some specific behaviour in this case
         */

        resolve(response);
      });
    });
  }
};

exports.default = API;
//# sourceMappingURL=api.js.map