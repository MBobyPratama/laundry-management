const Joi = require("joi");

const customerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(10).required(),
});

const itemSchema = Joi.object({
  name: Joi.string().min(3).required(),
  price: Joi.number().positive().required(),
});

module.exports = { customerSchema, itemSchema };
