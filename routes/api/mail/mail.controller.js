const fs = require('fs'); // 파일시스템. 파일 열고 읽고 할 때 쓰는 모듈
const data = fs.readFileSync('./database.json'); // app.js와 같은 폴더 안에 있는 database.json 파일을 열어서 읽어 data에 저장한다.
const conf = JSON.parse(data); // data에 json 형식으로 저장되어있는 것을 풀어서 conf에 저장한다.
const mysql = require('mysql'); // mysql모듈 선언
const crypto = require('crypto'); // 암호화 할 때 사용하는 모듈


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

exports.evalMail = (req, res) => {

    let roomID = req.query.roomID;

    // 리스트 받기 구현

    connection.query(
        'SELECT uID FROM RoomMember WHERE RoomMember.roomID = \'' + roomID + '\';',
        (err, results, fields) => {
            if(err){
                console.log(err);
            } else{
                res.send(results);
                console.log(results);
            }
        }
    )
}

exports.sendMails = (req, res) => {

    let results = req.body.uID;
    let game = req.body.game;
    let arr = [];

    for(let i = 0; i < results.length; i++){
        for(let j = 0; j < results.length; j++){
            if(i != j){
                let params = [results[j].uID, results[i].uID, game];
                arr.push(params);
            }                    
        }
    }   

    let sql = 'INSERT INTO Request VALUES (NULL, ?, ?, ?, NOW(), 0);';
    let sqls = '';
    arr.forEach(function(item){
        sqls += mysql.format(sql, item);
    });
    console.log('sqls = ' + sqls);

    connection.query(sqls, function(err, result) {
        if(err) {
            console.log('ERR : ' + err);
        }
        res.send(result);
        console.log(result);
    });
}

exports.getMails = (req, res) => {

    let uID2 = req.query.uID;

    // 리스트 받기 구현

    connection.query(
        'SELECT Request.fgID, Request.uID1, UserGame.gameID, UserGame.game, UserGame.tierID, Request.createdTime, User.userName, User.image, User.intro, User.good, User.bad FROM Request INNER JOIN UserGame ON UserGame.game = Request.kind AND UserGame.uID = Request.uID1 INNER JOIN User ON User.uID = Request.uID1 WHERE Request.isDeleted = 0 AND Request.uID2 = \'' + uID2 + '\' ;',
        (err, rows, fields) => {
            if(err){
                console.log(err);
            } else{
                res.send(rows);
            }
        }
    )
}

exports.good = (req, res) => {

    let uID = req.query.uID;

    // 리스트 받기 구현

    connection.query(
        'UPDATE User SET good = good + 1 WHERE uID = \'' + uID + '\';',
        (err, rows, fields) => {
            if(err){
                console.log(err);
            } else{
                res.send(rows);
            }
        }
    )
}

exports.bad = (req, res) => {

    let uID = req.query.uID;

    // 리스트 받기 구현

    connection.query(
        'UPDATE User SET bad = bad + 1 WHERE uID = \'' + uID + '\';',
        (err, rows, fields) => {
            if(err){
                console.log(err);
            } else{
                res.send(rows);
            }
        }
    )
}

exports.deleteMail = (req, res) => {

    let fgID = req.query.fgID;

    // 리스트 받기 구현

    connection.query(
        'UPDATE Request SET isDeleted = 1 WHERE fgID = \'' + fgID + '\';',
        (err, rows, fields) => {
            if(err){
                console.log(err);
            } else{
                res.send(rows);
            }
        }
    )
}