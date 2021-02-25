const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const {User} = require('./models/User');

const config = require('./config/key');

// application/x-www-form-urlencoded 타입 parse
app.use(bodyParser.urlencoded({extended: true}));

// application/json 타입 parse
app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
}).then(()=> console.log('MongoDB connected!'))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send("Hello, Node.js! 안녕하세요!"));

app.post('/register', (req, res) => {
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
app.listen(port, () => console.log(`Example App listening on port ${port}!`));