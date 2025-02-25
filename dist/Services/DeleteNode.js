"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MAX_EAGER_DEPTH = void 0;
exports["default"] = DeleteNode;
var _Builder = _interopRequireWildcard(require("../Query/Builder"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var MAX_EAGER_DEPTH = exports.MAX_EAGER_DEPTH = 10;

/**
 * Add a recursive cascade deletion
 *
 * @param {Neode}            neode          Neode instance
 * @param {Builder}          builder        Query Builder
 * @param {String}           alias          Alias of node
 * @param {RelationshipType} relationship   relationship type definition
 * @param {Array}            aliases        Current aliases
 * @param {Integer}          to_depth       Maximum depth to delete to
 */
function addCascadeDeleteNode(neode, builder, from_alias, relationship, aliases, to_depth) {
  if (aliases.length > to_depth) return;
  var rel_alias = "".concat(from_alias + relationship.name(), "_rel");
  var node_alias = "".concat(from_alias + relationship.name(), "_node");
  var target = neode.model(relationship.target());

  // Optional Match
  builder.optionalMatch(from_alias).relationship(relationship.relationship(), relationship.direction(), rel_alias).to(node_alias, relationship.target());

  // Check for cascade deletions
  target.relationships().forEach(function (relationship) {
    switch (relationship.cascade()) {
      case "delete":
        addCascadeDeleteNode(neode, builder, node_alias, relationship, aliases.concat(node_alias), to_depth);
        break;
      case "detach":
        addDetachNode(neode, builder, node_alias, relationship, aliases);
        break;
    }
  });

  // Delete it
  builder["delete"](node_alias);
}

/**
 * Delete the relationship to the other node
 *
 * @param {Neode}            neode          Neode instance
 * @param {Builder}          builder        Query Builder
 * @param {String}           from_alias     Alias of node at start of the match
 * @param {RelationshipType} relationship   model definition
 * @param {Array}            aliases        Current aliases
 */
function addDetachNode(neode, builder, from_alias, relationship, aliases) {
  // builder.withDistinct(aliases);

  var rel_alias = from_alias + relationship.name() + "_rel";
  var node_alias = "".concat(from_alias + relationship.name(), "_node");
  var target = neode.model(relationship.target());
  builder.optionalMatch(from_alias).relationship(relationship.relationship(), relationship.direction(), rel_alias).to(node_alias, relationship.target())["delete"](rel_alias);

  // builder.withDistinct( aliases );
}

/**
 * Cascade Delete a Node
 *
 * @param {Neode}   neode       Neode instance
 * @param {Integer} identity    Neo4j internal ID of node to delete
 * @param {Model}   model       Model definition
 * @param {Integer} to_depth    Maximum deletion depth
 */
function DeleteNode(neode, identity, model, customerId) {
  var to_depth = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : MAX_EAGER_DEPTH;
  var alias = "this";
  // const to_delete = [];
  var aliases = [alias];
  // const depth = 1;

  var builder = new _Builder["default"](neode).match(alias, model, undefined, customerId).whereId(alias, identity);

  // Cascade delete to relationships
  model.relationships().forEach(function (relationship) {
    switch (relationship.cascade()) {
      case "delete":
        addCascadeDeleteNode(neode, builder, alias, relationship, aliases, to_depth);
        break;
      case "detach":
        addDetachNode(neode, builder, alias, relationship, aliases);
        break;
    }
  });

  // Detach Delete target node
  builder["delete"](alias);
  return builder.execute(_Builder.mode.WRITE);
}