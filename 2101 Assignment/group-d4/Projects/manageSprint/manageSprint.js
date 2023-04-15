

// Call the function to load data from data base everytime the page loads
initFromDB().then(() => { displayAllTasks() })

// Temporary array to store the tasks added to the sprint backlog
temporaryTasksInSprint = []

// Direct to Main Page
function mainPage() {
    window.location = "../mainPage/tempMain.html"
}

// Direct to the Sprint Board 
function sprintBoard(){
    window.location = "../sprintBoard/sprintBoard.html"
}

// Direct to the Task Board 
function taskBoard(){
    window.location = "../taskBoard/taskboard.html"
}

// Direct to the Team Board 
function teamBoard(){
    window.location = "../teamBoard/teamBoard.html"
}

// Display all the tasks in both Product and Sprint backlog
function displayAllTasks() {
    // HTML referrencing
    htmlRefProductBacklog = document.getElementById("productBacklogDisplay")

    inputHTML = '<table class="mdl-data-table mdl-js-data-table"><tr style="background:#F5F5F5;"> <th class="mdl-data-table__cell--non-numeric"  style="width:70%">PRODUCT BACKLOG</th><th class="mdl-data-table__cell--non-numeric" style="text-align:center; ">STATUS</th><th class="mdl-data-table__cell--non-numeric" style="text-align:center">ADD TO SPRINT</th></tr>'

    // If temporaryTasksInSprint array is empty display all the tasks in the Product Backlog
    if (temporaryTasksInSprint.length == 0) {
        for (let index in Task.taskList) {
            inputHTML += `<tr><td class="mdl-data-table__cell--non-numeric" style="width:50%;font-size:100%;font-family:Verdana, Geneva, Tahoma, sans-serif">  ${Task.taskList[index].name} </td>
            <td class="mdl-data-table__cell--non-numeric" style="width:5%;text-align:center;font-size:100%;font-family:Verdana, Geneva, Tahoma, sans-serif;">  ${Task.taskList[index].status} </td>
            <td class="mdl-data-table__cell--non-numeric" style="width:5%;text-align:center;"><button class="mdl-button mdl-js-button mdl-button--icon" onclick="addToSprintBacklog(${index})"> <i class="material-icons" style="color:grey">add</i> </button></td>
            
            </tr>`
        }
    // If temporaryTasksInSprint array is not empty , display only the tasks that are not in the array in Product Backlog 
    } else {
        for (let index in Task.taskList) {
            isValid = true
            for (let j in temporaryTasksInSprint) {
                if (temporaryTasksInSprint[j].name === Task.taskList[index].name) {
                    isValid = false
                }
            }

            if (isValid == true) {
                inputHTML += `<tr><td class="mdl-data-table__cell--non-numeric" style="width:50%;font-size:100%;font-family:Verdana, Geneva, Tahoma, sans-serif;">  ${Task.taskList[index].name} </td>
                <td class="mdl-data-table__cell--non-numeric" style="width:5%;text-align:center;font-size:100%;font-family:Verdana, Geneva, Tahoma, sans-serif;">  ${Task.taskList[index].status} </td>
                <td class="mdl-data-table__cell--non-numeric" style="width:5%;text-align:center;"><button class="mdl-button mdl-js-button mdl-button--icon" onclick="addToSprintBacklog(${index})"> <i class="material-icons" style="color:grey">add</i> </button></td>
                
                </tr>`
                
               
            }

        }
    }
    inputHTML += '</table>'
    // append inputHTML to the html page
    htmlRefProductBacklog.innerHTML = inputHTML

    // HTML referrencing
    htmlRefSprintBacklog = document.getElementById("sprintBacklogDisplay")

    // Display the tasks in the temporaryTasksInSprint array in the SprintBacklog
    inputHTML2 = '<table class="mdl-data-table mdl-js-data-table"><tr style="background:#F5F5F5"> <th class="mdl-data-table__cell--non-numeric" style="width:70%">SPRINT BACKLOG</th><th class="mdl-data-table__cell--non-numeric" style="text-align:center; ">STATUS</th><th class="mdl-data-table__cell--non-numeric" style="text-align:center">REMOVE FROM SPRINT</th></tr>'
    for (let index in temporaryTasksInSprint) {
        inputHTML2 += `<tr><td class="mdl-data-table__cell--non-numeric" style="width:50%;font-size:100%;font-family:Verdana, Geneva, Tahoma, sans-serif;"> ${temporaryTasksInSprint[index].name} </td>
        <td class="mdl-data-table__cell--non-numeric" style="width:5%;text-align:center;font-size:100%;font-family:Verdana, Geneva, Tahoma, sans-serif;"> ${temporaryTasksInSprint[index].status} </td>
        <td class="mdl-data-table__cell--non-numeric" style="width:5%;text-align:center">
        <button class="mdl-button mdl-js-button mdl-button--icon" onclick="remove(${index})"> <i class="material-icons" style="color:grey">remove</i> </button></td>
        
        </tr>`
    }

    // append inputHTML2 to the html page
    htmlRefSprintBacklog.innerHTML = inputHTML2
}




