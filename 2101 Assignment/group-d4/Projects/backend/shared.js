
function rInt(a,b) {return Math.floor(Math.random() * (b+1-a)) + a}
function rChoice(list) {return list[Math.floor(Math.random() * list.length)];}


function genRandomID(length=16) {
    let result = rChoice(["Red","Orange","Yellow","Green","Blue","Purple","White","Grey","Black","Scarlet","Cyan","Magenta","Pink","Indigo","Violet"])
    result += `-${rInt(10,99)}-`
    for(let i = 0; i < length; i++) {
        result += String.fromCharCode(rChoice([rInt(48,57),rInt(65,90),rInt(97,122)]))
    }
    return result 
}
// scambled list of alphanumeric characters
vigenereList = ['q','R','Y','M','N','l','g','n','U','p','G','O','f','J','2','9','Q','V','w','a','b','d','s','h','A','0','z','v','I','8','r','j','Z','y','W','K','x','u','L','1','m','P','3','F','k','X','5','S','6','B','4','e','D','o','c','T','t','7','H','C','E','i']
ENCRYPTION_KEYWORD = "FIT2101" // this can be anything
function getVigenere(i,j) {
    return vigenereList[(vigenereList.length+i+j)%vigenereList.length] 
}
function processVigenere(text,multiplier) {
    result = ""
    for(let index in text) {
        if(vigenereList.includes(text[index])) {
            i = vigenereList.indexOf(text[index])
            j = vigenereList.indexOf(ENCRYPTION_KEYWORD[index%ENCRYPTION_KEYWORD.length])
            result += getVigenere(i,multiplier*j)
        }
        else {
            result += text[index]
        }
    }
    return result 
}
function encrypt(text) {
    rand = ""
    for(let i = 0; i < 12; i++) {
        rand += rChoice(vigenereList)
    }
    return processVigenere(text,1) + rand
}
function decrypt(text) {
    return processVigenere(text.slice(0,text.length-12),-1)
}

class DatabaseObj {

    // object deletion! deletes itself
    delete(instanceList,cls) {
        // remove from list
        instanceList.splice(instanceList.indexOf(this),1)
        // update database
        cls.toDB()
    }
    // sets the current state of the data into the database
    // can set the index of the instance List, or can automatically find it
    toDB(index,instanceList,folderKey) {
        if(index==-1) {index = instanceList.indexOf(this)}
        setToDB(`${folderKey}/${index}/`,this)
    }
    // goes through every object and updates the database for that object
    static toDB(instanceList,folderKey) {
        // clear everything first
        setToDB(`${folderKey}/`,"")
        // loop through taskList
        for(let index in instanceList) {
            instanceList[index].toDB(index)
        }
    }
    // asynchronous function that goes through each object,
    // creates an instance, and populates it with data
    // in order to run something directly after importing,
    // need to use the .then syntax
    static fromDB(instanceList,folderKey,emptyInstanceFunc) {
        return getFromDBPromise(`${folderKey}/`).then((snapshot) => {
            let data = snapshot.val() // extract the actual data
            instanceList.length = 0 // clear current instance list
            // loop for each index
            for(let index in data) {
                let subData = data[index] // get object data
                let object =  emptyInstanceFunc() // empty object
                object.fromData(subData) // put data into object
            }
        })
    }

}


// Tasks! 
class Task extends DatabaseObj {
    // a static list that keeps track of every task instance
    static taskList = []
    // creates a task using a name, taskType, and priority
    constructor(name, taskType, priority) {
        super()
        // input values
        this._id = genRandomID()
        this._name = name
        this._taskType = taskType
        this._priority = priority
        this._description = ""
        this._status = "Not Started"
        this._tag = []
        this._assignee = ""
        this._storyPoint = ""
        this._allocatedTime = 0
        // add to taskList
        Task.taskList.push(this)

        // if the name isn't undefined, update the database
        // the name can be undefined in the event that no arguments are passed into the constructor
        // which occurs when creating an empty task for importing database data
        if(name!=undefined) {
            this.toDB()
        }
    }
    // getters!
    get id() {return this._id}
    get name() {return this._name}
    get taskType() {return this._taskType}
    get priority() {return this._priority}
    get description() {return this._description}
    get status() {return this._status}
    get tag() {return this._tag}
    get assignee(){return this._assignee}
    get storyPoint(){return this._storyPoint}
    get allocatedTime() {return this._allocatedTime}

