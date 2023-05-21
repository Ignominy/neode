import { Integer, Node as Neo4jNode, QueryResult, Session, Transaction } from "neo4j-driver"

declare class Neode {
  schema: Neode.Schema

  /**
   * Constructor
   *
   * @param  {String} connection_string
   * @param  {String} username
   * @param  {String} password
   * @param  {Bool}   enterprise
   * @param  {String} database
   * @param  {Object} config
   * @return {Neode}
   */
  constructor(connection_string: string, username: string, password: string, enterprise?: boolean, database?: string, config?: object)

  /**
   * @static
   * Generate Neode instance using .env configuration
   *
   * @return {Neode}
   */
  static fromEnv(): Neode

  /**
   * Get customer id label
   *
   * @param {String} customerId
   */
  static getCustomerIdLabel(customerId: string): string

  /**
   * Get customer id from node
   *
   * @param {Neode.Node} customerId
   */
  static getCustomerIdFromNodeLabels(node: Neode.Node): string | undefined

  /**
   * Convert a properties into a cypher properties
   *
   * @param {Object} properties
   * @return {Object}
   */
  static propertiesToCypher<T>(model: Neode.Model<T>, properties: Partial<T>): object

  /**
   * Define multiple models
   *
   * @param  {Object} models   Map of models with their schema.  ie {Movie: {...}}
   * @return {Neode}
   */
  with(models: { [index: string]: Neode.SchemaObject }): Neode

  /**
   * Scan a directory for Models
   *
   * @param  {String} directory   Directory to scan
   * @return {Neode}
   */
  withDirectory(directory: string): Neode

  /**
   * Set Enterprise Mode
   *
   * @param {Bool} enterprise
   */
  setEnterprise(enterprise: boolean): void

  /**
   * Are we running in enterprise mode?
   *
   * @return {Bool}
   */
  enterprise(): boolean

  /**
   * Define a new Model
   *
   * @param  {String} name
   * @param  {Object} schema
   * @return {Model}
   */
  model<T>(name: string, schema?: Neode.SchemaObject): Neode.Model<T>

  /**
   * Extend a model with extra configuration
   *
   * @param  {String} name   Original Model to clone
   * @param  {String} as     New Model name
   * @param  {Object} using  Schema changes
   * @return {Model}
   */
  extend<T>(model: string, as: string, using: Neode.SchemaObject): Neode.Model<T>

  /**
   * Create a new Node of a type
   *
   * @param  {String} model
   * @param  {Object} properties
   * @param  {String|null} customerId
   * @return {Node}
   */
  create<T>(model: string, properties: object, customerId?: string): Promise<Neode.Node<T>>

  /**
   * Merge a node based on the defined indexes
   *
   * @param  {Object} properties
   * @param  {String|null} customerId
   * @return {Promise}
   */
  merge<T>(model: string, properties: object, customerId?: string): Promise<Neode.Node<T>>

  /**
   * Merge a node based on the supplied properties
   *
   * @param  {Object} match Specific properties to merge on
   * @param  {Object} set   Properties to set
   * @param  {String|null} customerId
   * @return {Promise}
   */
  mergeOn<T>(model: string, match: object, set: object, customerId?: string): Promise<Neode.Node<T>>

  /**
   * Delete a Node from the graph
   *
   * @param  {Node} node
   * @return {Promise}
   */
  delete(node: Neode.Node<any>): Promise<void>

  /**
   * Delete all node labels
   *
   * @param  {String} label
   * @return {Promise}
   */
  deleteAll(model: string): Promise<void>

  /**
   * Relate two nodes based on the type
   *
   * @param  {Node}   from        Origin node
   * @param  {Node}   to          Target node
   * @param  {String} type        Type of Relationship definition
   * @param  {Object} properties  Properties to set against the relationships
   * @param  {Boolean} force_create   Force the creation a new relationship? If false, the relationship will be merged
   * @return {Promise}
   */
  relate<T, U>(
    from: Neode.Node<T>,
    to: Neode.Node<U>,
    type: string,
    properties: Neode.RelationshipSchema,
    force_create?: boolean,
  ): Promise<Neode.Relationship<any, T, U> | undefined>

