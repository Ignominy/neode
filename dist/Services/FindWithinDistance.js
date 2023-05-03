"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = FindWithinDistance;

var _Builder = _interopRequireWildcard(require("../Query/Builder"));

var _EagerUtils = require("../Query/EagerUtils");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function FindWithinDistance(neode, model, location_property, point, distance, properties, order, limit, skip) {
  var alias = "this";
  var builder = new _Builder["default"](neode); // Match

  builder.match(alias, model); // Where

  if (properties) {
    Object.keys(properties).forEach(function (key) {
      builder.where("".concat(alias, ".").concat(key), properties[key]);
    });
  } // Prefix key on Properties


  if (properties) {
    Object.keys(properties).forEach(function (key) {
      properties["".concat(alias, ".").concat(key)] = properties[key];
      delete properties[key];
    });
  } // Distance from Point
  // TODO: When properties are passed match them as well .where(properties);


  var pointString = Number.isNaN(point.x) ? "latitude:".concat(point.latitude, ", longitude:").concat(point.longitude) : "x:".concat(point.x, ", y:").concat(point.y);

  if (!Number.isNaN(point.z)) {
    pointString += ", z:".concat(point.z);
  }

  if (!Number.isNaN(point.height)) {
    pointString += ", height:".concat(point.height);
  }

  builder.whereRaw("distance (this.".concat(location_property, ", point({").concat(pointString, "})) <= ").concat(distance)); // Order

  if (typeof order === "string") {
    order = "".concat(alias, ".").concat(order);
  } else if (_typeof(order) === "object") {
    Object.keys(order).forEach(function (key) {
      builder.orderBy("".concat(alias, ".").concat(key), order[key]);
    });
  } // Output


  var output = (0, _EagerUtils.eagerNode)(neode, 1, alias, model); // Complete Query

  return builder.orderBy(order).skip(skip).limit(limit)["return"](output).execute(_Builder.mode.READ).then(function (res) {
    return neode.hydrate(res, alias);
  });
}