/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */

class AnswerCard {
    constructor(xmlQuestion, theQuestionBox) {
        this.element = this.setupElement(xmlQuestion)
        this.myQuestionBox = theQuestionBox
        this.setDraggable()
    }

    setupElement(xmlQuestion) {
        let element = document.createElement('div')
        let p = document.createElement('p')
        p.innerHTML = xmlQuestion.innerHTML
        element.appendChild(p)
        return element
    }

    setDraggable() {
        $(this.element).draggable({
            containment: 'body',
            revert: true
        })
    }
}
