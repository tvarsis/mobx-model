'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mobx = require('mobx');

var _inflection = require('inflection');

var _filter = require('lodash/filter');

var _filter2 = _interopRequireDefault(_filter);

var _uniqueId = require('lodash/uniqueId');

var _uniqueId2 = _interopRequireDefault(_uniqueId);

var _result = require('lodash/result');

var _result2 = _interopRequireDefault(_result);

var _init_attributes = require('./init_attributes');

var _init_attributes2 = _interopRequireDefault(_init_attributes);

var _set_attributes = require('./set_attributes');

var _set_attributes2 = _interopRequireDefault(_set_attributes);

var _init_relations = require('./init_relations');

var _init_relations2 = _interopRequireDefault(_init_relations);

var _set_relations = require('./set_relations');

var _set_relations2 = _interopRequireDefault(_set_relations);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * This is a hack to allow each model that extends
 * BaseModel to have its own observable collection. Model is
 * assigned an observable collection when first instance of model is
 * created or when Model.all() method is called
 */
var initObservables = function initObservables(target) {
  if (!target.observables || !(0, _mobx.isObservableArray)(target.observables.collection)) {
    target.observables = {};
    (0, _mobx.extendObservable)(target.observables, { collection: (0, _mobx.asFlat)([]) });
  }
};

var BaseModel = function () {
  _createClass(BaseModel, null, [{
    key: 'addClassAction',


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

    // static observables = {};

    value: function addClassAction(actionName, method) {
      Object.defineProperty(this, actionName, {
        get: function get() {
          return method.bind(this);
        }
      });
    }
  }, {
    key: 'addAction',
    value: function addAction(actionName, method) {
      Object.defineProperty(this.prototype, actionName, {
        get: function get() {
          return method.bind(this);
        }
      });
    }
  }]);

  function BaseModel() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, BaseModel);

    _initialiseProps.call(this);

    var modelJson = options.modelJson,
        topLevelJson = options.topLevelJson,
        requestId = options.requestId;


    initObservables(this.constructor);

    if (modelJson && modelJson.id) {
      this.id = modelJson.id;
    }

    (0, _init_attributes2.default)({ model: this });
    (0, _init_relations2.default)({ model: this });

    this.onInitialize();
  }

  _createClass(BaseModel, [{
    key: 'set',
    value: function set() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var requestId = options.requestId,
          modelJson = options.modelJson,
          topLevelJson = options.topLevelJson;

      var model = this;

      if (!requestId) requestId = (0, _uniqueId2.default)('request_');

      if (this.lastSetRequestId === requestId) {
        return;
      } else {
        this.lastSetRequestId = requestId;
      }

      (0, _mobx.transaction)(function () {
        (0, _set_attributes2.default)({ model: model, modelJson: modelJson });

        (0, _set_relations2.default)({
          model: model,
          requestId: requestId,
          modelJson: modelJson,
          topLevelJson: topLevelJson
        });
      });
    }
  }, {
    key: 'onInitialize',
    value: function onInitialize() {}
  }, {
    key: 'onDestroy',
    value: function onDestroy() {
      var _this = this;

      (0, _mobx.transaction)(function () {
        _this.removeSelfFromCollection();
        _this.destroyDependentRelations();
        _this.removeSelfFromRelations();
      });
    }
  }, {
    key: 'removeSelfFromCollection',
    value: function removeSelfFromCollection() {
      this.constructor.remove(this);
    }
  }, {
    key: 'destroyDependentRelations',
    value: function destroyDependentRelations() {
      var _this2 = this;

      var relationsToDestroy = (0, _filter2.default)(this.constructor.relations, function (relation) {
        var reverseRelation = relation.reverseRelation;
        return reverseRelation && reverseRelation.onDestroy === 'destroyRelation';
      });

      relationsToDestroy.forEach(function (relation) {
        if (relation.isHasMany) {
          _this2[relation.propertyName].slice().forEach(function (relatedModel) {
            relatedModel.onDestroy();
          });
        } else if (relation.isHasOne) {
          _this2[relation.propertyName].onDestroy();
        }
      });
    }
  }, {
    key: 'removeSelfFromRelations',
    value: function removeSelfFromRelations() {
      var _this3 = this;

      var relationsToRemoveFrom = (0, _filter2.default)(this.constructor.relations, function (relation) {
        var reverseRelation = relation.reverseRelation;
        return reverseRelation && reverseRelation.onDestroy === 'removeSelf';
      });

      relationsToRemoveFrom.forEach(function (relation) {

        var removeMethodName = relation.reverseRelation.removeMethodName;

        if (relation.isHasMany) {
          _this3[relation.propertyName].slice().forEach(function (relatedModel) {
            if (relatedModel[removeMethodName]) {
              relatedModel[removeMethodName](_this3);
            }
          });
        } else if (relation.isHasOne) {
          // console.log(relation.propertyName, removeMethodName, this[relation.propertyName])
          if (_this3[relation.propertyName] && _this3[relation.propertyName][removeMethodName]) {
            _this3[relation.propertyName][removeMethodName](_this3);
          }
        }
      });
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      var _this4 = this;

      var id = this.id,
          constructor = this.constructor;
      var attributes = constructor.attributes,
          relations = constructor.relations;

      // collect attributes

      var attributeValues = Object.keys(attributes || {}).reduce(function (values, attributeName) {
        values[attributeName] = _this4[attributeName];
        return values;
      }, {});

      // collect relation models id
      var relationValues = (relations || []).reduce(function (values, _ref) {
        var type = _ref.type,
            propertyName = _ref.propertyName,
            foreignKey = _ref.foreignKey;

        var camelizedForeignKey = (0, _inflection.camelize)(foreignKey, true);

        if (type === 'hasMany') {
          values[camelizedForeignKey] = (_this4[propertyName] || []).slice().map(function (model) {
            return model.id;
          });
        }

        if (type === 'hasOne') {
          values[camelizedForeignKey] = (_this4[propertyName] || {}).id;
        }

        return values;
      }, {});

      return _extends({
        id: id
      }, attributeValues, relationValues);
    }
  }, {
    key: 'urlRoot',
    get: function get() {
      return this.constructor.urlRoot;
    }
  }, {
    key: 'jsonKey',
    get: function get() {
      return this.constructor.jsonKey;
    }
  }]);

  return BaseModel;
}();

