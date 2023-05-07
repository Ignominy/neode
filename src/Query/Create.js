import { getLabelStringWithCustomerIdCheck } from "./GetLabelStringWithCustomerIdCheck"

export default class Create {
  constructor(alias, model = false) {
    this._alias = alias
    this._model = model
  }

  toString() {
    const alias = this._alias || ""
    let model = ""

    model = getLabelStringWithCustomerIdCheck(this._model, this._customerId)

    return `(${alias}${model || ""})`
  }
}
