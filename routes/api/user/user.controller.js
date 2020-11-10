const nodemailer = require('nodemailer');

const fs = require('fs'); // 파일시스템. 파일 열고 읽고 할 때 쓰는 모듈
const data = fs.readFileSync('./database.json'); // app.js와 같은 폴더 안에 있는 database.json 파일을 열어서 읽어 data에 저장한다.
const conf = JSON.parse(data); // data에 json 형식으로 저장되어있는 것을 풀어서 conf에 저장한다.
const mysql = require('mysql'); // mysql모듈 선언
const crypto = require('crypto'); // 암호화 할 때 사용하는 모듈


const connection = mysql.createConnection({ // mysql과 연결해주는 컨넥션을 생성.
// database.json에 있는걸 풀어서 data로, data를 풀어서 conf로 저장했으니 database.json안에 있는 정보를 가져다 연결해준다 라는 것. 호스트 (우리 ip) 유저 (사용자 이름) 비밀번호 (사용자 패스워드), 포트 (사용하는 포트), 데이타베이스 (사용하는 데이타베이스)
    host: conf.host,

    user: conf.user,

    password: conf.password,

    port: conf.port,

    database: conf.database

});

connection.connect(); // 생성한 컨넥션을 연결

const smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "qinserver2015@gmail.com",
        pass: "unnormal2015!"
    },
    tls: {
        rejectUnauthorized: false
    }
});


exports.emailAuth = async (req, res) => {

    let userID = req.body.userID;
    let randomNumber = Math.floor( ( Math.random() * (100 - 1) + 1 ) );

    const mailOptions = {
        from: "qinserver2015@gmail.com",
        to: userID,
        subject: "Q in 이메일 인증",
        text: "화면에서 다음 숫자를 입력해주세요." + randomNumber
    };
    console.log(userID);
    console.log(randomNumber);
    res.send(JSON.stringify(randomNumber));

    await smtpTransport.sendMail(mailOptions, (error, responses) => {
        if (error) {
            res.json({msg: 'err'});
        } else {
            res.json({msg: 'sucess'});
        }
        smtpTransport.close();
    });

}








exports.search = (req, res) => { // search라는 이름의 모듈을 export한다. 매개변수로는 req(request), res(response) 두 개를 가진다. 이 문법은 es6 문법으로 람다 함수, 즉 1회용 함수를 만들 때 쓰는 문법이다. 그냥 function(req, res)와 같다고 생각하면 된다.

    let id = req.body.id; // req로부터 body에 있는 id 값을 받아와 id라는 변수에 저장한다. 즉, 클라이언트로부터의 요청의 body 중에서 id라는 키 값의 밸류 값을 가져와 id에 저장한다. let은 변수 선언 할 때 쓰는 타입이다. let, var, const에 대해서는 검색해보셈
    connection.query( // 생성한 컨넥션에서 쿼리문을 쓰겠다. 즉, 디비에 쿼리문 쓰겠다.
        'SELECT * FROM User WHERE uID = ' + id + ';', // User 테이블에서 uID가 방금 저장한 id인 것의 모든 것을 select하겠다. 얘가 첫 번째 매개변수가 된다. 즉 sql query문이 첫번째 매개변수다.
        (err, rows, fields) => { // 에러, 열, 필드를 매개변수로 갖는다. params가 없어서 이게 두 번째 매개변수다. cb가 뭐 약잔지는 나도 모르겠다. 아마도 response를 뜻하는듯. 여기서 매개변수 자체가 하나의 함수다. 이는 자바스크립트의 특성인데, 매개변수로 함수를 가질 수 있다. 이것 역시 람다함수다.
            if(rows != null){ // rows는 배열, fields는 컬럼을 의미한다. err는 에러 떴을 때 에러 내용 출력해줄거다. 아마도.
                res.send(rows); // select한 값이 있으면 리턴. 근데 else문도 똑같아서 별로 의미 있지는 않다. 그냥 테스트용 코드. res는 리스폰스로 다시 클라이언트에게 반환해 준다. 여기서 send 함수가 쓰인 것. rows는 select 된 애들이 들어간다.
            } else{
                res.send(rows);
            }
        }
    )
}
// 위와 동일
exports.getMyDatas = (req, res) => {

    let userID = req.query.uID; // 여기서는 body에 있는 것이 아닌 쿼리, 즉 uID 값에 배정된 값을 받아오겠다는 query가 쓰인다. 이는 get 방식으로 주었기 때문인데, url에 ?uID=1 이런식으로 와서 body에는 아무것도 없기 때문에 body.uID 백날 해봤자 아무것도 안나온다. 얘는 get 방식임에 유의.
    console.log(userID)
    
    connection.query(
        'SELECT uID, image, userName, userID, good, bad, intro FROM User WHERE userID = \'' + userID + '\';',
        (err, rows, fields) => {

            res.send(rows);
            console.log('getMyDatas send 로그 : ' + rows); // console.log는 printf랑 비슷한 것이다. 테스트를 위해 콘솔에 찍어 본 것.

        }
    )

}