    // setters! updates the database when the data is changed
    set name(name) {this._name = name; this.toDB()}
    set taskType(taskType) {this._taskType = taskType; this.toDB()}
    set priority(priority) {this._priority = priority; this.toDB()}
    set description(description) {this._description = description; this.toDB()}
    set status(status) {this._status = status; this.toDB()}
    set tag(tag) {this._tag = tag; this.toDB()}
    set assignee(assignee){this._assignee = assignee;this.toDB()}
    set storyPoint(storyPoint){this._storyPoint = storyPoint; this.toDB()}
    set allocatedTime(allocatedTime) {this._allocatedTime = allocatedTime; this.toDB()}


    // returns a string that represents the data in the task
    toString() {
        return `[${this.name}, taskType=${this.taskType}, priority=${this.priority}, tag=${this.tag}]`
    }
    // returns a string that lists out every task
    static allToString() {
        let result = ""
        result += `<-- list of all tasks -->\n`
        result += `total num of tasks = ${Task.taskList.length}\n`
        for(let i in Task.taskList) {
            result += `${i}: ${Task.taskList[i].toString()}\n`
        }
        result += "<-- -->"
        return result
    }

    // search through task list to find corresponding ID
    static findTaskByID(id) {
        for(let index in Task.taskList) {
            if(Task.taskList[index].id==id) {
                return Task.taskList[index]
            }
        }
        return null 
    }

    // gets each data point and sets the task accordingly
    fromData(data) {
        this._id = data["_id"]
        this._name = data["_name"]
        this._taskType = data["_taskType"]
        this._priority = data["_priority"]
        this._description = data["_description"]
        this._status = data["_status"]
        this._tag = []
        this._assignee =data["_assignee"]
        this._storyPoint = data["_storyPoint"]
        for(let i in data["_tag"]) {
            for(let j in Tag.tagList) {
                if(Tag.tagList[j].tagName == data["_tag"][i]) {
                    this._tag.push(Tag.tagList[j].tagName)
                }
            }
        }
        this._allocatedTime = parseFloat(data["_allocatedTime"])
    }
    // task deletion! deletes itself
    delete() {
        super.delete(Task.taskList,Task)
    }
    // sets the current state of the data into the database
    // can set the index of the instance List, or can automatically find it
    toDB(index=-1) {
        super.toDB(index,Task.taskList,TASK_FOLDER)
    }
    // goes through every task and updates the database for that task
    static toDB() {
        DatabaseObj.toDB(Task.taskList,TASK_FOLDER)
    }
    // iterates through all tasks and adds them to the taskList
    static fromDB() {
        return DatabaseObj.fromDB(Task.taskList,TASK_FOLDER,() => new Task())
    }
}

class Tag extends DatabaseObj {
    static tagList = []

    constructor(tagName){
        super()
        this._tagName = tagName

        Tag.tagList.push(this)

        if(tagName!=undefined) {
            this.toDB()
        }
    }

    get tagName(){return this._tagName}
    set tagName(tagName){this._tagName = tagName;this.toDB()}


    static findByName(name) {
        for(let index in Tag.tagList) {
            if(Tag.tagList[index].tagName==name) {
                return Tag.tagList[index]
            }
        }
        return null
    }

    fromData(data){
        this._tagName = data["_tagName"]
    }
    delete() {
        super.delete(Tag.tagList,Tag)
    }
    toDB(index=-1) {
        super.toDB(index,Tag.tagList,TAG_FOLDER)
    }
    static toDB() {
        DatabaseObj.toDB(Tag.tagList,TAG_FOLDER)
    }
    static fromDB() {
        return DatabaseObj.fromDB(Tag.tagList,TAG_FOLDER,() => new Tag())
    }
    
}
// users!
class User extends DatabaseObj {
    static userList = []
    constructor(name,password) {
        super()
        this._name = name 
        this._password = password
        User.userList.push(this)
        if(name!=undefined) {
            this.toDB()
        }
    }
    get name() {return this._name}
    get password() {return this._password}

    set name(name) {this._name = name; this.toDB()}
    set password(password) {this._password = password; this.toDB()}

    static findByName(name) {
        for(let index in User.userList) {
            if(User.userList[index].name==name) {
                return User.userList[index]
            }
        }
        return null
    }

    fromData(data) {
        this._name = data["_name"]
        this._password = decrypt(data["_password"])
    }
    delete() {
        super.delete(User.userList,User)
    }
    toDB(index=-1) {
        this._password = encrypt(this._password)
        super.toDB(index,User.userList,USER_FOLDER)
        this._password = decrypt(this._password)
    }
    static toDB() {
        DatabaseObj.toDB(User.userList,USER_FOLDER)
    }
    static fromDB() {
        return DatabaseObj.fromDB(User.userList,USER_FOLDER,() => new User())
    }
}

