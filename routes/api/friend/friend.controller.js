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
        'SELECT uID, image, userName, intro, good, bad, userID FROM User WHERE uID = ' + userID + ';',
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

exports.friendProfile = (req, res) => {
    let userID = req.query.uID;

    connection.query(
        'SELECT Us.uID, Us.image, Us.userName, Us.intro, Us.good, Us.bad FROM Friend AS Fr INNER JOIN User AS Us ON Fr.uID2 = Us.uID WHERE Fr.uID1 = ' + userID + ';',
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

exports.profileGame = (req, res) => {
    let userID = req.query.uID;

    connection.query(
        'SELECT usergameID, game, gameID, tierID FROM UserGame WHERE uID=' + userID + ';',
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

exports.profileGenre = (req, res) => {
    let userID = req.query.uID;

    connection.query(
        'SELECT gLikeID, genre, gDegree FROM GenreLike WHERE uID=' + userID + ';',
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

exports.insertProfileGame = (req, res) => {
    let sql = 'INSERT INTO UserGame VALUES (null, ?, ?, ?, ?, NOW(), 0)';

    const uID = req.body.uID;
    const game = req.body.game;
    const tierID = req.body.tierID;
    const gameID = req.body.gameID;

    let params = [uID, game, tierID, gameID];

    connection.query(sql, params, 

        (err, rows, fields) => { 

            res.send(rows); 
            
        }
    )
}

exports.insertProfileGenre = (req, res) => {
    let sql = 'INSERT INTO UserGame VALUES (null, ?, ?, ?, NOW(), 0)';

    const uID = req.body.uID;
    const genre = req.body.genre;
    const gDegree = req.body.gDegree;

    let params = [uID, genre, gDegree];

    connection.query(sql, params,

        (err, rows, fields) => {

            res.send(rows);

        }
    )
}
