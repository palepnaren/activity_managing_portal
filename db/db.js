var firebase = require('firebase-admin');
var chalk = require('chalk');
var fs = require('fs');
const rawdata = fs.readFileSync('firebase.json');
const serviceAccount = JSON.parse(rawdata);


firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL:'https://team-portal-dd915.firebaseio.com',
    storageBucket:'gs://team-portal-dd915.appspot.com'
});

// fire.initializeApp(firebaseConfig);


 var bucket = firebase.storage().bucket();
 var db = firebase.database().ref('/users');
 var flag;

//creating a file and saving some date to it.

exports.saveFile = (name, data,cb) => {
  
    // const index = name.lastIndexOf('\\');
    // name = name.substr(index + 1);

    console.log(name);
   data = Object.values(data);
   var buffer = Buffer.from(data);
   //console.log(buffer);
   
    bucket.file('/audio/'+name).save(buffer,{contentType:'audio/mp3'}).then(() => {
        console.log("File pushed onto server ");
        cb(true);
    }).catch(err => {
        cb(false);
    });
  
};

exports.promotedFiles = (fileData, cb) =>{
    var data;
    var key;
    var flag = false;
    firebase.database().ref('/promotedTalks').child(fileData.data.name).on('value', (snapshot) => {

        if(snapshot.exists()){
            
        } else{
            console.log('Adding new child')
            flag = true;
            key = firebase.database().ref('/promotedTalks').child(fileData.data.name).push(fileData);
            cb(flag); 
        }

    });
      
}

exports.getPromoted = (cb) => {
    var files = {
        keys: [],
        values: []
    }
    firebase.database().ref('/promotedTalks').on('value', (snapshot) => {
        files.keys = Object.keys(snapshot.val());
        files.values = Object.values(snapshot.val());
        // console.log(files);
        cb(files);
    })
}

exports.downloadFiles = () =>{
    return bucket.getFiles();
};

exports.saveUser = (user) =>{

    var key = db.child('/'+user.email.split('@')[0]).push(user);

    if(key != null){
        flag = true;
    } else {
        flag = false ;
    }

    return flag; 
};


exports.authUser = (user, cb) => {
    var data;
    db.child('/'+user.email.split('@')[0]).on('value', (snapshot) => {
        data = snapshot.val();
        cb(data);
    }, (err) => {
        console.log("no details found");
        data = null;
        cb(data);
    });
}

exports.updateUserProcess = (obj, email) => {
    var key;
    var msg;

    db.child('/'+email.split('@')[0]).on('value', (snapshot) => {
        key = Object.keys(snapshot.val());   
    });

    setTimeout(() => {
        db.child('/'+email.split('@')[0]+'/'+key).child('process').push().set(obj);
    }, 200);
    msg = "Saved";
            

   return msg;
}

exports.getProcess = (email, cb) => {

    console.log(email + 'inside db');
    var key;

    db.child('/'+email.split('@')[0]).on('value', (snapshot) => {
        key = Object.keys(snapshot.val());
        cb(snapshot.val());
    }, (err) => {
        cb(null);
    });
}

exports.forgotPwd = (email, newPwd, cb) => {
    var key;
    var flag;
    db.child('/'+email.split('@')[0]).on('value', (snapshot) => {
        key = Object.keys(snapshot.val());
    });

    setTimeout(() => {
        db.child('/'+email.split('@')[0]+'/'+key).update({pwd:newPwd}, (success) => {
            cb(true);
        }); 
    },200); 
    
}