BaseModel.attributes = {};
BaseModel.relations = [];

BaseModel.get = function (id) {
  var items = (0, _result2.default)(this, 'observables.$mobx.values.collection.value');
  if (items && (0, _mobx.isObservableArray)(items)) {
    var l = items.length;
    for (var i = 0; i < l; i++) {
      if (items[i].id.toString() === id.toString()) return items[i];
    }
  }

  return null;
};

BaseModel.set = function () {
  var _this5 = this;

  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


  // console.log('set static', this.name)

  var modelJson = options.modelJson,
      topLevelJson = options.topLevelJson,
      requestId = options.requestId;

  /*
    requestId is used to allow models to 
    prevent loops when setting same attributes
    multiple times, we set one if none is set
   */

  if (!requestId) requestId = (0, _uniqueId2.default)('request_');

  /*
   * topLevelJson is used to get json for models referenced by ids
   */
  if (!topLevelJson) topLevelJson = modelJson;

  var model = this.get(modelJson.id);

  (0, _mobx.transaction)(function () {
    if (!model) {
      model = new _this5({
        modelJson: modelJson,
        topLevelJson: topLevelJson,
        requestId: requestId
      });

      _this5.observables.collection.push(model);
    }

    model.set({ modelJson: modelJson, topLevelJson: topLevelJson, requestId: requestId });
  });

  // console.log('set', model)

  return model;
};

BaseModel.remove = function (model) {
  if (this.observables && (0, _mobx.isObservableArray)(this.observables.collection)) {
    this.observables.collection.splice(this.observables.collection.indexOf(model), 1);
  }
};

BaseModel.all = function () {
  initObservables(this);
  return this.observables.collection.slice();
};

var _initialiseProps = function _initialiseProps() {
  this.id = null;
  this.lastSetRequestId = null;
};

Object.defineProperty(BaseModel, 'urlRoot', {
  get: function get() {
    return this._urlRoot ? this._urlRoot : '/' + (0, _inflection.tableize)(this.modelName || this.name);
  },
  set: function set(value) {
    this._urlRoot = value;
  }
});

Object.defineProperty(BaseModel, 'jsonKey', {
  get: function get() {
    return this._jsonKey ? this._jsonKey : (0, _inflection.underscore)(this.modelName || this.name);
  },
  set: function set(value) {
    this._jsonKey = value;
  }
});

exports.default = BaseModel;
//# sourceMappingURL=base_model.js.map