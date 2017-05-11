/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */

class Quiz {
    constructor(xml) {
        this.xml = xml
        this._score = 0
        this.allMyQuestions = []

        this.setUp()
    }

    createQuizObjects() {
        let groups = this.xml.getElementsByTagName('set')
        Array.from(groups).forEach( aGroup => {
            // Create box objects
            let xmlBox = aGroup.getElementsByTagName('box')[0]
            let newQuestionBox = new QuestionBox(xmlBox, this)
            this.allMyQuestions.push(newQuestionBox)

            // Create answer card objects
            let xmlQuestions = aGroup.getElementsByTagName('question')
            Array.from(xmlQuestions).forEach( xmlQuestion => {
                newQuestionBox.addAnswerCard(xmlQuestion)
            })
        })
    }

    setUpHTML() {
        let box = document.getElementById('box')
        let answers = document.getElementById('ans')

        for (let aQuestion of this.allMyQuestions) {
            box.appendChild(aQuestion.element)

            for(let anAnswerCard of aQuestion.allMyAnswerCards) {
                answers.appendChild(anAnswerCard.element)
            }
        }
    }

    forAllAnswerCards(callback) {
        this.allMyQuestions.forEach(question => {
            question.allMyAnswerCards.forEach(answerCard => {
                callback(answerCard)
            })
        })
    }

    setUpAnswerScore() {
        let answerWeight = 100 / this.getNumberOfAnswers()
        let incorrectWeight = answerWeight * (1 / (this.getNumberOfBoxes() - 1))

        this.forAllAnswerCards((answerCard) => {
            answerCard.setUpScore(answerWeight, incorrectWeight)
        })
    }

    shuffleContents(targetId) {
        let target = document.getElementById(targetId)
        let divs = target.getElementsByTagName('div')
        for (let i = 0; i < divs.length; i++) {
            let randomDivNumber = Math.floor(Math.random() * divs.length)
            target.appendChild(Array.from(divs).splice(randomDivNumber, 1)[0])
        }
    }

    setUp() {
        this.createQuizObjects()
        this.setUpHTML()
        this.setUpAnswerScore()
        this.shuffleContents('box')
        this.shuffleContents('ans')
    }

    getAnswerCardFromInnerHTML(innerHTML) {
        let result
        this.forAllAnswerCards((answerCard) => {
            if (answerCard.element.innerHTML == innerHTML) {
                result = answerCard
            }
        })
        return result
    }

    moveAnswerCardToBox(answerCard, questionBox) {
        questionBox.element.appendChild(answerCard.element)
        let eventInput = new Event('resizeIframeEvent')
        window.dispatchEvent(eventInput)
    }

    getNumberOfBoxes() {
        return this.allMyQuestions.length
    }

    getNumberOfAnswers() {
        return this.allMyQuestions.reduce((acc, cur) => acc + cur.allMyAnswerCards.length, 0)
    }

    set score(newScore) {
        this._score = newScore
        let eventInput = new Event('scoreUpdateEvent')
        window.dispatchEvent(eventInput)
    }

    get score() {
        return this._score
    }

    getPassingScore() {
        let xmlPassingScore = this.xml.getElementsByTagName('passing-score')[0]
        let passingScore = Number(xmlPassingScore.innerHTML)
        return passingScore
    }

    finish() {
        this.forAllAnswerCards((answerCard) => {
            answerCard.removeDraggable()
        })
    }

}
