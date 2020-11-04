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
    database: conf.database,
    dateStrings : true

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
        io.emit('chat message', msg);
        console.log('message send : ' + msg);
    })

    //연결 종료시 실행
    socket.on('disconnect', () => {
        console.log('user disconnected: ' + socket.username);
    })
    
    //DB에서 채팅방 리스트 불러오기
    socket.on('load chatList', (uID) => {
        console.log("채팅방 불러오기");
        //MySQL ONLY_FULL_GROUP_BY 오류 발생하므로 MYsql mode set 설정해줌
        //SQL이 각 그룹별 최대값을 받아오지 못한다.
        let chatListSql = "SELECT A.chatID, A.chatName,B.message, date_format(MAX(sendTime),'%T') AS sendTime FROM ChatList AS A JOIN Message AS B ON B.chatID = A.chatID WHERE A.chatID IN(SELECT chatID FROM ChatMember WHERE uID =" + uID.uID + ") GROUP BY B.chatID;";
        console.log(chatListSql);
        connection.query(chatListSql, function (err, results, fields) {
            if(!err){
                console.log(results);
                socket.emit('return chatList', results);
            }else{
                console.log(err);
            }
            
        });
    })

    //DB에서 채팅방별 메시지 모두 불러오기
    socket.on('load Message', (chatName) => {
        let messageListSql = "SELECT Message.sendTime, Message.message, User.userName, User.uID FROM User, Message where (Message.uID = User.uID AND chatID = (SELECT chatID from ChatList where chatName ='" + chatName + "')) ORDER BY Message.sendTime";
        connection.query(messageListSql, function (err, results, fields) {
            //console.log(results);
            if(results.length > 0)
                socket.emit('return Message', results);
        });
    });

    //보낸 메시지 받아서 DB로 저장
    socket.on('send Message', (msg, chatName) => {
        //console.log(msg);
        io.emit('send Message', msg);
        let getMessageSql = "INSERT INTO Message(chatID, uID, sendTime, message) VALUES((SELECT chatID from ChatList where chatName ='" + chatName + "'), '"+ msg.uID +"','"+ msg.sendTime +"','" + msg.message + "')";
        connection.query(getMessageSql, function (err, results, fields) {
            //console.log(results);
        });
        
    })

    //채팅방 멤버 불러오기
    socket.on('load Member', (chatName) => {
        let getMemberSql = "SELECT ChatMember.uID, User.userName FROM User, ChatMember where ChatMember.uID = User.uID AND chatID = (SELECT chatID from ChatList where chatName ='" + chatName + "')";
        connection.query(getMemberSql, (err, results, fields) => {
            //console.log(results);
            if(results.length > 0)
                socket.emit('return Member', results);
        });
    })
})
http.listen(port, () => console.log('Chatting: Listening on port ' + port));