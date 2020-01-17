import Router from 'koa-Router';
import * as authCtrl from './auth.ctrl.js'

const auth = new Router();

// 컨트롤러 함수를 각 라우터에 연결
auth.post('/register', authCtrl.register);
auth.post('/login', authCtrl.login);
auth.post('/check', authCtrl.check);
auth.post('/logout', authCtrl.logout);

export default auth;