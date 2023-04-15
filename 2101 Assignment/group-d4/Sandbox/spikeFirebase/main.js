// reference to the text that shows whether an action succeeds or not
let resultText = document.getElementById("resultText")
// clears the result text whenever an action is run
function clearResultText() {
  resultText.innerHTML = ""
  resultText.style.color = "black"
}
// this is the data from the database; it is updated whenever the database changes
let usernameList = []
let dbData = null

// a listener that updates everything whenever the database changes
setDBListener((snapshot) => {
  // updates data
  dbData = snapshot
  console.log(dbData)
  // updates the list of usernames
  usernameList = []
  for(let key in dbData["users"]) {
    usernameList.push(dbData["users"][key].username) // gets the username string from the database
  }
  // updates the text that shows the database count
  databaseCountText = document.getElementById("databaseCountText")
  databaseCountText.innerHTML = usernameList.length
});

// a function that runs whenever the login button is clicked
function login() {
  clearResultText()
  // get references to HTML elements
  usernameBox = document.getElementById("loginUsername")
  passwordBox = document.getElementById("loginPassword")
  // get username and password from HTML elements
  username = usernameBox.value
  password = passwordBox.value
  // check if the username exists
  if(usernameList.includes(username)) {
    // check if the password is correct
    if(dbData["users"][username].password == password) {
      resultText.innerHTML = `Successfully logged in as ${username}!`
    }
    else {
      resultText.innerHTML = "Incorrect password! Please try again"
      resultText.style.color = "red"
    }
  }
  else {
    resultText.innerHTML = "Username not found! Please register first"
    resultText.style.color = "red"
  }
}
// a function that runs whenever the register button is clicked
function register() {
  clearResultText()
  // get references to HTML elements
  usernameBox = document.getElementById("loginUsername")
  passwordBox = document.getElementById("loginPassword")
  // get username and password from HTML elements
  username = usernameBox.value
  password = passwordBox.value
  // check if the user typed in both the username and the password  
  if(username=="" || password=="") {
    resultText.innerHTML = "Please enter a username and password"
    resultText.style.color = "red"
  }
  // check if the username already exists
  else if(usernameList.includes(username)) {
    resultText.innerHTML = "Username already exists! Please use a different username"
    resultText.style.color = "red"
  }
  // add the user to the database
  else {
    setToDB("/users/" + username,{username,password})
    resultText.innerHTML = `Successfully registered as ${username}!`
  }
}

// a function that runs whenever the clear database button is clicked
function clearDatabase() {
  clearResultText()
  setToDB("users","")
}