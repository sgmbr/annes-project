/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */

class QuestionBox {
    constructor(xmlBox, theQuiz) {
        this.element = this.setupElement(xmlBox)
        this.theQuiz = theQuiz
        this.allMyAnserCards = []
        this.setDroppable()
    }

    setupElement(xmlBox) {
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
            // In that case, 'this' is a box DOM object, not the QuestionBox
            // drop: handleCardDrop
            drop: (event, ui) => {
                let answerInnerHTMLs = this.allMyAnserCards.map(answerCard => answerCard.element.innerHTML)
                let draggableInnerHTML = ui.draggable[0].innerHTML
                if (answerInnerHTMLs.includes(draggableInnerHTML)) {
                    //this.theQuiz.correct++
                    let answerCard = this.theQuiz.getAnswerCardFromInnerHTML(draggableInnerHTML)
                    this.theQuiz.score += answerCard.score

                    ui.draggable.draggable('disable')
                    ui.draggable.draggable('option', 'revert', false)
                } else {
                    //this.theQuiz.incorrect++
                    let answerCard = this.theQuiz.getAnswerCardFromInnerHTML(draggableInnerHTML)
                    answerCard.reduceScore()
                }
            }
        })
    }

}
