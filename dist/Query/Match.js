"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _GetLabelStringWithCustomerIdCheck = require("./GetLabelStringWithCustomerIdCheck");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Match = /*#__PURE__*/function () {
  function Match(alias) {
    var model = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var properties = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var customerId = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;

    _classCallCheck(this, Match);

    this._alias = alias;
    this._model = model;
    this._properties = properties;
    this._customerId = customerId;
  }

  _createClass(Match, [{
    key: "toString",
    value: function toString() {
      var alias = this._alias || "";
      var model = "";
      var properties = "";
      model = (0, _GetLabelStringWithCustomerIdCheck.getLabelStringWithCustomerIdCheck)(this._model, this._customerId);

      if (this._properties.length) {
        properties = " { ";
        properties += this._properties.map(function (property) {
          return property.toInlineString();
        }).join(", ");
        properties += " }";
      }

      return "(".concat(alias).concat(model || "").concat(properties, ")");
    }
  }]);

  return Match;
}();

exports["default"] = Match;