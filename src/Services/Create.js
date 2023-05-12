import Builder, { mode } from "../Query/Builder"
import { eagerNode } from "../Query/EagerUtils"
import GenerateDefaultValues from "./GenerateDefaultValues"
import Validator from "./Validator"
import { addNodeToStatement, ORIGINAL_ALIAS } from "./WriteUtils"

export default function Create(neode, model, properties, customerId) {
  return GenerateDefaultValues(neode, model, properties)
    .then(properties => Validator(neode, model, properties))
    .then(properties => {
      const alias = ORIGINAL_ALIAS

      const builder = new Builder(neode)

      addNodeToStatement(neode, builder, alias, model, properties, [alias], "create", [], customerId)

      // Output
      const output = eagerNode(neode, 1, alias, model, customerId)

      return builder
        .return(output)
        .execute(mode.WRITE)
        .then(res => neode.hydrateFirst(res, alias))
        .catch(err => {
          console.error(err)
          throw new Error(`Could not create node for model ${model.name()}`)
        })
    })
}
