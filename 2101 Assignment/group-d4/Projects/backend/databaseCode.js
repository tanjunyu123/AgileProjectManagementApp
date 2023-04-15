// reference to the app and the database
let app = null
let database = null

// modules; used for calling relevant methods
let fireApp = null 
let fireDB = null




// sets an object to a particular path in the database
function setToDB(path,data) {
    path = ROOT + path
    fireDB.set(fireDB.ref(database,path), data);
}

// calls a function when an object is extracted from the database (this is asynchronous)
function getFromDB(path,funcOnLoad) {
    path = ROOT + path
    fireDB.get(fireDB.child(fireDB.ref(database), path)).then((snapshot) => funcOnLoad(snapshot.val()));
}
// returns a promise that can be invoked to run a function after an object is extracted from the database 
// (this is asynchronous)
function getFromDBPromise(path) {
    path = ROOT + path
    return fireDB.get(fireDB.child(fireDB.ref(database), path));
}

// updates the database with the data (im not sure how exactly this one works)
function updateDB(path,data) {
    path = ROOT + path
    fireDB.update(fireDB.ref(database), {[path]: {data}})
}

// sets a listener that calls a function whenever the database changes (this is asynchronous)
function setDBListener(funcOnUpdate) {
    fireDB.onValue(fireDB.child(fireDB.ref(database),ROOT), (snapshot) => {funcOnUpdate(snapshot.val())});
}

// this is a list of functions that would run every time the runAllListeners() method is called
// the functions would need to take the data as an input
// this allows a system for an update doing multiple things (eg update tasks, sprints, and teams)
listenerFuncList = []

// adds a function to the listener func list
function addDBListener(funcOnUpdate) {
    listenerFuncList.push(funcOnUpdate)
}

// runs every function in the listenerFuncList
function runAllListeners(data) {
    for(let i in listenerFuncList) {
        listenerFuncList[i](data)
    }
}

// ensures that runAllListeners is run every time the database is modified
function initMainListener() {
    setDBListener((data) => runAllListeners(data))
}

