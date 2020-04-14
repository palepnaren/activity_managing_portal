var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var cors = require('cors');
var crypt = require('crypto');
var db = require('./db/db.js');
var route = require('./routing/route.js');
const path = require('path');



app.use(express.static(__dirname+'/dist/team-project'));
app.use(bodyParser.json({limit:'100mb', extended:true}));
app.use(bodyParser.urlencoded({limit:'100mb',extended:true}));
app.use(cors());
app.use(session({secret: crypt.createHash('sha1').digest('hex'), resave: false, saveUninitialized: true}));
app.use('/',route);

app.get("/*", function(req, res){

    res.sendFile(path.join(__dirname,'/dist/team-project/index.html'));

});


var port = process.env.PORT || 9500;

app.listen(port, (req, res) => {

    
    console.log("Server started on http://localhost:" +port);

});

