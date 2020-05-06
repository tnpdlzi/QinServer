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

exports.frinedList = (req, res) => {
    let userID = req.query.uID;

    connection.query('SELECT Us.uID, Us.image, Us.userName, Us.intro FROM Friend AS Fr'
    +'INNER JOIN User AS Us ON Fr.uID2 = Us.uID WHERE Fr.uID1 = ' + userID + ';', function(error, results, fields) {
        res.send(results);
        console.log(results);
        console.log(fields);
    })
} 

exports.friendProfile = (req, res) => {
    let FriendID = req.body.uID;

    connection.query('SELECT image, userName, good, bad, intro')  
}

