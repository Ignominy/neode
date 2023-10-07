"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ORIGINAL_ALIAS = void 0;
exports.addReadNodeRelationshipToStatement = addReadNodeRelationshipToStatement;
exports.addReadNodeToStatement = addReadNodeToStatement;
exports.addReadRelationshipToStatement = addReadRelationshipToStatement;
var _Entity = require("../Entity");
var _Node = _interopRequireDefault(require("../Node"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var ORIGINAL_ALIAS = exports.ORIGINAL_ALIAS = "this";

/**
 * Split read properties into
 *
 * @param  {Model}   model        Model to merge on
 * @param  {Object}  properties   Map of properties
 * @return {Object}               Inline objects
 */
function checkProperties(model, properties) {
  var inline = {};

  // Calculate Set Properties
  model.properties().forEach(function (property) {
    var name = property.name();

    // Skip if not set
    if (!properties.hasOwnProperty(name)) {
      return;
    }
    var value = (0, _Entity.valueToCypher)(property, properties[name]);
    inline[name] = value;
  });
  return inline;
}

/**
 * Add a node to the current statement
 *
 * @param {Neode}   neode       Neode instance
 * @param {Builder} builder     Query builder
 * @param {String}  alias       Alias
 * @param {Model}   model       Model
 * @param {Object}  properties  Map of properties
 * @param {Array}   aliases     Aliases to carry through in with statement
 */
function addReadNodeToStatement(neode, builder, alias, model, properties, order) {
  var aliases = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : [];
  var customerId = arguments.length > 7 ? arguments[7] : undefined;
  var inline = checkProperties(model, properties);

  // Add alias
  if (aliases.indexOf(alias) == -1) {
    aliases.push(alias);
  }

  // Create
  builder.match(alias, model, inline, customerId);

  // Add order statement if exists
  if (typeof order === "string") {
    builder.orderBy("".concat(alias, ".").concat(order));
  } else if (_typeof(order) === "object") {
    Object.keys(order).forEach(function (key) {
      builder.orderBy("".concat(alias, ".").concat(key), order[key]);
    });
  }

  // Relationships
  model.relationships().forEach(function (relationship, key) {
    if (properties.hasOwnProperty(key) && properties[key] != null) {
      var value = properties[key];
      var rel_alias = "".concat(alias, "_").concat(key, "_rel");
      var target_alias = "".concat(alias, "_").concat(key, "_node");

      // Carry alias through
      builder["with"].apply(builder, _toConsumableArray(aliases));
      if (!relationship.target()) {
        throw new Error("A target defintion must be defined for ".concat(key, " on model ").concat(model.name()));
      } else if (Array.isArray(relationship.target())) {
        throw new Error("You cannot nodes with the ambiguous relationship: ".concat(key, " on model ").concat(model.name()));
      }
      switch (relationship.type()) {
        // Single Relationship
        case "relationship":
          var targetAlias = "".concat(target_alias);
          var relAlias = "".concat(rel_alias);
          aliases.push(targetAlias);
          addReadRelationshipToStatement(neode, builder, alias, relAlias, targetAlias, relationship, value, aliases, customerId);
          aliases.push(relAlias);
          builder["with"].apply(builder, _toConsumableArray(aliases));
          break;

        // Array of Relationships
        case "relationships":
          if (!Array.isArray(value)) value = [value];
          value.forEach(function (value, idx) {
            var targetAlias = "".concat(target_alias).concat(idx);
            var relAlias = "".concat(rel_alias).concat(idx);
            aliases.push(targetAlias);

            // Carry alias through
            addReadRelationshipToStatement(neode, builder, alias, relAlias, targetAlias, relationship, value, aliases, customerId);
            aliases.push(relAlias);
            builder["with"].apply(builder, _toConsumableArray(aliases));
          });
          break;

        // Single Node
        case "node":
          addReadNodeRelationshipToStatement(neode, builder, alias, rel_alias, target_alias, relationship, value, aliases, customerId);
          break;

        // Array of Nodes
        case "nodes":
          if (!Array.isArray(value)) value = [value];
          value.forEach(function (value, idx) {
            addReadNodeRelationshipToStatement(neode, builder, alias, rel_alias + idx, target_alias + idx, relationship, value, aliases, customerId);
          });
          break;
      }
    }
  });
  return builder;
}

/**
 * Add a relationship to the current statement
 *
 * @param {Neode}           neode           Neode instance
 * @param {Builder}         builder         Query builder
 * @param {String}          alias           Current node alias
 * @param {String}          rel_alias       Generated alias for the relationship
 * @param {String}          target_alias    Generated alias for the relationship
 * @param {Relationship}    relationship    Model
 * @param {Object}          value           Value map
 * @param {Array}           aliases         Aliases to carry through in with statement
 * @param {String|null}     customerId      Customer ID
 */
function addReadRelationshipToStatement(neode, builder, alias, rel_alias, target_alias, relationship, value, aliases, customerId) {
  // Extract Node
  var node_alias = relationship.nodeAlias();
  var node_value = value[node_alias];
  delete value[node_alias];

  // If Node is passed, attempt to match a relationship to that specific node
  if (node_value instanceof _Node["default"]) {
    builder.match(alias).relationship(relationship.relationship(), relationship.direction(), rel_alias).to(target_alias, undefined, customerId).whereId(target_alias, node_value.identity());
  }

  // If Primary key is passed then try to match on that
  else if (typeof node_value === "string" || typeof node_value === "number") {
    var model = neode.model(relationship.target());
    builder.match(alias).relationship(relationship.relationship(), relationship.direction(), rel_alias).to(target_alias, model, _defineProperty({}, model.primaryKey(), node_value), customerId);
  }

  // If Map is passed, attempt to match that node
  else if (Object.keys(node_value).length) {
    var _model = neode.model(relationship.target());
    addReadNodeToStatement(neode, builder, target_alias, _model, node_value, undefined, aliases, customerId);
    builder.match(alias).relationship(relationship.relationship(), relationship.direction(), rel_alias).to(target_alias);
  }
}

/**
 * Add a node relationship to the current statement
 *
 * @param {Neode}           neode           Neode instance
 * @param {Builder}         builder         Query builder
 * @param {String}          alias           Current node alias
 * @param {String}          rel_alias       Generated alias for the relationship
 * @param {String}          target_alias    Generated alias for the relationship
 * @param {Relationship}    relationship    Model
 * @param {Object}          value           Value map
 * @param {Array}           aliases         Aliases to carry through in with statement
 * @param {String}  mode        'create' or 'merge'
 * @param {String|null}     customerId      Customer ID
 */
function addReadNodeRelationshipToStatement(neode, builder, alias, rel_alias, target_alias, relationship, value, aliases, mode, customerId) {
  // If Node is passed, attempt to match a relationship to that specific node
  if (value instanceof _Node["default"]) {
    builder.match(alias).relationship(relationship.relationship(), relationship.direction(), rel_alias).to(target_alias).whereId(target_alias, value.identity());
  }
  // If Primary key is passed then try to match on that
  else if (typeof value === "string" || typeof value === "number") {
    var model = neode.model(relationship.target());
    builder.match(alias).relationship(relationship.relationship(), relationship.direction(), rel_alias).to(target_alias, model, _defineProperty({}, model.primaryKey(), value), customerId);
  }
  // If Map is passed, attempt to match that node
  // TODO: What happens when we need to validate this?
  // TODO: Is mergeFields() the right option here?
  else if (Object.keys(value).length) {
    var _model2 = neode.model(relationship.target());
    addReadNodeToStatement(neode, builder, target_alias, _model2, value, undefined, aliases, customerId);
    builder.match(alias).relationship(relationship.relationship(), relationship.direction(), rel_alias).to(target_alias);
  }
}