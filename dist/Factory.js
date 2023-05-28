"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _neo4jDriver = _interopRequireDefault(require("neo4j-driver"));
var _Collection = _interopRequireDefault(require("./Collection"));
var _Node = _interopRequireDefault(require("./Node"));
var _Relationship = _interopRequireDefault(require("./Relationship"));
var _EagerUtils = require("./Query/EagerUtils");
var _RelationshipType = require("./RelationshipType");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Factory = /*#__PURE__*/function () {
  /**
   * @constuctor
   *
   * @param Neode neode
   */
  function Factory(neode) {
    _classCallCheck(this, Factory);
    this._neode = neode;
  }

  /**
   * Hydrate the first record in a result set
   *
   * @param  {Object} res    Neo4j Result
   * @param  {String} alias  Alias of Node to pluck
   * @return {Node}
   */
  _createClass(Factory, [{
    key: "hydrateFirst",
    value: function hydrateFirst(res, alias, definition, extraEagerNames) {
      if (!res || !res.records.length) {
        return false;
      }
      return this.hydrateNode(res.records[0].get(alias), definition, extraEagerNames);
    }

    /**
     * Hydrate a set of nodes and return a Collection
     *
     * @param  {Object}          res            Neo4j result set
     * @param  {String}          alias          Alias of node to pluck
     * @param  {Definition|null} definition     Force Definition
     * @return {Collection}
     */
  }, {
    key: "hydrate",
    value: function hydrate(res, alias, definition, extraEagerNames) {
      var _this = this;
      if (!res) {
        return false;
      }
      var nodes = res.records.map(function (row) {
        return _this.hydrateNode(row.get(alias), definition, extraEagerNames);
      });
      return new _Collection["default"](this._neode, nodes);
    }

    /**
     * Get the definition by a set of labels
     *
     * @param  {Array} labels
     * @return {Model}
     */
  }, {
    key: "getDefinition",
    value: function getDefinition(labels) {
      return this._neode.models.getByLabels(labels.filter(function (x) {
        return !x.startsWith("cid_");
      }));
    }

    /**
     * Take a result object and convert it into a Model
     *
     * @param {Object}              record
     * @param {Model|String|null}   definition
     * @return {Node}
     */
  }, {
    key: "hydrateNode",
    value: function hydrateNode(record, definition, extraEagerNames) {
      var _this2 = this;
      // Is there no better way to check this?!
      if (_neo4jDriver["default"].isInt(record.identity) && Array.isArray(record.labels)) {
        var _objectSpread2;
        record = _objectSpread(_objectSpread({}, record.properties), {}, (_objectSpread2 = {}, _defineProperty(_objectSpread2, _EagerUtils.EAGER_ID, record.identity), _defineProperty(_objectSpread2, _EagerUtils.EAGER_LABELS, record.labels), _objectSpread2));
      }

      // Get Internals
      var identity = record[_EagerUtils.EAGER_ID];
      var labels = record[_EagerUtils.EAGER_LABELS];

      // Get Definition from
      if (!definition) {
        definition = this.getDefinition(labels);
      } else if (typeof definition === "string") {
        definition = this._neode.models.get(definition);
      }

      // Helpful error message if nothing could be found
      if (!definition) {
        throw new Error("No model definition found for labels ".concat(JSON.stringify(labels)));
      }

      // Get Properties
      var properties = new Map();
      definition.properties().forEach(function (value, key) {
        if (record.hasOwnProperty(key)) {
          properties.set(key, record[key]);
        }
      });

      // Create Node Instance
      var node = new _Node["default"](this._neode, definition, identity, labels, properties);
      // Create an array of all eagers and extra eagers
      var eagers = definition.eager();
      var nextNodesExtraEagerNames = {};
      if (extraEagerNames) {
        var relationships = definition.relationships();
        relationships.forEach(function (relationship) {
          if (extraEagerNames.includes(relationship.name()) && !eagers.some(function (x) {
            return x.name() === relationship.name();
          })) {
            eagers.push(relationship);
            var nextLevelEagersFiltered = extraEagerNames.filter(function (x) {
              return x.startsWith("".concat(relationship.name(), "."));
            }).map(function (x) {
              return x.replace("".concat(relationship.name(), "."), "");
            });
            if (nextLevelEagersFiltered.length > 0) {
              nextNodesExtraEagerNames[relationship.name()] = nextLevelEagersFiltered;
            }
          }
        });
      }

      // Add eagerly loaded props
      eagers.forEach(function (eager) {
        var name = eager.name();
        if (!record[name]) {
          return;
        }
        switch (eager.type()) {
          case "node":
            node.setEager(name, _this2.hydrateNode(record[name], undefined, nextNodesExtraEagerNames[name]));
            break;
          case "nodes":
            node.setEager(name, new _Collection["default"](_this2._neode, record[name].map(function (value) {
              return _this2.hydrateNode(value, undefined, nextNodesExtraEagerNames[name]);
            })));
            break;
          case "relationship":
            node.setEager(name, _this2.hydrateRelationship(eager, record[name], node, nextNodesExtraEagerNames[name]));
            break;
          case "relationships":
            node.setEager(name, new _Collection["default"](_this2._neode, record[name].map(function (value) {
              return _this2.hydrateRelationship(eager, value, node, nextNodesExtraEagerNames[name]);
            })));
            break;
        }
      });
      return node;
    }

    /**
     * Take a result object and convert it into a Relationship
     *
     * @param  {RelationshipType}  definition  Relationship type
     * @param  {Object}            record      Record object
     * @param  {Node}              this_node   'This' node in the current  context
     * @return {Relationship}
     */
  }, {
    key: "hydrateRelationship",
    value: function hydrateRelationship(definition, record, this_node, extraEagerNames) {
      // Get Internals
      var identity = record[_EagerUtils.EAGER_ID];
      var type = record[_EagerUtils.EAGER_TYPE];

      // Get Definition from
      // const definition = this.getDefinition(labels);

      // Get Properties
      var properties = new Map();
      definition.properties().forEach(function (value, key) {
        if (record.hasOwnProperty(key)) {
          properties.set(key, record[key]);
        }
      });

      // Start & End Nodes
      var other_node = this.hydrateNode(record[definition.nodeAlias()], undefined, extraEagerNames);

      // Calculate Start & End Nodes
      var start_node = definition.direction() == _RelationshipType.DIRECTION_IN ? other_node : this_node;
      var end_node = definition.direction() == _RelationshipType.DIRECTION_IN ? this_node : other_node;
      return new _Relationship["default"](this._neode, definition, identity, type, properties, start_node, end_node);
    }
  }]);
  return Factory;
}();
exports["default"] = Factory;