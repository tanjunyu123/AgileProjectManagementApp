
tableDivRef = document.getElementById("tableDiv")
inpDateStartRef = document.getElementById("inpDateStart")
inpDateEndRef = document.getElementById("inpDateEnd")

initFromDB().then(() => main())

startDate = null 
endDate = null
daysInRange = 0

function main() {
    // have everything in the range by default
    startDate = getMinDate()
    endDate = getMaxDate()
    inpDateStartRef.value = startDate
    inpDateEndRef.value = endDate
    inpDateStartRef.onchange = onStartDateChange
    inpDateEndRef.onchange = onEndDateChange
    genTable()
}

function genTable() {
    daysInRange = (getTime(endDate) - getTime(startDate))/(1000*60*60*24) + 1
    let innerHTML = ""
    innerHTML += `<table class="mdl-data-table mdl-js-data-table">`
    innerHTML += `
    <thead>
        <tr style="background:#F5F5F5;">
            <th style="text-align:center;font-size:100%;font-family:Verdana, Geneva, Tahoma, sans-serif;width:15%;">NAME</th>
            <th style="text-align:center;font-size:100%;font-family:Verdana, Geneva, Tahoma, sans-serif;width:20%;">AVERAGE TIME WORKED</th>
        </tr>
    </thead>
    `
    innerHTML += `<tbody>`
    for(let index in TeamMember.teamMemberList) {
        let teamMember = TeamMember.teamMemberList[index]
        totalHours = 0
        for(let index2 in teamMember.contributionList) {
            let contribution = teamMember.contributionList[index2]
            if(getTime(startDate)<=getTime(contribution.date) && getTime(contribution.date)<=getTime(endDate)) {
                totalHours += contribution.hours
            }
        }
        averageTime = totalHours/daysInRange
        averageHours = Math.floor(averageTime)
        averageMinutes = String(Math.floor((averageTime - averageHours) * 60))
        if(averageMinutes.length==1) {
            averageMinutes += "0"
        }
        innerHTML += `
        <tr style="color:black">
            <td style="text-align:center;font-size:100%;font-family:Verdana, Geneva, Tahoma, sans-serif;">${teamMember.name}</td>
            <td style="text-align:center;font-size:100%;font-family:Verdana, Geneva, Tahoma, sans-serif;">${averageHours}:${averageMinutes}</td>
        </tr>
        `
    }
    innerHTML += `</tbody>`
    innerHTML += `</table>`
    tableDivRef.innerHTML = innerHTML
}

function getMinDate() {
    minDate = null 
    for(let index in TeamMember.teamMemberList) {
        teamMember = TeamMember.teamMemberList[index]
        for(let index2 in teamMember.contributionList) {
            contribution = teamMember.contributionList[index2]
            if(minDate==null) {minDate=contribution.date}
            else if (getTime(minDate)>getTime(contribution.date)) {
                minDate = contribution.date
            }
        }
    }
    return minDate 
}

function getMaxDate() {
    maxDate = null 
    for(let index in TeamMember.teamMemberList) {
        teamMember = TeamMember.teamMemberList[index]
        for(let index2 in teamMember.contributionList) {
            contribution = teamMember.contributionList[index2]
            if(maxDate==null) {maxDate=contribution.date}
            else if (getTime(maxDate)<getTime(contribution.date)) {
                maxDate = contribution.date
            }
        }
    }
    return maxDate 
}

function onStartDateChange(e) {
    // prevent start date from being greater than end date
    if(getTime(inpDateStartRef.value)>getTime(endDate)) {
        inpDateStartRef.value = endDate
    }
    startDate = inpDateStartRef.value
    genTable()
}
function onEndDateChange(e) {
    // prevent end date from being smaller than start date
    if(getTime(inpDateEndRef.value)<getTime(startDate)) {
        inpDateEndRef.value = startDate
    }
    endDate = inpDateEndRef.value
    genTable()
}
function getTime(dateStr) {
    return new Date(dateStr).getTime()
}
function mainPage() {
    window.location.href = "../mainPage/tempMain.html";
}

function back() {
    window.location.href = "../teamBoard/teamBoard.html";
}


// Direct to the Task Board 
function taskBoard(){
    window.location = "../taskBoard/taskboard.html"
}

// Direct to the Sprint Board 
function sprintBoard(){
    window.location = "../sprintBoard/sprintBoard.html"
}