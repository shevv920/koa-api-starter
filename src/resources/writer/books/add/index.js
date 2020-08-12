const writerService = require('resources/writer/writer.service');
const Joi = require('@hapi/joi');
const validate = require('middlewares/validate');

const schema = Joi.object({
  writerId: Joi.string().required(),
  books: Joi.array().items(
    Joi.object({
      title: Joi.string(),
      genre: Joi.any().valid('novel', 'poem'),
    }),
  ).required(),
}).required();

async function handler(ctx) {
  const { writerId, books } = ctx.request.body;

  ctx.body = await writerService.addWriterBooks(writerId, books);
}

module.exports.register = (router) => {
  router.post('/books', validate(schema), handler);
};
