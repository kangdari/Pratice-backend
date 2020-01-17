import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const jwtMiddleware = async (ctx, next) => {
    // 토큰 가져오기
    const token = ctx.cookies.get('access_token');
    if (!token) return;
    try {
        // 토큰 검증
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        ctx.state.user = {
            _id: decoded._id,
            username: decoded.username,
        };
        // console.log(decoded);
        // decoded.iat = 생성 날짜 , decoded.exp : 남은 유효 기간
        // 남은 유효 기간이 3.5일 미만이라면 재발급
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp - now < 60 * 60 * 24 * 3.5) {
            const user = await User.findById(decoded._id);
            // 새 토큰 발급
            const token = user.generateToken();
            ctx.cookies.set('access_token', token, {
                maxAge: 1000 * 60 * 60 * 24 * 7, // 7-day
                httpOnly: true,
            });
        }
        return next();
    } catch (e) {
        return next();
    }
};

export default jwtMiddleware;
