const fs = require("fs");
const data = fs.readFileSync("./database.json");
const conf = JSON.parse(data);
const mysql = require('mysql');
const _url = require('url');

//DB
const connection = mysql.createConnection({
    host: conf.host,
    user: conf.user,
    password: conf.password,
    port: conf.port,
    database: conf.database
});

exports.hashAdd = (req, res) =>{
    const hashList = [];
    console.log(req.body);
    hashList.push(req.body);
    res.json(hashList);
}

//post req 
exports.ChatList = (req, res) =>{
    let uID = req.body.uID;
    let hashList = req.body.hashList;
    let chatList;
    console.log(uID);
    console.log(hashList);
    //if hashList is empty then show chatID that is user joined.
    if(hashList == null){
        connection.query("select * from ChatList where chatID IN (select chatID from ChatMember where uID =" + uID + ");", function(err, row, fields){
            res.json(row);
            console.log(row);
        });
    //if hashList not empty then show chatID that include all hashList.
    }else{ 
        console.log("list");
        const ihashNum = hashList.length;
        let strhashIn = "(";
        for (var i = 0; i < hashList.length; i++){
            strhashIn += '\'';
            strhashIn += hashList[i].hash;
            strhashIn += '\'';
            if (i < hashList.length - 1){
                strhashIn += ',';
            }
            console.log(strhashIn);
        }
        strhashIn += ')';
        console.log(strhashIn);
        connection.query("SELECT chatID, COUNT(DISTINCT HASH) AS HASH FROM HashTagUsed WHERE HASH IN " + strhashIn + "GROUP BY chatID HAVING COUNT(DISTINCT HASH) = " + ihashNum +";",function(err, row, fields){
            res.json(row);
            console.log(row);
        }); 
        var str1 = "SELECT chatID, COUNT(DISTINCT HASH) AS HASH FROM HashTagUsed WHERE HASH IN " + strhashIn + "GROUP BY chatID HAVING COUNT(DISTINCT HASH) = " + ihashNum +";";
        console.log(str1);
    }   
}