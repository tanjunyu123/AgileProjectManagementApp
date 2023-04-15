



// Display cards and display tags in filter when the page loads by retrieving data from database
initFromDB().then(() => { displayCards(); displayTagsInFilter() })







// When create task button is clicked , a dialog box is shown for user to input task details
function createTask() {

    // Referencing HTML elements
    showDialogBox = document.getElementById("dialogBox_Task")
    // show dialog box
    showDialogBox.showModal()

    // create reference for the tag input 
    let taskTagRef = document.getElementById("taskTag")

    inputHTML = ""

    console.log(Tag.tagList)
    // loop through all the tags in the tagList and add them all to the dropdown list 
    for (let index in Tag.tagList) {
        inputHTML += `<option value="${Tag.tagList[index].tagName}">${Tag.tagList[index].tagName}</option>`
    }

    // Append HTML 
    taskTagRef.innerHTML = inputHTML
    // add inner html for team input
    let assigneeRef = document.getElementById("taskAssignee")
    assigneeRef.innerHTML = getAssigneeOptionHtml()
}


// When the create tag button is clicked, a dialog box is shown for user to input new tag name
function createTag() {
    // Referencing HTML elements
    showDialogBox = document.getElementById("dialogBox_Tag");
    // show dialog box
    showDialogBox.showModal()
}


// Function that displays all tags that can be deleted in dialog box
function deleteTag() {
    // Referencing HTMl elements
    dialogRef = document.getElementById("dialogBox_DeleteTag")
    dialogRef.showModal()
    inventoryRef = document.getElementById("listTags")

    inputHTML = `<table> 
    <tr>
     <th>Tags</th>
     <th>Action</th>
    </tr>
    `

    // Display all tags that can be deleted in a table
    for (let index in Tag.tagList) {
        // "No Tag" is not shown as tags that can be deleted
        if (Tag.tagList[index].tagName != "No Tag") {
            inputHTML += `<tr>
                  <td>${Tag.tagList[index].tagName}</td>
                  <td><button class="mdl-button mdl-js-button mdl-button--raised" onclick="confirmDeleteTag(${index})">Delete</button></td> 
                  </tr>
                  `
        }
    }

    inputHTML += `</table>`

    inventoryRef.innerHTML = inputHTML;
}

// Confirm to delete tag
function confirmDeleteTag(index) {


    if (confirm("Are you sure? This tag will be removed from any tasks that currently hold it")) {
        // variable tag_remove is the tag to be removed
        tag_remove = Tag.tagList[index].tagName


        // If any of the task holds the tag to be removed, the task will change from the current tag to No Tag
        for (let index in Task.taskList) {
            for (let i in Task.taskList[index].tag) {
                if (Task.taskList[index].tag[i] == tag_remove) {
                    console.log(i)
                    Task.taskList[index].tag.splice(i, 1)
                }
            }

            // If there is no more tag on a task after removing a tag from it, the task will now be assigned to No Tag
            if (Task.taskList[index].tag.length == 0) {
                Task.taskList[index].tag.push("No Tag")
            }
        }


        // update Data base
        Task.toDB()

        // Remove the tag from the tagList using its index
        Tag.tagList.splice(index, 1);
        // Update the database after tag is removed
        Tag.toDB()

        // Close dialog box after a tag is deleted
        dialogBoxRef = document.getElementById("dialogBox_DeleteTag")
        dialogBoxRef.close();

        // Update the tag in the filter after a tag is removed
        displayTagsInFilter()

        // Update the display of cards
        displayCards_Filter()
    }


}



// Close the create task dialog box
function cancelDialogBox_Task() {
    dialogBoxRef = document.getElementById("dialogBox_Task")
    dialogBoxRef.close();
}

// Close the create tag dialog box
function cancelDialogBox_Tag() {
    dialogBoxRef = document.getElementById("dialogBox_Tag")
    dialogBoxRef.close();
}

function cancelDialogBox_DeleteTag() {
    dialogBoxRef = document.getElementById("dialogBox_DeleteTag")
    dialogBoxRef.close();
}


