"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var lowercaseFirstLetter = function lowercaseFirstLetter(string) {
	return string.charAt(0).toLowerCase() + string.slice(1);
};

var upperCaseFirstLetter = function upperCaseFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

exports.lowercaseFirstLetter = lowercaseFirstLetter;
exports.upperCaseFirstLetter = upperCaseFirstLetter;
//# sourceMappingURL=utils.js.map