var firebase = require('firebase-admin');
var chalk = require('chalk');
var os = require('os');
var serviceAccount = require('/Users/narenpalep/Desktop/Angular:AngularJS/Angular2/team-project/firebase.json');


firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL:'https://team-portal-dd915.firebaseio.com',
    storageBucket:'gs://team-portal-dd915.appspot.com'
});

var bucket = firebase.storage().bucket();
// var database = firebase.database().ref('/audio');
// firebase.storage().bucket('test').create();

//creating a file and saving some date to it.

exports.saveFile = (name, data) => {
    // const userInfo = os.userInfo();
    // console.log(userInfo);
    const index = name.lastIndexOf('\\');
    name = name.substr(index + 1);
    console.log(name);
    bucket.file('/audio/'+name).save(data);
    // var key = database.push(object);

    // bucket.upload('/audio/'+name).then(file => {
    //     console.log("file is uploaded");
    // }, err => {
    //     console.log(err);
    // });


   
};
// test.then(result => console.log(result));
// firebase.database();