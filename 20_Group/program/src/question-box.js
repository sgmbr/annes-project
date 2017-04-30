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
        element.classList.add('question-box')
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
            // Defining a function outside doesn't work.
            // In that case, 'this' is a box DOM object, not the QuestionBox
            // drop: handleCardDrop
            drop: (event, ui) => {
                let answerInnerHTMLs = this.allMyAnserCards.map(answerCard => answerCard.element.innerHTML)
                let draggableInnerHTML = ui.draggable[0].innerHTML
                let answerCard = this.theQuiz.getAnswerCardFromInnerHTML(draggableInnerHTML)
                if (answerInnerHTMLs.includes(draggableInnerHTML)) {
                    // correct answer
                    answerCard.addScoreToQuiz()
                    answerCard.removeDraggable()
                    this.theQuiz.moveAnswerCardToBox(answerCard, this)
                } else {
                    // wrong answer
                    answerCard.reduceScore()
                }
            }
        })
    }

}
