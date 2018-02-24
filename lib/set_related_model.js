'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setRelatedModel;

var _isNumber = require('lodash/isNumber');

var _isNumber2 = _interopRequireDefault(_isNumber);

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _find = require('lodash/find');

var _find2 = _interopRequireDefault(_find);

var _includes = require('lodash/includes');

var _includes2 = _interopRequireDefault(_includes);

var _base_model = require('./base_model');

var _base_model2 = _interopRequireDefault(_base_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setRelatedModel() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var id = options.id,
      modelJson = options.modelJson,
      relatedModel = options.relatedModel,
      model = options.model,
      relation = options.relation,
      requestId = options.requestId,
      topLevelJson = options.topLevelJson;


  var existingRelatedModel = void 0;
  // id, json, relatedModel,   

  if (!id && !modelJson && !relatedModel) return;

  // if only id was passed, try to get json from top level
  if (id && !modelJson) {
    var topLevelModelJson = topLevelJson[relation.topLevelJsonKey];
    if (topLevelModelJson) {
      modelJson = (0, _find2.default)(topLevelModelJson, { id: id });
    }
  }

  if (!id && modelJson) id = modelJson.id;
  if (!id && relatedModel) id = relatedModel.id;

  // try to find it in array by id if hasMany relation
  if (relation.isHasMany) {
    existingRelatedModel = model[relation.propertyName].find(function (m) {
      return m.id === id;
    });
    // or just check if property is assigned
  } else if (relation.isHasOne) {
    existingRelatedModel = model[relation.propertyName];
    if (existingRelatedModel && existingRelatedModel.id !== id) existingRelatedModel = undefined;
  }

  // if no existing related model was not found 
  if (!existingRelatedModel) {

    // if no related model was passed
    if (!relatedModel) {

      // if no json passed, then just try to fetch model 
      // with given id from the store, if any
      if (!modelJson) {

        /*
         * !!!!!!!!!!!!!!!!!!!!!!!!!!!
         * TODO
         */

        relatedModel = relation.relatedModel.get(id);

        // if not only id was passed in json then do regular
        // processing
      } else {

        // add relation to its store
        relatedModel = relation.relatedModel.set({
          modelJson: modelJson,
          requestId: requestId,
          topLevelJson: topLevelJson
        });
      }
    }

    // if we finally got related model, or it was passed
    // add it to relation property
    if (relatedModel) {

      // push new model to array
      if (relation.isHasMany && !(0, _includes2.default)(model[relation.propertyName], relatedModel)) {
        model[relation.propertyName].push(relatedModel);

        // or just assign it to the property
      } else if (relation.isHasOne) {
        model[relation.propertyName] = relatedModel;
      }

      // if there is reverse relation, add current model
      // to the related model's reverse relation.
      var reverseRelation = relation.reverseRelation;
      if (reverseRelation) {
        var setReverseRelation = relatedModel[reverseRelation.setMethodName];
        // console.log('reverseRelation', relation, relatedModel, reverseRelation.setMethodName, model)
        if (setReverseRelation) setReverseRelation({ relatedModel: model });
      }
    }

    return relatedModel;

    // if there is existing related model
  } else {

    // update it with json if it was passed
    if (modelJson) {
      existingRelatedModel.set({
        requestId: requestId,
        modelJson: modelJson,
        topLevelJson: topLevelJson
      });
    }

    return existingRelatedModel;
  }
}
//# sourceMappingURL=set_related_model.js.map