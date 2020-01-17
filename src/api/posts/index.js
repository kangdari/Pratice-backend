// const Router = require('koa-router');
// const postCtrl = require('./posts.ctrl');
import Router from 'koa-router';
import * as postCtrl from './posts.ctrl.js';
// 글 작성, 수정, 삭제를 하기 위해서는 로그인 상태 체크
import checkLoggedIn from '../../lib/checkLoggedIn.js'

const posts = new Router();

// 컨트롤러 함수를 각 라우터에 연결
posts.get('/', postCtrl.list);
posts.post('/', checkLoggedIn, postCtrl.write);
posts.get('/:id', postCtrl.checkObjectId, postCtrl.read);
posts.delete('/:id', postCtrl.checkObjectId, checkLoggedIn, postCtrl.remove);
posts.patch('/:id', postCtrl.checkObjectId, checkLoggedIn, postCtrl.update);

export default posts;