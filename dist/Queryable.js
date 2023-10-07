"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Builder = _interopRequireDefault(require("./Query/Builder"));

var _Create = _interopRequireDefault(require("./Services/Create"));

var _DeleteAll = _interopRequireDefault(require("./Services/DeleteAll"));

var _DeleteByProperties = _interopRequireDefault(require("./Services/DeleteByProperties"));

var _FindAll = _interopRequireDefault(require("./Services/FindAll"));

var _FindById = _interopRequireDefault(require("./Services/FindById"));

var _FindWithinDistance = _interopRequireDefault(require("./Services/FindWithinDistance"));

var _First = _interopRequireDefault(require("./Services/First"));

var _MergeOn = _interopRequireDefault(require("./Services/MergeOn"));

var _Update = _interopRequireDefault(require("./Services/Update"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Queryable = /*#__PURE__*/function () {
  /**
   * @constructor
   *
   * @param Neode neode
   */
  function Queryable(neode) {
    _classCallCheck(this, Queryable);

    this._neode = neode;
  }
  /**
   * Return a new Query Builder
   *
   * @return {Builder}
   */


  _createClass(Queryable, [{
    key: "query",
    value: function query() {
      return new _Builder["default"](this._neode);
    }
    /**
     * Create a new instance of this Model
     *
     * @param  {object} properties
     * @param  {String|null} customerId
     * @param  {String[]|null} extraEagerNames
     * @return {Promise}
     */

  }, {
    key: "create",
    value: function create(properties, extraEagerNames, customerId) {
      return (0, _Create["default"])(this._neode, this, properties, extraEagerNames, customerId);
    }
    /**
     * Merge a node based on the defined indexes
     *
     * @param  {Object} properties
     * @param  {String[]|null} extraEagerNames
     * @param  {String|null} customerId
     * @return {Promise}
     */

  }, {
    key: "merge",
    value: function merge(properties, extraEagerNames, customerId) {
      var merge_on = this.mergeFields();
      return (0, _MergeOn["default"])(this._neode, this, merge_on, properties, extraEagerNames, customerId);
    }
    /**
     * Merge a node based on the supplied properties
     *
     * @param  {Object} match Specific properties to merge on
     * @param  {Object} set   Properties to set
     * @param  {String[]|null} extraEagerNames Extra eagers to load with this query
     * @param  {String|null} customerId
     * @return {Promise}
     */

  }, {
    key: "mergeOn",
    value: function mergeOn(match, set, extraEagerNames, customerId) {
      var merge_on = Object.keys(match);

      var properties = _objectSpread(_objectSpread({}, match), set);

      return (0, _MergeOn["default"])(this._neode, this, merge_on, properties, extraEagerNames, customerId);
    }
    /**
     * Update a node based on the supplied properties
     *
     * @param  {Object} match Specific properties to match on
     * @param  {Object} set   Properties to set
     * @param  {String[]|null} extraEagerNames Extra eagers to load with this query
     * @param  {String|null} customerId
     * @return {Promise}
     */

  }, {
    key: "updateOn",
    value: function updateOn(match, set, extraEagerNames, customerId) {
      var merge_on = Object.keys(match).filter(function (key) {
        return match[key] !== undefined;
      });
      Object.keys(set).forEach(function (key) {
        return set[key] === undefined && delete set[key];
      });

      var properties = _objectSpread(_objectSpread({}, match), set);

      return (0, _Update["default"])(this._neode, this, merge_on, properties, extraEagerNames, customerId);
    }
    /**
     * Delete all nodes for this model
     *
     * @return {Promise}
     */

  }, {
    key: "deleteAll",
    value: function deleteAll() {
      return (0, _DeleteAll["default"])(this._neode, this);
    }
    /**
     * Delete nodes by properties
     *
     * @return {Promise}
     */

  }, {
    key: "deleteByProperties",
    value: function deleteByProperties(properties, customerId) {
      return (0, _DeleteByProperties["default"])(this._neode, this, properties, customerId);
    }
    /**
     * Get a collection of nodes for this label
     *
     * @param  {Object}              properties
     * @param  {String[]|Null}    extraEagerNames
     * @param  {String|Array|Object} order
     * @param  {Int}                 limit
     * @param  {Int}                 skip
     * @param  {String|null} customerId
     * @return {Promise}
     */

  }, {
    key: "all",
    value: function all(properties, extraEagerNames, order, limit, skip, customerId) {
      return (0, _FindAll["default"])(this._neode, this, properties, extraEagerNames, order, limit, skip, customerId);
    }
    /**
     * Find a Node by its Primary Key
     *
     * @param  {mixed} id
     * @param  {String|null} customerId
     * @return {Promise}
     */

  }, {
    key: "find",
    value: function find(id, customerId) {
      var primary_key = this.primaryKey();
      return this.first(_defineProperty({}, primary_key, id), customerId);
    }
    /**
     * Find a Node by it's internal node ID
     *
     * @param  {String} model
     * @param  {int}    id
     * @param  {String[]|Null}    extraEagerNames
     * @param  {String|null} customerId
     * @return {Promise}
     */

  }, {
    key: "findById",
    value: function findById(id, extraEagerNames, customerId) {
      return (0, _FindById["default"])(this._neode, this, id, extraEagerNames, customerId);
    }
    /**
     * Find a Node by properties
     *
     * @param  {Object} properties
     * @param  {String[]|null} extraEagerNames
     * @param  {String|null} customerId
     * @return {Promise}
     */

  }, {
    key: "first",
    value: function first(properties, extraEagerNames, customerId) {
      return (0, _First["default"])(this._neode, this, properties, extraEagerNames, customerId);
    }
    /**
     * Get a collection of nodes within a certain distance belonging to this label
     *
     * @param  {Object}              properties
     * @param  {String[]|null}       extraEagerNames
     * @param  {String}              location_property
     * @param  {Object}              point
     * @param  {Int}                 distance
     * @param  {String|Array|Object} order
     * @param  {Int}                 limit
     * @param  {Int}                 skip
     * @param  {String|null} customerId
     * @return {Promise}
     */

  }, {
    key: "withinDistance",
    value: function withinDistance(location_property, point, distance, properties, extraEagerNames, order, limit, skip, customerId) {
      return (0, _FindWithinDistance["default"])(this._neode, this, location_property, point, distance, properties, extraEagerNames, order, limit, skip, customerId);
    }
  }]);

  return Queryable;
}();

exports["default"] = Queryable;