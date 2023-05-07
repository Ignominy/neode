import Model from "../Model"

export const getCustomerIdLabel = customerId => {
  return `cid_${customerId.replace(/-/g, "_")}`
}

export const getLabelStringWithCustomerIdCheck = (model, customerId) => {
  if (model instanceof Model) {
    const labels = [...model.labels()]

    if (labels.length === 0 || !labels.every(label => label.startsWith("__"))) {
      if (!customerId) throw new Error("customerId is required for this model")

      labels.push(getCustomerIdLabel(customerId))
    }

    return `:${labels.join(":")}`
  } else if (typeof model === "string") {
    if (!model.startsWith("__")) {
      if (!customerId) throw new Error("customerId is required for this model")

      return `:${model}:${getCustomerIdLabel(customerId)}`
    }

    return `:${model}`
  } else if (model == null || model === false) {
    return undefined
  }

  throw new Error("model must be a Model instance or a string")
}
