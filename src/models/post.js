import mongoose from 'mongoose';

const { Schema } = mongoose;

// 스키마 생성
const PostSchema = new Schema({
    title: String, 
    body: String,
    tags: [String], // 문자열 배열
    publishedDate: {
        type: Date,
        default: Date.now
    },
    user:{
        _id: mongoose.Types.ObjectId,
        password: String
    }
});

// 모델 생성
// mongoose.model(스키마 이름, 스키마 객체, [원하는 컬렉션 이름])
// 첫 번째 파라미터로 다른 스키마에서 현재 스키마 참조할 수 있다.
const Post = mongoose.model('Post', PostSchema);

export default Post;

