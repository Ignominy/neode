import Builder, { mode } from "../Query/Builder"
import { eagerNode } from "../Query/EagerUtils"
import Validator from "./Validator"
import { addNodeToStatement, ORIGINAL_ALIAS } from "./WriteUtils"

export default function Update(neode, model, merge_on, properties, extraEagerNames, customerId) {
  return Validator(neode, model, properties, true).then(properties => {
    const alias = ORIGINAL_ALIAS

    const builder = new Builder(neode)

    addNodeToStatement(neode, builder, alias, model, properties, [alias], "update", merge_on, customerId)

    // Output
    const output = eagerNode(neode, 1, alias, model, extraEagerNames, customerId)

    return builder
      .return(output)
      .execute(mode.WRITE)
      .then(res => neode.hydrate(res, alias, model, extraEagerNames))
  })
}