class Sprint extends DatabaseObj {
    static sprintList = []
    constructor(name,startDate,endDate) {
        super()
        this._name = name 
        this._startDate = startDate
        this._endDate = endDate
        this._taskIDList = []
        this._status = "Not Started"
        Sprint.sprintList.push(this)
        if(name!=undefined) {
            this.toDB()
        }
    }

    get name() {return this._name}
    get startDate() {return this._startDate}
    get endDate() {return this._endDate}
    get taskIDList() {return this._taskIDList}
    get taskList() {
        let taskList = []
        for(let index in this.taskIDList) {
            taskList.push(Task.findTaskByID(this.taskIDList[index]))
        }
        return taskList
    }
    get status() {return this._status}

    set name(name) {this._name = name; this.toDB()}
    set startDate(startDate) {this._startDate = startDate; this.toDB()}
    set endDate(endDate) {this._endDate = endDate; this.toDB()}
    set taskIDList(taskIDList) {this._taskIDList = taskIDList; this.toDB()}
    set status(status) {this._status = status; this.toDB()}

    fromData(data) {
        this._name = data["_name"]
        this._startDate = data["_startDate"]
        this._endDate = data["_endDate"]
        this._taskIDList = []
        for(let index in data["_taskIDList"]) {
            this._taskIDList.push(data["_taskIDList"][index])
        }
        this._status = data["_status"]
    }
    delete() {
        super.delete(Sprint.sprintList,Sprint)
    }
    toDB(index=-1) {
        super.toDB(index,Sprint.sprintList,SPRINT_FOLDER)
    }
    static toDB() {
        DatabaseObj.toDB(Sprint.sprintList,SPRINT_FOLDER)
    }
    static fromDB() {
        return DatabaseObj.fromDB(Sprint.sprintList,SPRINT_FOLDER,() => new Sprint())
    }
}

class TeamMember extends DatabaseObj {
    static teamMemberList = []
    constructor(name,email) {
        super()
        this._name = name 
        this._email = email
        this._contributionList = []
        TeamMember.teamMemberList.push(this)
        if(name!=undefined) {
            this.toDB()
        }
    }
    get name() {return this._name}
    get email() {return this._email}
    get contributionList() {return this._contributionList}

    set name(name) {this._name = name; this.toDB()}
    set email(email) {this._email = email; this.toDB()}

    static findByName(name) {
        for(let index in TeamMember.teamMemberList) {
            if(TeamMember.teamMemberList[index].name==name) {
                return TeamMember.teamMemberList[index]
            }
        }
        return null
    }

    fromData(data) {
        this._name = data["_name"]
        this._email = data["_email"]
        this._contributionList = []
        for(let index in data["_contributionList"]) {
            this._contributionList.push({
                date: data["_contributionList"][index]["date"],
                hours: parseFloat(data["_contributionList"][index]["hours"])
            })
        }
    }
    delete() {
        super.delete(TeamMember.teamMemberList,TeamMember)
    }
    toDB(index=-1) {
        super.toDB(index,TeamMember.teamMemberList,TEAM_MEMBER_FOLDER)
    }
    static toDB() {
        DatabaseObj.toDB(TeamMember.teamMemberList,TEAM_MEMBER_FOLDER)
    }
    static fromDB() {
        return DatabaseObj.fromDB(TeamMember.teamMemberList,TEAM_MEMBER_FOLDER,() => new TeamMember())
    }
}


// functon to get the html for options for assignees
function getAssigneeOptionHtml(defaultAssignee="") {
    innerHTML = ""
    innerHTML += `<option value="None">None</option>`
    for(let index in TeamMember.teamMemberList) {
        let teamMember = TeamMember.teamMemberList[index]
        let selected = ""
        if(defaultAssignee==teamMember.name) {
            selected = "selected"
        }
        innerHTML += `<option value="${teamMember.name}" ${selected}>${teamMember.name}</option>`
        
    }
    return innerHTML
}


// function that grabs everything from the database
// in the future this could also import sprints and teams
function initFromDB() {
    initMainListener()
    return Tag.fromDB().then(() => Task.fromDB()).then(() => User.fromDB()).then(() => Sprint.fromDB()).then(() => TeamMember.fromDB())
}

