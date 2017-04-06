/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */

class Quiz {
    constructor(xml) {
        this.xml = xml
        this.correct = 0
        this.incorrect = 0
        this.allMyQuestions = []
    }

    get numberOfBoxes() {
        return this.allMyQuestions.length
    }

    get numberOfAnswers() {
        return this.allMyQuestions.reduce((a, b) => a.allMyAnserCards.length + b.allMyAnserCards.length)
    }

    getScore() {
        let answerWeight = 100 / this.numberOfAnswers
        let incorrectWeight = answerWeight * (1 / (this.numberOfBoxes - 1))
        let score = this.correct * answerWeight - this.incorrect * incorrectWeight
        score = Math.floor(score)
        if (score < 0) score = 0
        return score
    }

    setup() {
        let sets = this.xml.getElementsByTagName('set')
        Array.from(sets).forEach( aSet => {
            // Create box elements
            let xmlBox = aSet.getElementsByTagName('box')[0]
            let newQuestionBox = new QuestionBox(xmlBox, this)
            this.allMyQuestions.push(newQuestionBox)

            // Create answer cards elements
            let xmlQuestions = aSet.getElementsByTagName('question')
            Array.from(xmlQuestions).forEach( xmlQuestion => {
                newQuestionBox.addAnswerCard(xmlQuestion)
            })

        })
        this.setupHTML()
        this.shuffleAnswers()
    }

    setupHTML() {
        let box = document.querySelector('#box')
        let answers = document.querySelector('#ans')

        for (let aQuestion of this.allMyQuestions) {
            box.appendChild(aQuestion.element)

            for(let anAnswerCard of aQuestion.allMyAnserCards) {
                answers.appendChild(anAnswerCard.element)
            }
        }
    }

    shuffleAnswers() {
        let answerDiv = document.querySelector('#ans')
        let divs = answerDiv.getElementsByTagName('div')
        for (let i = 0; i < divs.length; i++) {
            let randomDivNumber = Math.floor(Math.random() * divs.length)
            answerDiv.append(Array.from(divs).splice(randomDivNumber, 1)[0])
        }
    }

}
