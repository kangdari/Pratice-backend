import Post from '../../models/post.js';
import mongooes from 'mongoose';
import Joi from 'joi';

const { ObjectId } = mongooes.Types;

// ObjectId 검증을 위한 미들웨어 
export const checkObjectId = (ctx, next) =>{
    const { id } = ctx.params
    // id가 유효하지 않다면 400 오류 발생
    if(!ObjectId.isValid(id)){
        ctx.status = 400; // Bad Request
        return;
    }
    return next();
}



// post 작성
export const write = async ctx => {
    const schema = Joi.object().keys({
        // 객체가 다음 필드를 가지고 있는지 검증
        title: Joi.string().required(), // requireㅇ()가 있으면 필수 요소
        body: Joi.string().required(),
        tags: Joi.array().items(Joi.string()).required(), // 문자열 배열
    })

    // 검증 후 검증 실패인 경우 에러 처리
    const result = Joi.validate(ctx.request.body, schema);
    if(result.error){
        ctx.status = 400; // Bad Request
        ctx.body = result.error;
        return;
    }

    // 웹 요청 정보
    const { title, body, tags } = ctx.request.body;

    // Post 인스턴스 생성
    const post = new Post({
        title,
        body,
        tags,
    });
    try {
        // 데이터베이스에 저장
        await post.save();
        ctx.body = post;
    } catch (e) {
        ctx.throw(500, e); // 서버 오류
    }
};
// 모든 post 조회
export const list = async ctx => {
    try {
        // 모델 인스턴스의 find() 함수롤 데이터 조회
        // exec() 를 붙여줘야 서버에 쿼리 요청
        const posts = await Post.find().exec();
        ctx.body = posts;
    } catch (e) {
        ctx.throw(500, e);
    }
};
// 특정 post 조회
export const read = async ctx => {
    const { id } = ctx.params;
    try {
        // id 값을 가진 데이터를 조회 시 findById() 함수 사용
        const post = await Post.findById(id).exec();
        // post가 없다면
        if (!post) {
            ctx.status = 404; // Not Found
            return;
        }
        ctx.body = post;
    } catch (e) {
        ctx.throw(500, e);
    }
};
// post 삭제
export const remove = async ctx => {
    const { id } = ctx.params;
    try {
        await Post.findByIdAndRemove(id).exec();
        ctx.status = 204; // No Connect 성공했지만 응답할 데이터 없음.
    } catch (e) {
        ctx.throw(500, e);
    }
};
// post 수정
export const update = async ctx => {
    const schema = Joi.object().keys({
        // 객체가 다음 필드를 가지고 있는지 확인
        title: Joi.string(),
        body: Joi.string(),
        tags: Joi.string().items(Joi.string())
    })

    // 검증 결과 확인
    const result = Joi.validate(ctx.request.body, schema);
    if(result.error){
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    const { id } = ctx.params;
    try {
        const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
            new: true, // 이 값을 설정하면 업데이트된 데이터를 반환
            // false일 때는 업데이트되기 전의 데이터를 반환
        }).exec();
        if (!post) {
            ctx.status = 404; // Not Found
            return;
        }
        ctx.body = post;
    } catch (e) {
        ctx.throw(500, e);
    }
};
