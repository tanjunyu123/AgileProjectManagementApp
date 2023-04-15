
// class that provides setters and getters for the coordinates of an element
// along with an element's width and height
class CoordObject {
    // pass in the ID of the element to modify the coordinates of
    constructor(id) {
        this.id = id
    }
    // for some reason there's a difference between two ways of getting the x and y coordinates
    // these two functions are intended to account for this by subtracting them
    bodyOffsetX() {
        return ((this.element.getBoundingClientRect().left - parseInt(this.element.style.left.replace("px",""))) || 0)
    }
    bodyOffsetY() {
        return ((this.element.getBoundingClientRect().top - parseInt(this.element.style.top.replace("px",""))) || 0)
    }
    // getters
    get element() {return document.getElementById(this.id)} // directly setting a variable as the element doesn't work unfortunately
    get x1() {return this.element.getBoundingClientRect().left}
    get y1() {return this.element.getBoundingClientRect().top}
    get x2() {return this.x1 + this.width}
    get y2() {return this.y1 + this.height}
    get x() {return this.x1 + this.width/2}
    get y() {return this.y1 + this.height/2}
    get width() {return this.element.offsetWidth}
    get height() {return this.element.offsetHeight}

    // setters 
    set x1(x1) {this.element.style.left = `${x1 - this.bodyOffsetX()}px`} // sets x1 and automatically moves x2 accordinly
    set y1(y1) {this.element.style.top = `${y1 - this.bodyOffsetY()}px`} // sets y1 and automatically moves y2 accordingly
    set x2(x2) {this.x1 = x2 - this.width} // sets x2 by setting x1
    set y2(y2) {this.y1 = y2 - this.height} // sets y2 by setting y1
    set x(x) {this.x1 = x - this.width/2} // sets x by setting x1
    set y(y) {this.y1 = y - this.height/2} // sets y by setting y1
    set width(width) {this.element.style.width = `${width}px`;} // sets width and automatically moves x2 accordingly
    set height(height) {this.element.style.height = `${height}px`;} // sets height and automatically moves y2 accordingly
}

// class that creates an invisible box
// could be useful idk; it's currently used for creating space below CardColumn
class AbsoluteAnchor extends CoordObject {
    constructor(ref,id,x,y) {
        super(id)
        ref.innerHTML += `
            <div style="position:absolute;" id=${id}></div>
        `
        this.x = x 
        this.y = y
        this.height = 10 
        this.width = 10
    }

}

// box with a centered text within it
class LabelBox extends CoordObject {
    // ----- constructor with inputs -----
    // ref = reference to the element to insert the box into
    // id = the id that the box should have
    // x1, y1, width, height = position and size of the box
    // text = text to put into the box
    // colour = colour of the box
    // relativePos = if true use relative positioning, otherwise use absolute positioning
    constructor(ref,id,x1,y1,width,height,text,colour="#FFFFFF",relativePos=false) {
        super(id)
        // should the position be absolute or relative?
        let position = "absolute"
        if(relativePos) {position = "relative"}
        // add innerHTML
        ref.innerHTML += `
        <div class="mdl-card mdl-shadow--2dp" style="position:${position}; min-height: 0px; background-color:${colour}" id="${id}">
                <div class="mdl-card__title" style = "white-space: nowrap; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                    <h3 class="mdl-card__title-text">${text}</h3>
                </div>
        </div>
        `
        // set position and size
        this.x1 = x1; this.y1 = y1; 
        this.width = width; this.height = height;
    }
}

// card with information that can be dragged between card columns
class Card extends CoordObject {
    // static list to store all card instances
    static cardList = []
    // the card that is being dragged if any
    static selectedCard = null
    // ----- constructor with inputs -----
    // ref = reference to the element to insert the card into
    // cardColumn = the card column to insert the card into
    // id = the id that the card should have
    // innerHTML = html representing the information to display in the card
    // width = the width of the card
    constructor(ref,cardColumn,id,innerHTML,width) {
        super(id)
        // add instance
        Card.cardList.push(this)
        // create html object
        ref.innerHTML += `
        <div class="mdl-card mdl-shadow--2dp" style="position:absolute; min-height: 0px;" id="${id}">
            ${innerHTML}
        </div>
        `
        // set width and add to card column
        this.x1 = 0; this.y1 = 0; this.width = width;
        cardColumn.addCard(this)

        // when the card is being dragged these store the position of the card relative to the cursor
        this.offsetX = 0; this.offsetY = 0

        // if the card is dragged to somewhere without a card column
        // they will be returned to this column at this index
        this.previousCardColumn = null 
        this.previousCardColumnIndex = null
    }
    getCurrentCardColumn() {
        // loop through card columns
        for(let index in CardColumn.cardColumnList) {
            let cardColumn = CardColumn.cardColumnList[index]
            // return if card column has this card
            if(cardColumn.cards.includes(this)) {
                return cardColumn
            }
        }
        // if no card columns contain the card, return null
        return null
    }

