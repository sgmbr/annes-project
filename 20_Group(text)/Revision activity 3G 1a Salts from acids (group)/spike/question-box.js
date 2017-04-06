/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */

class QuestionBox {
    constructor(xmlBox, theQuiz) {
        this.element = this.setup(xmlBox)
        this.theQuiz = theQuiz
        this.allMyAnserCards = []
        this.setDroppable()
    }

    setup(xmlBox) {
        let element = document.createElement('div')
        let p = document.createElement('p')
        p.innerHTML = xmlBox.innerHTML
        element.appendChild(p)
        return element
    }

    addAnswerCard(xmlQuestion) {
        let newAnswerCard = new AnswerCard(xmlQuestion, this)
        this.allMyAnserCards.push(newAnswerCard)
    }

    setDroppable() {
        $(this.element).droppable({
            accept: '#ans div',
            hoverClass: 'hovered',
            // Defining a function for drop and point it like following doesn't work.
            // Then 'this' is a box DOM object, not the QuestionBox
            // drop: handleCardDrop
            drop: (event, ui) => {
                let answerInnerHTML = this.allMyAnserCards.map(answerCard => answerCard.element.innerHTML)
                let draggableInnerHTML = ui.draggable[0].innerHTML
                if (answerInnerHTML.includes(draggableInnerHTML)) {
                    console.log('correct')
                    this.theQuiz.correct++
                    ui.draggable.draggable('disable')
                    ui.draggable.draggable('option', 'revert', false)
                } else {
                    console.log('incorrect')
                    this.theQuiz.incorrect++
                }
            }
        })
    }

}
