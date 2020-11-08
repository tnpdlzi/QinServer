const e = require("express");
const fs = require("fs");
const data = fs.readFileSync("./database.json");
const conf = JSON.parse(data);
const mysql = require('mysql');
const _url = require('url');

const connection = mysql.createConnection({
    host: conf.host,
    user: conf.user,
    password: conf.password,
    port: conf.port,
    database: conf.database
});

const getChatID = function(hashList, callback){
    console.log("getChatID call");
    let chatIDarray = new Array(); //리턴할 chatID가 담긴 배열
    let ihashNum = hashList.length; //hash의 갯수
    //SQL문 where에 들어갈 hashList
    let strhashIn = "(";
    for (var i = 0; i < hashList.length; i++){
        strhashIn += "\"";
        strhashIn += hashList[i];
        strhashIn += "\"";
        if (i < hashList.length - 1){
            strhashIn += ',';
        }
    }
    strhashIn += ')';
    //데이터베이스 연결하여 hash목록을 모두 포함한 생성되어 있는 chatID를 chatIDarray에 push
    connection.query("SELECT chatID FROM HashTagUsed WHERE hash IN " + strhashIn + "GROUP BY chatID HAVING COUNT(DISTINCT hash) = " + ihashNum +";",function(err, row, fields){
        console.log(row);
        if(row.length > 0){
            for(let i = 0; i < row.length;i++){
                chatIDarray.push(row[i].chatID);
            }
            console.log(chatIDarray);
            callback(chatIDarray);
        }else{
            callback(chatIDarray);
        }
    });
}
//hashList를 모두 포함하는 채팅방들의 chatID를 기반으로 ChatList 테이블과 HashTagUsed 테이블에서 정보를 추출한다.
exports.hashSearch = (req, res) =>{
    console.log("hashSearch CALL");
    let uID = req.body.uID; //user의 ID
    let hashList = req.body.hashList;
    console.log(hashList);
    const sqlColum = "A.chatID, A.chatName, A.chatInfo, A.total, A.createdDate, A.isDeleted, A.onetoone, A.ruID, A.maxNum";
    if(hashList.length > 0){
        //chatID들을 받아왔을때 채팅방에 대한 정보를 가져온다.
        getChatID(hashList, function(row){
            if(row.length > 0){
                let chatIDarray = row;
                let chatIDsql = "SELECT " + sqlColum +", GROUP_CONCAT(B.hash ORDER BY B.hOrder) AS hash FROM ChatList A JOIN  HashTagUsed B ON A.chatID = B.chatID WHERE A.chatID IN(" + row + ") GROUP BY A.chatID, A.chatName;";
                connection.query(chatIDsql, function(err, row, fields){
                    if(row.length != 0){
                        row.forEach(function(item, index){
                            item.hash = item.hash.replace(/,/gi," #");
                            console.log(item.hash);
                        })
                    }
                console.log(row);
                res.send(row); //host에게 json
            });
            }else{
                res.send(row);
            }
        });
    }else {
        console.log("HashList가 0");
        res.resd("none");
    } 
}
//채팅방 만들기 
exports.roomCreate = (req, res) =>{
    let ruID = req.body.uID;  //chatRoom 을 만드려고 시도한 유저의 ID를 chatRoom생성자의 ruID로써 사용
    let hashList = req.body.hashList; //입력한 hashTag들 담는다.
    let chatName = req.body.chatName;
    let chatInfo = req.body.chatInfo;
    let maxNum = req.body.maxNum;
    let chatID;
    let order = 0;
    //ChatList에 채팅방에 관한 정보를 추가하는 SQL
    let strsql = "INSERT INTO ChatList (chatName, chatInfo, total, createdDate, isDeleted, onetoone, ruID, maxNum) VALUES(\""+ chatName+"\",\""+chatInfo+"\", 1,now(),0,0,"+ruID+"," + maxNum +");";
    connection.query(strsql, function(err, row, fields){//채팅방 생성
        if(!err){
            chatID = row.insertId; //생성한 chatRoom의 chatID를 받아온다.
            //생성한 채팅방의 chatID에 유저가 추가하는 HashTag 리스트를 추가한다.
            hashList.forEach(element => {
                let sql = "INSERT INTO HashTagUsed VALUES (\""+ element+"\", "+chatID+","+order+");";
                connection.query(sql, function(err, row, fields){ //해시태그 추가
                    if(!err){
                        order++;
                        console.log("add hash for chatroom :"+element);
                    }
                    else console.log(err);
                });
            });
            //방장을 추가한다.
            connection.query("INSERT INTO ChatMember VALUES("+ruID+", 0,"+ chatID+");", function(err, row, fields){//채팅 멤버 추가
                const messageSQL = "INSERT INTO Message (chatID, uID, sendTime, message) VALUES(" + chatID +"," +ruID + ",now(), \"환영합니다.\");";
                console.log(messageSQL);
                if(!err){
                    connection.query(messageSQL, function(err, row, fields){
                        console.log(row);
                        res.send("success");
                    })
                        
                    
                }
                console.log("add chat members");
            });
        }
        else console.log(err);
    });
}
//상위 10개의 HashTag 리턴
exports.topRank = (req, res) =>{
    console.log("topRank call");
    connection.query("SELECT hash,count(*) as rank FROM HashTagUsed GROUP BY hash ORDER BY rank desc limit 10;", function(err, row, fields){
        res.send(row);
        console.log(row);
    })
}
//채팅방 입장 기능
exports.chatRoomEnter = (req, res) =>{
    console.log("chatRoomEnter Call");
    let uID = req.body.uID;
    let chatID = req.body.chatID;
    //채팅방에 인원이 더 들어갈 수 있는지 확인하는 SQL
    const maxCheckSQL = "SELECT total,maxNum FROM ChatList WHERE chatID = " + chatID + ";"
    //입장 요청을 한 유저가 이미 채팅방의 유저인지 확인하는 SQL
    const searchSQL = "SELECT * FROM ChatMember WHERE uID = " + uID +" AND chatID = " + chatID + ";"
    //채팅방 멤버에 요청을 한 유저를 삽입하는 SQL
    const insertSQL = "INSERT INTO ChatMember VALUES(" +uID+",0," +chatID+ ");"
    // 채팅방 멤버를 업데이트
    const updataSQL = "UPDATE ChatList SET total = total + 1 WHERE chatID = " + chatID +";"

    connection.query(searchSQL, function(err, row, fileds){
        console.log("chatRoomEnter : 이미 가입됬는지 확인");
        if(!err){
            if(row.length == 0){
                connection.query(maxCheckSQL,function(err, row, fields){
                    if(!err){
                        if(row[0].total + 1 <= row[0].maxNum){
                            connection.query(insertSQL,function(err,row,fields){
                                if(!err){
                                    connection.query(updataSQL,function(err, row, fields){
                                        if(!err){
                                            res.send("success");
                                        }
                                    })
                                }
                            })
                        }
                    }
                });
            }else{
                if(row[0].baned == 1){
                    res.send("baned");
                }else{
                    res.send("already join");
                }
            }
        }
    });
}