exports.searchName = (req, res) => { // search라는 이름의 모듈을 export한다. 매개변수로는 req(request), res(response) 두 개를 가진다. 이 문법은 es6 문법으로 람다 함수, 즉 1회용 함수를 만들 때 쓰는 문법이다. 그냥 function(req, res)와 같다고 생각하면 된다.
    console.log("searchNaem call");
    let name = req.body.userName; // req로부터 body에 있는 id 값을 받아와 id라는 변수에 저장한다. 즉, 클라이언트로부터의 요청의 body 중에서 id라는 키 값의 밸류 값을 가져와 id에 저장한다. let은 변수 선언 할 때 쓰는 타입이다. let, var, const에 대해서는 검색해보셈
    connection.query( // 생성한 컨넥션에서 쿼리문을 쓰겠다. 즉, 디비에 쿼리문 쓰겠다.
        'SELECT * FROM User WHERE userName = '+ JSON.stringify(name) + ';', // User 테이블에서 uID가 방금 저장한 id인 것의 모든 것을 select하겠다. 얘가 첫 번째 매개변수가 된다. 즉 sql query문이 첫번째 매개변수다.
        (err, rows, fields) => { // 에러, 열, 필드를 매개변수로 갖는다. params가 없어서 이게 두 번째 매개변수다. cb가 뭐 약잔지는 나도 모르겠다. 아마도 response를 뜻하는듯. 여기서 매개변수 자체가 하나의 함수다. 이는 자바스크립트의 특성인데, 매개변수로 함수를 가질 수 있다. 이것 역시 람다함수다.
            if(rows != ""){ // rows는 배열, fields는 컬럼을 의미한다. err는 에러 떴을 때 에러 내용 출력해줄거다. 아마도.
                console.log(rows);
                res.send(true); // select한 값이 있으면 리턴. 근데 else문도 똑같아서 별로 의미 있지는 않다. 그냥 테스트용 코드. res는 리스폰스로 다시 클라이언트에게 반환해 준다. 여기서 send 함수가 쓰인 것. rows는 select 된 애들이 들어간다.
            } else{
                console.log(rows);
                res.send(false);
            }
        }
    )
}
exports.searchQuestion = (req, res) => { // search라는 이름의 모듈을 export한다. 매개변수로는 req(request), res(response) 두 개를 가진다. 이 문법은 es6 문법으로 람다 함수, 즉 1회용 함수를 만들 때 쓰는 문법이다. 그냥 function(req, res)와 같다고 생각하면 된다.

    let name = req.body.userName; // req로부터 body에 있는 id 값을 받아와 id라는 변수에 저장한다. 즉, 클라이언트로부터의 요청의 body 중에서 id라는 키 값의 밸류 값을 가져와 id에 저장한다. let은 변수 선언 할 때 쓰는 타입이다. let, var, const에 대해서는 검색해보셈
    connection.query( // 생성한 컨넥션에서 쿼리문을 쓰겠다. 즉, 디비에 쿼리문 쓰겠다.
        'SELECT question FROM User WHERE userName = '+ JSON.stringify(name) + ';', // User 테이블에서 uID가 방금 저장한 id인 것의 모든 것을 select하겠다. 얘가 첫 번째 매개변수가 된다. 즉 sql query문이 첫번째 매개변수다.
        (err, rows, fields) => { // 에러, 열, 필드를 매개변수로 갖는다. params가 없어서 이게 두 번째 매개변수다. cb가 뭐 약잔지는 나도 모르겠다. 아마도 response를 뜻하는듯. 여기서 매개변수 자체가 하나의 함수다. 이는 자바스크립트의 특성인데, 매개변수로 함수를 가질 수 있다. 이것 역시 람다함수다.
            res.send(rows);
            console.log(rows);
        }
    )
}

