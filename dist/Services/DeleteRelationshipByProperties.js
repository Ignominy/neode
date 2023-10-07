"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = DeleteRelationshipByProperties;
var _Builder = _interopRequireDefault(require("../Query/Builder"));
var _RelationshipType = _interopRequireDefault(require("../RelationshipType"));
var _ReadUtils = require("./ReadUtils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function DeleteRelationshipByProperties(neode, fromModel, fromProperties, type, toModel, toProperties, customerId) {
  var relationship = fromModel.relationships().get(type);
  if (!(relationship instanceof _RelationshipType["default"])) {
    throw new Error("Cannot find relationship with type ".concat(type));
  }
  var builder = new _Builder["default"](neode);
  (0, _ReadUtils.addReadNodeToStatement)(neode, builder, "from", fromModel, fromProperties, undefined, ["from"], customerId);
  builder["with"]("from");
  (0, _ReadUtils.addReadNodeToStatement)(neode, builder, "to", toModel, toProperties, undefined, ["to", "from"], customerId)["with"]("from", "to").match("from").relationship(relationship, relationship.direction(), "rel").to("to")["delete"]("rel");
  var query = builder.build();
  return neode.writeCypher(query.query, query.params).then(function (res) {
    if (!res) throw new Error("Could not get nodes for model ".concat(model.name()));
    return res.summary.counters.updates().relationshipsDeleted;
  });
}