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
});

exports.loadChatList = (req, res) => {      //미완성 부분 (아직 안씀)
    let uID = req.body.uID;
    let chatListSql = "SELECT chatName FROM chatlist";
    connection.query(chatListSql, function(err, results, fields){
        console.log(results);
        res.send(results);
    });
}

io.on('connection', (socket) => {
    console.log('user connected');

    //연결 종료
    socket.on('disconnect', () => {
        console.log('user disconnected: ' + socket.username);
    })
    
    //DB에서 채팅방 리스트 불러오기
    socket.on('load chatList', (uID) => {
        let chatListSql = "SELECT * FROM" +
        "(" +
        "SELECT Tl.*, Tm.sendTime, Tm.message FROM (SELECT * FROM ChatList AS tl WHERE chatID IN (SELECT chatID FROM ChatMember WHERE uID = "+ uID + " && baned = 0)) AS Tl, Message AS Tm WHERE Tm.chatID = Tl.chatID" +
        ") AS TT1, " +
        "(SELECT TT.chatID, MAX(TT.SendTime) AS max_time FROM (SELECT Tl.chatID, Tl.chatName, Tm.sendTime, Tm.message FROM (SELECT * FROM ChatList AS tl WHERE chatID IN (SELECT chatID FROM ChatMember WHERE uID = " + uID + " && baned = 0)) AS Tl, Message AS Tm WHERE Tm.chatID = Tl.chatID) AS TT GROUP BY chatID" +
        ") AS TT2" +
        " WHERE TT1.sendTime = TT2.max_time AND TT1.chatID = TT2.chatID";
        //let chatListSql = "SELECT ChatList.chatID, chatName FROM ChatList, ChatMember where (ChatMember.uID = " + uID + " AND ChatMember.chatID = ChatList.chatID)";
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
    socket.on('load Message', (chatID) => {
        let messageListSql = "SELECT Message.sendTime, Message.message, User.userName, User.uID FROM User, Message where (Message.uID = User.uID AND chatID = " + chatID + ") ORDER BY Message.sendTime";
        connection.query(messageListSql, function (err, results, fields) {
            //console.log(results);
            if(results.length > 0)
                socket.emit('return Message', results);
        });
    });

    //보낸 메시지 받아서 DB로 저장
    socket.on('send Message', (msg) => {
        //console.log(msg);
        io.emit('send Message', msg);
        let getMessageSql = "INSERT INTO Message(chatID, uID, sendTime, message) VALUES(" + msg.chatID + ", '"+ msg.uID +"','"+ msg.sendTime +"','" + msg.message + "')";
        connection.query(getMessageSql, function (err, results, fields) {
            //console.log(results);
        });
        
    })

    //채팅방 멤버 불러오기
    socket.on('load Member', (chatID) => {
        let getMemberSql = "SELECT ChatMember.uID, User.userName FROM User, ChatMember where ChatMember.uID = User.uID AND chatID = " + chatID + " AND baned = 0 ORDER BY User.userName";
        connection.query(getMemberSql, (err, results, fields) => {
            //console.log(results);
            if(results.length > 0)
                socket.emit('return Member', results);
        });
    })

    //채팅방 정보 불러오기
    socket.on('load Info', (chatID) => {
        let getInfoSql = "SELECT onetoone, ruID FROM ChatList where chatID = " + chatID;
        connection.query(getInfoSql, (err, results, fields) => {
            //console.log(results);
            if(results.length > 0)
                socket.emit('return Info', results);
        });
    })

    //방 나가기
    socket.on('exit Room', (chatID, uID) => {
        console.log(chatID, uID);
        let exitRoomSql = "DELETE FROM ChatMember where chatID = " + chatID + " AND uID = " + uID
        connection.query(exitRoomSql, (err, results, fields) => {
            if(!err){
                //채팅방 인원수 감소
                connection.query("UPDATE ChatList SET total = total - 1 where chatID = " + chatID , (err, results, fields) => {
                }
            )}
            else
                console.log(err);
        });
    });

    //강퇴하기
    socket.on('ban Member', (chatID, banID) => {
        console.log(chatID, banID);
        let banMemberSql = "UPDATE ChatMember SET baned = 1 where chatID = '" + chatID + "' AND uID = '" + banID + "'";
        connection.query(banMemberSql, (err, results, fields) => {

        });
    })
})
http.listen(port, () => console.log('Chatting: Listening on port ' + port));