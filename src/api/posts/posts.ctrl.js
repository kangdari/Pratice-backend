import Post from '../../models/post.js';
// post 작성
export const write = async ctx =>{
    // 웹 요청 정보
    const { title, body, tags } = ctx.request.body;
    
    // Post 인스턴스 생성
    const post = new Post({
        title,
        body,
        tags
    });
    try{
        // 데이터베이스에 저장
        await post.save();
        ctx.body = post;
    }catch(e) {
        ctx.throw(500, e); // 서버 오류
    }
};
// 모든 post 조회
export const list = async ctx =>{
    try{
        // 모델 인스턴스의 find() 함수롤 데이터 조회
        // exec() 를 붙여줘야 서버에 쿼리 요청
        const posts = await Post.find().exec();
        ctx.body = posts;
    }catch(e) {
        ctx.throw(500, e);
    }
};
// 특정 post 조회
export const read = async ctx =>{
    const { id } = ctx.params;
    try{
        // id 값을 가진 데이터를 조회 시 findById() 함수 사용
        const post = await Post.findById(id).exec();
        // post가 없다면
        if(!post){
            ctx.status = 404 // Not Found
            return;
        }
        ctx.body = post;
    }catch(e) {
        ctx.throw(500, e);
    }
};

export const remove = ctx =>{};

export const update = ctx =>{};


