/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */

class Controller {
    constructor(quiz, View) {
        Controller.theQuiz = quiz
        Controller.view = View
        Controller.setup()
    }

    static setup() {
        window.addEventListener('submitEvent', Controller.submitEventHandler, false)
        window.addEventListener('tryAgainEvent', Controller.tryAgainEventHandler, false)
    }

    static submitEventHandler(event) {
        let score = Controller.theQuiz.getScore()
        let passingScore = Controller.theQuiz.getPassingScore()
        Controller.view.sendScoreToMoodle(score)
        Controller.view.displayResult(score, passingScore)
    }

    static tryAgainEventHandler(event) {
        location.reload()
    }
}