"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = removeRelatedModel;
function removeRelatedModel() {
  let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let {
    model,
    relation,
    relatedModel
  } = options;
  if (relation.isHasMany) {
    let collection = model[relation.propertyName];
    collection.splice(collection.indexOf(relatedModel), 1);
  } else if (relation.isHasOne) {
    model[relation.propertyName] = relation.initialValue;
  }
}
//# sourceMappingURL=remove_related_model.js.map