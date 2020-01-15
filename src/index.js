require('dotenv').config();
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const mongoose = require('mongoose');

// api 라우터 불러옴
const api = require('./api')

// 비구조화 할당을 통해 process.env 내부 값에 대한 레퍼런스 만들기
const { PORT, MONGO_URL } = process.env;

mongoose
    .connect(MONGO_URL, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true})
    .then(()=>{
        console.log('Connected to MongoDB');
    })
    .catch(e => {
        console.error(e);
});
    

const app = new Koa();
const router = new Router();

// 라우터 설정, api 라우터 적용
router.use('/api', api.routes());

// 라우터 적용 전에 bodyParser 적용
app.use(bodyParser());

// app 인스턴스에 라우저 적용
app.use(router.routes()).use(router.allowedMethods());

const port = PORT || 4000;
app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})