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
            res.send(results);

        }
    )
}

exports.gameList = (req, res) => {

    connection.query(
        'SELECT game FROM Game;',
        function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            res.send(results);

        }
    )
}

exports.genreList = (req, res) => {

    connection.query(
        'SELECT genre FROM Game;',
        function (error, results, fields) {
            if (error) {
                console.log(error);
            }
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
    let sql = 'INSERT INTO GenreLike VALUES (null, ?, ?, ?, NOW(), 0)';

    const uID = req.body.uID;
    const genre = req.body.genre;
    const gDegree = req.body.gDegree;

    let params = [uID, genre, gDegree];

    connection.query(sql, params,

        (err, rows, fields) => {

            res.send(rows);
            console.log("쿼리값 출력~~~~~~~~~");
            console.log(rows);
        }
    )
}

exports.tierData = (req, res) => {
    let game = req.query.game;

    connection.query(
        'SELECT tier FROM Tier WHERE game = \'' + game + '\' ORDER BY orderNum;',
        function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            res.send(results);

        }
    )
}


exports.editIntro = (req, res) => {
    let sql = 'UPDATE User SET intro= ? WHERE uID = ?';

    const uID = req.body.uID;
    const intro = req.body.intro;

    let params = [intro, uID];

    connection.query(sql, params,

        (err, rows, fields) => {

            res.send(rows);
        }
    )
}

exports.editProfileGame = (req, res) => {
    let sql = 'UPDATE UserGame SET game=?,tierID=?,gameID=? WHERE usergameID = ?';

    const game = req.body.game;
    const tierID = req.body.tierID;
    const gameID = req.body.gameID;
    const usergameID = req.body.usergameID;

    let params = [game, tierID, gameID, usergameID];

    connection.query(sql, params,

        (err, rows, fields) => {

            res.send(rows);
        }
    )
}

exports.editProfileGenre = (req, res) => {
    let sql = 'UPDATE GenreLike SET genre=?,gDegree=? WHERE gLikeID = ?';

    const genre = req.body.genre;
    const gDegree = req.body.gDegree;
    const gLikeID = req.body.gLikeID;

    let params = [genre, gDegree, gLikeID];

    connection.query(sql, params,

        (err, rows, fields) => {

            res.send(rows);
        }
    )
}

exports.deleteProfileGame = (req, res) => {
    let sql = 'DELETE FROM UserGame WHERE usergameID = ?';

    const usergameID = req.body.usergameID;

    let params = [usergameID];

    connection.query(sql, params,

        (err, rows, fields) => {

            res.send(rows);
        }
    )
}

exports.deleteProfileGenre = (req, res) => {
    let sql = 'DELETE FROM GenreLike WHERE gLikeID = ?';

    const gLikeID = req.body.gLikeID;

    let params = [gLikeID];

    connection.query(sql, params,

        (err, rows, fields) => {

            res.send(rows);
        }
    )
}

exports.checkChatList = (req, res) => {
    let uID = req.query.uID;

    connection.query(
        'SELECT chatID FROM OneChatImage WHERE uID = \'' + uID + '\' ;',
        function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            res.send(results);

        }
    )
}