  /**
   * Relate two nodes based on the type and properties
   *
   * @param  {Model}  fromModel               Origin model
   * @param  {Object} fromProperties          Origin properties
   * @param  {String} type                    Type of Relationship definition
   * @param  {Model}  toModel                 Target model
   * @param  {Object} toProperties            Target properties
   * @param  {Object} reltionshipProperties   Relationship properties
   * @param  {String} customerId              Customer id
   * @return {Promise}
   */
  relateByProperties<T, U, V>(
    fromModel: Neode.Model<T>,
    fromProperties: Partial<T>,
    type: keyof T,
    toModel: Neode.Model<U>,
    toProperties: Partial<U>,
    reltionshipProperties: V,
    customerId?: string,
  ): Promise<Neode.Relationship<V, T, U> | undefined>

  /**
   * Delete relationship between nodes found by properties
   *
   * @param  {Model}  fromModel               Origin model
   * @param  {Object} fromProperties          Origin properties
   * @param  {String} type                    Type of Relationship definition
   * @param  {Model}  toModel                 Target model
   * @param  {Object} toProperties            Target properties
   * @param  {String} customerId              Customer id
   * @return {Promise}
   */
  deleteRelationshipByProperties<T, U, V>(
    fromModel: Neode.Model<T>,
    fromProperties: Partial<T>,
    type: keyof T,
    toModel: Neode.Model<U>,
    toProperties: Partial<U>,
    customerId?: string,
  ): Promise<number>

  /**
   * Run an explicitly defined Read query
   *
   * @param  {String} query
   * @param  {Object} params
   * @return {Promise}
   */
  readCypher(query: string, params: object): Promise<QueryResult>

  /**
   * Run an explicitly defined Write query
   *
   * @param  {String} query
   * @param  {Object} params
   * @return {Promise}
   */
  writeCypher(query: string, params: object): Promise<QueryResult>

  /**
   * Run a Cypher query
   *
   * @param  {String} query
   * @param  {Object} params
   * @return {Promise}
   */
  cypher(query: string, params: object, session?: Session): Promise<QueryResult>

  /**
   * Create a new Session in the Neo4j Driver.
   *
   * @param {String} database
   * @return {Session}
   */
  session(): Session

  /**
   * Create an explicit Read Session
   *
   * @param {String} database
   * @return {Session}
   */
  readSession(database?: string): Session

  /**
   * Create an explicit Write Session
   *
   * @param {String} database
   * @return {Session}
   */
  writeSession(database?: string): Session

  /**
   * Create a new Transaction
   *
   * @param {String} mode
   * @param {String} database
   * @return {Transaction}
   */
  transaction(mode?: string, database?: string): Transaction

  /**
   * Run a batch of queries within a transaction
   *
   * @type {Array}
   * @return {Promise}
   */
  batch(queries?: Array<{ query: string | object; params?: object | string }>): Promise<any>

  /**
   * Close Driver
   *
   * @return {void}
   */
  close(): void

  /**
   * Return a new Query Builder
   *
   * @return {Builder}
   */
  query(): Neode.Builder

  /**
   * Get a collection of nodes
   *
   * @param  {String}              label
   * @param  {Object}              properties
   * @param  {String|Array|Object} order
   * @param  {Int}                 limit
   * @param  {Int}                 skip
   * @param  {String|null} customerId
   * @return {Promise}
   */
  all<T>(
    label: string,
    properties?: Partial<T>,
    order?: string | Array<any> | object,
    limit?: number,
    skip?: number,
    customerId?: string,
  ): Promise<Neode.NodeCollection<T>>

  /**
   * Find a Node by it's label and primary key
   *
   * @param  {String} label
   * @param  {mixed}  id
   * @param  {String|null} customerId
   * @return {Promise}
   */
  find<T>(label: string, id: string | number, customerId?: string): Promise<Neode.Node<T> | undefined>