// Button to add task from Product Backlog to Sprint Backlog
function addToSprintBacklog(index) {

    temporaryTasksInSprint.push(Task.taskList[index])

    displayAllTasks()

}

// Button to remove task from Sprint backlog back into Product Backlog
function remove(index) {

    temporaryTasksInSprint.splice(index, 1)
    displayAllTasks()
}





// Create Sprint 
function createSprint() {
    // HTML referrencing
    sprintNameRef = document.getElementById("newSprintName")
    sprintStartDateRef = document.getElementById("startDate")
    sprintEndDateRef = document.getElementById("endDate")

    // Sprint Details 
    sprintName = sprintNameRef.value
    sprintStartDate = sprintStartDateRef.value
    sprintEndDate = sprintEndDateRef.value

    // Convert date in string to date objects so that can be used for comparisons
    startDate_timeObj = new Date(sprintStartDate)
    endDate_timeObj = new Date(sprintEndDate)

    // Check if the dates selected is within or overlapping with the time period of other sprints
    isAccepted = true
    for (let index in Sprint.sprintList) {

        // if the start date selected is in between the time period of other sprints
        if ((startDate_timeObj >= new Date(Sprint.sprintList[index].startDate)) && (startDate_timeObj <= new Date(Sprint.sprintList[index].endDate))) {
            isAccepted = false
            break
        }

        // if the end date selected is in between the time period of other sprints
        if ((endDate_timeObj >= new Date(Sprint.sprintList[index].startDate)) && (endDate_timeObj <= new Date(Sprint.sprintList[index].endDate))) {
            isAccepted = false
            break
        }

        // if start date of other sprints falls in between the start date and end date selected for the new sprint
        if ((new Date(Sprint.sprintList[index].startDate) >= startDate_timeObj) && (new Date(Sprint.sprintList[index].startDate) <= endDate_timeObj)) {
            isAccepted = false
            break
        }

        // if end date of other sprints falls in between the start date and end date selected for the new sprint
        if ((new Date(Sprint.sprintList[index].endDate) >= startDate_timeObj) && (new Date(Sprint.sprintList[index].endDate) <= endDate_timeObj)) {
            isAccepted = false
            break
        }


    }

    // ensure all input fields are filled
    if (sprintName === "" || sprintEndDate === "" || sprintStartDate === "") {
        alert("Please enter all details filled ")
    } else {
        
        isAllowable = true

        // Check if the end date selected is same or earlier than the start date which is not allowable
        if (endDate_timeObj <= startDate_timeObj) {
            isAllowable = false
        }


        if (isAllowable == false) {
            alert("End Date cannot be the same or earlier than the Start Date")
        } else {


            // Check if the sprint about to be created is in the past which is now allowable
            isPermitted = true

            if (endDate_timeObj <= new Date()){
                isPermitted = false
            }

            if (isPermitted == false){
                alert("Sprint cannot be created in past dates")
            } else {
                if (isAccepted == true) {

                    // If any of the tasks selected to be added to Sprint is already completed
                    isValid = true
                    
                    for (let index in temporaryTasksInSprint) {
                        if (temporaryTasksInSprint[index].status === "Completed") {
                            isValid = false
                        }
                    }

                    if (isValid == false) {

                        alert("Sprint cannot be created with tasks that are completed!")

                    } else {

                        // Creating a sprint 
                        let newSprint = new Sprint(sprintName, sprintStartDate, sprintEndDate)
                        for (let index in temporaryTasksInSprint) {

                            newSprint.taskIDList.push(temporaryTasksInSprint[index].id)
                        }
                        Sprint.toDB()

                        // Direct back to the sprint board page
                        window.location.href = "../sprintBoard/sprintBoard.html"

                    }
                }
                else {
                    alert("Start or End date selected is in within or overlapping with the time period of another sprint. Please reselect the dates!")
                }



            }



            

        }

        

    }

}