exports.searchID = (req, res) => { // search라는 이름의 모듈을 export한다. 매개변수로는 req(request), res(response) 두 개를 가진다. 이 문법은 es6 문법으로 람다 함수, 즉 1회용 함수를 만들 때 쓰는 문법이다. 그냥 function(req, res)와 같다고 생각하면 된다.
    let userName = req.body.userName;
    let userID = req.body.userID;
    let phone = req.body.phone;

    connection.query( // 생성한 컨넥션에서 쿼리문을 쓰겠다. 즉, 디비에 쿼리문 쓰겠다.
        'SELECT * FROM User WHERE userID = '+ JSON.stringify(userID) + 'AND userName = ' + JSON.stringify(userName) + 'AND phone = ' + JSON.stringify(phone) + ';', // User 테이블에서 uID가 방금 저장한 id인 것의 모든 것을 select하겠다. 얘가 첫 번째 매개변수가 된다. 즉 sql query문이 첫번째 매개변수다.
        (err, rows, fields) => { // 에러, 열, 필드를 매개변수로 갖는다. params가 없어서 이게 두 번째 매개변수다. cb가 뭐 약잔지는 나도 모르겠다. 아마도 response를 뜻하는듯. 여기서 매개변수 자체가 하나의 함수다. 이는 자바스크립트의 특성인데, 매개변수로 함수를 가질 수 있다. 이것 역시 람다함수다.
            if(rows != ""){ // rows는 배열, fields는 컬럼을 의미한다. err는 에러 떴을 때 에러 내용 출력해줄거다. 아마도.
                console.log(rows);
                res.send(true); // select한 값이 있으면 리턴. 근데 else문도 똑같아서 별로 의미 있지는 않다. 그냥 테스트용 코드. res는 리스폰스로 다시 클라이언트에게 반환해 준다. 여기서 send 함수가 쓰인 것. rows는 select 된 애들이 들어간다.
            } else{
                console.log(rows);
                res.send(false);
            }
        }
    )
}
exports.search_ID = (req, res) => { // search라는 이름의 모듈을 export한다. 매개변수로는 req(request), res(response) 두 개를 가진다. 이 문법은 es6 문법으로 람다 함수, 즉 1회용 함수를 만들 때 쓰는 문법이다. 그냥 function(req, res)와 같다고 생각하면 된다.

    let userID = req.body.userID;

    connection.query( // 생성한 컨넥션에서 쿼리문을 쓰겠다. 즉, 디비에 쿼리문 쓰겠다.
        'SELECT * FROM User WHERE userID = '+ JSON.stringify(userID) + ';', // User 테이블에서 uID가 방금 저장한 id인 것의 모든 것을 select하겠다. 얘가 첫 번째 매개변수가 된다. 즉 sql query문이 첫번째 매개변수다.
        (err, rows, fields) => { // 에러, 열, 필드를 매개변수로 갖는다. params가 없어서 이게 두 번째 매개변수다. cb가 뭐 약잔지는 나도 모르겠다. 아마도 response를 뜻하는듯. 여기서 매개변수 자체가 하나의 함수다. 이는 자바스크립트의 특성인데, 매개변수로 함수를 가질 수 있다. 이것 역시 람다함수다.
            if(rows != ""){ // rows는 배열, fields는 컬럼을 의미한다. err는 에러 떴을 때 에러 내용 출력해줄거다. 아마도.
                console.log(rows);
                console.log(userID);
                res.send(true); // select한 값이 있으면 리턴. 근데 else문도 똑같아서 별로 의미 있지는 않다. 그냥 테스트용 코드. res는 리스폰스로 다시 클라이언트에게 반환해 준다. 여기서 send 함수가 쓰인 것. rows는 select 된 애들이 들어간다.
            } else{
                console.log(rows);
                console.log(userID);
                res.send(false);
            }
        }
    )
}

