


// Reload data from database and call the functions
initFromDB().then(() => { displaySprints(); callInterval()})

// Direct to the Main Page 
function mainPage(){
    window.location = "../mainPage/tempMain.html"
}

// Direct to the Task Board 
function taskBoard(){
    window.location = "../taskBoard/taskboard.html"
}

// Direct to the Team Board 
function teamBoard(){
    window.location = "../teamBoard/teamBoard.html"
}

// Direct to ManageSprint Page
function toManageSprintPage(){
    
    // isValid = true 
    // for(let index in Sprint.sprintList){
    //     if ( Sprint.sprintList[index].status === 'Active'){
    //         isValid = false 
    //         break
    //     }
    // }

    // if (isValid == false){
    //     alert("Another sprint cannot be created when there is an active sprint going on")
    // } else {
    //     window.location = "../manageSprint/manageSprint.html"
    // }

    window.location = "../manageSprint/manageSprint.html"
}



// Display all the sprints created
function displaySprints(){
    // HTML referrencing
    htmlRef = document.getElementById("sprintListDisplay")


    // table element
    inputHTML = '<table class="mdl-data-table mdl-js-data-table"><tr style="background:#F5F5F5;"> <th class="mdl-data-table__cell--non-numeric">SPRINT NAME</th><th class="mdl-data-table__cell--non-numeric" style="text-align:center;">START DATE</th><th class="mdl-data-table__cell--non-numeric" style="text-align:center;">DUE DATE</th><th class="mdl-data-table__cell--non-numeric" style="text-align:center; ">STATUS</th><th class="mdl-data-table__cell--non-numeric" style="text-align:center">VIEW</th><th class="mdl-data-table__cell--non-numeric" style="text-align:center">DELETE/EDIT</th></tr>'

    // for loop to iterate through all the sprints created and add them as the body to the table
    for (let index in Sprint.sprintList ){
        inputHTML +=  `<tr>
                <td class="mdl-data-table__cell--non-numeric" style="width:40%;font-size:100%;font-family:Verdana, Geneva, Tahoma, sans-serif;">${Sprint.sprintList[index].name}</td>
                 <td class="mdl-data-table__cell--non-numeric" style="width:10%;text-align:center;font-size:100%;font-family:Verdana, Geneva, Tahoma, sans-serif;">${Sprint.sprintList[index].startDate}</td>
                 <td class="mdl-data-table__cell--non-numeric" style="width:10%;text-align:center;font-size:100%;font-family:Verdana, Geneva, Tahoma, sans-serif;">${Sprint.sprintList[index].endDate}</td>
                 <td class="mdl-data-table__cell--non-numeric" style="width:10%;text-align:center;font-size:100%;font-family:Verdana, Geneva, Tahoma, sans-serif;">${Sprint.sprintList[index].status}</td>
                 <td class="mdl-data-table__cell--non-numeric" style="width:10%;text-align:center;font-size:100%">
                 <button class="mdl-button mdl-js-button mdl-button--icon" onclick='viewSprint(${index})'>  <i class="material-icons" style="color:grey">visibility</i> </button></td>
                 <td class="mdl-data-table__cell--non-numeric" style="width:10%;text-align:center;font-size:100%">
                 <button class="mdl-button mdl-js-button mdl-button--icon" onclick='deleteSprint(${index})'> <i class="material-icons" style="color:grey">delete</i> </button>
                 <button class="mdl-button mdl-js-button mdl-button--icon" onclick='editSprint(${index})'> <i class="material-icons" style="color:grey">edit</i> </button></td>
                </tr>`

    }

    // Closing tag for table
    inputHTML += '</table>'

    // Append the inputHTML to the html file
    htmlRef.innerHTML = inputHTML

    

}


// To edit Sprint
function editSprint(index){

    if (Sprint.sprintList[index].status === "Not Started"){
        localStorage.setItem("sprintToEdit", index);

        window.location = "../editSprint/editSprint.html"

    } else {
        alert("Active and Completed sprints are not editable")
    }
    
}


// Delete sprint
function deleteSprint(index){

    if (confirm(" Are you sure you want to delete this sprint? ")){

        if ( Sprint.sprintList[index].status === "Active" || Sprint.sprintList[index].status === "Completed" ){
            alert("Active sprints and Completed Sprints cannot be deleted")
        } else {

            // Remove the sprint from the sprintList in database
            Sprint.sprintList.splice(index,1)

            // Update data base after a sprint is deleted
            Sprint.toDB()

            // Redisplay the list of sprints in the sprint board
            displaySprints()


        }
        

    }


}

// TODO : MARIO
function viewSprint(index){
    localStorage.setItem("sprintToDisplay", index);
    // temporary version for now
    window.location = "../sprintView/sprintView.html"
}




// Call at the interval of 10 seconds to check the start date of all the sprints that have yet to be started .
function check_start_date(){
    console.log("okay")
    
    // for loop to iterate through all the sprints created
    for (let index in Sprint.sprintList){
        // Find for sprints that are in the status Not Started
        if (Sprint.sprintList[index].status === "Not Started" ){

            startDate = new Date(Sprint.sprintList[index].startDate)
            
            now = new Date()

            // If the start date is now, set the status of sprint to Active
            if (now >= startDate){
                Sprint.sprintList[index].status = "Active"
                Sprint.toDB()
                displaySprints()
            }
        }
    }

    
}

// Call at the interval of 10 seconds to check the end date of  the sprint that is currently Active. 
function check_end_date(){
    console.log("okay")
    
    // for loop to iterate through all the sprints created
    for (let index in Sprint.sprintList){
        // Find for sprint that is currently Active if there is any 
        if (Sprint.sprintList[index].status === "Active" ){

            endDate = new Date(Sprint.sprintList[index].endDate)  
            now = new Date()

            // Set the status to completed if the end date is now 
            if (endDate <= now){
                Sprint.sprintList[index].status = "Completed"
                Sprint.toDB()
                displaySprints()
            }
        }
    }

    
}

// Call the functions check start date and check end date at every 10 seconds interval
function callInterval(){
    interval1 = setInterval(check_start_date,10000)
    interval2 = setInterval(check_end_date,10000)
    check_start_date()
    check_end_date()
}









