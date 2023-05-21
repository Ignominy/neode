import { valueToCypher } from "../Entity"
import Node from "../Node"
import GenerateDefaultValues from "./GenerateDefaultValues"
import { addReadNodeToStatement } from "./ReadUtils"

export const MAX_CREATE_DEPTH = 99
export const ORIGINAL_ALIAS = "this"

/**
 * Split properties into
 *
 * @param  {String}  mode        'create' or 'merge' or 'update'
 * @param  {Model}   model        Model to merge on
 * @param  {Object}  properties   Map of properties
 * @param  {Array}   merge_on     Array of properties explicitly stated to merge on
 * @return {Object}               { inline, set, on_create, on_match }
 */
function splitProperties(mode, model, properties, merge_on = []) {
  const inline = {}
  const set = {}
  const on_create = {}
  const on_match = {}

  // Calculate Set Properties
  model.properties().forEach(property => {
    const name = property.name()

    // Skip if not set
    if (!properties.hasOwnProperty(name) || properties[name] === undefined) {
      return
    }

    const value = valueToCypher(property, properties[name])

    // If mode is create, go ahead and set everything
    if (mode == "create") {
      inline[name] = value
    } else if (merge_on.indexOf(name) > -1) {
      inline[name] = value
    }

    // Only set protected properties on creation
    else if (property.protected() || property.primary()) {
      on_create[name] = value
    }

    // Read-only property?
    else if (!property.readonly()) {
      set[name] = value
    }

    // Set all properties that are writable on update
    if (mode == "update" && value !== undefined && !property.protected() && !property.primary() && !property.readonly()) {
      set[name] = value
    }
  })

  return {
    inline,
    on_create,
    on_match,
    set,
  }
}

/**
 * Add a node to the current statement
 *
 * @param {Neode}   neode       Neode instance
 * @param {Builder} builder     Query builder
 * @param {String}  alias       Alias
 * @param {Model}   model       Model
 * @param {Object}  properties  Map of properties
 * @param {Array}   aliases     Aliases to carry through in with statement
 * @param {String}  mode        'create' or 'merge' or 'update'
 * @param {Array}   merge_on    Which properties should we merge on?
 */
export function addNodeToStatement(neode, builder, alias, model, properties, aliases = [], mode = "create", merge_on = [], customerId) {
  // Split Properties
  const { inline, on_create, on_match, set } = splitProperties(mode, model, properties, merge_on)

  // Add alias
  if (aliases.indexOf(alias) == -1) {
    aliases.push(alias)
  }

  // Create
  builder[mode === "update" ? "match" : mode](alias, model, inline, customerId)

  // On create set
  if (Object.keys(on_create).length) {
    Object.entries(on_create).forEach(([key, value]) => {
      builder.onCreateSet(`${alias}.${key}`, value)
    })
  }

  // On Match Set
  if (Object.keys(on_match).length) {
    Object.entries(on_match).forEach(([key, value]) => {
      builder.onCreateSet(`${alias}.${key}`, value)
    })
  }

  // Relationships
  model.relationships().forEach((relationship, key) => {
    if (properties.hasOwnProperty(key) && properties[key] != null) {
      let value = properties[key]

      const rel_alias = `${alias}_${key}_rel`
      const target_alias = `${alias}_${key}_node`

      // Carry alias through
      builder.with(...aliases)

      if (!relationship.target()) {
        throw new Error(`A target defintion must be defined for ${key} on model ${model.name()}`)
      } else if (Array.isArray(relationship.target())) {
        throw new Error(`You cannot create a node with the ambiguous relationship: ${key} on model ${model.name()}`)
      }

      switch (relationship.type()) {
        // Single Relationship
        case "relationship":
          const targetAlias = `${target_alias}`
          const relAlias = `${rel_alias}`
          aliases.push(targetAlias)

          addRelationshipToStatement(neode, builder, alias, relAlias, targetAlias, relationship, value, aliases, mode, customerId)

          aliases.push(relAlias)

          builder.with(...aliases)
          break

        // Array of Relationships
        case "relationships":
          if (!Array.isArray(value)) value = [value]

          value.forEach((value, idx) => {
            const targetAlias = `${target_alias}${idx}`
            const relAlias = `${rel_alias}${idx}`
            aliases.push(targetAlias)

            // Carry alias through
            addRelationshipToStatement(neode, builder, alias, relAlias, targetAlias, relationship, value, aliases, mode, customerId)

            aliases.push(relAlias)

            builder.with(...aliases)
          })
          break

        // Single Node
        case "node":
          addNodeRelationshipToStatement(neode, builder, alias, rel_alias, target_alias, relationship, value, aliases, mode, customerId)
          break

        // Array of Nodes
        case "nodes":
          if (!Array.isArray(value)) value = [value]

          value.forEach((value, idx) => {
            addNodeRelationshipToStatement(neode, builder, alias, rel_alias + idx, target_alias + idx, relationship, value, aliases, mode, customerId)
          })
          break
      }
    }
  })

  // Set
  if (Object.keys(set).length) {
    Object.entries(set).forEach(([key, value]) => {
      builder.set(`${alias}.${key}`, value)
    })
  }

  return builder
}