exports.searchAns = (req, res) => { // search라는 이름의 모듈을 export한다. 매개변수로는 req(request), res(response) 두 개를 가진다. 이 문법은 es6 문법으로 람다 함수, 즉 1회용 함수를 만들 때 쓰는 문법이다. 그냥 function(req, res)와 같다고 생각하면 된다.
    let userAns = req.body.userAns;
    let userName = req.body.userName;
    let userID = req.body.userID;
    let phone = req.body.phone;
    connection.query( // 생성한 컨넥션에서 쿼리문을 쓰겠다. 즉, 디비에 쿼리문 쓰겠다.
        'SELECT * FROM User WHERE answer = '+ JSON.stringify(userAns) + 'AND userName = ' + JSON.stringify(userName) + 'AND phone = ' + JSON.stringify(phone) + 'AND userID = ' + JSON.stringify(userID) + ';', // User 테이블에서 uID가 방금 저장한 id인 것의 모든 것을 select하겠다. 얘가 첫 번째 매개변수가 된다. 즉 sql query문이 첫번째 매개변수다.
        (err, rows, fields) => { // 에러, 열, 필드를 매개변수로 갖는다. params가 없어서 이게 두 번째 매개변수다. cb가 뭐 약잔지는 나도 모르겠다. 아마도 response를 뜻하는듯. 여기서 매개변수 자체가 하나의 함수다. 이는 자바스크립트의 특성인데, 매개변수로 함수를 가질 수 있다. 이것 역시 람다함수다.
            if(rows != ""){ // rows는 배열, fields는 컬럼을 의미한다. err는 에러 떴을 때 에러 내용 출력해줄거다. 아마도.
                console.log(rows);
                res.send(true); // select한 값이 있으면 리턴. 근데 else문도 똑같아서 별로 의미 있지는 않다. 그냥 테스트용 코드. res는 리스폰스로 다시 클라이언트에게 반환해 준다. 여기서 send 함수가 쓰인 것. rows는 select 된 애들이 들어간다.
            } else{
                console.log(rows);
                res.send(false);
            }
        }
    )
}

exports.searchPhone = (req, res) => { // search라는 이름의 모듈을 export한다. 매개변수로는 req(request), res(response) 두 개를 가진다. 이 문법은 es6 문법으로 람다 함수, 즉 1회용 함수를 만들 때 쓰는 문법이다. 그냥 function(req, res)와 같다고 생각하면 된다.
    // req로부터 body에 있는 id 값을 받아와 id라는 변수에 저장한다. 즉, 클라이언트로부터의 요청의 body 중에서 id라는 키 값의 밸류 값을 가져와 id에 저장한다. let은 변수 선언 할 때 쓰는 타입이다. let, var, const에 대해서는 검색해보셈
    let phone = req.body.phone;
    let userName = req.body.userName;
    connection.query( // 생성한 컨넥션에서 쿼리문을 쓰겠다. 즉, 디비에 쿼리문 쓰겠다.
        'SELECT phone FROM User WHERE phone = '+ JSON.stringify(phone) + 'AND userName = ' + JSON.stringify(userName) + ';', // User 테이블에서 uID가 방금 저장한 id인 것의 모든 것을 select하겠다. 얘가 첫 번째 매개변수가 된다. 즉 sql query문이 첫번째 매개변수다.
        (err, rows, fields) => { // 에러, 열, 필드를 매개변수로 갖는다. params가 없어서 이게 두 번째 매개변수다. cb가 뭐 약잔지는 나도 모르겠다. 아마도 response를 뜻하는듯. 여기서 매개변수 자체가 하나의 함수다. 이는 자바스크립트의 특성인데, 매개변수로 함수를 가질 수 있다. 이것 역시 람다함수다.
            if(rows != ""){ // rows는 배열, fields는 컬럼을 의미한다. err는 에러 떴을 때 에러 내용 출력해줄거다. 아마도.
                console.log(rows);
                res.send(true); // select한 값이 있으면 리턴. 근데 else문도 똑같아서 별로 의미 있지는 않다. 그냥 테스트용 코드. res는 리스폰스로 다시 클라이언트에게 반환해 준다. 여기서 send 함수가 쓰인 것. rows는 select 된 애들이 들어간다.
            } else{
                console.log(rows);
                res.send(false);
            }
        }
    )
}
exports.passID = (req, res) => { // search라는 이름의 모듈을 export한다. 매개변수로는 req(request), res(response) 두 개를 가진다. 이 문법은 es6 문법으로 람다 함수, 즉 1회용 함수를 만들 때 쓰는 문법이다. 그냥 function(req, res)와 같다고 생각하면 된다.
    // req로부터 body에 있는 id 값을 받아와 id라는 변수에 저장한다. 즉, 클라이언트로부터의 요청의 body 중에서 id라는 키 값의 밸류 값을 가져와 id에 저장한다. let은 변수 선언 할 때 쓰는 타입이다. let, var, const에 대해서는 검색해보셈
    let userID = req.body.userID;
    let userName = req.body.userName;
    connection.query( // 생성한 컨넥션에서 쿼리문을 쓰겠다. 즉, 디비에 쿼리문 쓰겠다.
        'SELECT userID FROM User WHERE userName = '+ JSON.stringify(userName) + ';', // User 테이블에서 uID가 방금 저장한 id인 것의 모든 것을 select하겠다. 얘가 첫 번째 매개변수가 된다. 즉 sql query문이 첫번째 매개변수다.
        (err, rows, fields) => { // 에러, 열, 필드를 매개변수로 갖는다. params가 없어서 이게 두 번째 매개변수다. cb가 뭐 약잔지는 나도 모르겠다. 아마도 response를 뜻하는듯. 여기서 매개변수 자체가 하나의 함수다. 이는 자바스크립트의 특성인데, 매개변수로 함수를 가질 수 있다. 이것 역시 람다함수다.
            if(rows != ""){ // rows는 배열, fields는 컬럼을 의미한다. err는 에러 떴을 때 에러 내용 출력해줄거다. 아마도.
                console.log(rows);
                res.send(rows); // select한 값이 있으면 리턴. 근데 else문도 똑같아서 별로 의미 있지는 않다. 그냥 테스트용 코드. res는 리스폰스로 다시 클라이언트에게 반환해 준다. 여기서 send 함수가 쓰인 것. rows는 select 된 애들이 들어간다.
            } else{
                console.log(rows);
                res.send(rows);
            }
        }
    )
}
exports.updatePW = (req, res) => {
    const inputPassword = req.body.userPW;
    let userName = req.body.userName;
    const salt = Math.round((new Date().valueOf() * Math.random())) + "";
    const hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

    connection.query(
        'UPDATE User SET userPW = '+ JSON.stringify(hashPassword) + 'WHERE userName =' + JSON.stringify(userName) +';',
        (err, rows, fields) => {
            if(rows != ""){
                console.log(rows);
                res.send(rows);
            } else{
                console.log(rows);
                res.send(false);
            }
        }
    )
}



