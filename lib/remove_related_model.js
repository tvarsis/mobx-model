"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = removeRelatedModel;
function removeRelatedModel() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var model = options.model,
      relation = options.relation,
      relatedModel = options.relatedModel;


  if (relation.isHasMany) {
    var collection = model[relation.propertyName];
    collection.splice(collection.indexOf(relatedModel), 1);
  } else if (relation.isHasOne) {
    model[relation.propertyName] = relation.initialValue;
  }
}
//# sourceMappingURL=remove_related_model.js.map