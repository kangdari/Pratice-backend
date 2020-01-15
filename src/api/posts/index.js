const Router = require('koa-router');
const postCtrl = require('./posts.ctrl');

const posts = new Router();

// 컨트롤러 함수를 각 라우터에 연결
posts.get('/', postCtrl.list);
posts.post('/', postCtrl.write);
posts.get('/:id', postCtrl.read);
posts.delete('/:id', postCtrl.remove);
posts.put('/:id', postCtrl.replace);
posts.patch('/:id', postCtrl.update);
module.exports = posts;