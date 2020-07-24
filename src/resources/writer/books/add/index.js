const writerService = require('resources/writer/writer.service');

async function handler(ctx) {
  const { writerId, books } = ctx.request.body;

  ctx.body = await writerService.addWriterBooks(writerId, books);
}

module.exports.register = (router) => {
  router.post('/books', handler);
};
