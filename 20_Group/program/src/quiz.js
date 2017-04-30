/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */

class Quiz {
    constructor(xml) {
        this.xml = xml
        this._score = 0
        this.allMyQuestions = []

        this.setup()
    }

    createElements() {
        let sets = this.xml.getElementsByTagName('set')
        Array.from(sets).forEach( aSet => {
            // Create box elements
            let xmlBox = aSet.getElementsByTagName('box')[0]
            let newQuestionBox = new QuestionBox(xmlBox, this)
            this.allMyQuestions.push(newQuestionBox)

            // Create answer card elements
            let xmlQuestions = aSet.getElementsByTagName('question')
            Array.from(xmlQuestions).forEach( xmlQuestion => {
                newQuestionBox.addAnswerCard(xmlQuestion)
            })
        })
    }

    setupHTML() {
        let box = document.getElementById('box')
        let answers = document.getElementById('ans')

        for (let aQuestion of this.allMyQuestions) {
            box.appendChild(aQuestion.element)

            for(let anAnswerCard of aQuestion.allMyAnserCards) {
                answers.appendChild(anAnswerCard.element)
            }
        }
    }

    forAllAnswerCards(callback) {
        this.allMyQuestions.forEach(question => {
            question.allMyAnserCards.forEach(answerCard => {
                callback(answerCard)
            })
        })
    }

    setupAnswerScore() {
        let answerWeight = 100 / this.numberOfAnswers
        let incorrectWeight = answerWeight * (1 / (this.numberOfBoxes - 1))

        this.forAllAnswerCards((answerCard) => {
            answerCard.setupScore(answerWeight, incorrectWeight)
        })
    }

    shuffleAnswers() {
        let answerDiv = document.getElementById('ans')
        let divs = answerDiv.getElementsByTagName('div')
        for (let i = 0; i < divs.length; i++) {
            let randomDivNumber = Math.floor(Math.random() * divs.length)
            answerDiv.appendChild(Array.from(divs).splice(randomDivNumber, 1)[0])
        }
    }

    setup() {
        this.createElements()
        this.setupHTML()
        this.setupAnswerScore()
        this.shuffleAnswers()
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
    }

    get numberOfBoxes() {
        return this.allMyQuestions.length
    }

    get numberOfAnswers() {
        return this.allMyQuestions.reduce((acc, cur) => acc + cur.allMyAnserCards.length, 0)
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