"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = FindAll;

var _Builder = _interopRequireWildcard(require("../Query/Builder"));

var _EagerUtils = require("../Query/EagerUtils");

var _ReadUtils = require("./ReadUtils");

var _Validator = _interopRequireDefault(require("./Validator"));

var _WriteUtils = require("./WriteUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function FindAll(neode, model, properties, extraEagerNames, order, limit, skip, customerId) {
  return (0, _Validator["default"])(neode, model, properties, true).then(function (properties) {
    var alias = _WriteUtils.ORIGINAL_ALIAS;
    var builder = new _Builder["default"](neode);
    (0, _ReadUtils.addReadNodeToStatement)(neode, builder, alias, model, properties, order, [alias], customerId); // Output

    var output = (0, _EagerUtils.eagerNode)(neode, 1, alias, model, extraEagerNames, customerId);
    return builder["return"](output).limit(limit).skip(skip).execute(_Builder.mode.READ).then(function (res) {
      if (!res) throw new Error("Could not get nodes for model ".concat(model.name()));
      return neode.hydrate(res, alias, model, extraEagerNames);
    })["catch"](function (err) {
      console.error(err);
      throw new Error("Could not get nodes for model ".concat(model.name()));
    });
  });
}