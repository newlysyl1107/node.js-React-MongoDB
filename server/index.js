const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const {User} = require('./models/User');
const cookieParser = require('cookie-parser');
const {auth} = require('./middleware/auth');

const config = require('./config/key');

// application/x-www-form-urlencoded 타입 parse
app.use(bodyParser.urlencoded({extended: true}));

// application/json 타입 parse
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
}).then(()=> console.log('MongoDB connected!'))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send("Hello, Node.js! 안녕하세요!"));

app.get('/api/hello', (req, res) => {
    res.send('안녕하세요');
})

app.post('/api/users/register', (req, res) => {
    // 회원 가입 시 필요한 정보들을 client 에서 가져오면
    // 그것들을 database에 넣어준다

    // 위에서 require 한 body-parser 가
    // req.body 에
    // id , password 등의 값을 받아준다.
    const user = new User(req.body);
    
    // save() 는 mongoDB 의 메소드 중 하나이며
    // req.body 의 내용이 user model 에 저장되게 한다.
    user.save((err, userInfo) => {
        // 만약 저장 시 ,에러가 발생한 경우
        // 클라이언트에 에러가 발생함을 전달해야 한다.
        // 아래 코드는 에러를 json 형식으로 전달한다는 의미. 에러메시지도 같이 보내준다.
        if(err) return res.json({ success : false, err})
        return res.status(200).json({
            success: true
        })
    })
})

// 로그인 router
app.post('/api/users/login', (req,res) => {
    // 요청된 이메일이 DB에 있는지 찾는다.
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: '제공된 이메일에 해당하는 유저가 없습니다.'
            })
        }
        // 요청된 이메일이 존재한다면, 비밀번호가 맞는지 확인한다.
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) 
                return res.json({ loginSuccess: false, message: '비밀번호가 틀렸습니다.' })
            
            // 비밀번호가 맞다면, 토큰을 생성한다.
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(arr);

                // 토큰을 저장한다. (어디에? 쿠키, 로컬스토리지)
                res.cookie('x_auth', user.token)
                .status(200)
                .json({ loginSuccess: true, userId: user._id })
            })
        })
    })
})

// 이건 각자 알아서 규칙을 정하는거지만
// role 1 어드민        role 2 특정 부서 어드민
// role 0 일반유저      role 0 이 아니면 관리자
app.get('/api/users/auth', auth, (req,res) => {

    // 여기까지 middleware 를 통과해왔다는 것은 authentication 이 true 라는 것
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id}, {token: ""}, (err,user) => {
        if(err) return res.json({ success: false, err });
        return res.status(200).send({
            success:true
        })
    });
})


app.listen(port, () => console.log(`Example App listening on port ${port}!`));