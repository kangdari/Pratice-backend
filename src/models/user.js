import mongooes from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema } = mongooes;

const UserSchema = new Schema({
    username: String,
    HashedPassword: String,
});

// 인스턴스 메서드
// 함수 내부에서 this에 접근해야하기 때문에 화살표 함수가 아닌 function 키워드 사용.
// HashedPassword 값 설정
UserSchema.methods.setPassword = async function(password) {
    const hash = await bcrypt.hash(password, 10);
    this.HashedPassword = hash;
};
// password 체크 메서드
UserSchema.methods.checkPassword = async function(password) {
    const result = await bcrypt.compare(password, this.HashedPassword);
    return result; // ture or false
};

// 스태틱 메서드, 스태틱 함수에서 this는 모델을 가리킴.
// username으로 데이터 찾기
UserSchema.statics.findByUsername = function(username){
    return this.findOne({ username }); // this = User
}

// 모델 생성
const User = mongooes.model('User', UserSchema);

export default User;
