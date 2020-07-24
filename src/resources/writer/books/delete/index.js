const writerService = require('resources/writer/writer.service');

async function handler(ctx) {
  const { writerId, bookId } = ctx.query;
  console.log(ctx.query);
  ctx.body = await writerService.deleteWriterBook(writerId, bookId);
}

module.exports.register = (router) => {
  router.delete('/books', handler);
};
