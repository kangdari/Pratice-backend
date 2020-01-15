const Router = require('koa-router');
const api = Router();
const posts = require('./posts');

api.get('/test', ctx => {
    ctx.body = 'test 성공'
});

api.use('/posts', posts.routes());

module.exports = api;