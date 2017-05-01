/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */

class AnswerCard {
    constructor(xmlQuestion, theQuestionBox) {
        this.element = this.setupElement(xmlQuestion)
        this.score = 0
        this.incorrectWeight = 0
        this.myQuestionBox = theQuestionBox
        this.setDraggable()
    }

    setupElement(xmlQuestion) {
        let element = document.createElement('div')
        let p = document.createElement('p')
        p.innerHTML = xmlQuestion.innerHTML
        element.appendChild(p)
        element.classList.add('answer-card')
        return element
    }

    setupScore(answerWeight, incorrectWeight) {
        this.score = answerWeight
        this.incorrectWeight = incorrectWeight
    }

    reduceScore() {
        this.score -= this.incorrectWeight
        this.score = (this.score < 0) ? 0 : this.score
    }

    addScoreToQuiz() {
        this.myQuestionBox.theQuiz.score += this.score
    }

    setDraggable() {
        $(this.element).draggable({
            containment: 'body',
            revert: true
        })
    }

    removeDraggable() {
        // setting revertDuration to 0 makes it look like snapping into a box
        // revert is necessary because otherwise it keeps relative position
        $(this.element).draggable('option', 'revertDuration', 0)
        $(this.element).draggable('disable')
    }
}
