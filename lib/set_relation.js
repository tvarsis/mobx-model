'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setRelation;

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

var _includes = require('lodash/includes');

var _includes2 = _interopRequireDefault(_includes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setRelation() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var ids = options.ids,
      modelJson = options.modelJson,
      relation = options.relation,
      model = options.model,
      requestId = options.requestId,
      topLevelJson = options.topLevelJson;

  // console.log('setRelation', relation, ids, modelJson)

  // if no ids and json was passed, do nothing

  if (!modelJson && ids === undefined) return;

  if (relation.isHasMany) {

    if (ids && !(0, _isArray2.default)(ids) || modelJson && !(0, _isArray2.default)(modelJson)) {
      throw new Error('Expected json or ids for ' + relation.propertyName + ' to be an array');
    }

    var relatedModelIds = [];
    var collection = model[relation.propertyName];

    var attributes = modelJson ? modelJson : ids;

    // add new relations to this model
    attributes.forEach(function (relatedModelAttributes) {

      // console.log('relatedModelAttributes', relatedModelAttributes)

      var options = {
        requestId: requestId,
        topLevelJson: topLevelJson
      };

      if (modelJson) {
        Object.assign(options, { modelJson: relatedModelAttributes });
      } else {
        Object.assign(options, { id: relatedModelAttributes });
      }

      var relatedModel = model[relation.setMethodName](options);

      // can be undefined for example if we haven't found
      // id in a separate store
      if (relatedModel) {
        relatedModelIds.push(relatedModel.id);
      }
    });

    // remove relations not in json
    collection.slice().forEach(function (relatedModel) {
      if (!(0, _includes2.default)(relatedModelIds, relatedModel.id)) {
        model[relation.removeMethodName](relatedModel);
      }
    });
  } else if (relation.isHasOne) {

    var _options = {
      requestId: requestId,
      topLevelJson: topLevelJson
    };

    if (modelJson) {
      Object.assign(_options, { modelJson: modelJson });
    } else {
      Object.assign(_options, { id: ids });
    }

    // try to set relation
    var relatedModel = model[relation.setMethodName](_options);

    // if no related model was returned then reset property
    if (!relatedModel) {
      model[relation.propertyName] = relation.initialValue;
    }
  }
}
//# sourceMappingURL=set_relation.js.map