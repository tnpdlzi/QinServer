const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 8080;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//cors
app.use(cors());

/* use router class */
const user = require('./routes/api/user/index');

/* /users 요청을 모두 /user/index.js로 */
app.use('/users', user);


app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;


