
// initialize the database, then run the main() code after the initialization is complete
initFromDB().then(() => main())

// boolean signifying whether edit mode is active
editMode = false 
// task that is being shown
task = null
// references to html elements that show the values of the data that cannot be edited
lblNameRef = null; lblTypeRef = null; lblPriorityRef = null; lblStatusRef = null; lblAssigneeRef = null; lblPointsRef = null; lblTagRef = null; lblDescRef = null;
// references to html elements that show the values of the data that can be edited
inpNameRef = null; inpTypeRef = null; inpPriorityRef = null; inpStatusRef = null; inpAssigneeRef = null; inpPointsRef = null; inpTagRef = null; inpDescRef = null;

// references to the edit and confirm buttons
editButtonRef = null
confirmButtonRef = null

// reference to the delete confirmation dialog
deleteDialogRef = document.getElementById("deleteDialog")

// was task info accessed from the task board?
cameFromTaskBoard = null
btnTimeLogRef = document.getElementById("btnTimeLog")

// dialog ref
timeDialogRef = document.getElementById("timeDialog")

// dialog related refs
totalHourRef = document.getElementById("totalHours")
inpHoursRef = document.getElementById("inpHours")
btnHoursRef = document.getElementById("btnHours")
inpDateRef = document.getElementById("inpDate")
inpTaskAssigneeDialogRef = document.getElementById("inpTaskAssigneeDialog")

// main function
// runs after the page and database's data has been loaded
function main() {
    // set references to elements that show non-editable data
    lblNameRef = document.getElementById("lblTaskName")
    lblTypeRef = document.getElementById("lblTaskType")
    lblPriorityRef = document.getElementById("lblTaskPriority")
    lblStatusRef = document.getElementById("lblTaskStatus")
    lblAssigneeRef = document.getElementById("lblTaskAssignee")
    lblPointsRef = document.getElementById("lblTaskPoints")
    lblTagRef = document.getElementById("lblTaskTag")
    lblDescRef = document.getElementById("lblTaskDescription")

    // set references to elements that show non-editable data for future access
    inpNameRef = document.getElementById("inpTaskName")
    inpTypeRef = document.getElementById("inpTaskType")
    inpPriorityRef = document.getElementById("inpTaskPriority")
    inpStatusRef = document.getElementById("inpTaskStatus")
    inpAssigneeRef = document.getElementById("inpTaskAssignee")
    inpPointsRef = document.getElementById("inpTaskPoints")
    inpTagRef = document.getElementById("inpTaskTag")
    inpDescRef = document.getElementById("inpTaskDescription")

    // set references to buttons for future access
    editButtonRef = document.getElementById("btnEdit")
    confirmButtonRef = document.getElementById("btnConfirm")

    // get task index from local storage
    taskIndex = localStorage.getItem("taskToDisplay")
    task = Task.taskList[taskIndex]
    // find source of accessing this page
    cameFromTaskBoard = localStorage.getItem("cameFromTaskBoard") == 'true'
    if(cameFromTaskBoard==false) {
        btnTimeLogRef.hidden = null
    }
    // add all tags as possible choices in the  menu for tags
    updateTags()

    // set all the values from the task according to the text
    updateUI()

}

// should the value labels be hidden? hidden="hidden" if yes, hidden=null if no
function setLblHidden(hidden) {
    lblNameRef.hidden = hidden
    lblTypeRef.hidden = hidden 
    lblPriorityRef.hidden = hidden
    lblStatusRef.hidden = hidden
    lblAssigneeRef.hidden = hidden
    lblPointsRef.hidden = hidden
    lblTagRef.hidden = hidden
    lblDescRef.hidden = hidden
}
// should the value input boxes be hidden? hidden="hidden" if yes, hidden=null if no
function setInpHidden(hidden) {
    inpNameRef.hidden = hidden
    inpTypeRef.hidden = hidden 
    inpPriorityRef.hidden = hidden
    inpStatusRef.hidden = hidden
    inpAssigneeRef.hidden = hidden
    inpPointsRef.hidden = hidden
    inpTagRef.hidden = hidden
    inpDescRef.hidden = hidden
}

