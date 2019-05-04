var firebase = require('firebase-admin');
var chalk = require('chalk');
var serviceAccount = require('/Users/narenpalep/Desktop/Angular:AngularJS/Angular2/team-project/firebase.json');


firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL:'https://team-portal-dd915.firebaseio.com',
    storageBucket:'gs://team-portal-dd915.appspot.com'
});

var bucket = firebase.storage().bucket();
var database = firebase.database().ref('/audio');
// firebase.storage().bucket('test').create();

//creating a file and saving some date to it.

exports.saveFile = (name, data) => {
    var object = {
        fileName: name,
        content: data
    }
    bucket.file('/audio/'+name).save(data);
    var key = database.push(object);


   
};
// test.then(result => console.log(result));
// firebase.database();