// 회원가입 POST
// 위와 동일. 암호화 부분은 넘어가자.
exports.register = (req, res) => {

    let sql = 'INSERT INTO User VALUES (null, null, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, curdate(), 0, 0)';

    const userName = req.body.userName;
    const userID = req.body.userID;
    const inputPassword = req.body.password;
    const salt = Math.round((new Date().valueOf() * Math.random())) + "";
    const hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
    const loginBy = req.body.loginBy;
    const answer = req.body.answer;
    const question = req.body.question;
    const phone = req.body.phone;

    // params가 들어갔다. 얘네는 뭐냐면 위의 sql문에서 ?에 들어갈 애들이 된다.
    let params = [userName, userID, hashPassword, salt, loginBy, answer, question, phone];

    console.log('param:' + params);

    connection.query(sql, params, // params가 ?에 들어간 상태로 쿼리문이 실행되게 된다.

        (err, rows, fields) => { // 리스폰스 해줄 애들.

            res.send(rows); // response 해줬다. rows를

        }
    )
}



// 로그인 POST


exports.login = (req,res,next) => {
    let userID = req.query.userID;
    let inputPassword = req.query.password;
    let dbPassword, salt, userName, loginBy, good, bad, intro, uID;

    connection.query('SELECT uID, userPW, loginBy, salt, intro, good, bad, userID, userName FROM User WHERE userID = \'' + userID + '\';', function(error, results, fields) { // 여기선 es6 방식을 쓰지 않았다. 위의 = (err, rows, fields) => 이거랑 똑같은 거다.

        if (error) {
            console.log('다음은 에러메시지이다 : ' + error);
        }
        // console.log('로그인 시간 : ' + date.toDateString)
        console.log('이것은 유저의 아이디이다 = ' + userID)
        console.log('이것은 유저가 입력한 패스워드이다 = ' + inputPassword)
        console.log('유저패스워드는 다음과 같다 = ' + JSON.stringify(results))

        dbPassword = JSON.stringify(results[0].userPW); // results(rows)에서 userPW 값을 받아와 dbPassword라는 변수에 저장해주었다.

        salt = JSON.stringify(results[0].salt); // 받은 값 중에서 salt를 받아와 salt에 저장해주었다.
        var t = salt.replace('\"', "");
        var s = t.replace('\"', ""); // 따옴표를 없애주는 과정

        salt = s; // 따옴표 없앤걸 다시 저장

        userName = JSON.stringify(results[0].userName); // 같은 과정
        console.log('유저네임은다음과같다 : ' + userName)
        // var c = centerKey.replace('\"', "");
        // var d = c.replace('\"', "");
        //
        // centerKey = d;

        loginBy = JSON.stringify(results[0].loginBy); // loginBy 받아와 저장
        good = JSON.stringify(results[0].good); // loginBy 받아와 저장
        bad = JSON.stringify(results[0].bad); // loginBy 받아와 저장
        intro = JSON.stringify(results[0].intro); // loginBy 받아와 저장
        uID = JSON.stringify(results[0].uID); // loginBy 받아와 저장

        let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex"); // 암호화를 통한 동일 여부 검사

        if (dbPassword === '\"' + hashPassword + '\"') { // 디비에 들어가있는 패스워드와 방금 입력받아 암호화 다시 돌린게 같은지 검사
               console.log("비밀번호 일치");
            //  console.log(hashPassword + 'ha성공');
            //  console.log(dbPassword + 'db성공');
            //  console.log(salt + '솔트');
            
            let sendData = {uID: uID, userName: userName, userID: userID, loginBy: loginBy, good: good, bad: bad, intro: intro}; // 같다면 userName, userID, loginBy를 다시 클라이언트로 반환

            console.log(sendData)

            res.send(sendData); // sendData 값 response
        } else {
              console.log("비밀번호 불일치");
            // console.log(hashPassword + 'ha실패');
            // console.log(dbPassword + 'db실패');
            //   console.log(salt + '솔트');

            res.send("false"); // 안같으면 false라는 스트링을 클라이언트로 response
        }

    })

}