  /**
   * Find a Node by it's internal node ID
   *
   * @param  {String} model
   * @param  {int}    id
   * @param  {String|null} customerId
   * @return {Promise}
   */
  findById<T>(label: string, id: number, customerId?: string): Promise<Neode.Node<T> | undefined>

  /**
   * Find a Node by properties
   *
   * @param  {String} label
   * @param  {mixed}  key     Either a string for the property name or an object of values
   * @param  {mixed}  value   Value
   * @param  {String|null} customerId
   * @return {Promise}
   */
  first<T>(label: string, key: string | Partial<T>, value: any, customerId?: string): Promise<Neode.Node<T> | undefined>

  /**
   * Hydrate a set of nodes and return a NodeCollection
   *
   * @param  {Object}          res            Neo4j result set
   * @param  {String}          alias          Alias of node to pluck
   * @param  {Definition|null} definition     Force Definition
   * @param  {String[]|null} extraEagerNames
   * @return {NodeCollection}
   */
  hydrate<T>(res: QueryResult, alias: string, definition?: Neode.Model<T>, extraEagerNames: Array<keyof T>): Neode.NodeCollection<T>

  /**
   * Hydrate the first record in a result set
   *
   * @param  {Object} res    Neo4j Result
   * @param  {String} alias  Alias of Node to pluck
   * @param  {String[]|null} extraEagerNames
   * @return {Node}
   */
  hydrateFirst<T>(res: QueryResult, alias: string, definition?: Neode.Model<T>, extraEagerNames: Array<keyof T>): Neode.Node<T> | undefined
}

export = Neode

declare namespace Neode {
  type PropertyType = string | number | boolean

  type TemporalPropertyTypes = "datetime" | "date" | "time" | "localdate" | "localtime" | "duration"
  type NumberPropertyTypes = "number" | "int" | "integer" | "float"
  type RelationshipPropertyTypes = "relationship" | "relationships"
  type NodesPropertyTypes = "node" | "nodes"
  type StringPropertyTypes = "string" | "uuid"
  type PropertyTypes = TemporalPropertyTypes | NumberPropertyTypes | RelationshipPropertyTypes | StringPropertyTypes | NodesPropertyTypes | "boolean" | "Point"

  type Direction = "direction_in" | "direction_out" | "direction_both" | "in" | "out"

  interface BaseNodeProperties {
    primary?: boolean
    required?: boolean
    unique?: boolean
    indexed?: boolean
    hidden?: boolean
    readonly?: boolean
    default?: any
  }

  interface BaseNumberNodeProperties extends BaseNodeProperties {
    /**
     * Minimum value of the number
     */
    min: number

    /**
     * Maximum value of the number
     */
    max: number

    /**
     * Is the number an integer
     */
    integer: boolean

    /**
     * Can the number handle positive value
     */
    positive: boolean

    /**
     * Can the number handle negative value
     */
    negative: boolean

    /**
     * The number has to be a multiple of
     */
    multiple: number
  }

  interface NumberNodeProperties extends BaseNumberNodeProperties {
    type: "number"
  }
  interface IntNodeProperties extends BaseNumberNodeProperties {
    type: "int"
  }
  interface IntegerNodeProperties extends BaseNumberNodeProperties {
    type: "integer"
  }
  interface FloatNodeProperties extends BaseNumberNodeProperties {
    type: "float"

    /**
     * Precision, decimal count
     */
    precision: number
  }

  interface StringNodeProperties extends BaseNodeProperties {
    type: "string"

    regex:
      | RegExp
      | {
          pattern: RegExp
          invert: boolean
          name: string
        }

    /**
     * Replace parts of the string
     */
    replace: {
      /**
       * RegExp pattern
       */
      pattern: RegExp

      /**
       * What should replace the pattern
       */
      replace: string
    }

    /**
     * Should the string be in a valid email format
     */
    email:
      | boolean
      | {
          /**
           * tld Domain whitelist (e.g ['com', 'fr'])
           */
          tldWhitelist: string[]
        }
  }

