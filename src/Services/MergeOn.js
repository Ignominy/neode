import Builder, { mode } from "../Query/Builder"
import { eagerNode } from "../Query/EagerUtils"
import GenerateDefaultValues from "./GenerateDefaultValues"
import Validator from "./Validator"
import { addNodeToStatement, ORIGINAL_ALIAS } from "./WriteUtils"

export default function MergeOn(neode, model, merge_on, properties, extraEagerNames, customerId) {
  return GenerateDefaultValues(neode, model, properties)
    .then(properties => Validator(neode, model, properties))
    .then(properties => {
      const alias = ORIGINAL_ALIAS

      const builder = new Builder(neode)

      addNodeToStatement(neode, builder, alias, model, properties, [alias], "merge", merge_on, customerId)

      // Output
      const output = eagerNode(neode, 1, alias, model, extraEagerNames, customerId)

      return builder
        .return(output)
        .execute(mode.WRITE)
        .then(res => neode.hydrateFirst(res, alias, model, extraEagerNames))
    })
}