    cardOnMouseDown(e) {
        // set selected card
        Card.selectedCard = this 
        // get mouse position
        let mousePosX = getMousePosX(e); let mousePosY = getMousePosY(e);
        // find difference between card and mouse position and set to offset
        this.offsetX = this.x1 - mousePosX 
        this.offsetY = this.y1 - mousePosY
        // get card column that this card is in
        let cardColumn = this.getCurrentCardColumn()
        if(cardColumn!=null) {
            // store previous position and remove the card
            this.previousCardColumn = cardColumn 
            this.previousCardColumnIndex = cardColumn.cards.findIndex((item) => item==this)
            cardColumn.removeCard(this)
        }

        
    }
    cardOnMouseMove(e) {
        // set card position relative to the mouse
        let mousePosX = getMousePosX(e); let mousePosY = getMousePosY(e);
        this.x1 = mousePosX + this.offsetX
        this.y1 = mousePosY + this.offsetY
    }
    cardOnMouseUp(e) {
        // get mouse position
        let mousePosX = getMousePosX(e); let mousePosY = getMousePosY(e);
        // unset selected card
        Card.selectedCard = null
        // find if the card can go into any card column
        let foundColumn = false
        for(let index in CardColumn.cardColumnList) {
            let cardColumn = CardColumn.cardColumnList[index]
            // is the mouse within the card column?
            if(pointIntersects(mousePosX,mousePosY,cardColumn)) {
                // insert into card column
                cardColumn.insertCardByMousePos(this,mousePosY)
                foundColumn = true
                break
            }
        }
        // no card column found? then move the card back into its starting position
        if(!foundColumn) {
            this.previousCardColumn.insertCardByIndex(this,this.previousCardColumnIndex)
        }
        // reset to null
        this.previousCardColumn = null 
        this.previousCardColumnIndex = null
    }
}

