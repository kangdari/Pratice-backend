// dotenv import 
import dotenv from 'dotenv';
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';

// api 라우터 불러옴
import api from './api/index.js';
// import createFakeDate from './createFakeData.js';

import jwtMiddleware from './lib/jwtMiddleware.js'

// config() 함수 호출
dotenv.config();
// 비구조화 할당을 통해 process.env 내부 값에 대한 레퍼런스 만들기
// Node.js에서 환경변수는 process.env 값을 통해 조회 가능
const { PORT, MONGO_URL } = process.env;

mongoose
    .connect(MONGO_URL, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true})
    .then(()=>{
        console.log('Connected to MongoDB');
        // 가짜 데이터 생성
        // createFakeDate();
    })
    .catch(e => {
        console.error(e);
});

const app = new Koa();
const router = new Router();

// 라우터 설정, api 라우터 적용
router.use('/api', api.routes());

// 미들웨어 적용
// 라우터 적용 전에 bodyParser 적용
app.use(bodyParser());
app.use(jwtMiddleware);

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

const port = PORT || 4000;
app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})