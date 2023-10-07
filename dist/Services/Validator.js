"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Validator;
var Joi = _interopRequireWildcard(require("joi"));
var _neo4jDriver = _interopRequireDefault(require("neo4j-driver"));
var _Model = _interopRequireDefault(require("../Model"));
var _Node = _interopRequireDefault(require("../Node"));
var _RelationshipType = _interopRequireWildcard(require("../RelationshipType"));
var _ValidationError = _interopRequireDefault(require("../ValidationError"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); } /* eslint-disable no-case-declarations */
var joi_options = {
  allowUnknown: false,
  abortEarly: false
};

// TODO: Move these to constants and validate the model schemas a bit better
var ignore = ["labels", "type", "default", "alias", "properties", "primary", "relationship", "target", "direction", "eager", "hidden", "readonly", "index", "unique", "cascade"];
var booleans = ["optional", "forbidden", "strip", "positive", "negative", "port", "integer", "iso", "isoDate", "insensitive", "required", "truncate", "creditCard", "alphanum", "token", "hex", "hostname", "lowercase", "uppercase"];
var booleanOrOptions = ["email", "ip", "uri", "base64", "normalize", "hex"];
var temporalBase = Joi.object();
var afterExtension = {
  type: "temporal",
  base: temporalBase,
  messages: {
    "temporal.after": "Value is before the minimum expected value"
  },
  rules: {
    after: {
      method: function method(after) {
        return this.$_addRule({
          name: "after",
          args: {
            after: after
          }
        });
      },
      args: [{
        name: "after",
        assert: Joi.alternatives()["try"](Joi.date(), Joi.string()).required(),
        message: "must be a date or a string"
      }],
      validate: function validate(value, helpers, _ref, options) {
        var after = _ref.after;
        if (after === "now") {
          after = new Date();
        }
        if (after > new Date(value.toString())) {
          return helpers.error("temporal.after");
        }
        return value;
      }
    }
  }
};
var beforeExtension = {
  type: "temporal",
  base: temporalBase,
  messages: {
    "temporal.before": "Value is after the minimum expected value"
  },
  rules: {
    before: {
      method: function method(before) {
        return this.$_addRule({
          name: "before",
          args: {
            before: before
          }
        });
      },
      args: [{
        name: "before",
        assert: Joi.alternatives()["try"](Joi.date(), Joi.string()).required(),
        message: "must be a date or a string"
      }],
      validate: function validate(value, helpers, _ref2, options) {
        var before = _ref2.before;
        if (before === "now") {
          before = new Date();
        }
        if (before < new Date(value.toString())) {
          return helpers.error("temporal.before");
        }
        return value;
      }
    }
  }
};
var temporal = Joi.extend(afterExtension, beforeExtension);
var integerBase = Joi.custom(function (value, helpers) {
  if (typeof value === "number" || value instanceof _neo4jDriver["default"].types.Integer) {
    return value;
  }
  return helpers.error("any.invalid");
}, "Custom integer validation");
var minExtension = {
  type: "integer",
  base: integerBase,
  messages: {
    "integer.min": "Value is less than the minimum expected value"
  },
  rules: {
    min: {
      method: function method(min) {
        return this.$_addRule({
          name: "min",
          args: {
            min: min
          }
        });
      },
      args: [{
        name: "min",
        assert: Joi.number().required(),
        message: "must be a number"
      }],
      validate: function validate(value, helpers, _ref3, options) {
        var min = _ref3.min;
        var compare = value instanceof _neo4jDriver["default"].types.Integer ? value.toNumber() : value;
        if (min > compare) {
          return helpers.error("integer.min");
        }
        return value;
      }
    }
  }
};
var maxExtension = {
  type: "integer",
  base: integerBase,
  messages: {
    "integer.max": "Value is greater than the maximum expected value"
  },
  rules: {
    max: {
      method: function method(max) {
        return this.$_addRule({
          name: "max",
          args: {
            max: max
          }
        });
      },
      args: [{
        name: "max",
        assert: Joi.number().required(),
        message: "must be a number"
      }],
      validate: function validate(value, helpers, _ref4, options) {
        var max = _ref4.max;
        var compare = value instanceof _neo4jDriver["default"].types.Integer ? value.toNumber() : value;
        if (max < compare) {
          return helpers.error("integer.max");
        }
        return value;
      }
    }
  }
};
var multipleExtension = {
  type: "integer",
  base: integerBase,
  messages: {
    "integer.multiple": "Value is not a multiple of the given number"
  },
  rules: {
    multiple: {
      method: function method(multiple) {
        return this.$_addRule({
          name: "multiple",
          args: {
            multiple: multiple
          }
        });
      },
      args: [{
        name: "multiple",
        assert: Joi.number().required(),
        message: "must be a number"
      }],
      validate: function validate(value, helpers, _ref5, options) {
        var multiple = _ref5.multiple;
        var compare = value instanceof _neo4jDriver["default"].types.Integer ? value.toNumber() : value;
        if (compare % multiple !== 0) {
          return helpers.error("integer.multiple");
        }
        return value;
      }
    }
  }
};
var neoInteger = Joi.extend(minExtension, maxExtension, multipleExtension);
var pointExtension = {
  type: "point",
  base: Joi.custom(function (value, helpers) {
    if (value instanceof _neo4jDriver["default"].types.Point) {
      return value;
    }
    return helpers.message({
      custom: "value is not an instance of neo4j.types.Point"
    });
  })
};
var point = Joi.extend(pointExtension);
function nodeSchema() {
  return Joi.alternatives([Joi.custom(function (value, helpers) {
    if (value instanceof _Node["default"]) {
      return value;
    }
    return helpers.error("any.invalid");
  }, "Custom Node validation"), Joi.string(), Joi.number(), Joi.object()]);
}
function relationshipSchema(alias) {
  var properties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return Joi.object().keys(_objectSpread(_defineProperty({}, alias, nodeSchema().required()), BuildValidationSchema(properties)));
}
function BuildValidationSchema(schema, allOptional) {
  if (schema instanceof _Model["default"] || schema instanceof _RelationshipType["default"]) {
    schema = schema.schema();
  }
  var output = {};
  Object.keys(schema).forEach(function (key) {
    // Ignore Labels
    if (key == "labels") return;
    var config = typeof schema[key] === "string" ? {
      type: schema[key]
    } : schema[key];
    var validation = false;
    switch (config.type) {
      // TODO: Recursive creation, validate nodes and relationships
      case "node":
        validation = nodeSchema();
        break;
      case "nodes":
        validation = Joi.array().items(nodeSchema());
        break;
      case "relationship":
        // TODO: Clean up... This should probably be an object
        validation = relationshipSchema(config.alias || _RelationshipType.DEFAULT_ALIAS, config.properties);
        break;
      case "relationships":
        validation = Joi.array().items(relationshipSchema(config.alias || _RelationshipType.DEFAULT_ALIAS, config.properties));
        break;
      case "uuid":
        validation = Joi.string().guid({
          version: "uuidv4"
        });
        break;
      case "string":
        validation = Joi[config.type]().allow("");
        break;
      case "number":
      case "boolean":
        validation = Joi[config.type]();
        break;
      case "datetime":
        validation = temporal.temporal();
        break;
      case "date":
        validation = temporal.temporal();
        break;
      case "time":
        validation = temporal.temporal();
        break;
      case "localdate":
        validation = temporal.temporal();
        break;
      case "localtime":
        validation = temporal.temporal();
        break;
      case "point":
        validation = point.point();
        break;
      case "int":
      case "integer":
        validation = neoInteger.integer();
        break;
      case "float":
        validation = Joi.number();
        break;
      default:
        validation = Joi.any();
        break;
    }
    if (allOptional) {
      validation = validation.optional();
    }
    if (!config.required) {
      validation = validation.allow(null);
    }

    // Apply additional Validation
    Object.keys(config).forEach(function (validator) {
      var options = config[validator];
      if (validator == "regex") {
        if (options instanceof RegExp) {
          validation = validation.regex(options);
        } else {
          var pattern = options.pattern;
          delete options.pattern;
          validation = validation.regex(pattern, options);
        }
      } else if (validator == "replace") {
        validation = validation.replace(options.pattern, options.replace);
      } else if (booleanOrOptions.indexOf(validator) > -1) {
        if (_typeof(options) === "object") {
          validation = validation[validator](options);
        } else if (options) {
          validation = validation[validator]();
        }
      } else if (booleans.indexOf(validator) > -1) {
        if (options === true && !(validator === "required" && allOptional)) {
          validation = validation[validator](options);
        }
      } else if (ignore.indexOf(validator) == -1 && validation[validator]) {
        validation = validation[validator](options);
      } else if (ignore.indexOf(validator) == -1 && booleans.indexOf(validator) == -1) {
        throw new Error("Not sure how to validate ".concat(validator, " on ").concat(key));
      }
    });
    output[key] = validation;
  });
  return output;
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
function Validator(neode, model, properties) {
  var allOptional = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var schema = BuildValidationSchema(model, allOptional);
  return new Promise(function (resolve, reject) {
    try {
      var validated = Joi.object(schema).validateAsync(properties, joi_options);
      return resolve(validated);
    } catch (err) {
      return reject(new _ValidationError["default"](err.details, properties, err));
    }
  });
}