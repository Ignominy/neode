/* eslint-disable no-case-declarations */
import * as Joi from "joi"
import neo4j from "neo4j-driver"
import Model from "../Model"
import Node from "../Node"
import RelationshipType, { DEFAULT_ALIAS } from "../RelationshipType"
import ValidationError from "../ValidationError"

const joi_options = {
  allowUnknown: false,
  abortEarly: false,
}

// TODO: Move these to constants and validate the model schemas a bit better
const ignore = [
  "labels",
  "type",
  "default",
  "alias",
  "properties",
  "primary",
  "relationship",
  "target",
  "direction",
  "eager",
  "hidden",
  "readonly",
  "index",
  "unique",
  "cascade",
]
const booleans = [
  "optional",
  "forbidden",
  "strip",
  "positive",
  "negative",
  "port",
  "integer",
  "iso",
  "isoDate",
  "insensitive",
  "required",
  "truncate",
  "creditCard",
  "alphanum",
  "token",
  "hex",
  "hostname",
  "lowercase",
  "uppercase",
]
const booleanOrOptions = ["email", "ip", "uri", "base64", "normalize", "hex"]

const temporalBase = Joi.object()

const afterExtension = {
  type: "temporal",
  base: temporalBase,
  messages: {
    "temporal.after": "Value is before the minimum expected value",
  },
  rules: {
    after: {
      method(after) {
        return this.$_addRule({ name: "after", args: { after } })
      },
      args: [
        {
          name: "after",
          assert: Joi.alternatives().try(Joi.date(), Joi.string()).required(),
          message: "must be a date or a string",
        },
      ],
      validate(value, helpers, { after }, options) {
        if (after === "now") {
          after = new Date()
        }

        if (after > new Date(value.toString())) {
          return helpers.error("temporal.after")
        }

        return value
      },
    },
  },
}

const beforeExtension = {
  type: "temporal",
  base: temporalBase,
  messages: {
    "temporal.before": "Value is after the minimum expected value",
  },
  rules: {
    before: {
      method(before) {
        return this.$_addRule({ name: "before", args: { before } })
      },
      args: [
        {
          name: "before",
          assert: Joi.alternatives().try(Joi.date(), Joi.string()).required(),
          message: "must be a date or a string",
        },
      ],
      validate(value, helpers, { before }, options) {
        if (before === "now") {
          before = new Date()
        }

        if (before < new Date(value.toString())) {
          return helpers.error("temporal.before")
        }

        return value
      },
    },
  },
}

const temporal = Joi.extend(afterExtension, beforeExtension)

const integerBase = Joi.custom((value, helpers) => {
  if (typeof value === "number" || value instanceof neo4j.types.Integer) {
    return value
  }
  return helpers.error("any.invalid")
}, "Custom integer validation")

const minExtension = {
  type: "integer",
  base: integerBase,
  messages: {
    "integer.min": "Value is less than the minimum expected value",
  },
  rules: {
    min: {
      method(min) {
        return this.$_addRule({ name: "min", args: { min } })
      },
      args: [
        {
          name: "min",
          assert: Joi.number().required(),
          message: "must be a number",
        },
      ],
      validate(value, helpers, { min }, options) {
        const compare = value instanceof neo4j.types.Integer ? value.toNumber() : value
        if (min > compare) {
          return helpers.error("integer.min")
        }
        return value
      },
    },
  },
}

const maxExtension = {
  type: "integer",
  base: integerBase,
  messages: {
    "integer.max": "Value is greater than the maximum expected value",
  },
  rules: {
    max: {
      method(max) {
        return this.$_addRule({ name: "max", args: { max } })
      },
      args: [
        {
          name: "max",
          assert: Joi.number().required(),
          message: "must be a number",
        },
      ],
      validate(value, helpers, { max }, options) {
        const compare = value instanceof neo4j.types.Integer ? value.toNumber() : value
        if (max < compare) {
          return helpers.error("integer.max")
        }
        return value
      },
    },
  },
}

const multipleExtension = {
  type: "integer",
  base: integerBase,
  messages: {
    "integer.multiple": "Value is not a multiple of the given number",
  },
  rules: {
    multiple: {
      method(multiple) {
        return this.$_addRule({ name: "multiple", args: { multiple } })
      },
      args: [
        {
          name: "multiple",
          assert: Joi.number().required(),
          message: "must be a number",
        },
      ],
      validate(value, helpers, { multiple }, options) {
        const compare = value instanceof neo4j.types.Integer ? value.toNumber() : value
        if (compare % multiple !== 0) {
          return helpers.error("integer.multiple")
        }
        return value
      },
    },
  },
}

