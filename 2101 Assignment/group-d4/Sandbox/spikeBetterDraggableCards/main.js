
class TaskCard extends Card {
    constructor(ref,cardColumn,id,title,description,width) {
        // information!
        let innerHTML = 
            `
            <div class="mdl-card__title">
                <h3 class="mdl-card__title-text">${title}</h3>
            </div>
            <div class="mdl-card__supporting-text">
                ${description}
            </div>
            `
        super(ref,cardColumn,id,innerHTML,width)
    }
}

// ref to insert card
cardSectionRef = document.getElementById("cardSection")

// ref to insert card columns
columnDivRef1 = document.getElementById("columnDiv1")
columnDivRef2 = document.getElementById("columnDiv2")
columnDivRef3 = document.getElementById("columnDiv3")

// labels for columns
new LabelBox(columnDivRef1,"labelBox1",0,0,250,100,"Not Started","#EEDDDD",true)
new LabelBox(columnDivRef2,"labelBox2",0,0,250,100,"In Progress","#EEEEDD",true)
new LabelBox(columnDivRef3,"labelBox3",0,0,250,100,"Completed","#DDEEDD",true)

// columns
column1 = new CardColumn(columnDivRef1,"column1",0,0,250,true)
column2 = new CardColumn(columnDivRef2,"column2",0,0,250,true)
column3 = new CardColumn(columnDivRef3,"column3",0,0,250,true)

// cards
card1 = new TaskCard(cardSectionRef,column1,"card1","A Cool Task","A Cool Description",200)
card2 = new TaskCard(cardSectionRef,column1,"card2","A Cooler Task","A Cooler Description",200)
card3 = new TaskCard(cardSectionRef,column1,"card3","A Narrow Task","Not exactly the most narrow of Descriptions",120)
card4 = new TaskCard(cardSectionRef,column2,"card4","A Neighbouring Task","A Neighbouring Description",200)
card5 = new TaskCard(cardSectionRef,column1,"card5","Task","Task",200)