  interface BaseRelationshipNodeProperties extends BaseNodeProperties {
    /**
     * Neo4J Relationship name (e.g: ACTED_IN)
     */
    relationship: string

    /**
     * Target model name
     */
    target: string

    /**
     * Is the relation required to be fetch
     */
    required?: boolean

    /**
     * Load the relation with the parent object
     */
    eager?: boolean

    /**
     * Default value
     */
    default?: any

    /**
     * Relationship direction
     */
    direction: Direction

    /**
     * Behaviour when deleting the parent object
     */
    cascade?: "detach" | "delete"

    /**
     * Relationship attached properties
     */
    properties?: {
      [index: string]: PropertyTypes
    }
  }

  interface RelationshipsNodeProperties extends BaseRelationshipNodeProperties {
    type: "relationships"
  }
  interface RelationshipNodeProperties extends BaseRelationshipNodeProperties {
    type: "relationship"
  }

  interface NodesNodeProperties extends BaseRelationshipNodeProperties {
    type: "nodes"
  }

  interface NodeNodeProperties extends BaseRelationshipNodeProperties {
    type: "node"
  }

  interface OtherNodeProperties extends BaseNodeProperties {
    type: PropertyTypes
  }

  type NodeProperty =
    | PropertyTypes
    | NumberNodeProperties
    | IntNodeProperties
    | IntegerNodeProperties
    | FloatNodeProperties
    | RelationshipNodeProperties
    | RelationshipsNodeProperties
    | NodeNodeProperties
    | NodesNodeProperties
    | StringNodeProperties
    | OtherNodeProperties

  export type SchemaObject = {
    [index: string]: NodeProperty
  }

  export type RelationshipSchema = {
    [index: string]: BaseRelationshipNodeProperties
  }

  type Mode = "READ" | "WRITE"

  class Builder {
    constructor(neode: Neode)

    /**
     * Start a new Query segment and set the current statement
     *
     * @return {Builder}
     */
    statement(prefix: string): Builder

    /**
     * Start a new Where Segment
     *
     * @return {Builder}
     */
    whereStatement(prefix: string): Builder

    /**
     * Match a Node by a definition
     *
     * @param  {String} alias      Alias in query
     * @param  {Model}  model      Model definition
     * @param  {Object} properties Properties to match
     * @param  {String|null} customerId
     * @return {Builder}           Builder
     */
    match<T>(alias: string, model?: Model<T>, properties?: { [key: keyof T]: any }, customerId?: string): Builder

    optionalMatch<T>(alias: string, model?: Model<T>, properties?: { [key: keyof T]: any }, customerId?: string): Builder

    /**
     * Add a 'with' statement to the query
     *
     * @param  {...String} args Variables/aliases to return
     * @return {Builder}
     */
    with(...args: Array<string>): Builder

    /**
     * Create a new WhereSegment
     * @param  {...mixed} args
     * @return {Builder}
     */
    or(...args: Array<string>): Builder

    /**
     * Add a where condition to the current statement.
     *
     * @param  {...String} args Argumenta
     * @return {Builder}
     */
    where(...args: Array<string>): Builder

    /**
     * Add a unwind statement to the current statement.
     *
     * @param  {...String} args Argumenta
     * @return {Builder}
     */
    unwind(...args: Array<string>): Builder

    /**
     * Query on Internal ID
     *
     * @param  {String} alias
     * @param  {Int}    value
     * @return {Builder}
     */
    whereId(alias: string, value: number): Builder

    /**
     * Set Delete fields
     *
     * @param  {...mixed} args
     * @return {Builder}
     */
    delete(...args: Array<string>): Builder

    /**
     * Set Detach Delete fields
     *
     * @param  {...mixed} args
     * @return {Builder}
     */
    detachDelete(...args: Array<string>): Builder

    /**
     * Set Return fields
     *
     * @param  {...mixed} args
     * @return {Builder}
     */
    return(...args: Array<string>): Builder

    /**
     * Set Record Limit
     *
     * @param  {Int} limit
     * @return {Builder}
     */
    limit(limit: number): Builder

