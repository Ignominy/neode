import Builder, { mode } from "../Query/Builder"
import { addReadNodeToStatement } from "./ReadUtils"

export const MAX_EAGER_DEPTH = 10

/**
 * Add a recursive cascade deletion
 *
 * @param {Neode}            neode          Neode instance
 * @param {Builder}          builder        Query Builder
 * @param {String}           alias          Alias of node
 * @param {RelationshipType} relationship   relationship type definition
 * @param {Array}            aliases        Current aliases
 * @param {Integer}          to_depth       Maximum depth to delete to
 */
function addCascadeDeleteNode(neode, builder, from_alias, relationship, aliases, curr_depth, to_depth, customerId) {
  if (curr_depth > to_depth) return

  const rel_alias = `${from_alias + relationship.name()}_rel`
  const node_alias = `${from_alias + relationship.name()}_node`
  const target = neode.model(relationship.target())

  // Optional Match
  builder
    .optionalMatch(from_alias)
    .relationship(relationship.relationship(), relationship.direction(), rel_alias)
    .to(node_alias, relationship.target(), undefined, customerId)

  // Check for cascade deletions
  target.relationships().forEach(relationship => {
    switch (relationship.cascade()) {
      case "delete":
        let next_depth = curr_depth + 1
        addCascadeDeleteNode(neode, builder, node_alias, relationship, aliases.concat(node_alias), next_depth, to_depth, customerId)
        break

      case "detach":
        addDetachNode(neode, builder, node_alias, relationship, aliases.concat(node_alias), customerId)
        break
    }
  })

  // Delete it
  builder.delete(node_alias)

  builder.withDistinct(aliases)
}

/**
 * Delete the relationship to the other node
 *
 * @param {Neode}            neode          Neode instance
 * @param {Builder}          builder        Query Builder
 * @param {String}           from_alias     Alias of node at start of the match
 * @param {RelationshipType} relationship   model definition
 * @param {Array}            aliases        Current aliases
 */
function addDetachNode(neode, builder, from_alias, relationship, aliases, customerId) {
  const rel_alias = from_alias + relationship.name() + "_rel"
  const node_alias = `${from_alias + relationship.name()}_node`
  const target = neode.model(relationship.target())

  builder
    .optionalMatch(from_alias)
    .relationship(relationship.relationship(), relationship.direction(), rel_alias)
    .to(node_alias, relationship.target(), undefined, customerId)
    .delete(rel_alias)

  builder.withDistinct(aliases)
}

/**
 * Cascade Delete a Node
 *
 * @param {Neode}   neode       Neode instance
 * @param {Integer} identity    Neo4j internal ID of node to delete
 * @param {Model}   model       Model definition
 * @param {Integer} to_depth    Maximum deletion depth
 */
export default function DeleteByProperties(neode, model, properties, customerId, to_depth = MAX_EAGER_DEPTH) {
  const alias = "this"
  // const to_delete = [];
  const aliases = [alias]
  // const depth = 1;

  const builder = new Builder(neode)

  addReadNodeToStatement(neode, builder, alias, model, properties, undefined, aliases, customerId)

  // Cascade delete to relationships
  model.relationships().forEach(relationship => {
    switch (relationship.cascade()) {
      case "delete":
        addCascadeDeleteNode(neode, builder, alias, relationship, aliases, 1, to_depth, customerId)
        break

      case "detach":
        addDetachNode(neode, builder, alias, relationship, aliases, customerId)
        break
    }
  })

  // Detach Delete target node
  builder.delete(alias)

  return builder.execute(mode.WRITE)
}
