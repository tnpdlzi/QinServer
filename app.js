const createError = require('http-errors'); // 에러 모듈. 안씀
const express = require('express'); // express, 서버 만들어주는 모듈. api 서버 만들 때 사용
const path = require('path'); // 디렉토리 관련 어플. 디렉토리 찾아줌.
const cookieParser = require('cookie-parser'); // 클라이언트로부터 쿠키 받아오는 모듈
const cors = require('cors'); // 한 호스팅 안에서 각기 다른 포트로부터 상호 통신 할 때 에러 안 나게 해주는 모듈
const bodyParser = require('body-parser'); // body에 있는 내용을 받아오는 모듈. rest api 제작할 때 사용
const app = express(); // express 선언
const port = process.env.PORT || 8080; // port 중에서 8000번 포트 사용
app.use(bodyParser.json()); // 바디파서의 jason 사용
app.use(bodyParser.urlencoded({ extended: true })); // 중첩된 객체를 사용하게 할지 말지에 관한것. true니까 사용
const http = require('http').createServer(app);
const io = require('socket.io')(http);
//cors 사용
app.use(cors());
const multer = require('multer');

/* use router class */
const user = require('./routes/api/user/index'); // user 모듈을 가져다 쓰겠다. 이렇게 선언함으로써 user api가 동작하게 됨. 다른 모듈도 똑같이 여기서 이런식으로 선언해 줘야 함
const friend = require('./routes/api/friend/index');
const hash = require("./routes/api/hash/index"); //for hash req
const category = require('./routes/api/category/index');
const chat = require('./routes/api/chat/index');
const mail = require('./routes/api/mail/index');

/* /users 요청을 모두 /user/index.js로 */
app.use('/users', user); // api의 경로 설정해 준 것. 위에서 선언한 user를 어느 경로의 url로 요청했을 때 반응하게 해줄 것인가에 관한 것.
// /categori, /friends 이런식으로 우리가 쓰는 url 뒤에 /로 이어서 써주면 그 url을 통해 모듈로 요청이 가능하게 됨
app.use('/friend', friend);
app.use("/hash", hash);
app.use('/category', category);
app.use('/chat', chat);
app.use('/mail', mail);

const fs = require('fs'); // 파일시스템. 파일 열고 읽고 할 때 쓰는 모듈
const data = fs.readFileSync('./database.json'); // app.js와 같은 폴더 안에 있는 database.json 파일을 열어서 읽어 data에 저장한다.
const conf = JSON.parse(data); // data에 json 형식으로 저장되어있는 것을 풀어서 conf에 저장한다.
const mysql = require('mysql'); // mysql모듈 선언

const connection = mysql.createConnection({ // mysql과 연결해주는 컨넥션을 생성.
    // database.json에 있는걸 풀어서 data로, data를 풀어서 conf로 저장했으니 database.json안에 있는 정보를 가져다 연결해준다 라는 것.
    // 호스트 (우리 ip) 유저 (사용자 이름) 비밀번호 (사용자 패스워드), 포트 (사용하는 포트), 데이타베이스 (사용하는 데이타베이스)
        host: conf.host,
    
        user: conf.user,
    
        password: conf.password,
    
        port: conf.port,
    
        database: conf.database,
    
        multipleStatements: true
    
    });
    
    connection.connect(); // 생성한 컨넥션을 연결

// const upload = multer({
//   storage: multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './profileImages');
//     },
//     filename: function (req, file, cb) {
//       cb(null, new Date().valueOf() + path.extname(file.originalname));
//     }
//   }),
// }).single('uri');

const upload = multer({dest: './profileImages'}).single('photo');

app.use('/image', express.static('./profileImages'));

let fn;
app.post('/upload', function(req, res) {
    console.log('req.file........' + req.file)
    upload(req, res, function (err) {
        if(err){
            console.log('image err................' + err)
        }
        if(req.file != null){
            fn = req.file.uri;
        } else {
            fn = 'noImage';
        }

        console.log('filename...............' + fn)
        console.log('uID...............' + req.body.uID)

        let sql = 'UPDATE User SET image = ? WHERE uID = \'' + req.body.uID + '\'';

        let image = 'image/' + fn;

        let params = [image];

        connection.query(sql, params,

          (err, rows, fields) => {
            if(err){
                console.log('image connection err................' + err)
            }

              res.send(rows);
              console.log(rows);

          }

        )

    })

})



app.listen(port, () => console.log(`Listening on port ${port}`)); // 서버 가동시켜줌


module.exports = app;
/* app = express();로 불러온 app의 프로퍼티에 수정을 한 뒤, (위쪽에서 app.~~로 쓴 것들이 모두 수정된 것임.)
 다시 이 객체를 모듈로 리턴했다고 볼 수 있다. */

 