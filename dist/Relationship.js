"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Entity2 = _interopRequireDefault(require("./Entity"));

var _UpdateRelationship = _interopRequireDefault(require("./Services/UpdateRelationship"));

var _DeleteRelationship = _interopRequireDefault(require("./Services/DeleteRelationship"));

var _RelationshipType = require("./RelationshipType");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }

function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Relationship = /*#__PURE__*/function (_Entity) {
  _inherits(Relationship, _Entity);

  var _super = _createSuper(Relationship);

  /**
   *
   * @param {Neode}            neode          Neode instance
   * @param {RelationshipType} definition     Relationship type definition
   * @param {Integer}          identity       Identity
   * @param {String}           relationship   Relationship type
   * @param {Map}              properties     Map of properties for the relationship
   * @param {Node}             start          Start Node
   * @param {Node}             end            End Node
   * @param {String}           node_alias     Alias given to the Node when converting to JSON
   */
  function Relationship(neode, definition, identity, type, properties, start, end, node_alias) {
    var _this;

    _classCallCheck(this, Relationship);

    _this = _super.call(this);
    _this._neode = neode;
    _this._definition = definition;
    _this._identity = identity;
    _this._type = type;
    _this._properties = properties || new Map();
    _this._start = start;
    _this._end = end;
    _this._node_alias = node_alias;
    return _this;
  }
  /**
   * Get the definition for this relationship
   *
   * @return {Definition}
   */


  _createClass(Relationship, [{
    key: "definition",
    value: function definition() {
      return this._definition;
    }
    /**
     * Get the relationship type
     */

  }, {
    key: "type",
    value: function type() {
      return this._type;
    }
    /**
     * Get the start node for this relationship
     *
     * @return {Node}
     */

  }, {
    key: "startNode",
    value: function startNode() {
      return this._start;
    }
    /**
     * Get the start node for this relationship
     *
     * @return {Node}
     */

  }, {
    key: "endNode",
    value: function endNode() {
      return this._end;
    }
    /**
     * Get the node on the opposite end of the Relationship to the subject
     * (ie if direction is in, get the end node, otherwise get the start node)
     */

  }, {
    key: "otherNode",
    value: function otherNode() {
      return this._definition.direction() == _RelationshipType.DIRECTION_IN ? this.startNode() : this.endNode();
    }
    /**
     * Convert Relationship to a JSON friendly Object
     *
     * @return {Promise}
     */

  }, {
    key: "toJson",
    value: function toJson() {
      var _this2 = this;

      var output = {
        _id: this.id(),
        _type: this.type()
      };
      var definition = this.definition(); // Properties

      definition.properties().forEach(function (property, key) {
        if (property.hidden()) {
          return;
        }

        if (_this2._properties.has(key)) {
          output[key] = _this2.valueToJson(property, _this2._properties.get(key));
        }
      }); // Get Other Node

      return this.otherNode().toJson().then(function (json) {
        output[definition.nodeAlias()] = json;
        return output;
      });
    }
    /**
     * Update the properties for this relationship
     *
     * @param {Object} properties  New properties
     * @return {Node}
     */

  }, {
    key: "update",
    value: function update(properties) {
      var _this3 = this;

      // TODO: Temporary fix, add the properties to the properties map
      // Sorry, but it's easier than hacking the validator
      this._definition.properties().forEach(function (property) {
        var name = property.name();

        if (property.required() && !properties.hasOwnProperty(name)) {
          properties[name] = _this3._properties.get(name);
        }
      });

      return (0, _UpdateRelationship["default"])(this._neode, this._definition, this._identity, properties).then(function (properties) {
        Object.entries(properties).forEach(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              key = _ref2[0],
              value = _ref2[1];

          _this3._properties.set(key, value);
        });
      }).then(function () {
        return _this3;
      });
    }
    /**
     * Delete this relationship from the Graph
     *
     * @return {Promise}
     */

  }, {
    key: "delete",
    value: function _delete() {
      var _this4 = this;

      return (0, _DeleteRelationship["default"])(this._neode, this._identity).then(function () {
        _this4._deleted = true;
        return _this4;
      });
    }
  }]);

  return Relationship;
}(_Entity2["default"]);

exports["default"] = Relationship;