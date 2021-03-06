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

exports.getRooms = (req, res) => {

    let tier = req.query.tier;
    let game = req.query.game;

    // 삭제 구현

    connection.query('SELECT roomID, endTime FROM Room WHERE game = \'' + game + '\' AND tier = \'' + tier + '\' AND isDeleted = 0 AND matched = 0;', function(error, results, fields) {

        if(error) {
            console.log(results);
        }
        res.send(results);
        console.log(results);

    });
}

exports.updateRooms = (req, res) => {

    let results = req.body.results;
    let arr = [];
    // 삭제 구현

    for(let j = 0; j < results.length; j++){
            let params = [results[j].roomID, results[j].endTime];
            arr.push(params);
    }

    for(let i = 0; i < results.length; i++){
        let sql = 'UPDATE Room SET isDeleted = 1 WHERE roomID = ? AND DATE_ADD(createdTime, INTERVAL ? MINUTE) < NOW()' + ';'
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
}
exports.roomList = (req, res) => {

    let tier = req.query.tier;
    let game = req.query.game;

    // 리스트 받기 구현

    connection.query(
        'SELECT User.userName, Room.ruID AS ruID, Room.roomID AS roomID, Room.tier AS tier, Room.ruID AS ruID, Room.roomIntro AS roomIntro, Room.total AS total, Room.endTime AS endTime, Room.createdTime AS createdTime, (SELECT COUNT(RoomMember.uID) FROM RoomMember WHERE RoomMember.roomID = Room.roomID) AS joined FROM Room INNER JOIN RoomMember ON RoomMember.roomID = Room.roomID INNER JOIN User ON User.uID = Room.ruID WHERE Room.game = \'' + game + '\' AND Room.tier = \'' + tier + '\' AND Room.matched = 0 AND Room.isDeleted = 0 GROUP BY Room.roomID;',
        (err, rows, fields) => {
            if(err){
                console.log(err);
            } else{
                res.send(rows);
                console.log(rows);
            }
        }
    )
}
// exports.roomlist = (req, res) => {

//     let tier = req.query.tier;
//     let game = req.query.game;

//     // 삭제 구현

//     connection.query('SELECT roomID, endTime FROM Room WHERE game = \'' + game + '\' AND tier = \'' + tier + '\' AND isDeleted = 0 AND matched = 0;', function(error, results, fields) {

//         if(error) {
//             console.log(error);
//         }

//         console.log(results);


//         for(let i = 0; i < results.length; i++){
//             let sql = 'UPDATE Room SET isDeleted = 1 WHERE roomID = ' + JSON.stringify(results[i].roomID) + ' AND DATE_ADD(createdTime, INTERVAL ' + JSON.stringify(results[i].endTime) + ' MINUTE) < NOW()' + ';'
//             // console.log(JSON.stringify(results[i].proID));

//             connection.query(sql, function(err, result) {
//                     if(error) {
//                         console.log(result);
//                     }
//                     res.send(result);
//                     console.log(result);

//                 }
//             );
//         }

//     })

//     // 리스트 받기 구현

//     connection.query(
//         //'SELECT Room.roomID AS roomID, Room.ruID AS ruID, Room.roomIntro AS roomIntro, Room.total AS total, Room.endTime AS endTime, Room.createdTime AS createdTime, (SELECT COUNT(RoomMember.uID) FROM RoomMember WHERE RoomMember.roomID = Room.roomID) AS joined FROM Room INNER JOIN RoomMember ON RoomMember.roomID = Room.roomID WHERE Room.game = \'' + game + '\' AND Room.tier = \'' + tier + '\' AND Room.matched = 0 AND Room.isDeleted = 0 GROUP BY Room.roomID;',
//         'SELECT User.userName, Room.ruID AS ruID, Room.roomID AS roomID, Room.tier AS tier, Room.ruID AS ruID, Room.roomIntro AS roomIntro, Room.total AS total, Room.endTime AS endTime, Room.createdTime AS createdTime, (SELECT COUNT(RoomMember.uID) FROM RoomMember WHERE RoomMember.roomID = Room.roomID) AS joined FROM Room INNER JOIN RoomMember ON RoomMember.roomID = Room.roomID INNER JOIN User ON User.uID = Room.ruID WHERE Room.game = \'' + game + '\' AND Room.tier = \'' + tier + '\' AND Room.matched = 0 AND Room.isDeleted = 0 GROUP BY Room.roomID;',
//         (err, rows, fields) => {
//             if(err){
//                 console.log(err);
//             } else{
//                 res.send(rows);
//                 console.log(rows);
//             }
//         }
//     )
// }

exports.myroom = (req, res) => {

    let tier = req.query.tier;
    let game = req.query.game;
    let uID = req.query.uID;

    // 리스트 받기 구현

    connection.query(
        'SELECT Room.roomID AS roomID, Room.ruID AS ruID, Room.roomIntro AS roomIntro, Room.total AS total, Room.endTime AS endTime, Room.createdTime AS createdTime, (SELECT COUNT(RoomMember.uID) FROM RoomMember WHERE RoomMember.roomID = Room.roomID) AS joined FROM Room INNER JOIN RoomMember ON RoomMember.roomID = Room.roomID WHERE Room.game = \'' + game + '\' AND Room.tier = \'' + tier + '\' AND Room.matched = 0 AND Room.isDeleted = 0 AND Room.ruID = \'' + uID + '\' GROUP BY Room.roomID;',
        // 'SELECT roomID, ruID, roomIntro, total, endTime, createdTime FROM Room WHERE game = \'LOL\' AND tier = \'bronze\' AND matched = 0 AND isDeleted = 0;',
        (err, rows, fields) => {
            if(err){
                console.log(err);
            } else{
                res.send(rows);
                console.log(rows);
            }
        }
    )
}

exports.newroom = (req, res) => {

    let tier = req.query.tier;
    let game = req.query.game;
    let uID = req.query.uID;

    // 리스트 받기 구현

    connection.query(
        'SELECT roomID FROM Room WHERE Room.game = \'' + game + '\' AND Room.tier = \'' + tier + '\' AND Room.matched = 0 AND Room.isDeleted = 0 AND Room.ruID = \'' + uID + '\';',
        // 'SELECT roomID, ruID, roomIntro, total, endTime, createdTime FROM Room WHERE game = \'LOL\' AND tier = \'bronze\' AND matched = 0 AND isDeleted = 0;',
        (err, rows, fields) => {
            if(err){
                console.log(err);
            } else{
                res.send(rows);
                console.log(rows);
            }
        }
    )
}


exports.refresh = (req, res) => {

    let roomID = req.query.roomID;
    let endTime = req.query.endTime;

    // 리스트 받기 구현

    connection.query(
        'UPDATE Room SET createdTime = DATE_ADD(createdTime, INTERVAL ' + endTime + ' MINUTE) WHERE DATE_ADD(createdTime, INTERVAL ' + endTime + ' MINUTE) < DATE_ADD(NOW(), INTERVAL 1 HOUR) AND roomID = ' + roomID + ';',
        (err, rows, fields) => {
            if(err){
                console.log(err);
            } else{
                res.send(rows);
                console.log(rows);
            }
        }
    )
}

exports.member = (req, res) => {

    let roomID = req.query.roomID;
    let game = req.query.game;

    // 리스트 받기 구현

    connection.query(
        'SELECT User.userName, User.intro, User.good, User.bad, UserGame.gameID AS gameID, RoomMember.uID AS uID, inTime, position FROM RoomMember INNER JOIN UserGame ON RoomMember.uID = UserGame.uID AND UserGame.game = \'' + game + '\' INNER JOIN User ON RoomMember.uID = User.uID WHERE RoomMember.roomID = \'' + roomID + '\' AND RoomMember.baned = 0 ORDER BY RoomMember.rInID;',
        (err, rows, fields) => {
            if(err){
                console.log(err);
            } else{
                res.send(rows);
                console.log(rows);
            }
        }
    )
}

exports.mGames = (req, res) => {

    let uID = req.query.uID;

    // 리스트 받기 구현

    connection.query(
        'SELECT game, gameID, tierID FROM UserGame WHERE uID = \'' + uID + '\';',
        (err, rows, fields) => {
            if(err){
                console.log(err);
            } else{
                res.send(rows);
                console.log(rows);
            }
        }
    )
}

exports.ismember = (req, res) => {

    let roomID = req.query.roomID;
    let uID = req.query.uID;

    // 리스트 받기 구현

    connection.query(
        'SELECT uID FROM RoomMember WHERE roomID = \'' + roomID + '\' AND uID = \'' + uID + '\';',
        (err, rows, fields) => {
            if(err){
                console.log(err);
            } else{
                res.send(rows);
                console.log(rows);
            }
        }
    )
}

exports.title = (req, res) => {

    let roomID = req.query.roomID;

    connection.query(
        'SELECT Room.roomIntro AS roomIntro, Room.total AS total, (SELECT COUNT(RoomMember.uID) FROM RoomMember WHERE RoomMember.roomID = Room.roomID) AS joined FROM Room WHERE Room.roomID = \'' + roomID + '\';',
        (err, rows, fields) => {
            if(err){
                console.log(err);
            } else{
                res.send(rows);
                console.log(rows);
            }
        }
    )

    // 리스트 받기 구현
}

exports.join = (req, res) => {

    let sql = 'INSERT INTO RoomMember VALUES (null, ?, ?, ?, NOW(), 0)';

    const roomID = req.body.roomID;
    const uID = req.body.uID;
    const position = req.body.position;

    // params가 들어갔다. 얘네는 뭐냐면 위의 sql문에서 ?에 들어갈 애들이 된다.
    let params = [roomID, uID, position];

    console.log('param:' + params);

    connection.query(sql, params, // params가 ?에 들어간 상태로 쿼리문이 실행되게 된다.

        (err, rows, fields) => { // 리스폰스 해줄 애들.

            res.send(rows); // response 해줬다. rows를

        }
    )
}

exports.makeRoom = (req, res) => {

    let sql = 'INSERT INTO Room VALUES (null, ?, ?, ?, NOW(), 0, 0, ?, ?, ?)';

    const ruID = req.body.ruID;
    const tier = req.body.tier;
    const game = req.body.game;
    const total = req.body.total;
    const endTime = req.body.endTime;
    const roomIntro = req.body.roomIntro;

    // params가 들어갔다. 얘네는 뭐냐면 위의 sql문에서 ?에 들어갈 애들이 된다.
    let params = [ruID, tier, game, total, endTime, roomIntro];

    console.log('param:' + params);

    connection.query(sql, params, // params가 ?에 들어간 상태로 쿼리문이 실행되게 된다.

        (err, rows, fields) => { // 리스폰스 해줄 애들.

            res.send(rows); // response 해줬다. rows를

        }
    )
}

exports.gameID = (req, res) => {

    let uID = req.query.uID;
    let game = req.query.game;

    connection.query(
        'SELECT gameID FROM UserGame WHERE uID = \'' + uID + '\' AND game = \'' + game + '\';',
        (err, rows, fields) => {
            if(err){
                console.log(err);
            } else{
                res.send(rows);
                console.log(rows);
            }
        }
    )

    // 리스트 받기 구현
}

exports.matched = (req, res) => {

    let roomID = req.query.roomID;

    // 리스트 받기 구현

    connection.query(
        'UPDATE Room SET matched = 1, isDeleted = 1 WHERE roomID = \'' + roomID + '\';',
        (err, rows, fields) => {
            if(err){
                console.log(err);
            } else{
                res.send(rows);
                console.log(rows);
            }
        }
    )
}


exports.friend = (req, res) => {

    let sql = 'INSERT INTO Friend VALUES (?, ?, f)';

    const uID1 = req.body.uID1;
    const uID2 = req.body.uID2

    // params가 들어갔다. 얘네는 뭐냐면 위의 sql문에서 ?에 들어갈 애들이 된다.
    let params = [uID1, uID2];

    console.log('param:' + params);

    connection.query(sql, params, // params가 ?에 들어간 상태로 쿼리문이 실행되게 된다.

        (err, rows, fields) => { // 리스폰스 해줄 애들.

            res.send(rows); // response 해줬다. rows를

        }
    )
}

exports.ban = (req, res) => {

    let roomID = req.query.roomID;
    let uID = req.query.uID;

    // 리스트 받기 구현

    connection.query(
        'UPDATE RoomMember SET baned = 1 WHERE roomID = \'' + roomID + '\' AND uID = \'' + uID + '\';',
        (err, rows, fields) => {
            if(err){
                console.log(err);
            } else{
                res.send(rows);
                console.log(rows);
            }
        }
    )
}