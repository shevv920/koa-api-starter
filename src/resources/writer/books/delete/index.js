const writerService = require('resources/writer/writer.service');
const Joi = require('@hapi/joi');
const validate = require('middlewares/validate');

const schema = Joi.object({
  writerId: Joi.string().required(),
  bookId: Joi.string().required(),
}).required();

async function handler(ctx) {
  const { writerId, bookId } = ctx.validatedData;
  ctx.body = await writerService.deleteWriterBook(writerId, bookId);
}

module.exports.register = (router) => {
  router.delete('/books', validate(schema), handler);
};