class CardColumn extends CoordObject {
    // how many pixels of empty space should be between cards
    static SPACING_PER_CARD = 20
    // ensures that the card column doesn't just disappear if there are no cards in ot
    static MINIMUM_HEIGHT = 300
    // vertical displacement of an invisible box so that there's some empty space below the card column
    static ANCHOR_PADDING = 200
    // static list of all card column instances
    static cardColumnList = []
    // ----- constructor with inputs -----
    // ref = reference to the element to insert the card column into
    // id = the id that the card column should have
    // x1, y1, width = position and size of cardColumn
    // relativePos = if true use relative positioning, otherwise use absolute positioning
    constructor(ref,id,x1,y1,width,relativePos=false) {
        super(id)
        // add to list of instances
        CardColumn.cardColumnList.push(this)
        // list of cards within the column
        this.cards = []
        // sets whether to use absolute or relative positions
        let position = "absolute"
        if(relativePos) {position = "relative"}
        // add element to reference
        ref.innerHTML += `
            <div class="mdl-shadow--2dp" style="position:${position};" id="${id}">
            </div>
            `
        // set size and position
        this.x1 = x1; this.y1 = y1; 
        this.width = width; this.height = 200

        // create anchor
        this.anchor = new AbsoluteAnchor(ref,`${id}Anchor`,this.x,this.y2+CardColumn.ANCHOR_PADDING)

        // when the card is being dragged, these variables store the index that the card would go into
        // if the card is to be inserted into the column
        // the previousVacantIndex helps show when the index changes so that the UI can be changed accordingly
        this.vacantIndex = null; this.previousVacantIndex = null;

    }
    addCard(card) {
        this.cards.push(card)
        this.updateUI()
    }
    insertCardByIndex(card,index) {
        this.cards.splice(index,0,card) 
        this.updateUI()
    }
    getInsertIndex(mousePosY) {
        // default index is at the end of the list
        let insertIndex = this.cards.length
        // loop through y positions until the right index is found
        let currentY = this.y1 + CardColumn.SPACING_PER_CARD
        for(let index in this.cards) {
            let iterCard = this.cards[index]
            // check if the mouse position is less than the halfway position of the card
            currentY += iterCard.height/2
            currentY += CardColumn.SPACING_PER_CARD
            if(mousePosY<currentY) {
                // if so quit loop
                insertIndex = index
                break
            }
            currentY += iterCard.height/2
        }
        return insertIndex
    }
    insertCardByMousePos(card,mousePosY) {
        this.insertCardByIndex(card,this.getInsertIndex(mousePosY))
    }
    removeCard(card) {
        // get card index and remove from array
        let index = this.cards.indexOf(card)
        if(index!=-1) {
            this.cards.splice(index,1)
        }
        this.updateUI()
    }
    updateVacancy(e) {
        // get mouse position
        let mousePosX = getMousePosX(e); let mousePosY = getMousePosY(e);
        // if the mouse intersects set vacantIndex accordingly, else set it to null
        if(pointIntersects(mousePosX,mousePosY,this)) {
            this.vacantIndex = this.getInsertIndex(mousePosY)
        }
        else {
            this.vacantIndex = null 
        }
        // if the vacant index changes
        if(this.vacantIndex!=this.previousVacantIndex) {
            // equalize previous and current index
            this.previousVacantIndex = this.vacantIndex
            // update accordingly
            if(Card.selectedCard!=null) {
                this.updateUI(Card.selectedCard.height)
            }
            else {
                this.updateUI()
            }
            
        }
    }
    updateUI(vacantHeight=0) {
        // starting position
        let currentY = this.y1 + CardColumn.SPACING_PER_CARD
        // loop through cards
        for(let index in this.cards) {
            // if the vacant index is reached create an empty space to fit the dragged card
            if(index==this.vacantIndex) {
                currentY += vacantHeight
                currentY += CardColumn.SPACING_PER_CARD
            }
            // set position of card
            let card = this.cards[index]
            card.x = this.x 
            card.y1 = currentY
            currentY += card.height 
            currentY += CardColumn.SPACING_PER_CARD
        }
        // if the vacant index is at the end of the list create an empty space to fit the dragged card
        if(this.cards.length==this.vacantIndex) {
            currentY += vacantHeight
            currentY += CardColumn.SPACING_PER_CARD
        }
        // set heigh and anchor position
        this.height = Math.max(CardColumn.MINIMUM_HEIGHT,currentY) - this.y1
        this.anchor.y = this.y2+CardColumn.ANCHOR_PADDING
    }
}

function getMousePosX(e) {
    return e.clientX
}
function getMousePosY(e) {
    return e.clientY
}

function pointIntersects(x,y,obj) {
    if(x>=obj.x1 && y>=obj.y1 && x<=obj.x2 && y<=obj.y2) {
        return true 
    }
    else {
        return false
    }
}
function findIntersecting(x,y,objList) {
    // loop through objects
    for(let index in objList) {
        // if object intersects coords, return object
        if(pointIntersects(x,y,objList[index])) {
            return objList[index]
        }
    }
    return null
}

function onMouseDown(e) {
    // only run if nothing is selected
    if(Card.selectedCard==null) {
        // get mouse position
        let mousePosX = getMousePosX(e); let mousePosY = getMousePosY(e);
        // start dragging card if a card is selected
        let card = findIntersecting(mousePosX,mousePosY,Card.cardList)
        if(card!=null) {
            card.cardOnMouseDown(e)
        }
    }
}

function onMouseMove(e) {
    // if a card is selected
    if(Card.selectedCard!=null) {
        // move card
        Card.selectedCard.cardOnMouseMove(e);
        
        // update card columns to account for movement
        for(let index in CardColumn.cardColumnList) {
            CardColumn.cardColumnList[index].updateVacancy(e)
        }
    }
    // get mouse position
    let mousePosX = getMousePosX(e); let mousePosY = getMousePosY(e);
    // if the mouse is hovering over a card, set the cursor accordingly
    if(findIntersecting(mousePosX,mousePosY,Card.cardList)) {
        document.body.style.cursor = "move"
    }
    else {
        document.body.style.cursor = "auto"
    }
}
  
function onMouseUp(e) {
    // release card
    if(Card.selectedCard!=null) {
        Card.selectedCard.cardOnMouseUp(e);
    }
}

function onResize() {
    // update cards within card columns whenever the screen is resized
    for(let index in CardColumn.cardColumnList) {
        CardColumn.cardColumnList[index].updateUI()
    }
}

// set event listeners // UNCOMMENT THESE TO RESTORE CARD FUNCTIONALITY
// document.onmousedown = onMouseDown;
// document.onmousemove = onMouseMove;
// document.onmouseup = onMouseUp;
window.onresize = onResize;