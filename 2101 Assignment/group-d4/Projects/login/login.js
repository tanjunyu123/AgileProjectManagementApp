
initFromDB().then(() => main())

nameRef = null; passwordRef = null;
resultRef = null;


function main() {
    nameRef = document.getElementById("inpName")
    passwordRef = document.getElementById("inpPassword")
    resultRef = document.getElementById("lblResult")
    // add a default login if it doesn't already exist
    if(User.findByName("Admin")==null) {
      new User("Admin","Admin")
    }
}

function login() {
    clearResultText()
    // get username and password from HTML elements
    username = nameRef.value
    password = passwordRef.value
    // check if the username exists
    user = User.findByName(username)
    if(user!=null) {
      // check if the password is correct
      if(user.password == password) {
        setResultText(`Successfully logged in as ${user.name}!`)
        window.location = "../mainPage/tempMain.html" // temporary page for now
      }
      else {
        setResultText("Incorrect password! Please try again",true)
      }
    }
    else {
      setResultText("Username not found!",true)
    }
}

function clearResultText() {
    resultRef.innerHTML = ""
    resultRef.style.color = "black"
}
function setResultText(strVal,isError=false) {
    resultRef.innerHTML = strVal 
    if(isError) {
        resultRef.style.color = "red"
    }
    else {
        resultRef.style.color = "black"
    }
}