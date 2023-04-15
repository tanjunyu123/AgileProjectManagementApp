
initFromDB().then(() => main())

tableDivRef = document.getElementById("tableDiv")
teamDialogRef = document.getElementById("teamDialog")
dialogNameRef = document.getElementById("inpName")
dialogEmailRef = document.getElementById("inpEmail")

function main() {
    genTable()
}

function genTable() {
    let innerHTML = ""
    innerHTML += `<table class="mdl-data-table mdl-js-data-table">`
    innerHTML += `
    <thead>
        <tr style="background:#F5F5F5;">
            <th style="text-align:center;font-size:100%;font-family:Verdana, Geneva, Tahoma, sans-serif;width:15%;">NAME</th>
            <th style="text-align:center;font-size:100%;font-family:Verdana, Geneva, Tahoma, sans-serif;width:20%;">EMAIL</th>
            <th style="text-align:center;font-size:100%;font-family:Verdana, Geneva, Tahoma, sans-serif;width:15%;">ANALYTIC</th>
            <th style="text-align:center;font-size:100%;font-family:Verdana, Geneva, Tahoma, sans-serif;width:15%;">DELETE</th>
        </tr>
    </thead>
    `
    innerHTML += `<tbody>`
    for(let index in TeamMember.teamMemberList) {
        let teamMember = TeamMember.teamMemberList[index]
        innerHTML += `
        <tr style="color:black";>
            <td style="text-align:center;font-size:100%;font-family:Verdana, Geneva, Tahoma, sans-serif;">${teamMember.name}</td>
            <td style="text-align:center;font-size:100%;font-family:Verdana, Geneva, Tahoma, sans-serif;">${teamMember.email}</td>
            <td style="text-align:center;">
                <button class="mdl-button mdl-js-button mdl-button--icon" style="color:grey" onclick="toAnalytics(${index})">
                <i class="material-symbols-outlined">monitoring</i>  </button>
            </td>
            <td style="text-align:center;">
                <button class="mdl-button mdl-js-button mdl-button--icon" style="color:grey" onClick="deleteTeamMember(${index})">
                    <i class="material-icons">delete</i>
                </button></td>
        </tr>
        `
    }
    innerHTML += `</tbody>`
    innerHTML += `</table>`
    tableDivRef.innerHTML = innerHTML
}


// function to format date to yyyy-mm-dd
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

// Analytics dialog box 
function toAnalytics(indexOfTeamMember){
    dialogRef = document.getElementById("analyticsDialog")

    inputHTML = `<h4 style = "font: 30px Times New Roman;"> Team Member Analytics</h4>
    <h6 style = "font: 20px Times New Roman"> Last 7 Days </h6>
    `

    // Array to store the last 7 days in date object 
    last7Days_dateObject = []

    // Array to store the last 7 days in yyyy-mm-dd string format 
    last7Days_yyyy_mm_dd_strFormat = []

    // Array to store the last 7 days with their respective Day Name (Monday,Tuesday,...etc)
    last7Days_Day = []

    // Array to store the contribution of the team member in the last 7 days
    last7Days_contribution = []
    


    let i = 0 
    let daysToSubtract = 6

    // Add the last 7 days into the last7Days_dateObject array
    while( i < 7 ){
        dateNow = new Date() 

        last7Days_dateObject.push(new Date(dateNow.setDate(dateNow.getDate() - daysToSubtract)))
        i++
        daysToSubtract--

    }

    
    // Convert all the 7 days in date object into string
    for (let index in last7Days_dateObject){
        last7Days_yyyy_mm_dd_strFormat.push(formatDate(last7Days_dateObject[index]))
    }

    
    // Get the respective day names of each day 
    for (let index in last7Days_dateObject){

        day = last7Days_dateObject[index].getDay()
        
        if (day == 0 ){
            dayName = "Sunday"
        } 
        else if (day == 1){
            dayName = "Monday"
        }
        else if (day == 2){
            dayName = "Tuesday"
        }
        else if (day == 3){
            dayName = "Wednesday"
        }
        else if (day == 4){
            dayName = "Thursday"
        }
        else if (day == 5){
            dayName = "Friday"
        }
        else if (day == 6){
            dayName = "Saturday"
        }

        last7Days_Day.push(dayName)
    }

    // Get the hours contributed for each day of the last 7 days
    for ( let index in last7Days_yyyy_mm_dd_strFormat){
        contributed = false
        for (let j in TeamMember.teamMemberList[indexOfTeamMember].contributionList){
            if (last7Days_yyyy_mm_dd_strFormat[index] === TeamMember.teamMemberList[indexOfTeamMember].contributionList[j].date){
                last7Days_contribution.push(TeamMember.teamMemberList[indexOfTeamMember].contributionList[j].hours)
                contributed = true
            }
        }

        if (contributed == false) {
            last7Days_contribution.push(0)
        }
    }
    inputHTML += `<table class="mdl-data-table mdl-js-data-table">`
    inputHTML += `
    <thead>
        <tr style="background:#F5F5F5;">
            <th style="text-align:center;font-size:100%;font-family:Verdana, Geneva, Tahoma, sans-serif;width:15%;">Day</th>
            <th style="text-align:center;font-size:100%;font-family:Verdana, Geneva, Tahoma, sans-serif;width:20%;">Hours</th>
        </tr>
    </thead>
    `
    inputHTML += `<tbody>`
    // Display the data in the dialog box 
    for (let index in last7Days_Day){
        inputHTML += `
        <tr style = "color:black">
            <td style="text-align:center;font-size:100%;font-family:Verdana, Geneva, Tahoma, sans-serif;">${last7Days_Day[index]}</td>
            <td style="text-align:center;font-size:100%;font-family:Verdana, Geneva, Tahoma, sans-serif;">${last7Days_contribution[index]}</td>
        
        </tr>
        `
    }
    
    inputHTML += `</tbody>`
    inputHTML += `</table>`
    inputHTML += `<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" onclick="cancelDialogBoxAnalytics()">Cancel</button>`

    dialogRef.innerHTML = inputHTML

    dialogRef.showModal()

}


// Close Analytics dialog box 
function cancelDialogBoxAnalytics(){
    dialogBoxRef = document.getElementById("analyticsDialog")

    dialogBoxRef.close()
}





function deleteTeamMember(index) {
    if (confirm(" Are you sure you want to remove this team member? ")){
        let teamMember = TeamMember.teamMemberList[index]
        teamMember.delete()
        genTable()
    }
}

function addTeamMember() {
    teamDialogRef.showModal()
}
function confirmAddTeamMember() {
    new TeamMember(dialogNameRef.value,dialogEmailRef.value)
    genTable()
    closeTeamDialog()
}
function back() {
    window.location.href = "../mainPage/tempMain.html";
}

function teamDashboard() {
    window.location.href = "../teamDashboard/teamDashboard.html";
}

function closeTeamDialog() {
    teamDialogRef.close()
}

// Direct to the Task Board 
function taskBoard(){
    window.location = "../taskBoard/taskboard.html"
}

// Direct to the Sprint Board 
function sprintBoard(){
    window.location = "../sprintBoard/sprintBoard.html"
}
