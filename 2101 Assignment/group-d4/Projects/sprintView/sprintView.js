
class TaskCard extends Card {
    constructor(ref,cardColumn,id,task,width) {
        // information! // showTimeDialog(${Task.taskList.indexOf(task)})
        let innerHTML = 
            `
            <div onclick="viewTaskDetails(${Task.taskList.indexOf(task)})" style="cursor: pointer">
                <div class="mdl-card__title">
                    <h3 class="mdl-card__title-text">${task.name}</h3>
                </div>
                <div class="mdl-card__supporting-text">
                    <p>type: ${task.taskType}</p>
                    <p>priority: ${task.priority}</p>
                    <p>story points: ${task.storyPoint}</p>
                </div>
            </div>
            `
        super(ref,cardColumn,id,innerHTML,width)
        this.task = task
    }
    cardOnMouseUp(e) {
        super.cardOnMouseUp(e)
        let colID = this.getCurrentCardColumn().id 
        if(colID=="colNotStarted") {
            this.task.status = "Not Started"
        }
        else if(colID=="colInProgress") {
            this.task.status = "In Progress"
        }
        else if(colID=="colCompleted") {
            this.task.status = "Completed"
        }
        
    }
}

// ref to insert card
cardSectionRef = document.getElementById("cardSection")

// ref to insert card columns
colNotStartedRef = document.getElementById("columnNotStarted")
colInProgressRef = document.getElementById("columnInProgress")
colCompletedRef = document.getElementById("columnCompleted")




// columns
colNotStarted = null
colInProgress = null
colCompleted = null

// sprint
let sprint = null

// width in pixels for columns
const COLUMN_WIDTH = 350


initFromDB().then(() => main())

function main() {
    // labels for columns
    new LabelBox(colNotStartedRef,"labelBox1",0,0,COLUMN_WIDTH,100,"Not Started","#EEDDDD",true)
    new LabelBox(colInProgressRef,"labelBox2",0,0,COLUMN_WIDTH,100,"In Progress","#EEEEDD",true)
    new LabelBox(colCompletedRef,"labelBox3",0,0,COLUMN_WIDTH,100,"Completed","#DDEEDD",true)

    // create columns
    colNotStarted = new CardColumn(colNotStartedRef,"colNotStarted",0,0,COLUMN_WIDTH,true)
    colInProgress = new CardColumn(colInProgressRef,"colInProgress",0,0,COLUMN_WIDTH,true)
    colCompleted = new CardColumn(colCompletedRef,"colCompleted",0,0,COLUMN_WIDTH,true)

    // temporary sprint - replace with local storage in the future
    if(Sprint.sprintList.length==0) {
        sprint = generateDefaultSprint()
    }
    else {
        sprint = Sprint.sprintList[0]
    }
    let sprintIndex = localStorage.getItem("sprintToDisplay")
    sprint = Sprint.sprintList[sprintIndex]

    // create cards
    let taskList = sprint.taskList
    for(let index in taskList) {
        let task = taskList[index]
        let column = colNotStarted 
        if(task.status=="In Progress") {
            column = colInProgress
        } 
        else if(task.status=="Completed") {
            column = colCompleted
        }

        new TaskCard(cardSectionRef,column,genRandomID(),task,COLUMN_WIDTH-50)
    }
}

// function completeSprint() {
//     sprint.status = "Completed"
//     window.location.href = "../mainPage/tempMain.html";
// }

function back() {
    window.location.href = "../sprintBoard/sprintBoard.html"; 
}

// Direct to the Sprint Board 
function sprintBoard(){
    window.location = "../sprintBoard/sprintBoard.html"
}

// Direct to Main Page
function mainPage() {
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

function viewTaskDetails(index) {
    localStorage.setItem("taskToDisplay", index);
    localStorage.setItem("cameFromTaskBoard", false);
    window.location = "../taskInformation/tempTaskInfo.html"
}



function generateDefaultSprint() {
    setToDB(`${TASK_FOLDER}/`,"")
    setToDB(`${SPRINT_FOLDER}/`,"")
    Task.taskList = []
    Sprint.sprintList = []
    let task1 = new Task("Create a Spiked Goomba for level 11", "Code Implementation", "Low")
    let task2 = new Task("Build maze level", "Code Implementation", "Medium")
    let task3 = new Task("Fix coin duplication glitch", "Debug", "High")
    let task4 = new Task("Create inventory expansion system", "Code Implementation", "Medium")
    let task5 = new Task("Fix typo in shopkeeper dialog", "Debug", "Low")
    let sprint = new Sprint("Sprint 5","19-09-2022","3-09-2022")
    task3.status = "Completed"
    sprint.taskIDList.push(task1.id)
    sprint.taskIDList.push(task2.id)
    sprint.taskIDList.push(task3.id)
    sprint.taskIDList.push(task5.id)
    sprint.toDB()
    return sprint 
}