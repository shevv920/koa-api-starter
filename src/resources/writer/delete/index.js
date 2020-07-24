const writerService = require('resources/writer/writer.service');

async function handler(ctx) {
  const { writerId } = ctx.query;

  ctx.body = await writerService.deleteWriter(writerId);
}

module.exports.register = (router) => {
  router.delete('/', handler);
};
