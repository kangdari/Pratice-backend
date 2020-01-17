import Joi from 'Joi';
import User from '../../models/user.js';

// Post /api/auth/register
export const register = async ctx => {
    const schema = Joi.object().keys({
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(20)
            .required(),
        password: Joi.string().required(),
    });
    const result = Joi.validate(ctx.request.body, schema);
    if (result.error) {
        ctx.status = 400; // Bad Request
        ctx.body = result.error;
        return;
    }

    const { username, password } = ctx.request.body;
    try {
        // username 중복 체크
        const exists = await User.findByUsername(username);
        if (exists) {
            ctx.status = 409; // Confilct
            return;
        }
        const user = new User({
            username,
        });
        await user.setPassword(password); // 비밀번호 저장
        await user.save(); // 데이터베이스에 저장
        // 응답할 데이터에서 hashedPassword 필드 제거
        ctx.body = user.serialize();

        // 토큰 및 쿠키 생성
        const token = user.generateToken();
        ctx.cookies.set('access_token', token, {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7-day
            httpOnly: true,
        });
    } catch (e) {
        ctx.throw(500, e);
    }
};

// Post /api/auth/login
export const login = async ctx => {
    const { username, password } = ctx.request.body;

    // username, password가 없으면 에러 처리
    if (!username || !password) {
        ctx.status = 401; // Unauthorized 인증 오류
        return;
    }

    try {
        const user = await User.findByUsername(username);
        // 유저가 없음
        if (!user) {
            ctx.status = 401; // Unauthorized 인증 오류
            return;
        }
        // password 검증
        const vaild = await user.checkPassword(password);
        // 잘못된 password
        if (!vaild) {
            ctx.status = 401;
            return;
        }
        // 응답할 데이터에서 hashedPassword 필드 제거
        ctx.body = user.serialize();

        // 토큰 및 쿠키 생성
        const token = user.generateToken();
        ctx.cookies.set('access_token', token, {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7-day
            httpOnly: true,
        });
    } catch (e) {
        ctx.throw(500, e); // 서버 오류
    }
};

// 로그인 상태 확인 메서드, 토큰 확인
// Get /api/auth/check
export const check = async ctx => {
    const { user } = ctx.state;
    // 로그인 중 아님.
    if (!user) {
        ctx.status = 401; // Unauthorized 인증 오류
        return;
    }
    ctx.body = user;
};

// Post /api/auth/logout
export const logout = async ctx => {
    // 빈 쿠키로 생성
    ctx.cookies.set('access_token');
    ctx.status = 204; // No Connect
};