// Add task to the taskList 
function addTask() {


    // creating references for each input by the user
    let taskNameRef = document.getElementById("newTaskName");
    let taskPriorityRef = document.getElementById("newTaskPriority");
    let taskTypeRef = document.getElementById("newTaskType");
    let taskTagRef = document.getElementById("taskTag");
    let taskAssigneeRef = document.getElementById("taskAssignee")
    let taskStoryPointRef = document.getElementById("taskStoryPoint")
    let filterRef = document.getElementById("tags");

    // Create an empty array to store all the tags selected by user
    let tagValues = [];

    // for each tag selected, add them into the tagValues array
    for (let i = 0; i < taskTagRef.options.length; i++) {
        if (taskTagRef.options[i].selected) {
            tagValues.push(taskTagRef.options[i].value);
        }
    }

    


    //accessing html element values
    let newTaskName = taskNameRef.value;
    let newPriority = taskPriorityRef.value;
    let newTaskType = taskTypeRef.value;
    let taskAssignee = taskAssigneeRef.options[taskAssigneeRef.selectedIndex].value
    let taskStoryPoint = taskStoryPointRef.value;

    // Set val to true
    let val = "true"

    // Check if No Tag is selected with other tags.If Yes set val to false
    for (let index in tagValues) {
        if (tagValues[index] == "No Tag") {
            if (tagValues.length != 1) {
                val = "false"
            }
        }
    }


    // Check if any input field is empty
    if (newTaskName === "" || newTaskType === "" || newPriority === "" || taskAssignee === "" || taskStoryPoint === "" || tagValues.length == 0) {
        alert("Please ensure all input fields are filled")
    } // if no field is left empty 
    else {

        if (val == "false") {
            alert("No Tag can only be selected alone")
        }
        else {
            // Create a task using constructor
            let newTaskObj = new Task(newTaskName, newTaskType, newPriority);


            // Add assignee to task 
            newTaskObj.assignee = taskAssignee

            // Add story point to task
            newTaskObj.storyPoint = taskStoryPoint


            // Append each tag into the tag array of the Task created
            for (let index in tagValues) {
                newTaskObj.tag.push(tagValues[index])
            }

            // update Database
            Task.toDB()

            // close dialog box
            dialogBoxRef = document.getElementById("dialogBox_Task")
            dialogBoxRef.close();

            // Reset the filter tag back to all
            filterRef.value = "all";

        }

        displayCards_Filter();

    }


}

// Add tag to tagList
function addTag() {
    // Referencing HTML elements
    let newTagRef = document.getElementById("newTagName");
    let filterRef = document.getElementById("tags");

    newTag = newTagRef.value;


    // Check if tag to be added already exists
    validation_check = "true"
    for (let index in Tag.tagList) {
        if (Tag.tagList[index].tagName === newTag) {
            validation_check = "false"
        }
    }

    if (validation_check == "false") {
        alert("Tag already exists")
    } else {
        // Create a new tag
        let newTagObj = new Tag(newTag)

        // close dialog box
        dialogBoxRef = document.getElementById("dialogBox_Tag")
        dialogBoxRef.close();

        // Display the new tag added in the filter box
        displayTagsInFilter()

        // Reset the filter tag back to all
        filterRef.value = "all";

        // Update the display of cards
        displayCards_Filter()

    }

}

function checkTagFilterValidity(taskTag, filtTag) {
    console.log(filtTag)
    if (filtTag == 'all') {
        return true
    }
    else if (filtTag == 'No Tag' && taskTag.length == 0) {
        console.log("wow")
        return true
    }
    else {
        for (let i in taskTag) {
            if (taskTag[i] == filtTag) {
                return true
            }
        }
    }
    return false
}

//Global variables & copy original tasklist
let oriList = Task.taskList.slice(0);
let copyList;

//to check 'sort by priority' functionality
function testPriority(prioFlag = 'None'){

    if (prioFlag == 'highToLow') {
        const order = ['High', 'Medium', 'Low'];
        // copy taskList and sort by priority (High->Medium->Low)
        copyList = Task.taskList.slice(0).sort((a, b) => order.indexOf(a.priority) - order.indexOf(b.priority));

        for (i in oriList) {
            for (j in copyList) {
                if (copyList[j].name == oriList[i].name && copyList[j].priority == oriList[i].priority) {
                    copyList[j].sortedIndex = i;
                }
            }
        }
    }

    else if (prioFlag == 'lowToHigh') {
        const order = ['Low', 'Medium', 'High'];
        // copy taskList and sort by priority (Low->Medium->High)
        copyList = Task.taskList.slice(0).sort((a, b) => order.indexOf(a.priority) - order.indexOf(b.priority));

        for (i in oriList) {
            for (j in copyList) {
                if (copyList[j].name == oriList[i].name && copyList[j].priority == oriList[i].priority) {
                    copyList[j].sortedIndex = i;
                }
            }
        }
    }

    //default order(based on create time)
    else {
        copyList = Task.taskList.slice(0);
        for (let index in copyList) {
            copyList[index].sortedIndex = index;
        }
    }
}

