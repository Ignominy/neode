import Builder from "./Query/Builder"
import Create from "./Services/Create"
import DeleteAll from "./Services/DeleteAll"
import DeleteByProperties from "./Services/DeleteByProperties"
import FindAll from "./Services/FindAll"
import FindById from "./Services/FindById"
import FindWithinDistance from "./Services/FindWithinDistance"
import First from "./Services/First"
import MergeOn from "./Services/MergeOn"
import Update from "./Services/Update"

export default class Queryable {
  /**
   * @constructor
   *
   * @param Neode neode
   */
  constructor(neode) {
    this._neode = neode
  }

  /**
   * Return a new Query Builder
   *
   * @return {Builder}
   */
  query() {
    return new Builder(this._neode)
  }

  /**
   * Create a new instance of this Model
   *
   * @param  {object} properties
   * @param  {String|null} customerId
   * @param  {String[]|null} extraEagerNames
   * @return {Promise}
   */
  create(properties, extraEagerNames, customerId) {
    return Create(this._neode, this, properties, extraEagerNames, customerId)
  }

  /**
   * Merge a node based on the defined indexes
   *
   * @param  {Object} properties
   * @param  {String[]|null} extraEagerNames
   * @param  {String|null} customerId
   * @return {Promise}
   */
  merge(properties, extraEagerNames, customerId) {
    const merge_on = this.mergeFields()

    return MergeOn(this._neode, this, merge_on, properties, extraEagerNames, customerId)
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
  mergeOn(match, set, extraEagerNames, customerId) {
    const merge_on = Object.keys(match)
    const properties = { ...match, ...set }

    return MergeOn(this._neode, this, merge_on, properties, extraEagerNames, customerId)
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
  updateOn(match, set, extraEagerNames, customerId) {
    const merge_on = Object.keys(match).filter(key => match[key] !== undefined)
    Object.keys(set).forEach(key => set[key] === undefined && delete set[key])

    const properties = { ...match, ...set }

    return Update(this._neode, this, merge_on, properties, extraEagerNames, customerId)
  }

  /**
   * Delete all nodes for this model
   *
   * @return {Promise}
   */
  deleteAll() {
    return DeleteAll(this._neode, this)
  }

  /**
   * Delete nodes by properties
   *
   * @return {Promise}
   */
  deleteByProperties(properties, customerId) {
    return DeleteByProperties(this._neode, this, properties, customerId)
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
  all(properties, extraEagerNames, order, limit, skip, customerId) {
    return FindAll(this._neode, this, properties, extraEagerNames, order, limit, skip, customerId)
  }

  /**
   * Find a Node by its Primary Key
   *
   * @param  {mixed} id
   * @param  {String|null} customerId
   * @return {Promise}
   */
  find(id, customerId) {
    const primary_key = this.primaryKey()

    return this.first({ [primary_key]: id }, customerId)
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
  findById(id, extraEagerNames, customerId) {
    return FindById(this._neode, this, id, extraEagerNames, customerId)
  }

  /**
   * Find a Node by properties
   *
   * @param  {Object} properties
   * @param  {String[]|null} extraEagerNames
   * @param  {String|null} customerId
   * @return {Promise}
   */
  first(properties, extraEagerNames, customerId) {
    return First(this._neode, this, properties, extraEagerNames, customerId)
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
  withinDistance(location_property, point, distance, properties, extraEagerNames, order, limit, skip, customerId) {
    return FindWithinDistance(this._neode, this, location_property, point, distance, properties, extraEagerNames, order, limit, skip, customerId)
  }
}
