const writerService = require('resources/writer/writer.service');
const Joi = require('@hapi/joi');
const validate = require('middlewares/validate');

const schema = Joi.object({
  pageNumber: Joi.number(),
  documentsInPage: Joi.number()
    .sign('positive')
    .min(1)
    .max(5)
    .precision(0),
  sortBy: Joi.any().valid('firstName','lastName','_id', 'createdOn').default('_id'),
  sortOrder: Joi.any().valid('desc', 'asc'),
});

async function handler(ctx) {
  const { results, pagesCount, count } = await writerService.listing(ctx.validatedData);
  ctx.body = { data: results, meta: { numberOfAllDocuments: count, totalPages: pagesCount } };
}

module.exports.register = (router) => {
  router.get('/', validate(schema), handler);
};
