"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Create;

var _GenerateDefaultValues = _interopRequireDefault(require("./GenerateDefaultValues"));

var _Validator = _interopRequireDefault(require("./Validator"));

var _Builder = _interopRequireWildcard(require("../Query/Builder"));

var _EagerUtils = require("../Query/EagerUtils");

var _WriteUtils = require("./WriteUtils");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function Create(neode, model, properties) {
  return (0, _GenerateDefaultValues["default"])(neode, model, properties).then(function (properties) {
    return (0, _Validator["default"])(neode, model, properties);
  }).then(function (properties) {
    var alias = _WriteUtils.ORIGINAL_ALIAS;
    var builder = new _Builder["default"](neode);
    (0, _WriteUtils.addNodeToStatement)(neode, builder, alias, model, properties, [alias]); // Output

    var output = (0, _EagerUtils.eagerNode)(neode, 1, alias, model);
    return builder["return"](output).execute(_Builder.mode.WRITE).then(function (res) {
      return neode.hydrateFirst(res, alias);
    });
  });
}