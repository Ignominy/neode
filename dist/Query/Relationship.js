"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _RelationshipType = require("../RelationshipType");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Relationship = /*#__PURE__*/function () {
  function Relationship(relationship, direction, alias, traversals) {
    _classCallCheck(this, Relationship);
    this._relationship = relationship;
    this._direction = direction ? direction.toUpperCase() : "";
    this._alias = alias;
    this._traversals = traversals;
  }
  _createClass(Relationship, [{
    key: "toString",
    value: function toString() {
      var dir_in = this._direction == _RelationshipType.DIRECTION_IN || this._direction == _RelationshipType.ALT_DIRECTION_IN ? "<" : "";
      var dir_out = this._direction == _RelationshipType.DIRECTION_OUT || this._direction == _RelationshipType.ALT_DIRECTION_OUT ? ">" : "";
      var alias = this._alias ? "".concat(this._alias) : "";
      var relationship = this._relationship || "";
      if (Array.isArray(relationship)) {
        relationship = relationship.join("`|`");
      }
      if (relationship != "") {
        relationship = ":`".concat(relationship, "`");
      }
      var traversals = this._traversals ? this._traversals !== "*" ? "*".concat(this._traversals) : "*" : "";
      var rel = this._relationship || this._alias || this._traversals ? "[".concat(alias).concat(relationship).concat(traversals, "]") : "";
      return "".concat(dir_in, "-").concat(rel, "-").concat(dir_out);
    }
  }]);
  return Relationship;
}();
exports["default"] = Relationship;