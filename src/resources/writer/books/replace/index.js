const writerService = require('resources/writer/writer.service');

async function handler(ctx) {
  const { writerId, books } = ctx.request.body;

  ctx.body = await writerService.replaceWriterBooks(writerId, books);
}

module.exports.register = (router) => {
  router.put('/books', handler);
};
