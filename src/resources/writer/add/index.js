const Joi = require('@hapi/joi');
const validate = require('middlewares/validate');
const writerService = require('resources/writer/writer.service');

const schema = Joi.object({
  writer: {
    firstName: Joi.string()
      .trim()
      .messages({
        'string.empty': 'First name is required',
      }),
    lastName: Joi.string()
      .trim()
      .messages({
        'string.empty': 'Last name is required',
      }),
    age: Joi.number().required(),
    books: Joi.array().items(
      Joi.object({
        title: Joi.string(),
        genre: Joi.any().valid('novel', 'poem'),
      })
    ),
  }
});

async function existsValidator(ctx, next) {
  const { writer } = ctx.validatedData;

  const writerExists = await writerService.exists({
    "firstName": writer.firstName,
    "lastName": writer.lastName,
  });

  if (writerExists) {
    ctx.body = {
      errors: {
        writer: ['Writer already exists'],
      },
    };
    ctx.throw(400);
  }

  await next();
}

async function handler(ctx) {
  const { writer } = ctx.request.body;

  ctx.body = await writerService.createWriter(writer);
}

module.exports.register = (router) => {
  router.post('/', validate(schema), existsValidator, handler);
};
