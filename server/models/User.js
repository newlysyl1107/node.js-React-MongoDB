const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;  // salt 가 몇자리인지
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function (next) {
    var user = this;
    // 비밀번호를 암호화한다.

    if(user.isModified('password')) {
        // salt를 먼저 만들고 salt 를 가지고 암호화한다.
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)        // 에러나는 경우

            // salt 를 생성한 경우
            bcrypt.hash(user.password, salt, function(err, hash) {        // 콜백함수의 hash 는 암호화된 비밀번호
                if(err) return next(err)

                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
})

userSchema.methods.comparePassword = function (plainPassword, callback) {
    // plainPassword 1234567  vs  암호화된 비밀번호 $2b$10$Q.0av9oLdSwrLiHRmYF59
    // 이 둘이 같은지 확인해야하는데,
    // 암호화 된 것을 복호화 할 수는 없고
    // plain 을 암호화하여 데이터베이스의 암호화된 비밀번호와 비교해야한다.
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return callback(err);
        callback(null, isMatch);
    });
}

userSchema.methods.generateToken = function (callback) {
    var user = this;
    // jsonwebtoken 을 이용해서 token 을 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken');

    user.token = token;
    user.save(function(err, user) {
        if(err) return callback(err)
        callback(null, user);
    })
}

userSchema.statics.findByToken = function (token, callback) {
    var user = this;

    // token 을 복호화 하는 과정
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저 아이디를 이용해서 유저를 찾은 뒤,
        // 클라이언트에서 가져온 토큰과 DB에 보관된 토큰이 일치하는지 확인
        user.findOne({ "_id": decoded, "token": token}, function(err, user) {
            if(err) return callback(err);
            callback(null, user);
        })
    })
}

const User = mongoose.model('User', userSchema);
module.exports = {User}