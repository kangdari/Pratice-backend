const Router = require('koa-router');
const api = Router();

api.get('/test', ctx => {
    ctx.body = 'test 성공'
});

module.exports = api;