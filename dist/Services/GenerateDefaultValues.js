"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var uuid = _interopRequireWildcard(require("uuid"));

var _ValidationError = _interopRequireDefault(require("../ValidationError"));

var _CleanValue = _interopRequireDefault(require("./CleanValue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function GenerateDefaultValuesAsync(neode, model, properties) {
  var schema = model.schema();
  var output = {};

  if (!(properties instanceof Object)) {
    throw new _ValidationError["default"]("`properties` must be an object.", properties);
  } // Get All Config


  Object.keys(schema).forEach(function (key) {
    var config = typeof schema[key] === "string" ? {
      type: schema[key]
    } : schema[key];

    switch (config.type) {
      case "uuid":
        config["default"] = uuid.v4;
        break;
    }

    if (properties.hasOwnProperty(key)) {
      output[key] = properties[key];
    } // Set Default Value
    else if (typeof config["default"] !== "undefined") {
        output[key] = typeof config["default"] === "function" ? config["default"]() : config["default"];
      } // Clean Value


    if (output[key]) {
      output[key] = (0, _CleanValue["default"])(config, output[key]);
    }
  });
  return output;
}
/**
 * Generate default values where no values are not currently set.
 *
 * @param  {Neode}  neode
 * @param  {Model}  model
 * @param  {Object} properties
 * @return {Promise}
 */


function GenerateDefaultValues(neode, model, properties) {
  var output = GenerateDefaultValuesAsync(neode, model, properties);
  return Promise.resolve(output);
}

GenerateDefaultValues.async = GenerateDefaultValuesAsync;
var _default = GenerateDefaultValues;
exports["default"] = _default;