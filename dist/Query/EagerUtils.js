"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MAX_EAGER_DEPTH = exports.EAGER_TYPE = exports.EAGER_LABELS = exports.EAGER_ID = void 0;
exports.eagerNode = eagerNode;
exports.eagerPattern = eagerPattern;
exports.eagerRelationship = eagerRelationship;
var _Builder = _interopRequireDefault(require("./Builder"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/* eslint-disable no-empty */

var EAGER_ID = exports.EAGER_ID = "__EAGER_ID__";
var EAGER_LABELS = exports.EAGER_LABELS = "__EAGER_LABELS__";
var EAGER_TYPE = exports.EAGER_TYPE = "__EAGER_TYPE__";
var MAX_EAGER_DEPTH = exports.MAX_EAGER_DEPTH = 3;

/**
 * Build a pattern to use in an eager load statement
 *
 * @param {Neode} neode                 Neode instance
 * @param {Integer} depth               Maximum depth to stop at
 * @param {String} alias                Alias for the starting node
 * @param {RelationshipType} rel        Type of relationship
 * @param {string|null} customerId        Customer ID
 */
function eagerPattern(neode, depth, alias, rel, nextLevelEagers, customerId) {
  var builder = new _Builder["default"]();
  var name = rel.name();
  var type = rel.type();
  var relationship = rel.relationship();
  var direction = rel.direction();
  var target = rel.target();
  var relationship_variable = "".concat(alias, "_").concat(name, "_rel");
  var node_variable = "".concat(alias, "_").concat(name, "_node");
  var target_model;
  try {
    target_model = neode.model(target);
  } catch (e) {}

  // Build Pattern
  builder.match(alias, undefined, undefined, customerId).relationship(relationship, direction, relationship_variable).to(node_variable, target_model, undefined, customerId);
  var fields = node_variable;
  switch (type) {
    case "node":
    case "nodes":
      fields = eagerNode(neode, depth + 1, node_variable, target_model, nextLevelEagers, customerId);
      break;
    case "relationship":
    case "relationships":
      fields = eagerRelationship(neode, depth + 1, relationship_variable, rel.nodeAlias(), node_variable, target_model, nextLevelEagers, customerId);
  }
  var pattern = "".concat(name, ": [ ").concat(builder.pattern().trim(), " | ").concat(fields, " ]");

  // Get the first?
  if (type === "node" || type === "relationship") {
    return "".concat(pattern, "[0]");
  }
  return pattern;
}

/**
 * Produces a Cypher pattern for a consistant eager loading format for a
 * Node and any subsequent eagerly loaded models up to the maximum depth.
 *
 * @param {Neode} neode     Neode instance
 * @param {Integer} depth   Maximum depth to traverse to
 * @param {String} alias    Alias of the node
 * @param {Model} model     Node model
 * @param {string|null} customerId        Customer ID
 */
function eagerNode(neode, depth, alias, model, extraEagerNames, customerId) {
  var indent = "  ".repeat(depth * 2);
  var pattern = "\n".concat(indent, " ").concat(alias, " { ");

  // Properties
  pattern += "\n".concat(indent).concat(indent, ".*");

  // ID
  pattern += "\n".concat(indent).concat(indent, ",").concat(EAGER_ID, ": id(").concat(alias, ")");

  // Labels
  pattern += "\n".concat(indent).concat(indent, ",").concat(EAGER_LABELS, ": labels(").concat(alias, ")");

  // Create an array of all eagers and extra eagers
  var eagers = model.eager();
  var nextNodesExtraEagerNames = {};
  if (extraEagerNames) {
    var relationships = model.relationships();
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

  // Eager
  if (model && depth <= MAX_EAGER_DEPTH) {
    eagers.forEach(function (rel) {
      pattern += "\n".concat(indent).concat(indent, ",").concat(eagerPattern(neode, depth, alias, rel, nextNodesExtraEagerNames[rel.name()], customerId));
    });
  }
  pattern += "\n".concat(indent, "}");
  return pattern;
}

/**
 * Produces a Cypher pattern for a consistant eager loading format for a
 * Relationship and any subsequent eagerly loaded modules up to the maximum depth.
 *
 * @param {Neode} neode     Neode instance
 * @param {Integer} depth   Maximum depth to traverse to
 * @param {String} alias    Alias of the node
 * @param {Model} model     Node model
 * @param {string|null} customerId        Customer ID
 */
function eagerRelationship(neode, depth, alias, node_alias, node_variable, node_model, nextLevelEagers, customerId) {
  var indent = "  ".repeat(depth * 2);
  var pattern = "\n".concat(indent, " ").concat(alias, " { ");

  // Properties
  pattern += "\n".concat(indent).concat(indent, ".*");

  // ID
  pattern += "\n".concat(indent).concat(indent, ",").concat(EAGER_ID, ": id(").concat(alias, ")");

  // Type
  pattern += "\n".concat(indent).concat(indent, ",").concat(EAGER_TYPE, ": type(").concat(alias, ")");

  // Node Alias
  // pattern += `\n,${indent}${indent},${node_alias}`
  pattern += "\n".concat(indent).concat(indent, ",").concat(node_alias, ": ");
  pattern += eagerNode(neode, depth + 1, node_variable, node_model, nextLevelEagers, customerId);
  pattern += "\n".concat(indent, "}");
  return pattern;
}