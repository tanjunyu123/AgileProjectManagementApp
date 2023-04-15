
class Task
{
    // constructor
    constructor(taskName="",priority,taskType)
    {
        this._taskName = taskName;
        this._priority = priority;
        this._taskType = taskType;
        this._taskDescription ="";
        this._assignee = null;
    }

    //accessors
    get taskName()
    {
        return this._taskName;
    }
    get priority()
    {
        return this._priority;
    }
    get taskType()
    {
        return this._taskType;
    }


   
    
}






