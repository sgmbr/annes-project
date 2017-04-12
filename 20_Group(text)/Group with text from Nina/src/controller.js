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
        window.addEventListener('scoreUpdateEvent', Controller.scoreUpdateEventHandler, false)
    }

    static submitEventHandler(event) {
        let score = Math.round(Controller.theQuiz.score)
        let passingScore = Controller.theQuiz.getPassingScore()
        Controller.view.sendScoreToMoodle(score)
        Controller.view.displayResult(score, passingScore)
        Controller.theQuiz.finish()
    }

    static tryAgainEventHandler(event) {
        location.reload()
    }

    static scoreUpdateEventHandler(event) {
        let score = Math.round(Controller.theQuiz.score)
        Controller.view.showCurrentScore(score)
    }
}
