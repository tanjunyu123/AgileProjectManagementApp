initFromDB().then(() => main())

nameRef = null; passwordRef = null;
resultRef = null;


function main() {
    nameRef = document.getElementById("inpName")
    passwordRef = document.getElementById("inpPassword")
    resultRef = document.getElementById("lblResult")
}


function register() {
    clearResultText()
    // get username and password from HTML elements
    username = nameRef.value
    password = passwordRef.value
    // check if the user typed in both the username and the password  
    if(username=="" || password=="") {
      setResultText("Please enter a username and password",true)
    }
    // check if the username already exists
    else if(User.findByName(username)!=null) {
      setResultText("Username already exists! Please use a different username",true)
    }
    // create a user
    else {
      user = new User(username,password)
      setResultText(`Successfully registered as ${user.name}!`)
    }
}

function back() {
    window.location.href = "../mainPage/tempMain.html";
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