// side bar

// 게임정보 변경
/*
exports.gameInfo_change = (req, res) => {

    let usergameID = req.body.usergameID; // 바디에 있는 usergameID는 gameID로
    let tierID = req.body.tierID; // 바디에 있는 tierID는 tierID로
    let uID = req.body.uID; // 바디에 있는 uID는 uID로

    console.log(usergameID, tierID, uID);

    connection.query(
        'UPDATE UserGame SET tierID = ' + tierID + '  WHERE uID = ' + uID + ';', // 해당 uID가 맞으면  gameID, tierID 수정
        (err, rows, fields) => { //여긴 몰라
            if(rows != null){
                res.send(rows);
            } else{
                res.send('NO');
            }
        }
    )

}
*/


exports.gameInfo_change = (req, res) => {

    let usergameID = req.body.usergameID; // 바디에 있는 usergameID는 gameID로
    let tierID = req.body.tierID; // 바디에 있는 tierID는 tierID로
    let uID = req.body.uID; // 바디에 있는 uID는 uID로

    console.log(usergameID, tierID, uID);

    connection.query(
        'UPDATE UserGame SET tierID = ' + tierID + '  WHERE uID = ' + uID + ';', // 해당 uID가 맞으면  gameID, tierID 수정
        (err, rows, fields) => { //여긴 몰라
            if(rows != null){
                res.send(rows);
            } else{
                res.send('NO');
            }
        }
    )

}
//프로필 자기소개 변경

exports.userInfo_change = (req, res) => {

    let name = req.body.name;
    connection.query(
        'SELECT * FROM USER WHERE name = ' + name + ';',
        (err, rows, fields) => {
            if(rows != null){
                res.send(rows);
            } else{
                res.send('NO');
            }
        }
    )

}

//매너지수, 비매너지수

exports.mannerInfo_change = (req, res) => {

    let name = req.body.name;
    connection.query(
        'SELECT * FROM USER WHERE name = ' + name + ';',
        (err, rows, fields) => {
            if(rows != null){
                res.send(rows);
            } else{
                res.send('NO');
            }
        }
    )

}