/**
 * Add a relationship to the current statement
 *
 * @param {Neode}           neode           Neode instance
 * @param {Builder}         builder         Query builder
 * @param {String}          alias           Current node alias
 * @param {String}          rel_alias       Generated alias for the relationship
 * @param {String}          target_alias    Generated alias for the relationship
 * @param {Relationship}    relationship    Model
 * @param {Object}          value           Value map
 * @param {Array}           aliases         Aliases to carry through in with statement
 * @param {String}          mode            'create' or 'merge' or 'update'
 * @param {String|null}     customerId      Customer ID
 */
export function addRelationshipToStatement(neode, builder, alias, rel_alias, target_alias, relationship, value, aliases, mode, customerId) {
  if (aliases.length > MAX_CREATE_DEPTH) {
    return
  }

  // Extract Node
  const node_alias = relationship.nodeAlias()
  let node_value = value[node_alias]

  delete value[node_alias]

  // Create Node

  // If Node is passed, attempt to create a relationship to that specific node
  if (node_value instanceof Node) {
    builder.optionalMatch(target_alias, undefined, customerId).whereId(target_alias, node_value.identity())
  }

  // If Primary key is passed then try to match on that
  else if (typeof node_value === "string" || typeof node_value === "number") {
    const model = neode.model(relationship.target())

    builder.optionalMatch(
      target_alias,
      model,
      {
        [model.primaryKey()]: node_value,
      },
      customerId,
    )
  }

  // If Map is passed, attempt to create that node and then relate
  else if (Object.keys(node_value).length) {
    const model = neode.model(relationship.target())

    if (!model) {
      throw new Error(`Couldn't find a target model for ${relationship.target()} in ${relationship.name()}.  Did you use module.exports?`)
    }

    addReadNodeToStatement(neode, builder, target_alias, model, node_value, undefined, aliases, customerId)
  }

  // Create the Relationship
  builder[mode === "update" ? "match" : mode](alias).relationship(relationship.relationship(), relationship.direction(), rel_alias).to(target_alias)

  if (mode !== "update") {
    // Set Relationship Properties
    relationship.properties().forEach(property => {
      const name = property.name()

      if (value.hasOwnProperty(name)) {
        builder.set(`${rel_alias}.${name}`, value[name])
      }
    })
  }
}

/**
 * Add a node relationship to the current statement
 *
 * @param {Neode}           neode           Neode instance
 * @param {Builder}         builder         Query builder
 * @param {String}          alias           Current node alias
 * @param {String}          rel_alias       Generated alias for the relationship
 * @param {String}          target_alias    Generated alias for the relationship
 * @param {Relationship}    relationship    Model
 * @param {Object}          value           Value map
 * @param {Array}           aliases         Aliases to carry through in with statement
 * @param {String}  mode        'create' or 'merge' or 'update'
 * @param {String|null}     customerId      Customer ID
 */
export function addNodeRelationshipToStatement(neode, builder, alias, rel_alias, target_alias, relationship, value, aliases, mode, customerId) {
  if (aliases.length > MAX_CREATE_DEPTH) {
    return
  }

  // If Node is passed, attempt to create a relationship to that specific node
  if (value instanceof Node) {
    builder.match(target_alias).whereId(target_alias, value.identity())
  }
  // If Primary key is passed then try to match on that
  else if (typeof value === "string" || typeof value === "number") {
    const model = neode.model(relationship.target())

    builder.match(
      target_alias,
      model,
      {
        [model.primaryKey()]: value,
      },
      customerId,
    )
  }
  // If Map is passed, attempt to create that node and then relate
  // TODO: What happens when we need to validate this?
  // TODO: Is mergeFields() the right option here?
  else if (Object.keys(value).length) {
    const model = neode.model(relationship.target())

    if (!model) {
      throw new Error(`Couldn't find a target model for ${relationship.target()} in ${relationship.name()}.  Did you use module.exports?`)
    }

    if (mode === "update") {
      addReadNodeToStatement(neode, builder, target_alias, model, value, undefined, aliases, customerId)
    } else {
      value = GenerateDefaultValues.async(neode, model, value)

      addNodeToStatement(neode, builder, target_alias, model, value, aliases, mode, model.mergeFields(), customerId)
    }
  }

  // Create the Relationship
  builder[mode === "update" ? "match" : mode](alias).relationship(relationship.relationship(), relationship.direction(), rel_alias).to(target_alias)
}
