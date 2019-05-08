var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var cors = require('cors');
var crypt = require('crypto');
var db = require('./db/db.js');
var route = require('./routing/route.js');

app.use(bodyParser.json({limit:'100mb', extended:true}));
app.use(bodyParser.urlencoded({limit:'100mb',extended:true}));
app.use(cors());
app.use(session({secret: crypt.createHash('sha1').digest('hex'), resave: false, saveUninitialized: true}));
app.use('/',route);
// app.get('/', (req, res) => {
//     res.send('Hi');
// });

var port = process.env.PORT || 9500;

app.listen(port, (req, res) => {

    console.log("Server started on http://localhost:" +port);

})