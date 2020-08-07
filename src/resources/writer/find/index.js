const writerService = require('resources/writer/writer.service');

async function handler(ctx) {
  const { writerId } = ctx.query;

  ctx.body = await writerService.getWriterById(writerId);
}

module.exports.register = (router) => {
  router.get('/:writerId', handler);
};
