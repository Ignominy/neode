import Builder from "../Query/Builder"
import Relationship from "../Relationship"
import RelationshipType, { DIRECTION_IN } from "../RelationshipType"
import { addReadNodeToStatement } from "./ReadUtils"

export default function RelateByProperties(neode, fromModel, fromProperties, type, toModel, toProperties, reltionshipProperties, customerId) {
  const relationship = fromModel.relationships().get(type)

  if (!(relationship instanceof RelationshipType)) {
    throw new Error(`Cannot find relationship with type ${type}`)
  }

  const builder = new Builder(neode)

  addReadNodeToStatement(neode, builder, "from", fromModel, fromProperties, undefined, ["from"], customerId)

  builder.with("from")

  addReadNodeToStatement(neode, builder, "to", toModel, toProperties, undefined, ["to", "from"], customerId)
    .with("from", "to")
    .merge("from")
    .relationship(relationship, relationship.direction(), "rel")
    .to("to")
    .set("rel", reltionshipProperties)
    .return("rel")

  const query = builder.build()

  return neode.writeCypher(query.query, query.params).then(res => {
    const rel = res.records[0].get("rel")
    const hydrate_from = relationship.direction() == DIRECTION_IN ? toModel : fromModel
    const hydrate_to = relationship.direction() == DIRECTION_IN ? fromModel : toModel

    const properties = new Map()

    Object.keys(rel.properties).forEach(key => {
      properties.set(key, rel.properties[key])
    })

    return new Relationship(neode, relationship, rel.identity, rel.type, properties, hydrate_from, hydrate_to)
  })
}
