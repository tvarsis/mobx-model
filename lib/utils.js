"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upperCaseFirstLetter = exports.lowercaseFirstLetter = void 0;
let lowercaseFirstLetter = function (string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
};
exports.lowercaseFirstLetter = lowercaseFirstLetter;
let upperCaseFirstLetter = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
exports.upperCaseFirstLetter = upperCaseFirstLetter;
//# sourceMappingURL=utils.js.map