    /**
     * Set Records to Skip
     *
     * @param  {Int} skip
     * @return {Builder}
     */
    skip(skip: number): Builder

    /**
     * Add an order by statement
     *
     * @param  {...String|object} args  Order by statements
     * @return {Builder}
     */
    orderBy(...args: Array<string | object>): Builder

    /**
     * Add a relationship to the query
     *
     * @param  {String|RelationshipType} relationship  Relationship name or RelationshipType object
     * @param  {String}                  direction     Direction of relationship DIRECTION_IN, DIRECTION_OUT
     * @param  {String|null}             alias         Relationship alias
     * @param  {Int|String}              traversals    Number of traversals (1, "1..2", "0..2", "..3")
     * @return {Builder}
     */
    relationship(relationship: string | RelationshipType, direction: Neode.Direction, alias?: string, traversals?: number | string): Builder

    /**
     * Complete a relationship
     * @param  {String} alias Alias
     * @param  {Model} model  Model definition
     * @param  {Object} properties Properties to match
     * @param  {String|null} customerId
     * @return {Builder}
     */
    to<T>(alias: string, model?: Model<T>, properties?: { [key: keyof T]: any }, customerId?: string): Builder

    /**
     * Complete the relationship statement to point to anything
     *
     * @return {Builder}
     */
    toAnything(): Builder

    /**
     * Build the Query
     *
     * @param  {...String} output References to output
     * @return {Object}           Object containing `query` and `params` property
     */
    build(): BuiltCypher

    /**
     * Execute the query
     *
     * @return {Promise}
     */
    execute(mode?: Mode): Promise<QueryResult>
  }

  class Queryable<T> {
    /**
     * @constructor
     *
     * @param Neode neode
     */
    constructor(neode: Neode)

    /**
     * Return a new Query Builder
     *
     * @return {Builder}
     */
    query(): Builder

    /**
     * Create a new node
     *
     * @param  {object} properties
     * @param  {String[]|null} extraEagerNames
     * @param  {String|null} customerId
     * @return {Promise}
     */
    create(properties: T, extraEagerNames?: Array<keyof T>, customerId?: string): Promise<Node<T>>

    /**
     * Merge a node based on the defined indexes
     *
     * @param  {Object} properties
     * @param  {String[]|null} extraEagerNames
     * @param  {String|null} customerId
     * @return {Promise}
     */
    merge(properties: T, extraEagerNames?: Array<keyof T>, customerId?: string): Promise<Node<T>>

    /**
     * Merge a node based on the supplied properties
     *
     * @param  {Object} match Specific properties to merge on
     * @param  {Object} set   Properties to set
     * @param  {String[]|null} extraEagerNames
     * @param  {String|null} customerId
     * @return {Promise}
     */
    mergeOn(match: Partial<T>, set: Partial<T>, extraEagerNames?: Array<keyof T>, customerId?: string): Promise<Node<T>>

    /**
     * Update a node based on the supplied properties
     *
     * @param  {Object} match Specific properties to match on
     * @param  {Object} set   Properties to set
     * @param  {String[]|null} extraEagerNames
     * @param  {String|null} customerId
     * @return {Promise}
     */
    updateOn(match: Partial<T>, set: Partial<T>, extraEagerNames?: Array<keyof T>, customerId?: string): Promise<NodeCollection<T>>

    /**
     * Delete all nodes for this model
     *
     * @return {Promise}
     */
    deleteAll(): Promise<void>

    /**
     * Delete nodes by properties
     *
     * @return {Promise}
     */
    deleteByProperties(properties: Partial<T>, customerId?: string): Promise<number>

    /**
     * Get a collection of nodes for this label
     *
     * @param  {Object}              properties
     * @param  {String[]|null} extraEagerNames
     * @param  {String|Array|Object} order
     * @param  {Int}                 limit
     * @param  {Int}                 skip
     * @param  {String|null} customerId
     * @return {Promise}
     */
    all(
      properties?: Partial<T>,
      extraEagerNames?: Array<keyof T>,
      order?: string | Array<any> | object,
      limit?: number,
      skip?: number,
      customerId?: string,
    ): Promise<NodeCollection<T>>

