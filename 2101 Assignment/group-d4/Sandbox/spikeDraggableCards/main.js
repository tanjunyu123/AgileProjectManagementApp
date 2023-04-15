


class Card {
  static selectedCard = null;
  constructor(id) {
    // set variables
    this.offsetX = 0; this.offsetY = 0;
    this.id = id;
    this.cardColumn = null;
    // get the html element from the html file
    this.element = document.getElementById(id);
    // set the method to run when the the card is clicked
    this.element.onmousedown = (e) => {Card.dragMouseDown(this,e)};
    let rect = this.element.getBoundingClientRect();
    this.element.style.left = rect.left;
    this.element.style.top = rect.top;
  }
  static dragMouseDown(card,e) {
    // set offset based on the mouse position relative to the current card position
    card.offsetX = parseInt(card.element.style.left.replace("px","")) - e.clientX; 
    card.offsetY = parseInt(card.element.style.top.replace("px","")) - e.clientY;
    // set the select card to this card
    Card.selectedCard = card;
    // free card from card column, if any
    if(card.cardColumn!=null) {
      card.cardColumn.removeCard(card);
    }
  }
  static elementDrag(e) {
    // if there is no selected card, quit
    let card = Card.selectedCard
    if(card==null) return;
    // otherwise move the card
    card.element.style.left =  e.clientX + card.offsetX + "px";
    card.element.style.top = e.clientY + card.offsetY + "px";
  }
  static closeDragElement() {

    // if there is no selected card, quit
    let card = Card.selectedCard;
    if(card==null) return;
    // get the midpoint x and y of the card
    let x = parseInt(card.element.style.left.replace("px","")) + card.element.offsetWidth/2;
    let y = parseInt(card.element.style.top.replace("px","")) + card.element.offsetHeight/2;
    
    // loop through cardColumnList
    for(let i=0;i<CardColumn.cardColumnList.length;i++) {
      let cardColumn = CardColumn.cardColumnList[i]
      // if the card is in the cardColumn, add it to the cardColumn
      if(x>=cardColumn.x1 && x<=cardColumn.x2 && y>=cardColumn.y1 && y<=cardColumn.y2) {
        cardColumn.addCard(card);
        break;
      }
    }
    // stop moving the card
    Card.selectedCard = null;
  }
}

class CardColumn {
  static cardColumnList = [] // global list of all card columns
  constructor(id) {
    CardColumn.cardColumnList.push(this)
    this.cards = []
    this.element = document.getElementById(id)
    // get x and y position of element
    let rect = this.element.getBoundingClientRect();
    this.x1 = rect.left
    this.y1 = rect.top
    this.x2 = rect.right
    this.y2 = rect.bottom
  }
  addCard(card) {
    // add to list
    this.cards.push(card)
    // set card's card column
    card.cardColumn = this
    this.calculateCardPositions()
  }
  calculateCardPositions() {
    let currentY = this.y1
    // loop through each card
    for(let i=0;i<this.cards.length;i++) {
      let card = this.cards[i]
      let cardHeight = card.element.offsetHeight
      // place card at currentY
      card.element.style.left = this.x1 + "px";
      card.element.style.top = currentY + "px";
      // increment currentY by card height (to ensure that the next card is directly under the current card)
      currentY += cardHeight
    }
  }
  removeCard(card) {
    // get card index and remove from array
    let index = this.cards.indexOf(card)
    if(index!=-1) {
      this.cards.splice(index,1)
    }
    // reset card's card column
    card.cardColumn = null
    this.calculateCardPositions()
  }
}

function onMouseMove(e) {
  Card.elementDrag(e);
}

function onMouseUp(e) {
  Card.closeDragElement();
}

// code that runs after the html file is loaded
window.onload = function() {
  // listeners when the mouse moves and is lifted up
  document.onmousemove = onMouseMove;
  document.onmouseup = onMouseUp;

  // cards
  let crd = new Card("card")
  let crd2 = new Card("card2")
  let crd3 = new Card("card3")

  // columns
  let col = new CardColumn("column")
  let col2 = new CardColumn("column2")
  let col3 = new CardColumn("column3")

  // add cards to the first column
  col.addCard(crd)
  col.addCard(crd2)
  col.addCard(crd3)
}