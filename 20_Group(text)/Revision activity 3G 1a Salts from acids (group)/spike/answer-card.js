/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */

class AnswerCard {
    constructor(xmlQuestion, theQuestionBox) {
        this.element = this.setup(xmlQuestion)
        this.myQuestionBox = theQuestionBox
        this.setDraggable()
    }

    setup(xmlQuestion) {
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