    /**
     * Find a Node by its Primary Key
     *
     * @param  {mixed} id
     * @param  {String[]|null} extraEagerNames
     * @param  {String|null} customerId
     * @return {Promise}
     */
    find(id: string | number, extraEagerNames?: Array<keyof T>, customerId?: string): Promise<Node<T> | undefined>

    /**
     * Find a Node by it's internal node ID
     *
     * @param  {int}    id
     * @param  {String[]|null} extraEagerNames
     * @param  {String|null} customerId
     * @return {Promise}
     */
    findById(id: number, extraEagerNames?: Array<keyof T>, customerId?: string): Promise<Node<T> | undefined>

    /**
     * Find a Node by properties
     *
     * @param  {String} label
     * @param  {Object}  properties
     * @param  {String[]|null} extraEagerNames
     * @param  {String|null} customerId
     * @return {Promise}
     */
    first(properties: Partial<T>, extraEagerNames?: Array<keyof T>, customerId?: string): Promise<Node<T> | undefined>

    /**
     * Get a collection of nodes within a certain distance belonging to this label
     *
     * @param  {Object}              properties
     * @param  {String}              location_property
     * @param  {Object}              point
     * @param  {Int}                 distance
     * @param  {String[]|null}        extraEagerNames
     * @param  {String|Array|Object} order
     * @param  {Int}                 limit
     * @param  {Int}                 skip
     * @param  {String|null} customerId
     * @return {Promise}
     */
    withinDistance(
      location_property: string,
      point: { x: number; y: number; z?: number } | { latitude: number; longitude: number; height?: number },
      distance: number,
      properties?: Partial<T>,
      extraEagerNames?: Array<keyof T>,
      order?: string | Array<any> | object,
      limit?: number,
      skip?: number,
      customerId?: string,
    ): Promise<NodeCollection<T>>
  }

  class Model<T> extends Queryable<T> {
    constructor(neode: Neode, name: string, schema: Neode.SchemaObject)

    /**
     * Get Model name
     *
     * @return {String}
     */
    name(): string

    /**
     * Get Schema
     *
     * @return {Object}
     */
    schema(): Neode.SchemaObject

    /**
     * Get a map of Properties
     *
     * @return {Map}
     */
    properties(): Map<string, any>

    /**
     * Set Labels
     *
     * @param  {...String} labels
     * @return {Model}
     */
    setLabels(...labels: Array<string>): Model<T>

    /**
     * Get Labels
     *
     * @return {Array}
     */
    labels(): Array<string>

    /**
     * Add a property definition
     *
     * @param {String} key    Property name
     * @param {Object} schema Schema object
     * @return {Model}
     */
    addProperty(key: string, schema: Neode.SchemaObject): Model<T>

    /**
     * Add a new relationship
     *
     * @param  {String} name                Reference of Relationship
     * @param  {String} type                Internal Relationship type
     * @param  {String} relationship        Internal Relationship name
     * @param  {String} direction           Direction of Node (Use constants DIRECTION_IN, DIRECTION_OUT, DIRECTION_BOTH)
     * @param  {String|Model|null} target   Target type definition for the
     * @param  {Object} schema              Property Schema
     * @param  {Bool} eager                 Should this relationship be eager loaded?
     * @param  {Bool|String} cascade        Cascade delete policy for this relationship
     * @return {Relationship}
     */
    relationship<U>(
      name: string,
      type: string,
      relationship: string,
      direction?: Neode.Direction,
      target?: string | Model<U>,
      schema?: Neode.SchemaObject,
      eager?: boolean,
      cascade?: boolean | string,
    ): Relationship<object, T, U>

    /**
     * Get all defined Relationships  for this Model
     *
     * @return {Map}
     */
    relationships(): Map<string, RelationshipType>

    /**
     * Get relationships defined as Eager relationships
     *
     * @return {Array}
     */
    eager(): Array<Relationship<object, Node<any>, Node<any>>>

