import Model from "../Model"
import Neode from "../index"

export const getLabelStringWithCustomerIdCheck = (model, customerId) => {
  if (model instanceof Model) {
    const labels = [...model.labels()]

    if (labels.length === 0 || !labels.every(label => label.startsWith("__"))) {
      if (!customerId) throw new Error("customerId is required for this model")

      labels.push(Neode.getCustomerIdLabel(customerId))
    }

    return `:${labels.join(":")}`
  } else if (typeof model === "string") {
    if (!model.startsWith("__")) {
      if (!customerId) throw new Error("customerId is required for this model")

      return `:${model}:${Neode.getCustomerIdLabel(customerId)}`
    }

    return `:${model}`
  } else if (model == null || model === false) {
    return undefined
  }

  throw new Error("model must be a Model instance or a string")
}
