import { valueToCypher } from "../Entity"
import Node from "../Node"

export const ORIGINAL_ALIAS = "this"

/**
 * Split read properties into
 *
 * @param  {Model}   model        Model to merge on
 * @param  {Object}  properties   Map of properties
 * @return {Object}               Inline objects
 */
function checkProperties(model, properties) {
  const inline = {}

  // Calculate Set Properties
  model.properties().forEach(property => {
    const name = property.name()

    // Skip if not set
    if (!properties.hasOwnProperty(name)) {
      return
    }

    const value = valueToCypher(property, properties[name])

    inline[name] = value
  })

  return inline
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
 */
export function addReadNodeToStatement(neode, builder, alias, model, properties, order, aliases = [], customerId) {
  const inline = checkProperties(model, properties)

  // Add alias
  if (aliases.indexOf(alias) == -1) {
    aliases.push(alias)
  }

  // Create
  builder.match(alias, model, inline, customerId)

  // Add order statement if exists
  if (typeof order === "string") {
    builder.orderBy(`${alias}.${order}`)
  } else if (typeof order === "object") {
    Object.keys(order).forEach(key => {
      builder.orderBy(`${alias}.${key}`, order[key])
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
        throw new Error(`You cannot nodes with the ambiguous relationship: ${key} on model ${model.name()}`)
      }

      switch (relationship.type()) {
        // Single Relationship
        case "relationship":
          const targetAlias = `${target_alias}`
          const relAlias = `${rel_alias}`
          aliases.push(targetAlias)

          addReadRelationshipToStatement(neode, builder, alias, relAlias, targetAlias, relationship, value, aliases, customerId)

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
            addReadRelationshipToStatement(neode, builder, alias, relAlias, targetAlias, relationship, value, aliases, customerId)

            aliases.push(relAlias)

            builder.with(...aliases)
          })
          break

        // Single Node
        case "node":
          addReadNodeRelationshipToStatement(neode, builder, alias, rel_alias, target_alias, relationship, value, aliases, customerId)
          break

        // Array of Nodes
        case "nodes":
          if (!Array.isArray(value)) value = [value]

          value.forEach((value, idx) => {
            addReadNodeRelationshipToStatement(neode, builder, alias, rel_alias + idx, target_alias + idx, relationship, value, aliases, customerId)
          })
          break
      }
    }
  })

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
 * @param {String|null}     customerId      Customer ID
 */
export function addReadRelationshipToStatement(neode, builder, alias, rel_alias, target_alias, relationship, value, aliases, customerId) {
  // Extract Node
  const node_alias = relationship.nodeAlias()
  let node_value = value[node_alias]

  delete value[node_alias]

  builder.match(alias).relationship(relationship.relationship(), relationship.direction(), rel_alias)

  // If Node is passed, attempt to match a relationship to that specific node
  if (node_value instanceof Node) {
    builder.to(target_alias, undefined, customerId).whereId(target_alias, node_value.identity())
  }

  // If Primary key is passed then try to match on that
  else if (typeof node_value === "string" || typeof node_value === "number") {
    const model = neode.model(relationship.target())

    builder.to(
      target_alias,
      model,
      {
        [model.primaryKey()]: node_value,
      },
      customerId,
    )
  }

  // If Map is passed, attempt to match that node
  else if (Object.keys(node_value).length) {
    const model = neode.model(relationship.target())

    builder.to(target_alias, model, node_value, customerId)
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
 * @param {String}  mode        'create' or 'merge'
 * @param {String|null}     customerId      Customer ID
 */
export function addReadNodeRelationshipToStatement(neode, builder, alias, rel_alias, target_alias, relationship, value, aliases, mode, customerId) {
  builder.match(alias).relationship(relationship.relationship(), relationship.direction(), rel_alias)

  // If Node is passed, attempt to match a relationship to that specific node
  if (value instanceof Node) {
    builder.to(target_alias).whereId(target_alias, value.identity())
  }
  // If Primary key is passed then try to match on that
  else if (typeof value === "string" || typeof value === "number") {
    const model = neode.model(relationship.target())

    builder.to(
      target_alias,
      model,
      {
        [model.primaryKey()]: value,
      },
      customerId,
    )
  }
  // If Map is passed, attempt to match that node
  // TODO: What happens when we need to validate this?
  // TODO: Is mergeFields() the right option here?
  else if (Object.keys(value).length) {
    const model = neode.model(relationship.target())

    builder.to(target_alias, model, value, customerId)
  }
}
