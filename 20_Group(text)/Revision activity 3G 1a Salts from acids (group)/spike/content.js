/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */

class QuestionBox {
    constructor(xmlBox) {
        this.element = this.setup(xmlBox)
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
            // Then 'this' becomes the box DOM object, not the QuestionBox
            // drop: handleCardDrop
            drop: (event, ui) => {
                let answerInnerHTML = this.allMyAnserCards.map(answerCard => answerCard.element.innerHTML)
                let draggableInnerHTML = ui.draggable[0].innerHTML
                if (answerInnerHTML.includes(draggableInnerHTML)) {
                    console.log('correct')
                    ui.draggable.draggable('disable')
                    ui.draggable.draggable('option', 'revert', false)
                } else {
                    console.log('incorrect')
                }
            }
        })
    }

    setUpHTML() {
        let box = document.querySelector('#box')
        box.appendChild(this.element)

        let answers = document.querySelector('#ans')
        for(let answerCard of this.allMyAnserCards) {
            answers.appendChild(answerCard.element)
        }
    }
}

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

/*
var description = []
var answers = []
var qno = 0
var ano = 0
var incorrect = 0
*/

class Quiz {
    constructor(xml) {
        this.allMyQuestions = []
    }

    shuffleAnswers() {}

    setup() {}
}

function shuffleAnswers() {
    let answerDiv = document.querySelector('#ans')
    let divs = answerDiv.getElementsByTagName('div')
    console.log(divs);
    for (let i = 0; i < divs.length; i++) {
        let randomDivNumber = Math.floor(Math.random() * divs.length)
        answerDiv.append(Array.from(divs).splice(randomDivNumber, 1)[0])
    }
}

window.onload = function() {
    let request = new XMLHttpRequest()
    request.open('GET', 'store.xml', true)

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            // success
            let xml = request.responseXML
            let sets = xml.getElementsByTagName('set')
            Array.from(sets).forEach( aSet => {
                // Create box elements
                let xmlBox = aSet.getElementsByTagName('box')[0]
                let newQuestionBox = new QuestionBox(xmlBox)

                // Create answer cards elements
                let xmlQuestions = aSet.getElementsByTagName('question')
                Array.from(xmlQuestions).forEach( xmlQuestion => {
                    newQuestionBox.addAnswerCard(xmlQuestion)
                })

                newQuestionBox.setUpHTML()
            })
            shuffleAnswers()
        } else {
            // reached target server, but it returned an error
        }
    }
    request.onerror = function() {
        // There was a connection erro of some sort
    }

    request.send()
}
