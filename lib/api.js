"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _superagent = _interopRequireDefault(require("superagent"));
var _qs = _interopRequireDefault(require("qs"));
var _pick = _interopRequireDefault(require("lodash/pick"));
var _isFunction = _interopRequireDefault(require("lodash/isFunction"));
var _isEmpty = _interopRequireDefault(require("lodash/isEmpty"));
const API = {
  config() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    Object.assign(this, (0, _pick.default)(options, ["onRequestError", "onRequestCompleted", "requestData", "requestHeaders", "urlRoot", "superagent"]));
  },
  request() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let {
      method,
      data,
      endpoint,
      onSuccess,
      onError,
      fileData,
      superagent,
      passedRequestHeaders,
      retry
    } = options;
    let requestData, requestHeaders, doRequest;
    const request = superagent || this.superagent || _superagent.default;
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
      onSuccess = options => {};
    }
    if (!onError) {
      onError = options => {};
    }

    // set headers
    doRequest = request[method](this.urlRoot + endpoint);
    if ((0, _isEmpty.default)(fileData)) {
      doRequest.accept("json");
    }
    if ((0, _isFunction.default)(this.requestHeaders)) {
      requestHeaders = this.requestHeaders();
    } else {
      requestHeaders = this.requestHeaders;
    }
    if (passedRequestHeaders) {
      requestHeaders = {
        ...requestHeaders,
        ...passedRequestHeaders
      };
    }
    Object.keys(requestHeaders).forEach(header => {
      doRequest = doRequest.set(header, requestHeaders[header]);
    });

    // for now do not send any data except files if they are passed
    if (!(0, _isEmpty.default)(fileData)) {
      // merge default requestData with object passed with this request
      if ((0, _isFunction.default)(this.requestData)) {
        requestData = this.requestData();
      } else {
        requestData = this.requestData;
      }
      Object.assign(data, requestData);
    }
    const retryCount = retry !== null && retry !== void 0 ? retry : 3;
    console.log(retryCount, 'retryCount');
    // just send as POST or prepare data for GET request
    if (method === "post" || method === "put" || method === "patch") {
      if (!(0, _isEmpty.default)(fileData)) {
        let formData = new FormData();
        formData.append(fileData.attibuteName, fileData.file);
        doRequest.send(formData);
      } else {
        doRequest.send(data);
      }
    } else if (method === "get" || method == "del") {
      doRequest.retry(retryCount).query(_qs.default.stringify(data, {
        arrayFormat: "brackets"
      }));
    }
    return new Promise(resolve => {
      // send request and act upon result
      doRequest.end((err, response) => {
        if (this.onRequestCompleted) this.onRequestCompleted(response);
        if (!response || !response.ok) {
          // let errors = response.body ? response.body.errors : 'Something bad happened';
          // let statusCode = response.status;

          if (this.onRequestError) this.onRequestError(response, err);
          onError(response);
        } else {
          onSuccess(response);
        }

        /*
          we resolve promise even if request
          was not successful to reduce boilerplate
          + because we typically don't want ui to
          have some specific behaviour in this case
         */

        resolve(response);
      });
    });
  }
};
var _default = exports.default = API;
//# sourceMappingURL=api.js.map