    /**
     * Get the name of the primary key
     *
     * @return {String}
     */
    primaryKey(): string

    /**
     * Get array of hidden fields
     *
     * @return {String[]}
     */
    hidden(): Array<string>

    /**
     * Get defined merge fields
     *
     * @return {Array}
     */
    mergeFields(): Array<string>
  }

  class Schema {
    /**
     * Neode will install the schema created by the constraints defined in your Node definitions.
     */
    install(): void

    /**
     * Dropping the schema will remove all indexes and constraints created by Neode.
     * All other indexes and constraints will be left intact.
     */
    drop(): void
  }

  class RelationshipType {
    /**
     * Constructor
     * @param  {String} type                Reference of Relationship
     * @param  {String} relationship        Internal Neo4j Relationship type (ie 'KNOWS')
     * @param  {String} direction           Direction of Node (Use constants DIRECTION_IN, DIRECTION_OUT, DIRECTION_BOTH)
     * @param  {String|Model|null} target   Target type definition for the
     * @param  {Object} schema              Relationship definition schema
     * @param  {Bool} eager                 Should this relationship be eager loaded?
     * @param  {Bool|String} cascade        Cascade delete policy for this relationship
     * @return {Relationship}
     */
    constructor(
      type: string,
      relationship: string,
      direction: Neode.Direction,
      target: string | Model<any> | null,
      schema?: Neode.RelationshipSchema,
      eager?: boolean,
      cascade?: boolean | string,
    )

    /**
     * Type
     *
     * @return {String}
     */
    type(): string

    /**
     * Get Internal Relationship Type
     *
     * @return {String}
     */
    relationship(): string

    /**
     * Set Direction of relationship
     *
     * @return {RelationshipType}
     */
    setDirection(direction: Neode.Direction): RelationshipType

    /**
     * Get Direction of Node
     *
     * @return {String}
     */
    direction(): Neode.Direction

    /**
     * Get the target node definition
     *
     * @return {Model}
     */
    target(): Model<any>

    /**
     * Get Schema object
     *
     * @return {Object}
     */
    schema(): Neode.RelationshipSchema

    /**
     * Should this relationship be eagerly loaded?
     *
     * @return {bool}
     */
    eager(): boolean

    /**
     * Cascade policy for this relationship type
     *
     * @return {String}
     */
    cascade(): string
  }

  class Relationship<PROP, FROM, TO> {
    /**
     * Constructor
     *
     * @param  {Neode}            neode         Neode Instance
     * @param  {RelationshipType} type          Relationship Type definition
     * @param  {Relationship}     relationship  Neo4j Relationship
     * @param  {Node}             from          Start node for the relationship
     * @param  {Node}             to            End node for the relationship
     * @return {Relationship}
     */
    constructor(neode: Neode, type: RelationshipType, relationship: Relationship<PROP, FROM, TO>, from: Node<FROM>, to: Node<TO>)

    /**
     * Relationship Type definition for this node
     *
     * @return {RelationshipType}
     */
    type(): RelationshipType

    /**
     * Get Internal Relationship ID
     *
     * @return {int}
     */
    id(): number

    /**
     * Return Internal Relationship ID as Neo4j Integer
     *
     * @return {Integer}
     */
    idInt(): Integer

    /**
     * Get Properties for this Relationship
     *
     * @return {Object}
     */
    properties(): PROP

    /**
     * Get a property for this relationship
     *
     * @param  {String} property Name of property
     * @param  {or}     default  Default value to supply if none exists
     * @return {mixed}
     */
    get<T>(property: keyof PROP, or?: T): T

    /**
     * Get originating node for this relationship
     *
     * @return Node
     */
    startNode(): Node<FROM>

    /**
     * Get destination node for this relationship
     *
     * @return Node
     */
    endNode(): Node<TO>

    /**
     * Convert Relationship to Object
     *
     * @return {Promise}
     */
    toJson(): Promise<string>

    /**
     * Update the properties for this relationship
     *
     * @param {Object} properties  New properties
     * @return {Node}
     */
    update(properties: Partial<PROP>): Promise<Relationship<PROP, FROM, TO>>
  }

