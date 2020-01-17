import Joi from 'Joi';
import User from '../../models/user.js';
import posts from '../posts/index.js';

// username, password : String
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
    if(result.error){
        ctx.status = 400; // Bad Request
        ctx.body = result.error;
        return;
    }

    const { username, password } = ctx.request.body;
    try{
        // username 중복 체크
        const exists = await User.findByUsername(username);
        if(exists){
            ctx.status = 409; // Confilct
            return;
        }
        const user = new User({
            username
        })
        await user.setPassword(password); // 비밀번호 저장
        await user.save(); // 데이터베이스에 저장
        // 응답할 데이터에서 hashedPassword 필드 제거 
        ctx.body = user.serialize();
    }catch(e) {
        ctx.throw(500, e);
    }
};

export const login = async ctx => {};

export const check = async ctx => {};

export const logout = async ctx => {};
