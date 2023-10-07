"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLabelStringWithCustomerIdCheck = void 0;

var _Model = _interopRequireDefault(require("../Model"));

var _index = _interopRequireDefault(require("../index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var getLabelStringWithCustomerIdCheck = function getLabelStringWithCustomerIdCheck(model, customerId) {
  if (model instanceof _Model["default"]) {
    var labels = _toConsumableArray(model.labels());

    if (labels.length === 0 || !labels.every(function (label) {
      return label.startsWith("__");
    })) {
      if (!customerId) throw new Error("customerId is required for this model " + model.name());
      labels.push(_index["default"].getCustomerIdLabel(customerId));
    }

    return ":".concat(labels.join(":"));
  } else if (typeof model === "string") {
    if (!model.startsWith("__")) {
      if (!customerId) throw new Error("customerId is required for this model " + model.name());
      return ":".concat(model, ":").concat(_index["default"].getCustomerIdLabel(customerId));
    }

    return ":".concat(model);
  } else if (model == null || model === false) {
    return undefined;
  }

  throw new Error("model must be a Model instance or a string");
};

exports.getLabelStringWithCustomerIdCheck = getLabelStringWithCustomerIdCheck;