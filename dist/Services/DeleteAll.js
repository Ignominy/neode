"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = DeleteAll;

var _GetLabelStringWithCustomerIdCheck = require("../Query/GetLabelStringWithCustomerIdCheck");

// TODO : Delete Dependencies
function DeleteAll(neode, model, customerId) {
  var labels = (0, _GetLabelStringWithCustomerIdCheck.getLabelStringWithCustomerIdCheck)("node", model, customerId);
  var query = "MATCH (node".concat(labels, ") DETACH DELETE node");
  return neode.writeCypher(query);
}