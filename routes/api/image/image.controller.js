const fs = require('fs'); // 파일시스템. 파일 열고 읽고 할 때 쓰는 모듈
const data = fs.readFileSync('./database.json'); // app.js와 같은 폴더 안에 있는 database.json 파일을 열어서 읽어 data에 저장한다.
const conf = JSON.parse(data); // data에 json 형식으로 저장되어있는 것을 풀어서 conf에 저장한다.
const mysql = require('mysql'); // mysql모듈 선언
const multer = require('multer');

const connection = mysql.createConnection({ // mysql과 연결해주는 컨넥션을 생성.
    // database.json에 있는걸 풀어서 data로, data를 풀어서 conf로 저장했으니 database.json안에 있는 정보를 가져다 연결해준다 라는 것.
    // 호스트 (우리 ip) 유저 (사용자 이름) 비밀번호 (사용자 패스워드), 포트 (사용하는 포트), 데이타베이스 (사용하는 데이타베이스)
        host: conf.host,
    
        user: conf.user,
    
        password: conf.password,
    
        port: conf.port,
    
        database: conf.database,
    
        multipleStatements: true
    
    });
    
    connection.connect(); // 생성한 컨넥션을 연결

// const upload = multer({
//   storage: multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './profileImages');
//     },
//     filename: function (req, file, cb) {
//       cb(null, new Date().valueOf() + path.extname(file.originalname));
//     }
//   }),
// }).single('uri');

// const upload = multer({dest: './profileImages'}).single('photo');

// app.use('/image', express.static('./profileImages'));

// let fn;
// app.post('/upload', function(req, res) {
//     console.log('req.file........' + req.file)
//     upload(req, res, function (err) {
//         if(err){
//             console.log('image err................' + err)
//         }
//         if(req.file != null){
//             fn = req.file.uri;
//         } else {
//             fn = 'noImage';
//         }

//         console.log('filename...............' + fn)
//         console.log('uID...............' + req.body.uID)

//         let sql = 'UPDATE User SET image = ? WHERE uID = \'' + req.body.uID + '\'';

//         let image = 'image/' + fn;

//         let params = [image];

//         connection.query(sql, params,

//           (err, rows, fields) => {
//             if(err){
//                 console.log('image connection err................' + err)
//             }

//               res.send(rows);
//               console.log(rows);

//           }

//         )

//     })

// })

const Storage = multer.diskStorage({
    destination(req, file, callback) {
      callback(null, '../../../upload');
    },
    filename(req, file, callback) {
      callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
    },
  });
  
//   app.get('/', (req, res) => {
//     res.status(200).send('to upload image use this  /api/upload.');
//   });
  
exports.upload = (req, res) => {
    let upload = multer({storage: Storage}).single('photo');
    upload(req, res, function (err) {
      if (!req.file) {
        return res.send('Please select an image to upload');
      } else if (err instanceof multer.MulterError) {
        return res.send(err);
      } else if (err) {
        return res.send(err);
      }
      // Display uploaded image for user validation
      res.send(req.file.path); // send uploaded image
      console.log('req.file.path...............' + req.file.path)
    });
  };
  
