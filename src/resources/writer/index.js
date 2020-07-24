const Router = require('@koa/router');

const router = new Router();

require('./find').register(router);
require('./add').register(router);
require('./books/add').register(router);
require('./books/delete').register(router);
require('./books/replace').register(router);
require('./delete').register(router);
require('./update').register(router);
require('./listing').register(router);
require('./truncate').register(router);

module.exports = router.routes();
