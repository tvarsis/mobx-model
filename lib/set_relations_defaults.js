'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setRelationsDefaults;

var _utils = require('./utils');

var _inflection = require('inflection');

var _isBoolean = require('lodash/isBoolean');

var _isBoolean2 = _interopRequireDefault(_isBoolean);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// mutate static relations and add defaults
// to each relation
function setRelationsDefaults(model) {

  if (!model.constructor.getModel) {
    throw new Error("getModel static method must be defined for a \
                     base model class, that returns model class given its name");
  }

  model.constructor.relations.forEach(function (relation) {

    if (relation._isPrepared) return;

    // console.log('setRelationsDefaults', model, relation)   

    // shorthand method to quickly check if relation is of hasMany type
    Object.defineProperty(relation, "isHasMany", {
      get: function get() {
        return this.type === 'hasMany';
      }
    });

    // shorthand method to quickly check if relation is of hasOne type
    Object.defineProperty(relation, "isHasOne", {
      get: function get() {
        return this.type === 'hasOne';
      }
    });

    // set initialValue for relation property
    if (relation.isHasMany) {
      relation.initialValue = [];
    } else if (relation.isHasOne) {
      relation.initialValue = null;
    }

    if ((0, _isString2.default)(relation.relatedModel)) {
      relation.relatedModel = model.constructor.getModel(relation.relatedModel);
    }

    // property name on model instance to relation(s)
    if (!relation.propertyName) {
      relation.propertyName = (0, _utils.lowercaseFirstLetter)(relation.relatedModel.modelName || relation.relatedModel.name);

      if (relation.isHasMany) {
        relation.propertyName = (0, _inflection.pluralize)(relation.propertyName);
      }
    }

    // json key for embedded json
    if (!relation.jsonKey) {
      relation.jsonKey = (0, _inflection.underscore)(relation.propertyName);
    }

    // key in top level json
    if (!relation.topLevelJsonKey) {
      relation.topLevelJsonKey = (0, _inflection.tableize)(relation.propertyName);
    }

    // foreign key with ids of relations
    if (!relation.foreignKey) {
      if (relation.isHasMany) {
        relation.foreignKey = (0, _inflection.foreign_key)((0, _inflection.singularize)(relation.propertyName)) + 's';
      } else if (relation.isHasOne) {
        relation.foreignKey = (0, _inflection.foreign_key)(relation.propertyName);
      }
    }

    var name = (0, _utils.upperCaseFirstLetter)(relation.propertyName);
    if (relation.isHasMany) name = (0, _inflection.singularize)(name);

    // method name to add single relation, will be used as alias
    if (!relation.setMethodName) {
      relation.setMethodName = 'set' + name;
    }

    // method name to remove single relation, will be used as alias
    if (!relation.removeMethodName) {
      relation.removeMethodName = 'remove' + name;
    }

    var reverseRelation = relation.reverseRelation;

    if (reverseRelation) {

      if ((0, _isBoolean2.default)(reverseRelation)) {
        reverseRelation = relation.reverseRelation = {};
      }

      if (!reverseRelation.onDestroy && reverseRelation.onDestroy !== false) {
        reverseRelation.onDestroy = 'removeSelf';
      }

      if (!reverseRelation.propertyName) {
        reverseRelation.propertyName = (0, _utils.lowercaseFirstLetter)(model.constructor.modelName || model.constructor.name);
      }

      var _name = (0, _utils.upperCaseFirstLetter)(reverseRelation.propertyName);

      if (!reverseRelation.setMethodName) {
        reverseRelation.setMethodName = 'set' + _name;
      }

      if (!reverseRelation.removeMethodName) {
        reverseRelation.removeMethodName = 'remove' + _name;
      }

      //console.log('setRelationsDefaults reverseRelation is true', relation.reverseRelation, relation)
    }

    relation._isPrepared = true;
  });
}
//# sourceMappingURL=set_relations_defaults.js.map