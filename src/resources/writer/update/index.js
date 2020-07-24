const writerService = require('resources/writer/writer.service');

async function handler(ctx) {
  const { writerId, data } = ctx.request.body;

  ctx.body = await writerService.updateWriter(writerId, data);
}

module.exports.register = (router) => {
  router.put('/', handler);
};
