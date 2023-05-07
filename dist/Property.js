"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 *  Container holding information for a property.
 *
 * TODO: Schema validation to enforce correct data types
 */
var Property = /*#__PURE__*/function () {
  function Property(name, schema) {
    var _this = this;
    _classCallCheck(this, Property);
    if (typeof schema === "string") {
      schema = {
        type: schema
      };
    }
    this._name = name;
    this._schema = schema;

    // TODO: Clean Up
    Object.keys(schema).forEach(function (key) {
      _this["_".concat(key)] = schema[key];
    });
  }
  _createClass(Property, [{
    key: "name",
    value: function name() {
      return this._name;
    }
  }, {
    key: "type",
    value: function type() {
      return this._schema.type;
    }
  }, {
    key: "primary",
    value: function primary() {
      return this._primary || false;
    }
  }, {
    key: "unique",
    value: function unique() {
      return this._unique || false;
    }
  }, {
    key: "exists",
    value: function exists() {
      return this._exists || false;
    }
  }, {
    key: "required",
    value: function required() {
      return this._exists || this._required || false;
    }
  }, {
    key: "indexed",
    value: function indexed() {
      return this._index || false;
    }
  }, {
    key: "protected",
    value: function _protected() {
      return this._primary || this._protected;
    }
  }, {
    key: "hidden",
    value: function hidden() {
      return this._hidden;
    }
  }, {
    key: "readonly",
    value: function readonly() {
      return this._readonly || false;
    }
  }, {
    key: "convertToInteger",
    value: function convertToInteger() {
      return this._type == "int" || this._type == "integer";
    }
  }]);
  return Property;
}();
exports["default"] = Property;