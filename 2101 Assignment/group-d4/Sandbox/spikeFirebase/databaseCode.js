// reference to the app and the database (values are set in main.html)
let app = null
let database = null

// modules; used for calling relevant methods (values are set in main.html)
let fireApp = null 
let fireDB = null

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// (i copy-pasted this from the firebase console, no clue what's going on here!)

// old config (previously used with mario's personal email)
// const firebaseConfig = {
//     apiKey: "AIzaSyA979sQNO-nzxyDbgS561cSYGUBq6QqtPg",
//     authDomain: "testproject-cd7b9.firebaseapp.com",
//     databaseURL: "https://testproject-cd7b9-default-rtdb.asia-southeast1.firebasedatabase.app",
//     projectId: "testproject-cd7b9",
//     storageBucket: "testproject-cd7b9.appspot.com",
//     messagingSenderId: "557214380904",
//     appId: "1:557214380904:web:aaaaa657342b6963cf1cdd",
//     measurementId: "G-6N3J2SLTVV"
// };

// email: sprintmanager3000@gmail.com
// password: qwertyuiop321
const firebaseConfig = {
    apiKey: "AIzaSyB8SrA7CKr6TrdcGznR3ft3i5YdOd-5BF8",
    authDomain: "scrummaster3000-7ba91.firebaseapp.com",
    databaseURL: "https://scrummaster3000-7ba91-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "scrummaster3000-7ba91",
    storageBucket: "scrummaster3000-7ba91.appspot.com",
    messagingSenderId: "913072712982",
    appId: "1:913072712982:web:4a9b70e7024d1b7c52b437",
    measurementId: "G-JL8F2L2RMC"
  };


// sets an object to a particular path in the database
function setToDB(path,data) {
    fireDB.set(fireDB.ref(database,path), data);
}

// calls a function when an object is extracted from the database (this is asynchronous)
function getFromDB(path,funcOnLoad) {
    fireDB.get(fireDB.child(fireDB.ref(database), path)).then((snapshot) => funcOnLoad(snapshot.val()));
}

// updates the database with the data (im not sure how exactly this one works)
function updateDB(path,data) {
    fireDB.update(fireDB.ref(database), {[path]: {data}})
}

// sets a listener that calls a function whenever the database changes (this is asynchronous)
function setDBListener(funcOnUpdate) {
    fireDB.onValue(fireDB.ref(database), (snapshot) => {funcOnUpdate(snapshot.val())});
}