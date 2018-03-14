import * as firebase from 'firebase';

var config = {
    apiKey: "AIzaSyApCugTsQBbu60xkVMRT1_8nd5HzdFySSo",
    authDomain: "interactive-courses.firebaseapp.com",
    databaseURL: "https://interactive-courses.firebaseio.com",
    projectId: "interactive-courses",
    storageBucket: "interactive-courses.appspot.com",
    messagingSenderId: "497412400202"
};

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

const auth = firebase.auth();
const db = firebase.database();
const storage = firebase.storage();

export {
    auth,
    db,
    storage,
};
