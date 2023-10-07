"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = RelateByProperties;
var _Builder = _interopRequireDefault(require("../Query/Builder"));
var _Relationship = _interopRequireDefault(require("../Relationship"));
var _RelationshipType = _interopRequireWildcard(require("../RelationshipType"));
var _ReadUtils = require("./ReadUtils");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function RelateByProperties(neode, fromModel, fromProperties, type, toModel, toProperties, reltionshipProperties, customerId) {
  var relationship = fromModel.relationships().get(type);
  if (!(relationship instanceof _RelationshipType["default"])) {
    throw new Error("Cannot find relationship with type ".concat(type));
  }
  var builder = new _Builder["default"](neode);
  (0, _ReadUtils.addReadNodeToStatement)(neode, builder, "from", fromModel, fromProperties, undefined, ["from"], customerId);
  builder["with"]("from");
  (0, _ReadUtils.addReadNodeToStatement)(neode, builder, "to", toModel, toProperties, undefined, ["to", "from"], customerId)["with"]("from", "to").merge("from").relationship(relationship, relationship.direction(), "rel").to("to").set("rel", reltionshipProperties)["return"]("rel");
  var query = builder.build();
  return neode.writeCypher(query.query, query.params).then(function (res) {
    var rel = res.records[0].get("rel");
    var hydrate_from = relationship.direction() == _RelationshipType.DIRECTION_IN ? toModel : fromModel;
    var hydrate_to = relationship.direction() == _RelationshipType.DIRECTION_IN ? fromModel : toModel;
    var properties = new Map();
    Object.keys(rel.properties).forEach(function (key) {
      properties.set(key, rel.properties[key]);
    });
    return new _Relationship["default"](neode, relationship, rel.identity, rel.type, properties, hydrate_from, hydrate_to);
  });
}