// TODO: Rename this, NodePattern?
import { getLabelStringWithCustomerIdCheck } from "./GetLabelStringWithCustomerIdCheck"

export default class Match {
  constructor(alias, model = false, properties = [], customerId = undefined) {
    this._alias = alias
    this._model = model
    this._properties = properties
    this._customerId = customerId
  }

  toString() {
    const alias = this._alias || ""
    let model = ""
    let properties = ""

    model = getLabelStringWithCustomerIdCheck(this._model, this._customerId)

    if (this._properties.length) {
      properties = " { "

      properties += this._properties.map(property => property.toInlineString()).join(", ")

      properties += " }"
    }

    return `(${alias}${model || ""}${properties})`
  }
}
