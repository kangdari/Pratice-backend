let postId = 1; // id 초깃값

// posts 배열 초기 데이터
const posts = [
    {
        id: 1,
        title: '제목',
        body: '내용'
    }
];

// post 작성
// Post /api/posts
export const write = ctx => {
    // REST API의 Request Body는 ctx.request.body에서 조회 가능
    const { title, body } = ctx.request.body;
    postId += 1;
    const post = { id: postId, title, body};
    posts.push(post);
    ctx.body = post;
};

// post 목록 조회
// GET /api/posts
export const list = ctx => {
    ctx.body = posts;
}

// 특정 포스트 조회
// GET /api/posts/:id
export const read = ctx => {
    const { id } = ctx.params;
    // 파라미터로 받아온 id 값은 문자열 형태
    const post = posts.find( post => post.id.toString() === id );
    // post가 없으면 오류 반환
    if(!post){
        ctx.status = 404;
        ctx.body = {
            message: '포스트가 존재하지 않음.'
        };
        return;
    }
    ctx.body = post;
}

// 특정 포스터 제거
// DELETE /api/posts/:id
export const remove = ctx =>{
    const { id } = ctx.params;
    // id에 해당하는 post의 index 값 확인
    const index = posts.findIndex(post => post.id.toString() === id);
    // post가 존재하지 않으면 오류 반환
    if(index === -1){
        ctx.status = 404;
        ctx.body = {
            message: '포스트가 존재하지 않음.'
        }
        return;
    }
    // index번째 요소 삭제
    posts.splice(index, 1);
    ctx.status = 204 // No Content
}

// 포스트 통채로 수정
// PUT /api/posts/:id
export const replace = ctx =>{
    const { id } = ctx.params;
    const index = posts.findIndex( post => post.id.toString() === id);
    if(index === -1){
        ctx.status = 404;
        ctx.body = {
            message: '포스트가 존재하지 않음.'
        }
        return;
    }
    // 전체 객체를 덮어 씌움
    // id를 제외한 기존 정보를 날리고, 객체를 새로 만듦.
    posts[index] = {
        id,
        ...ctx.request.body
    };
    ctx.body = posts[index];
}

// 포스트 수정 (특정 필드 수정)
// PATCH /api/posts/:id
export const update = ctx =>{
    const { id } = ctx.params;
    const index = posts.findIndex(post => post.id.toString() === id);
    if(index === -1){
        ctx.status = 404;
        ctx.body = {
            message: '포스트가 존재하지 않음.'
        }
        return;
    }
    // 기존 값에 덮어 씌움.
    posts[index] = {
        ...posts[index],
        ...ctx.request.body
    }
    ctx.body = posts[index];
}