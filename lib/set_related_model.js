"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setRelatedModel;
var _isNumber = _interopRequireDefault(require("lodash/isNumber"));
var _isPlainObject = _interopRequireDefault(require("lodash/isPlainObject"));
var _find = _interopRequireDefault(require("lodash/find"));
var _includes = _interopRequireDefault(require("lodash/includes"));
var _base_model = _interopRequireDefault(require("./base_model"));
function setRelatedModel() {
  let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let {
    id,
    modelJson,
    relatedModel,
    // related model instance, basically the same as existingRelatedModel
    model,
    relation,
    requestId,
    topLevelJson
  } = options;
  let existingRelatedModel;
  // id, json, relatedModel,   

  if (!id && !modelJson && !relatedModel) return;

  // if only id was passed, try to get json from top level
  if (id && !modelJson) {
    let topLevelModelJson = topLevelJson[relation.topLevelJsonKey];
    if (topLevelModelJson) {
      modelJson = (0, _find.default)(topLevelModelJson, {
        id
      });
    }
  }
  if (!id && modelJson) id = modelJson.id;
  if (!id && relatedModel) id = relatedModel.id;

  // try to find it in array by id if hasMany relation
  if (relation.isHasMany) {
    existingRelatedModel = model[relation.propertyName].find(m => m.id === id);
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
          modelJson,
          requestId,
          topLevelJson
        });
      }
    }

    // if we finally got related model, or it was passed
    // add it to relation property
    if (relatedModel) {
      // push new model to array
      if (relation.isHasMany && !(0, _includes.default)(model[relation.propertyName], relatedModel)) {
        model[relation.propertyName].push(relatedModel);

        // or just assign it to the property
      } else if (relation.isHasOne) {
        model[relation.propertyName] = relatedModel;
      }

      // if there is reverse relation, add current model
      // to the related model's reverse relation.
      let reverseRelation = relation.reverseRelation;
      if (reverseRelation) {
        let setReverseRelation = relatedModel[reverseRelation.setMethodName];
        // console.log('reverseRelation', relation, relatedModel, reverseRelation.setMethodName, model)
        if (setReverseRelation) setReverseRelation({
          relatedModel: model
        });
      }
    }
    return relatedModel;

    // if there is existing related model
  } else {
    // update it with json if it was passed
    if (modelJson) {
      existingRelatedModel.set({
        requestId,
        modelJson,
        topLevelJson
      });
    }
    return existingRelatedModel;
  }
}
//# sourceMappingURL=set_related_model.js.map