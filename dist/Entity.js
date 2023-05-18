"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
exports.valueToCypher = valueToCypher;
exports.valueToJson = _valueToJson;
var _neo4jDriver = _interopRequireDefault(require("neo4j-driver"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); } /* eslint indent: 0 */
/**
 * Convert a raw property into a JSON friendly format
 *
 * @param  {Property}   property
 * @param  {Mixed}      value
 * @return {Mixed}
 */
function _valueToJson(property, value) {
  if (_neo4jDriver["default"].isInt(value)) {
    return value.toNumber();
  }
  if (_neo4jDriver["default"].temporal.isDate(value) || _neo4jDriver["default"].temporal.isDateTime(value) || _neo4jDriver["default"].temporal.isTime(value) || _neo4jDriver["default"].temporal.isLocalDateTime(value) || _neo4jDriver["default"].temporal.isLocalTime(value) || _neo4jDriver["default"].temporal.isDuration(value)) {
    return value.toString();
  }
  if (_neo4jDriver["default"].spatial.isPoint(value)) {
    switch (value.srid.toString()) {
      // SRID values: @https://neo4j.com/docs/developer-manual/current/cypher/functions/spatial/
      case "4326":
        // WGS 84 2D
        return {
          longitude: value.x,
          latitude: value.y
        };
      case "4979":
        // WGS 84 3D
        return {
          longitude: value.x,
          latitude: value.y,
          height: value.z
        };
      case "7203":
        // Cartesian 2D
        return {
          x: value.x,
          y: value.y
        };
      case "9157":
        // Cartesian 3D
        return {
          x: value.x,
          y: value.y,
          z: value.z
        };
    }
  }
  return value;
}

/**
 * Convert a property into a cypher value
 *
 * @param {Property} property
 * @param {Mixed}    value
 * @return {Mixed}
 */
function valueToCypher(property, value) {
  if (property.convertToInteger() && value !== null && value !== undefined) {
    value = _neo4jDriver["default"]["int"](value);
  }
  if (property.convertToDatetime() && value !== null && value !== undefined) {
    value = _neo4jDriver["default"].DateTime.fromStandardDate(new Date(value));
  }
  if (property.convertToDate() && value !== null && value !== undefined) {
    value = _neo4jDriver["default"].Date.fromStandardDate(new Date(value));
  }
  return value;
}
var Entity = /*#__PURE__*/function () {
  function Entity() {
    _classCallCheck(this, Entity);
  }
  _createClass(Entity, [{
    key: "id",
    value:
    /**
     * Get Internal Node ID
     *
     * @return {int}
     */
    function id() {
      return this._identity.toNumber();
    }

    /**
     * Return internal ID as a Neo4j Integer
     *
     * @return {Integer}
     */
  }, {
    key: "identity",
    value: function identity() {
      return this._identity;
    }

    /**
     * Return the Node's properties as an Object
     *
     * @return {Object}
     */
  }, {
    key: "properties",
    value: function properties() {
      var _this = this;
      var output = {};
      var model = this._model || this._definition;
      model.properties().forEach(function (property, key) {
        if (!property.hidden() && _this._properties.has(key)) {
          output[key] = _this.valueToJson(property, _this._properties.get(key));
        }
      });
      return output;
    }

    /**
     * Get a property for this node
     *
     * @param  {String} property Name of property
     * @param  {or}     default  Default value to supply if none exists
     * @return {mixed}
     */
  }, {
    key: "get",
    value: function get(property) {
      var or = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      // If property is set, return that
      if (this._properties.has(property)) {
        return this._properties.get(property);
      }
      // If property has been set in eager, return that
      if (this._eager && this._eager.has(property)) {
        return this._eager.get(property);
      }
      return or;
    }

    /**
     * Convert a raw property into a JSON friendly format
     *
     * @param  {Property}   property
     * @param  {Mixed}      value
     * @return {Mixed}
     */
  }, {
    key: "valueToJson",
    value: function valueToJson(property, value) {
      return _valueToJson(property, value);
    }
  }]);
  return Entity;
}();
exports["default"] = Entity;