// this pretty much runs every time the edit/confirm buttons are pressed
function updateUI() {
    if(editMode) {
        // hide and unhide stuff
        setLblHidden("hidden")
        setInpHidden(null)
        editButtonRef.hidden = "hidden"
        confirmButtonRef.hidden = null

        // set current values to the input boxes
        inpNameRef.value = task.name;
        inpTypeRef.value = task.taskType; 
        inpPriorityRef.value = task.priority; 
        inpStatusRef.value = task.status; 
        inpAssigneeRef.innerHTML = getAssigneeOptionHtml(task.assignee); 
        inpPointsRef.value = task.storyPoint; 
        for(let index in Tag.tagList) {
            if(task.tag.includes(Tag.tagList[index].tagName)) {
                inpTagRef[parseInt(index,10) + 1].selected = true
            }
        }
        inpDescRef.value = task.description;

    }
    else {
        // hide and unhide stuff
        setLblHidden(null)
        setInpHidden("hidden")
        editButtonRef.hidden = null
        confirmButtonRef.hidden = "hidden"

        // set current values to the labels
        lblNameRef.innerHTML = task.name 
        lblTypeRef.innerHTML = task.taskType 
        lblPriorityRef.innerHTML = task.priority 
        lblStatusRef.innerHTML = task.status 
        lblAssigneeRef.innerHTML = task.assignee 
        lblPointsRef.innerHTML = task.storyPoint 
        // generate the html values for tags
        let htmlVal = ""
        for(let index in task.tag) {
            htmlVal += `<p>${task.tag[index]}</p>`
        }
        lblTagRef.innerHTML = htmlVal; 

        lblDescRef.innerHTML = task.description 
    }
}

// runs when edit button is pressed
function edit() {
    editMode = true 
    updateUI()
}
// runs when confirm button is pressed

function getOption(ref) {
    return ref.options[ref.selectedIndex].value
}

function confirm() {
    editMode = false 
    // check tags first
    // if an invalid configuration exists, do not save the task
    let tagSelect = inpTagRef && inpTagRef.options
    let tag = []
    for(let i = 0; i <tagSelect.length; i++) {
        option = tagSelect[i]
        if(option.selected) {
            tag.push(option.value)
        }
    }

    if(tag.includes("No Tag") && tag.length > 1 ) {
        alert("No Tag can only be selected alone! Please reselect tags")
        return 
    }
    else if(tag.toString() != task.tag.toString()) {task.tag = tag}

    // if any values were changed (other than tag), update accordingly
    if(inpNameRef.value != task.name) {task.name = inpNameRef.value}
    if(getOption(inpTypeRef) != task.taskType) {task.taskType = getOption(inpTypeRef)}
    if(getOption(inpPriorityRef) != task.priority) {task.priority = getOption(inpPriorityRef)}
    if(getOption(inpStatusRef) != task.status) {task.status = getOption(inpStatusRef)}
    if(getOption(inpAssigneeRef) != task.assignee) {task.assignee = getOption(inpAssigneeRef)}
    if(inpPointsRef.value != task.storyPoint) {task.storyPoint = inpPointsRef.value}
    if(inpDescRef.value != task.description) {task.description = inpDescRef.value}
    updateUI()
}
function back() {
    if(cameFromTaskBoard) {
        window.location = "../taskBoard/taskboard.html"
    }
    else {
        window.location = "../sprintView/sprintView.html"
    }
}

// Display all the tags available in the tagList in the filter box
function updateTags() {
    // Referencing HTML elements
    inputHTML = ``
    // loop through all the tags in the tagList and display all of them in the dropdown menu
    for (let index in Tag.tagList) {
        inputHTML += `<option value="${Tag.tagList[index].tagName}">${Tag.tagList[index].tagName}</option>`
    }
    inpTagRef.innerHTML = inputHTML
}

// deletes the currently selected task and returns back to the task board
function deleteTask() {
    deleteDialogRef.showModal()
}

function deleteDialogConfirm() {
    task.delete()
    back()
}
function deleteDialogCancel() {
    deleteDialogRef.close()
}

// shows time dialog
function showTimeDialog() {
    totalHourRef.innerHTML = task.allocatedTime
    inpTaskAssigneeDialogRef.innerHTML = getAssigneeOptionHtml(task.assignee)
    inpTaskAssigneeDialogRef.onchange = () => {
        task.assignee = getOption(inpTaskAssigneeDialogRef)
    }
    btnHoursRef.onclick = addHours
    timeDialogRef.showModal()
}

// closes time dialog
function closeTimeDialog() {
    timeDialogRef.close()
}

function addHours() {
    let addedHours = inpHoursRef.value
    let dateAdded = inpDateRef.value

    if(!isNaN(parseFloat(addedHours))) {
        task.allocatedTime += parseFloat(addedHours)
        let teamMember = TeamMember.findByName(task.assignee)
        teamMember.contributionList.push({hours: parseFloat(addedHours), date:dateAdded})
        teamMember.toDB()
    }
    else {
        alert("input for additional hours needs to be numeric!")
    }
    totalHourRef.innerHTML = task.allocatedTime
}