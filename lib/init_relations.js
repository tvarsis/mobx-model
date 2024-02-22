"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = initRelations;
var _mobx = require("mobx");
var _set_relations_defaults = _interopRequireDefault(require("./set_relations_defaults"));
var _remove_related_model = _interopRequireDefault(require("./remove_related_model"));
var _set_related_model = _interopRequireDefault(require("./set_related_model"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function initRelations() {
  let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let {
    model
  } = options;

  // set defaults for relations
  (0, _set_relations_defaults.default)(model);
  model.constructor.relations.forEach(relation => {
    (0, _mobx.extendObservable)(model, {
      [relation.propertyName]: relation.initialValue
    });

    // add alias method to set relation to model's instance
    model[relation.setMethodName] = function () {
      let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      Object.assign(options, {
        relation,
        model
      });
      return (0, _set_related_model.default)(options);
    }.bind(model);

    // add alias method to remove relation to model's instance
    model[relation.removeMethodName] = function (relatedModel) {
      return (0, _remove_related_model.default)({
        model,
        relation,
        relatedModel
      });
    }.bind(model);
  });
}
//# sourceMappingURL=init_relations.js.map