// Helper method to display Cards
function helperDisplay(stat, filtTag = 'all') {
    
    // check for status color
    let stateColor;
    if (stat == 'Completed') {
        stateColor = 'green';
    }
    else if (stat == 'In Progress') {
        stateColor = 'orange';
    }
    else {
        stateColor = 'red';
    }

    // Tasks with same status will be display in one column.
    output = '<div class="container" style="padding:19px;width:30%;float:left">'
    
    for (let index in copyList) {
        if (checkTagFilterValidity(copyList[index].tag, filtTag) && copyList[index].status == stat) {

            output += `<div class="mdl-card mdl-shadow--2dp card" id="card${copyList[index].sortedIndex}" style="border-radius:8px;margin: 3px 10px 20px 30px;height:3cm;cursor: pointer">
            <div class="mdl-card__title">
                <h3 class="mdl-card__title-text" style="cursor: pointer" onclick ="viewTaskDetails(${copyList[index].sortedIndex})">${copyList[index].status}</h3>

                <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab" style="border-radius:8px;height:0.5cm;position:absolute;top:15px;right:10px;background-color:${stateColor}"
                onclick ="viewTaskDetails(${copyList[index].sortedIndex})">
                </button>
                \

            </div>
            <div class="mdl-card__supporting-text" style="cursor: pointer" onclick ="viewTaskDetails(${copyList[index].sortedIndex})">
                Task Name : ${copyList[index].name}
            </div>
            <div class="mdl-card__supporting-text" style="cursor: pointer" onclick ="viewTaskDetails(${copyList[index].sortedIndex})">
                Task Type : ${copyList[index].taskType}
            </div>
            <div class="mdl-card__supporting-text" style="cursor: pointer" onclick ="viewTaskDetails(${copyList[index].sortedIndex})">
                Task Priority : ${copyList[index].priority}
            </div>

            </div>`
        }
    }

    output += '</div>'
    return output;

}

// Display cards 
function displayCards() {
    // Referencing HTML elements
    let displayCardsRef = document.getElementById("cardsDisplay")

    inputHTML = `<div class="container"><div class="row">`;


    //Call the helper method to display cards
    testPriority();
    inputHTML2 = helperDisplay("Not Started");
    inputHTML2 += helperDisplay("In Progress");
    inputHTML2 += helperDisplay("Completed");

    displayCardsRef.innerHTML = inputHTML + inputHTML2


}

// Display cards according to filter tag/priority selected
function displayCards_Filter() {


    // Referencing HTML elements
    let displayCardsRef = document.getElementById("cardsDisplay")
    let select = document.getElementById("tags")
    let tag = select.options[select.selectedIndex].value
    let select_priority = document.getElementById("priority")
    let prio = select_priority.options[select_priority.selectedIndex].value

    inputHTML = `<div class="container"><div class="row">`

    console.log(Task.taskList)

    //Call the helper method to display cards
    testPriority(prio);
    inputHTML2 = helperDisplay("Not Started",tag);
    inputHTML2 += helperDisplay("In Progress",tag);
    inputHTML2 += helperDisplay("Completed",tag);

    displayCardsRef.innerHTML = inputHTML + inputHTML2
}

// Delete Task
function deleteTask(index) {
    // Referencing HTML elements
    filterRef = document.getElementById("tags")
    // Remove the task from the taskList using its index
    Task.taskList.splice(index, 1);
    // Update the database after task is removed
    Task.toDB()

    // Update the display of cards
    displayCards_Filter()




}

// Display all the tags available in the tagList in the filter box
function displayTagsInFilter() {
    // generate default tag if it doesn't exist yet
    if(Tag.findByName("No Tag")==null) {
        new Tag("No Tag")
    }

    if(Tag.findByName("UI")==null) {
        new Tag("UI")
    }

    if(Tag.findByName("Core")==null) {
        new Tag("Core")
    }

    if(Tag.findByName("Testing")==null) {
        new Tag("Testing")
    }


    // Referencing HTML elements
    tagRef = document.getElementById("tags")


    inputHTML = `<option value="all">All</option>`

    // loop through all the tags in the tagList and display all of them in the dropdown menu
    for (let index in Tag.tagList) {
        inputHTML += `<option value="${Tag.tagList[index].tagName}">${Tag.tagList[index].tagName}</option>`
    }

    tagRef.innerHTML = inputHTML

}




function viewTaskDetails(index) {
    localStorage.setItem("taskToDisplay", index);
    localStorage.setItem("cameFromTaskBoard", true);
    window.location = "../taskInformation/tempTaskInfo.html"
}


// back to mainPage when home button is clicked in navigation drawer
function mainPage() {
    window.location = "../mainPage/tempMain.html"
}

// Direct to the Team Board 
function teamBoard(){
    window.location = "../teamBoard/teamBoard.html"
}

// Direct to the Sprint Board 
function sprintBoard(){
    window.location = "../sprintBoard/sprintBoard.html"
}

