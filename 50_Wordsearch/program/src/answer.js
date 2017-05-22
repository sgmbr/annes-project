/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */

class Answer {
    constructor(newAnswerText) {
        this.answerText = newAnswerText
        this.answerScore = 0
    }

    setAnswerScore(newScore) {
        this.answerScore = newScore
    }

    reduceAnswerScore(number) {
        this.answerScore -= number
        this.answerScore = (this.answerScore < 0) ? 0 : this.answerScore
    }
}
