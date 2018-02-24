'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setRelations;

var _set_relation = require('./set_relation');

var _set_relation2 = _interopRequireDefault(_set_relation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setRelations() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _options = options,
      model = _options.model,
      modelJson = _options.modelJson,
      requestId = _options.requestId,
      topLevelJson = _options.topLevelJson;


  model.constructor.relations.forEach(function (relation) {

    var embeddedJson = modelJson[relation.jsonKey];
    var foreignKeys = modelJson[relation.foreignKey];

    options = {
      model: model,
      relation: relation,
      requestId: requestId,
      topLevelJson: topLevelJson
    };

    if (embeddedJson) {
      Object.assign(options, { modelJson: embeddedJson });
    } else if (foreignKeys !== undefined) {
      Object.assign(options, { ids: foreignKeys });
    }

    // console.log(relation.propertyName, attributes);
    (0, _set_relation2.default)(options);
  });
}
//# sourceMappingURL=set_relations.js.map