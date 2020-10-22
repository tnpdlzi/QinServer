const fs = require('fs');
const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);
const mysql = require('mysql');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = 3000;

const connection = mysql.createPool({   
    host: conf.host,
    user: conf.user,
    password: conf.password,
    port: conf.port,
    database: conf.database

    // host: 'localhost',
    // user: 'root',
    // password: '1234',
    // port: '3306',
    // database: 'chattest'
});
//connection.connect();

exports.loadChatList = (req, res) => {      //미완성 부분 (아직 안씀)
    let uID = req.body.uID;
    let chatListSql = "SELECT chatName FROM chatlist";
    connection.query(chatListSql, function(err, results, fields){
        console.log(results);
        res.send(results);
    });
}

io.on('connection', (socket) => {

    //메시지 주고받기
    socket.on('chat message', (msg) => {
        //io.emit('submit', msg);
        console.log('message send : ' + msg);
    })

    //연결 종료시 실행
    socket.on('disconnect', () => {
        console.log('user disconnected: ' + socket.username);
    })
    
    //DB에서 채팅방 리스트 불러오기
    socket.on('load chatList', () => {
        let chatListSql = "SELECT chatName FROM ChatList";
        connection.query(chatListSql, function (err, results, fields) {
            //console.log(results);
            socket.emit('return chatList', results);
        });
    })

    //DB에서 채팅방별 메시지 모두 불러오기
    socket.on('load Message', (chatName) => {
        let messageListSql = "SELECT mID, message FROM Message where chatID = (SELECT chatID from ChatList where chatName ='" + chatName + "')";
        connection.query(messageListSql, function (err, results, fields) {
            //console.log(results);
            if(results.length > 0)
                socket.emit('return Message', results);
        });
    });

    //보낸 메시지 받아서 DB로 저장
    socket.on('send Message', (msg, chatName) => {
        var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let getMessageSql = "INSERT INTO Message(chatID, uID, sendTime, message) VALUES((SELECT chatID from ChatList where chatName ='" + chatName + "'), 1, '" + date + "','" + msg +"')";
        connection.query(getMessageSql, function (err, results, fields) {
            //console.log(results);
        });
    })
})
http.listen(port, () => console.log('Chatting: Listening on port ' + port));