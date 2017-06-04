/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */

class Quiz {
    constructor() {
        this.gridGenerator = new GridGenerator()
        this.questions = []
        this.options = {}
        this.grid = []
        this.solution = {}
        this.passingScore = 0
        this.score = 0
        this.scorePerWord = 0
    }

    setUp(xml) {
        let parser = new Parser()
        this.questions = parser.parseQuestions(xml)
        this.options = parser.parseOptions(xml)
        this.passingScore = parser.parsePassingScore(xml)
        this.scorePerWord = 100 / this.questions.length

        this.initialize()
    }

    initialize() {
        let words = this.questions.map( question => question.word )
        this.grid = this.gridGenerator.newPuzzle(words, this.options)
        this.solution = this.gridGenerator.solve(this.grid, words)
        this.score = 0
    }

    addQuizScore(answer) {
        this.score += answer.answerScore
        let eventInput = new Event('scoreUpdateEvent')
        window.dispatchEvent(eventInput)
    }

    getRoundedQuizScore() {
        return Math.round(this.score)
    }

}
