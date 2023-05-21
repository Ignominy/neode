import Builder from "../Query/Builder"
import RelationshipType from "../RelationshipType"
import { addReadNodeToStatement } from "./ReadUtils"

export default function DeleteRelationshipByProperties(neode, fromModel, fromProperties, type, toModel, toProperties, customerId) {
  const relationship = fromModel.relationships().get(type)

  if (!(relationship instanceof RelationshipType)) {
    throw new Error(`Cannot find relationship with type ${type}`)
  }

  const builder = new Builder(neode)

  addReadNodeToStatement(neode, builder, "from", fromModel, fromProperties, undefined, ["from"], customerId)

  builder.with("from")

  addReadNodeToStatement(neode, builder, "to", toModel, toProperties, undefined, ["to", "from"], customerId)
    .with("from", "to")
    .match("from")
    .relationship(relationship, relationship.direction(), "rel")
    .to("to")
    .delete("rel")

  const query = builder.build()

  return neode.writeCypher(query.query, query.params).then(res => {
    if (!res) throw new Error(`Could not get nodes for model ${model.name()}`)
    return res.summary.counters.updates().relationshipsDeleted
  })
}
