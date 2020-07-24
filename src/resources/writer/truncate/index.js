const writerService = require('resources/writer/writer.service');

async function handler(ctx) {

  ctx.body = await writerService.truncate();
}

module.exports.register = (router) => {
  router.delete('/truncate', handler);
};
