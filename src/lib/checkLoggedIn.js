const checkLoggedIn = (ctx, next) =>{
    // 로그아웃 상태...
    if(!ctx.state.user){
        ctx.status = 401; // Unauthorized 인증 x
        return;
    }
    return next();
}

export default checkLoggedIn;