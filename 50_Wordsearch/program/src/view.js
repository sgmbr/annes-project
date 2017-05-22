/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */

class View {
    static setUp() {
        View.setUpSubmitBtn('btn-submit')
        View.setUpTryAgainBtn('btn-try-again')
    }

    static fireCustomEvent(eventName) {
        let eventInput = new Event(eventName)
        window.dispatchEvent(eventInput)
    }

    static setUpSubmitBtn(tagId) {
        document.getElementById(tagId).onclick = function(event) {
            View.fireCustomEvent('submitEvent')
        }
    }

    static setUpTryAgainBtn(tagId) {
        document.getElementById(tagId).onclick = function(event) {
            View.fireCustomEvent('tryAgainEvent')
        }
    }

    // helper method to create question and answer element
    static createDivElement(str) {
        let div = document.createElement('div')
        let p = document.createElement('p')
        p.innerHTML = str
        div.appendChild(p)
        return div
    }

    static createQuestionBoxElement(str) {
        let boxContainer = document.getElementById('boxes')
        let box = View.createDivElement(str)
        box.classList.add('question-box')
        boxContainer.appendChild(box)

        $(box).droppable({
            accept: '.answer-card',
            hoverClass: 'hovered',
            drop: (event, ui) => {
                // use CustomEvent to pass data.
                let eventInput = new CustomEvent('dropEvent', {
                    'detail': {
                        'question': str,
                        'answer': ui.draggable[0].children[0].innerHTML
                    }
                })
                window.dispatchEvent(eventInput)
            }
        })
    }

    static createAnswerCardElement(str) {
        let answerContainer = document.getElementById('answers')
        let answerCard = View.createDivElement(str)
        answerCard.classList.add('answer-card')
        answerContainer.appendChild(answerCard)

        $(answerCard).draggable({
            containment: 'body',
            revert: true
        })
    }

    // for shuffling question boxes and answer cards
    static shuffleContents(tagId) {
        let target = document.getElementById(tagId)
        let divs = target.getElementsByTagName('div')
        for (let i = 0; i < divs.length; i++) {
            let randomDivNumber = Math.floor(Math.random() * divs.length)
            target.appendChild(Array.from(divs).splice(randomDivNumber, 1)[0])
        }
    }

    // find a question box or answer card of specific strings
    static findDiv(tagId, str) {
        let divs = document.getElementById(tagId).getElementsByTagName('div')
        let foundDiv = Array.from(divs).find(div => {
            let divContent = div.children[0].innerHTML
            if (divContent == str) {
                return div
            }
        })
        return foundDiv
    }

    static moveAnswerCardToBox(answer, question) {
        let answerDiv = View.findDiv('answers', answer)
        let questionDiv = View.findDiv('boxes', question)
        questionDiv.appendChild(answerDiv)
        // resize iframe to fit height after possible expansion of question box
        View.fireCustomEvent('resizeIframeEvent')
    }

    static removeDraggable(answer) {
        let answerDiv = View.findDiv('answers', answer)
        // setting revertDuration to 0 makes it look like snapping into a box
        // revert is necessary because otherwise it keeps relative position
        $(answerDiv).draggable('option', 'revertDuration', 0)
        $(answerDiv).draggable('disable')
    }

    static removeDraggableAll() {
        let divs = document.getElementById('answers').getElementsByTagName('div')
        Array.from(divs).forEach(div => {
            $(div).draggable('disable')
        })
    }

    static updateCurrentScore(score) {
        let currentScoreElement = document.getElementById('current-score')
        currentScoreElement.innerHTML = score
    }

    static sendScoreToMoodle(score) {
        let form = window.parent.document.getElementById("store")
        form.mark.value = score
        //form.submit() //commented out because it refreshes page
    }

    static displayResult(score, passingScore) {
        let scoreElement = document.getElementById('score')
        scoreElement.innerHTML = score

        let passingScoreElement = document.getElementById('passing-score')
        passingScoreElement.innerHTML = passingScore

        let finalMessage = document.getElementById('final-message')
        if (score >= passingScore) {
            finalMessage.innerHTML = 'Well done! A great result!'
        } else {
            finalMessage.innerHTML = 'Sorry you failed this time, but try again!'
        }

        let resultElement = document.getElementById('result')
        resultElement.style.display = 'block'
    }
}
