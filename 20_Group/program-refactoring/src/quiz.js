/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */

class Quiz {
    constructor(xml) {
        this.xml = xml
        this.quiz = [] // [{question: "groupName", answers: [Answer1, Answer2...]}...]
        this.passingScore = 0
        this.score = 0
        this.incorrectWeight = 0

        this.setUp()
    }

    setUp() {
        this.createQuiz()
        this.setPassingScore()
        this.setAnswerScore()
        this.setIncorrectWeight()
    }

    createQuiz() {
        let groups = this.xml.getElementsByTagName('group')
        Array.from(groups).forEach( aGroup => {
            let groupName = aGroup.getElementsByTagName('name')[0].innerHTML
            let groupElementsXml = aGroup.getElementsByTagName('element')
            let groupElements = Array.from(groupElementsXml).map(element => element.innerHTML)

            let answers = []
            groupElements.forEach( groupElement => {
                let newAnswer = new Answer(groupElement)
                answers.push(newAnswer)
            })

            let questionAnswerSet = {
                question: groupName,
                answers: answers
            }
            this.quiz.push(questionAnswerSet)
        })
    }

    setPassingScore() {
        let passingScore = this.xml.getElementsByTagName('passing-score')[0]
        this.passingScore = Number(passingScore.innerHTML)
    }

    forAllAnswers(callback) {
        this.quiz.forEach(questionAnswerSet => {
            questionAnswerSet.answers.forEach(answer => {
                callback(answer)
            })
        })
    }

    countQuestions() {
        return this.quiz.length
    }

    countAnswers() {
        return this.quiz.reduce((acc, cur) => acc + cur.answers.length, 0)
    }

    calcAnswerScore() {
        let answerScore = 100 / this.countAnswers()
        return answerScore
    }

    calcIncorrectWeight() {
        let answerScore = this.calcAnswerScore()
        let incorrectWeight = answerScore * (1 / (this.countQuestions() - 1))
        return incorrectWeight
    }

    setAnswerScore() {
        let answerScore = this.calcAnswerScore()
        this.forAllAnswers(answer => {
            answer.setAnswerScore(answerScore)
        })
    }

    reduceAnswerScore(answer) {
        answer.reduceAnswerScore(this.incorrectWeight)
    }

    setIncorrectWeight() {
        this.incorrectWeight = this.calcIncorrectWeight()
    }

    addQuizScore(answer) {
        this.score += answer.answerScore
        let eventInput = new Event('scoreUpdateEvent')
        window.dispatchEvent(eventInput)
    }

    getRoundedQuizScore() {
        return Math.round(this.score)
    }

    findAnswer(innerHTML) {
        // answerText and innerHTML can be different.
        // Do createElement() and get innerHTML to compare correctly.
        // e.g. <img src="foo"/> changes to <img src="foo"> (/ is omitted)
        let foundAnswer
        this.forAllAnswers(answer => {
            let p = document.createElement('p')
            p.innerHTML = answer.answerText
            if (p.innerHTML == innerHTML) {
                foundAnswer = answer
            }
        })
        return foundAnswer
    }
}
