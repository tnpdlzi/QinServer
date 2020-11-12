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

/* use router class */
const user = require('./routes/api/user/index'); // user 모듈을 가져다 쓰겠다. 이렇게 선언함으로써 user api가 동작하게 됨. 다른 모듈도 똑같이 여기서 이런식으로 선언해 줘야 함
const friend = require('./routes/api/friend/index');
const hash = require("./routes/api/hash/index"); //for hash req
const category = require('./routes/api/category/index');
const chat = require('./routes/api/chat/index');
const mail = require('./routes/api/mail/index');
const image = require('./routes/api/image/index');

/* /users 요청을 모두 /user/index.js로 */
app.use('/users', user); // api의 경로 설정해 준 것. 위에서 선언한 user를 어느 경로의 url로 요청했을 때 반응하게 해줄 것인가에 관한 것.
// /categori, /friends 이런식으로 우리가 쓰는 url 뒤에 /로 이어서 써주면 그 url을 통해 모듈로 요청이 가능하게 됨
app.use('/friend', friend);
app.use("/hash", hash);
app.use('/category', category);
app.use('/chat', chat);
app.use('/mail', mail);
app.use('/image', image);


app.listen(port, () => console.log(`Listening on port ${port}`)); // 서버 가동시켜줌


module.exports = app;
/* app = express();로 불러온 app의 프로퍼티에 수정을 한 뒤, (위쪽에서 app.~~로 쓴 것들이 모두 수정된 것임.)
 다시 이 객체를 모듈로 리턴했다고 볼 수 있다. */

 