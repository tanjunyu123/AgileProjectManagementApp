function createTask(){
    showDialogBox = document.getElementById("dialogBox")
    showDialogBox.showModal()
}



function addTask(){

    // creating references for each input by the user
    let taskNameRef = document.getElementById("newTaskName");
    let taskPriorityRef = document.getElementById("newTaskPriority");
    let taskTypeRef = document.getElementById("newTaskType");

     //accessing html element values
     let newTaskName = taskNameRef.value;
     let newPriority = taskPriorityRef.value;
     let newTaskType = taskTypeRef.value;

     let newTask = new Task(newTaskName,newPriority,newTaskType);


     setToDB("/users/" + newTask.taskName,{newPriority,newTaskType})

     // close dialog box
     dialogBoxRef = document.getElementById("dialogBox")
     dialogBoxRef.close();


}


function displayCards(){
    displayCardsRef = document.getElementById("cardsDisplay")
}

function cancelDialogBox(){
    dialogBoxRef = document.getElementById("dialogBox")
    dialogBoxRef.close();
}