const neoInteger = Joi.extend(minExtension, maxExtension, multipleExtension)

const pointExtension = {
  type: "point",
  base: Joi.custom((value, helpers) => {
    if (value instanceof neo4j.types.Point) {
      return value
    }
    return helpers.message({ custom: "value is not an instance of neo4j.types.Point" })
  }),
}

const point = Joi.extend(pointExtension)

function nodeSchema() {
  return Joi.alternatives([
    Joi.custom((value, helpers) => {
      if (value instanceof Node) {
        return value
      }
      return helpers.error("any.invalid")
    }, "Custom Node validation"),
    Joi.string(),
    Joi.number(),
    Joi.object(),
  ])
}

function relationshipSchema(alias, properties = {}) {
  return Joi.object().keys({
    [alias]: nodeSchema().required(),
    ...BuildValidationSchema(properties),
  })
}

function BuildValidationSchema(schema, allOptional) {
  if (schema instanceof Model || schema instanceof RelationshipType) {
    schema = schema.schema()
  }

  const output = {}

  Object.keys(schema).forEach(key => {
    // Ignore Labels
    if (key == "labels") return

    const config = typeof schema[key] === "string" ? { type: schema[key] } : schema[key]

    let validation = false

    switch (config.type) {
      // TODO: Recursive creation, validate nodes and relationships
      case "node":
        validation = nodeSchema()
        break

      case "nodes":
        validation = Joi.array().items(nodeSchema())
        break

      case "relationship":
        // TODO: Clean up... This should probably be an object
        validation = relationshipSchema(config.alias || DEFAULT_ALIAS, config.properties)

        break

      case "relationships":
        validation = Joi.array().items(relationshipSchema(config.alias || DEFAULT_ALIAS, config.properties))
        break

      case "uuid":
        validation = Joi.string().guid({ version: "uuidv4" })
        break

      case "string":
        validation = Joi[config.type]().allow("")
        break

      case "number":
      case "boolean":
        validation = Joi[config.type]()
        break

      case "datetime":
        validation = temporal.temporal()
        break

      case "date":
        validation = temporal.temporal()
        break

      case "time":
        validation = temporal.temporal()
        break

      case "localdate":
        validation = temporal.temporal()
        break

      case "localtime":
        validation = temporal.temporal()
        break

      case "point":
        validation = point.point()
        break

      case "int":
      case "integer":
        validation = neoInteger.integer()
        break

      case "float":
        validation = Joi.number()
        break

      default:
        validation = Joi.any()
        break
    }

    if (allOptional) {
      validation = validation.optional()
    }

    if (!config.required) {
      validation = validation.allow(null)
    }

    // Apply additional Validation
    Object.keys(config).forEach(validator => {
      const options = config[validator]

      if (validator == "regex") {
        if (options instanceof RegExp) {
          validation = validation.regex(options)
        } else {
          const { pattern } = options
          delete options.pattern

          validation = validation.regex(pattern, options)
        }
      } else if (validator == "replace") {
        validation = validation.replace(options.pattern, options.replace)
      } else if (booleanOrOptions.indexOf(validator) > -1) {
        if (typeof options === "object") {
          validation = validation[validator](options)
        } else if (options) {
          validation = validation[validator]()
        }
      } else if (booleans.indexOf(validator) > -1) {
        if (options === true && !(validator === "required" && allOptional)) {
          validation = validation[validator](options)
        }
      } else if (ignore.indexOf(validator) == -1 && validation[validator]) {
        validation = validation[validator](options)
      } else if (ignore.indexOf(validator) == -1 && booleans.indexOf(validator) == -1) {
        throw new Error(`Not sure how to validate ${validator} on ${key}`)
      }
    })

    output[key] = validation
  })

  return output
}

/**
 * Run Validation
 *
 * TODO: Recursive Validation
 *
 * @param  {Neode} neode
 * @param  {Model} model
 * @param  {Object} properties
 * @return {Promise}
 */
export default function Validator(neode, model, properties, allOptional = false) {
  const schema = BuildValidationSchema(model, allOptional)

  return new Promise((resolve, reject) => {
    try {
      const validated = Joi.object(schema).validateAsync(properties, joi_options)
      return resolve(validated)
    } catch (err) {
      return reject(new ValidationError(err.details, properties, err))
    }
  })
}
