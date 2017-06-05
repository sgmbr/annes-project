/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */

class Quiz {
    constructor() {
        this.gridGenerator = new GridGenerator()
        this.questions = []
        this.options = {}
        this.grid = []
        this.answers = []
        this.passingScore = 0
        this.score = 0
        this.scorePerWord = 0
    }

    setUp(xml) {
        let parser = new Parser()
        this.questions = parser.parseQuestions(xml)
        this.options = parser.parseOptions(xml)
        this.passingScore = parser.parsePassingScore(xml)

        this.initialize()
    }

    initialize() {
        let words = this.questions.map( question => question.word )
        this.grid = this.gridGenerator.newPuzzle(words, this.options)
        this.score = 0
        this.addQuizScore(0) // to notify score
        this.scorePerWord = 100 / this.questions.length
        this.scoreReduceBy = this.scorePerWord / 5 // reduce by 20%
        this.questions.forEach(question => {
            let answer = this.gridGenerator.answers.find(answer => answer.word === question.word)
            question.x = answer.x
            question.y = answer.y
            question.orientation = answer.orientation
            question.answered = false
        })
    }

    addQuizScore(score) {
        this.score += score
        let eventInput = new Event('scoreUpdateEvent')
        window.dispatchEvent(eventInput)
    }

    reduceScorePerWord() {
        this.scorePerWord -= this.scoreReduceBy
        this.scorePerWord = (this.scorePerWord < 0) ? 0 : this.scorePerWord
    }

    getRoundedQuizScore() {
        return Math.round(this.score)
    }

}
