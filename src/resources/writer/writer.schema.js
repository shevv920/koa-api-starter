const Joi = require('@hapi/joi');

const schema = Joi.object({
  _id: Joi.string(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  age: Joi.number(),
  createdOn: Joi.date(),
  books: Joi.array().items(
    Joi.object({
      _id: Joi.string(),
      title: Joi.string(),
      genre: Joi.string().pattern(/^novel|poem$/),
    })
  ),
});

module.exports = (obj) => schema.validate(obj, { allowUnknown: false });
