"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mobx = require("mobx");
var _inflection = require("inflection");
var _filter = _interopRequireDefault(require("lodash/filter"));
var _uniqueId = _interopRequireDefault(require("lodash/uniqueId"));
var _result = _interopRequireDefault(require("lodash/result"));
var _init_attributes = _interopRequireDefault(require("./init_attributes"));
var _set_attributes = _interopRequireDefault(require("./set_attributes"));
var _init_relations = _interopRequireDefault(require("./init_relations"));
var _set_relations = _interopRequireDefault(require("./set_relations"));
/*
 * This is a hack to allow each model that extends
 * BaseModel to have its own observable collection. Model is
 * assigned an observable collection when first instance of model is
 * created or when Model.all() method is called
 */
const initObservables = function (target) {
  if (!target.observables || !(0, _mobx.isObservableArray)(target.observables.collection)) {
    target.observables = {};
    (0, _mobx.extendObservable)(target.observables, {
      collection: _mobx.observable.array([], {
        deep: false
      })
    });
  }
};
class BaseModel {
  static attributes = {};
  static relations = [];
  // static observables = {};

  id = null;
  lastSetRequestId = null;

  // static config = function(options = {}) {
  //   let { models } = options;
  //   this.models = models;
  // };

  /*
  * NOTE: we access internal mobservable array of values to
  * prevent notifying observers when we're just getting single
  * value. This way we'll prevent re-rendering components displaying
  * single model when collection changes
  */
  static get = function (id) {
    let items = this.observables?.collection;
    if (items && (0, _mobx.isObservableArray)(items)) {
      let l = items.length;
      for (var i = 0; i < l; i++) {
        if (items[i].id.toString() === id.toString()) return items[i];
      }
    }
    return null;
  };
  static set = function () {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    // console.log('set static', this.name)

    let {
      modelJson,
      topLevelJson,
      requestId
    } = options;

    /*
    requestId is used to allow models to 
    prevent loops when setting same attributes
    multiple times, we set one if none is set
    */
    if (!requestId) requestId = (0, _uniqueId.default)("request_");

    /*
    * topLevelJson is used to get json for models referenced by ids
    */
    if (!topLevelJson) topLevelJson = modelJson;
    let model = this.get(modelJson.id);
    (0, _mobx.transaction)(() => {
      if (!model) {
        model = new this({
          modelJson,
          topLevelJson,
          requestId
        });
        this.observables.collection.push(model);
      }
      model.set({
        modelJson,
        topLevelJson,
        requestId
      });
    });

    // console.log('set', model)

    return model;
  };
  static remove = function (model) {
    if (this.observables && (0, _mobx.isObservableArray)(this.observables.collection)) {
      this.observables.collection.splice(this.observables.collection.indexOf(model), 1);
    }
  };
  static all = function () {
    initObservables(this);
    return this.observables.collection.slice();
  };
  static addClassAction(actionName, method) {
    Object.defineProperty(this, actionName, {
      get: function () {
        return method.bind(this);
      },
      configurable: true
    });
  }
  static addAction(actionName, method) {
    Object.defineProperty(this.prototype, actionName, {
      get: function () {
        return method.bind(this);
      },
      configurable: true
    });
  }
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let {
      modelJson,
      topLevelJson,
      requestId
    } = options;
    initObservables(this.constructor);
    if (modelJson && modelJson.id) {
      this.id = modelJson.id;
    }
    (0, _init_attributes.default)({
      model: this
    });
    (0, _init_relations.default)({
      model: this
    });
    this.onInitialize();
  }
  set() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let {
      requestId,
      modelJson,
      topLevelJson
    } = options;
    let model = this;
    if (!requestId) requestId = (0, _uniqueId.default)("request_");
    if (this.lastSetRequestId === requestId) {
      return;
    } else {
      this.lastSetRequestId = requestId;
    }
    (0, _mobx.transaction)(() => {
      (0, _set_attributes.default)({
        model,
        modelJson
      });
      (0, _set_relations.default)({
        model,
        requestId,
        modelJson,
        topLevelJson
      });
    });
  }
  get urlRoot() {
    return this.constructor.urlRoot;
  }
  get jsonKey() {
    return this.constructor.jsonKey;
  }
  onInitialize() {}
  onDestroy() {
    (0, _mobx.transaction)(() => {
      this.removeSelfFromCollection();
      this.destroyDependentRelations();
      this.removeSelfFromRelations();
    });
  }
  removeSelfFromCollection() {
    this.constructor.remove(this);
  }
  destroyDependentRelations() {
    let relationsToDestroy = (0, _filter.default)(this.constructor.relations, relation => {
      let reverseRelation = relation.reverseRelation;
      return reverseRelation && reverseRelation.onDestroy === "destroyRelation";
    });
    relationsToDestroy.forEach(relation => {
      if (relation.isHasMany) {
        this[relation.propertyName].slice().forEach(relatedModel => {
          relatedModel.onDestroy();
        });
      } else if (relation.isHasOne) {
        this[relation.propertyName].onDestroy();
      }
    });
  }
  removeSelfFromRelations() {
    let relationsToRemoveFrom = (0, _filter.default)(this.constructor.relations, relation => {
      let reverseRelation = relation.reverseRelation;
      return reverseRelation && reverseRelation.onDestroy === "removeSelf";
    });
    relationsToRemoveFrom.forEach(relation => {
      let removeMethodName = relation.reverseRelation.removeMethodName;
      if (relation.isHasMany) {
        this[relation.propertyName].slice().forEach(relatedModel => {
          if (relatedModel[removeMethodName]) {
            relatedModel[removeMethodName](this);
          }
        });
      } else if (relation.isHasOne) {
        // console.log(relation.propertyName, removeMethodName, this[relation.propertyName])
        if (this[relation.propertyName] && this[relation.propertyName][removeMethodName]) {
          this[relation.propertyName][removeMethodName](this);
        }
      }
    });
  }
  toJSON() {
    const {
      id,
      constructor
    } = this;
    const {
      attributes,
      relations
    } = constructor;

    // collect attributes
    const attributeValues = Object.keys(attributes || {}).reduce((values, attributeName) => {
      values[attributeName] = this[attributeName];
      return values;
    }, {});

    // collect relation models id
    const relationValues = (relations || []).reduce((values, _ref) => {
      let {
        type,
        propertyName,
        foreignKey
      } = _ref;
      const camelizedForeignKey = (0, _inflection.camelize)(foreignKey, true);
      if (type === "hasMany") {
        values[camelizedForeignKey] = (this[propertyName] || []).slice().map(model => model.id);
      }
      if (type === "hasOne") {
        values[camelizedForeignKey] = (this[propertyName] || {}).id;
      }
      return values;
    }, {});
    return {
      id,
      ...attributeValues,
      ...relationValues
    };
  }
}
Object.defineProperty(BaseModel, "urlRoot", {
  get: function () {
    return this._urlRoot ? this._urlRoot : "/" + (0, _inflection.tableize)(this.modelName || this.name);
  },
  set: function (value) {
    this._urlRoot = value;
  },
  configurable: true
});
Object.defineProperty(BaseModel, "jsonKey", {
  get: function () {
    return this._jsonKey ? this._jsonKey : (0, _inflection.underscore)(this.modelName || this.name);
  },
  set: function (value) {
    this._jsonKey = value;
  },
  configurable: true
});
var _default = exports.default = BaseModel;
//# sourceMappingURL=base_model.js.map