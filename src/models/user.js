import mongooes from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const { Schema } = mongooes;

const UserSchema = new Schema({
    username: String,
    hashedPassword: String,
});

// 인스턴스 메서드
// 함수 내부에서 this에 접근해야하기 때문에 화살표 함수가 아닌 function 키워드 사용.
// hashedPassword 값 설정
UserSchema.methods.setPassword = async function(password) {
    const hash = await bcrypt.hash(password, 10);
    this.hashedPassword = hash;
};
// password 체크 메서드
UserSchema.methods.checkPassword = async function(password) {
    const result = await bcrypt.compare(password, this.hashedPassword);
    return result; // ture or false
};
// serialize
// 응답할 데이터에서 hashedPassword 필드 제거
UserSchema.methods.serialize = function() {
    const data = this.toJSON();
    delete data.hashedPassword;
    return data;
};

UserSchema.methods.generateToken = function() {
    const token = jwt.sign(
        // 첫 번째 파라미터에는 토큰 안에 집어 넣고 싶은 데이터를 넣음.
        {
            _id: this.id,
            username: this.username,
        },
        process.env.JWT_SECRET, // 두 번째 파라미터는 JWT 비밀키를 넣음.
        {
            expiresIn: '7d', // 7일 동안 유효함.
        },
    );
    return token;
};

// 스태틱 메서드, 스태틱 함수에서 this는 모델을 가리킴.
// username으로 데이터 찾기
UserSchema.statics.findByUsername = function(username) {
    return this.findOne({ username }); // this = User
};

// 모델 생성
const User = mongooes.model('User', UserSchema);

export default User;
