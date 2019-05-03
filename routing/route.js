var express = require('express');
var app = express();
var routing = express.Router();
var db = require('../db/db.js');

var file;

routing.route('/file').post((req, res) => {
    file = req.body.name;
    data = req.body.content;
    console.log(file);
    db.saveFile(file, data);
});

module.exports = routing;