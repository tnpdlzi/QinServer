const fs = require('fs');
const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);
const mysql = require('mysql');
const crypto = require('crypto');
const multer = require('multer');
// const upload = multer({dest: '../upload/'})

const connection = mysql.createConnection({

    host: conf.host,

    user: conf.user,

    password: conf.password,

    port: conf.port,

    database: conf.database

});

connection.connect();

exports.search = (req, res) => {

    let id = req.body.id;
    connection.query(
        'SELECT * FROM User WHERE uID = ' + id + ';',
        (err, rows, fields) => {
            if(rows != null){
                res.send(rows);
            } else{
                res.send(rows);
            }
        }
    )

}

exports.get = (req, res) => {

    let id = req.query.uID;
    connection.query(
        'SELECT * FROM User WHERE uID = ' + id + ';',
        (err, rows, fields) => {

            res.send(rows);
            console.log(rows);

        }
    )

}

// 회원가입 POST

exports.register = (req, res) => {

    let sql = 'INSERT INTO User VALUES (null, null, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, NOW(), 0, 0)';

    const userName = req.body.userName;
    const userID = req.body.userID;
    const inputPassword = req.body.password;
    const salt = Math.round((new Date().valueOf() * Math.random())) + "";
    const hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
    const loginBy = req.body.loginBy;
    const name = req.body.name;
    const question = req.body.question;
    const phone = req.body.phone;


    let params = [userName, userID, hashPassword, salt, loginBy, name, question, phone];

    console.log('param:' + params);

    connection.query(sql, params,

        (err, rows, fields) => {

            res.send(rows);

        }
    )
}



// 로그인 POST


exports.login = (req,res,next) => {
    let userID = req.body.userID;
    let inputPassword = req.body.password;
    let dbPassword, salt, userName, loginBy;

    connection.query('SELECT userPW, loginBy, salt FROM User WHERE userID = \'' + userID + '\';', function(error, results, fields) {

        if (error) {
            console.log(error);
        }

        dbPassword = JSON.stringify(results[0].userPW);

        salt = JSON.stringify(results[0].salt);
        var t = salt.replace('\"', "");
        var s = t.replace('\"', "");

        salt = s;

        userName = JSON.stringify(results[0].username);
        // var c = centerKey.replace('\"', "");
        // var d = c.replace('\"', "");
        //
        // centerKey = d;

        loginBy = JSON.stringify(results[0].loginBy);

        let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

        if (dbPassword === '\"' + hashPassword + '\"') {
            //    console.log("비밀번호 일치");
            //  console.log(hashPassword + 'ha성공');
            //  console.log(dbPassword + 'db성공');
            //  console.log(salt + '솔트');
            //
            // console.log('auth2=' + auth);

            let sendData = {userName, userID, loginBy};

            res.send(sendData);
        } else {
            //   console.log("비밀번호 불일치");
            // console.log(hashPassword + 'ha실패');
            // console.log(dbPassword + 'db실패');
            //   console.log(salt + '솔트');

            res.send("false");
        }

    })

}
