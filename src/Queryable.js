import Builder from "./Query/Builder"
import Create from "./Services/Create"
import DeleteAll from "./Services/DeleteAll"
import FindAll from "./Services/FindAll"
import FindById from "./Services/FindById"
import FindWithinDistance from "./Services/FindWithinDistance"
import First from "./Services/First"
import MergeOn from "./Services/MergeOn"

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
   * @return {Promise}
   */
  create(properties, customerId) {
    return Create(this._neode, this, properties, customerId)
  }

  /**
   * Merge a node based on the defined indexes
   *
   * @param  {Object} properties
   * @param  {String|null} customerId
   * @return {Promise}
   */
  merge(properties, customerId) {
    const merge_on = this.mergeFields()

    return MergeOn(this._neode, this, merge_on, properties, customerId)
  }

  /**
   * Merge a node based on the supplied properties
   *
   * @param  {Object} match Specific properties to merge on
   * @param  {Object} set   Properties to set
   * @param  {String|null} customerId
   * @return {Promise}
   */
  mergeOn(match, set, customerId) {
    const merge_on = Object.keys(match)
    const properties = { ...match, ...set }

    return MergeOn(this._neode, this, merge_on, properties, customerId)
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
   * Get a collection of nodes for this label
   *
   * @param  {Object}              properties
   * @param  {String|Array|Object} order
   * @param  {Int}                 limit
   * @param  {Int}                 skip
   * @param  {String|null} customerId
   * @return {Promise}
   */
  all(properties, order, limit, skip, customerId) {
    return FindAll(this._neode, this, properties, order, limit, skip, customerId)
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

    return this.first(primary_key, id, customerId)
  }

  /**
   * Find a Node by it's internal node ID
   *
   * @param  {String} model
   * @param  {int}    id
   * @param  {String|null} customerId
   * @return {Promise}
   */
  findById(id, customerId) {
    return FindById(this._neode, this, id, customerId)
  }

  /**
   * Find a Node by properties
   *
   * @param  {String} label
   * @param  {mixed}  key     Either a string for the property name or an object of values
   * @param  {mixed}  value   Value
   * @param  {String|null} customerId
   * @return {Promise}
   */
  first(key, value, customerId) {
    return First(this._neode, this, key, value, customerId)
  }

  /**
   * Get a collection of nodes within a certain distance belonging to this label
   *
   * @param  {Object}              properties
   * @param  {String}              location_property
   * @param  {Object}              point
   * @param  {Int}                 distance
   * @param  {String|Array|Object} order
   * @param  {Int}                 limit
   * @param  {Int}                 skip
   * @param  {String|null} customerId
   * @return {Promise}
   */
  withinDistance(location_property, point, distance, properties, order, limit, skip, customerId) {
    return FindWithinDistance(this._neode, this, location_property, point, distance, properties, order, limit, skip, customerId)
  }
}
