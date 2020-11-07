const fs = require('fs');
const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);
const mysql = require('mysql');

const connection = mysql.createConnection({ 
    
        host: conf.host,
    
        user: conf.user,
    
        password: conf.password,
    
        port: conf.port,
    
        database: conf.database
    
    });

    connection.connect();

exports.myProfile = (req, res) => {
    let userID = req.query.uID;

    connection.query(
        'SELECT uID, image, userName, intro FROM User WHERE uID = ' + userID + ';',
        function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            console.log(results);
            console.log(fields);
            res.send(results);

        }
    )
} 


exports.friendList = (req, res) => {
    let userID = req.query.uID;

    connection.query(
        'SELECT Us.uID AS uid, Us.image AS image, Us.userName AS name, Us.intro AS comment FROM Friend AS Fr INNER JOIN User AS Us ON Fr.uID2 = Us.uID WHERE Fr.uID1 = ' + userID + ';', 
        function(error, results, fields) {
            if(error){
                console.log(error);
            }
            console.log(results);
            console.log(fields);
            res.send(results);
            
        }
    )
} 

exports.friendProfile = (req, res) => {
    let FriendID = req.query.uID;

    connection.query(
        'SELECT User.good, User.bad, UserGame.game, UserGame.tierID, UserGame.gameID FROM UserGame INNER JOIN User ON User.uID = UserGame.uID WHERE UserGame.uID = \'' + FriendID + '\';', 
        function (error, results, fields) {
            res.send(results);
            console.log(results);
            console.log(fields);
        }
    )  
}
