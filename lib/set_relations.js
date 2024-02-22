"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setRelations;
var _set_relation = _interopRequireDefault(require("./set_relation"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function setRelations() {
  let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let {
    model,
    modelJson,
    requestId,
    topLevelJson
  } = options;
  model.constructor.relations.forEach(relation => {
    let embeddedJson = modelJson[relation.jsonKey];
    let foreignKeys = modelJson[relation.foreignKey];
    options = {
      model,
      relation,
      requestId,
      topLevelJson
    };
    if (embeddedJson) {
      Object.assign(options, {
        modelJson: embeddedJson
      });
    } else if (foreignKeys !== undefined) {
      Object.assign(options, {
        ids: foreignKeys
      });
    }

    // console.log(relation.propertyName, attributes);
    (0, _set_relation.default)(options);
  });
}
//# sourceMappingURL=set_relations.js.map