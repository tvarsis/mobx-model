'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = initRelations;

var _mobx = require('mobx');

var _set_relations_defaults = require('./set_relations_defaults');

var _set_relations_defaults2 = _interopRequireDefault(_set_relations_defaults);

var _remove_related_model = require('./remove_related_model');

var _remove_related_model2 = _interopRequireDefault(_remove_related_model);

var _set_related_model = require('./set_related_model');

var _set_related_model2 = _interopRequireDefault(_set_related_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function initRelations() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var model = options.model;

  // set defaults for relations

  (0, _set_relations_defaults2.default)(model);

  model.constructor.relations.forEach(function (relation) {

    (0, _mobx.extendObservable)(model, _defineProperty({}, relation.propertyName, relation.initialValue));

    // add alias method to set relation to model's instance
    model[relation.setMethodName] = function () {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      Object.assign(options, { relation: relation, model: model });
      return (0, _set_related_model2.default)(options);
    }.bind(model);

    // add alias method to remove relation to model's instance
    model[relation.removeMethodName] = function (relatedModel) {
      return (0, _remove_related_model2.default)({
        model: model,
        relation: relation,
        relatedModel: relatedModel
      });
    }.bind(model);
  });
}
//# sourceMappingURL=init_relations.js.map