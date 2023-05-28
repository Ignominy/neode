import Builder, { mode } from "../Query/Builder"
import { eagerNode } from "../Query/EagerUtils"
import { addReadNodeToStatement } from "./ReadUtils"
import Validator from "./Validator"
import { ORIGINAL_ALIAS } from "./WriteUtils"

export default function FindAll(neode, model, properties, extraEagerNames, order, limit, skip, customerId) {
  return Validator(neode, model, properties, true).then(properties => {
    const alias = ORIGINAL_ALIAS

    const builder = new Builder(neode)

    addReadNodeToStatement(neode, builder, alias, model, properties, order, [alias], customerId)

    // Output
    const output = eagerNode(neode, 1, alias, model, extraEagerNames, customerId)

    return builder
      .return(output)
      .limit(limit)
      .skip(skip)
      .execute(mode.READ)
      .then(res => {
        if (!res) throw new Error(`Could not get nodes for model ${model.name()}`)

        return neode.hydrate(res, alias, model, extraEagerNames)
      })
      .catch(err => {
        console.error(err)
        throw new Error(`Could not get nodes for model ${model.name()}`)
      })
  })
}
