exports.search = (req, res) => {

    let name = req.body.name;
    connection.query(
        'SELECT * FROM USER WHERE name = ' + name + ';',
        (err, rows, fields) => {
            if(rows != null){
                res.send('YES');
            } else{
                res.send('NO');
            }
        }
    )

}

exports.get = (req, res) => {

    let name = req.body.name;
    connection.query(
        'SELECT * FROM USER WHERE name = ' + name + ';',
        (err, rows, fields) => {
            if(rows != null){
                res.send(rows);
            } else{
                res.send('NO');
            }
        }
    )

}