  class Node<T> {
    /**
     * @constructor
     *
     * @param  {Neode} neode  Neode Instance
     * @param  {Model} model  Model definition
     * @param  {node}  node   Node Object from neo4j-driver
     * @param  {Map}   eager  Eagerly loaded values
     * @return {Node}
     */
    constructor(neode: Neode, model: Model<T>, node: Neo4jNode, eager?: Map<string, NodeCollection<any>>)

    /**
     * Model definition for this node
     *
     * @return {Model}
     */
    model(): Model<T>

    /**
     * Get Internal Node ID
     *
     * @return {int}
     */
    id(): number

    /**
     * Return Internal Node ID as Neo4j Integer
     *
     * @return {Integer}
     */
    idInt(): Integer

    /**
     * Get a property for this node
     *
     * @param  {String} property Name of property
     * @param  {or}     default  Default value to supply if none exists
     * @return {mixed}
     */
    get<U>(property: keyof T, or?: U): U

    /**
     * Get all properties for this node
     *
     * @return {Object}
     */
    properties(): T

    /**
     * Get Labels
     *
     * @return {Array}
     */
    labels(): string[]

    /**
     * Update the properties of a node
     * @param  {Object} properties Updated properties
     * @return {Promise}
     */
    update(properties: T): Promise<Node<T>>

    /**
     * Delete this node from the Graph
     *
     * @return {Promise}
     */
    delete(): Promise<Node<T>>

    /**
     * Detach this node from another
     *
     * @param  {Node<any>} other Node to detach from
     * @return {Promise<[Node<any>, Node<any>]>}
     */
    detachFrom(other: Node<any>): Promise<[Node<any>, Node<any>]>

    /**
     * Relate this node to another based on the type
     *
     * @param  {Node}   node            Node to relate to
     * @param  {String} type            Type of Relationship definition
     * @param  {Object} properties      Properties to set against the relationships
     * @param  {Boolean} force_create   Force the creation a new relationship? If false, the relationship will be merged
     * @return {Promise}
     */
    relateTo<U>(node: Node<U>, type: string, properties?: object, force_create?: boolean): Promise<Relationship<object, T, U>>

    /**
     * When converting to string, return this model's primary key
     *
     * @return {String}
     */
    toString(): string

    /**
     * Convert Node to Object
     *
     * @return {Promise}
     */
    toJson(): Promise<T>
  }

  class NodeCollection<N> {
    /**
     * @constructor
     * @param  {Neode} neode    Neode Instance
     * @param  {Node[]} values  Array of Node
     * @return {Collection}
     */
    constructor(neode: Neode, values: Array<Node<any>>)

    /**
     * Get length property
     *
     * @return {Int}
     */
    length: number;

    /**
     * Iterator
     */
    [Symbol.iterator](): IterableIterator<Node<any>>

    /**
     * Get a value by it's index
     *
     * @param  {Int} index
     * @return {Node}
     */
    get(index: number): Node<N>

    /**
     * Get the first Node in the Collection
     *
     * @return {Node}
     */
    first(): Node<N>

    /**
     * Map a function to all values
     *
     * @param  {Function} fn
     * @return {mixed}
     */
    map<U>(fn: (value: Node<N>, index: number, array: Array<Node<N>>) => U): Array<U>

    /**
     * Find node with function
     *
     * @param  {Function} fn
     * @return {mixed}
     */
    find<U>(fn: (value: Node<N>, index: number, array: Array<Node<N>>) => U): Node<U>

    /**
     * Run a function on all values
     * @param  {Function} fn
     * @return {mixed}
     */
    forEach(fn: (value: Node<N>, index: number, array: Array<Node<N>>) => N): N

    /**
     * Map the 'toJson' function on all values
     *
     * @return {Promise}
     */
    toJson(): Promise<object>
  }
}

export interface RelationshipNode<T> {
  node: string | number | Partial<T> | T
}

export interface BuiltCypher {
  query: string
  params: { [key: string]: any }
}
