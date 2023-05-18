import Builder, { mode } from "../Query/Builder"
import { eagerNode } from "../Query/EagerUtils"
import { ORIGINAL_ALIAS, addReadNodeToStatement } from "./ReadUtils"
import Validator from "./Validator"

export default function First(neode, model, properties, extraEagerNames, customerId) {
  return Validator(neode, model, properties, true).then(properties => {
    const alias = ORIGINAL_ALIAS

    const builder = new Builder(neode)

    addReadNodeToStatement(neode, builder, alias, model, properties, undefined, [alias], customerId)

    // Output
    const output = eagerNode(neode, 1, alias, model, extraEagerNames, customerId)

    return builder
      .return(output)
      .limit(1)
      .execute(mode.READ)
      .then(res => {
        if (!res) throw new Error(`Could not get nodes for model ${model.name()}`)
        return neode.hydrateFirst(res, alias, model, extraEagerNames)
      })
      .catch(err => {
        console.error(err)
        throw new Error(`Could not get nodes for model ${model.name()}`)
      })
  })
}
