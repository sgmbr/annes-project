/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */

class Controller {
    constructor(quiz, View) {
        Controller.theQuiz = quiz
        Controller.view = View
        Controller.setUp()
    }

    static setUp() {
        window.addEventListener('submitEvent', Controller.submitEventHandler, false)
        window.addEventListener('tryAgainEvent', Controller.tryAgainEventHandler, false)
        window.addEventListener('scoreUpdateEvent', Controller.scoreUpdateEventHandler, false)
        window.addEventListener('resizeIframeEvent', Controller.resizeIframeEventHandler, false)
    }

    static submitEventHandler(event) {
        let score = Math.round(Controller.theQuiz.score)
        let passingScore = Controller.theQuiz.getPassingScore()
        Controller.theQuiz.finish()
        Controller.view.displayResult(score, passingScore)
        Controller.view.sendScoreToMoodle(score)
    }

    static tryAgainEventHandler(event) {
        location.reload()
    }

    static scoreUpdateEventHandler(event) {
        let score = Math.round(Controller.theQuiz.score)
        Controller.view.showCurrentScore(score)
    }

    static resizeIframeEventHandler(event) {
        parent.resizeIframe()
    }
}
