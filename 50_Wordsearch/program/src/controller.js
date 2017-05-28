/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */

class Controller {
    constructor(newQuiz, newView) {
        //Controller.myQuiz = newQuiz     // Model: Quiz instance
        Controller.myView = newView     // View: View class

        //Controller.createQuizElements()
        Controller.setUpEventListeners()
    }

    static createQuizElements() {
        let questions = Controller.myQuiz.quiz.map(questionAnswerSet => questionAnswerSet.question)
        questions.forEach(question => {
            Controller.myView.createQuestionBoxElement(question)
        })

        Controller.myQuiz.forAllAnswers(answer => {
            Controller.myView.createAnswerCardElement(answer.answerText)
        })

        Controller.myView.shuffleContents('boxes')
        Controller.myView.shuffleContents('answers')
    }

    static setUpEventListeners() {
        window.addEventListener('submitEvent', Controller.submitEventHandler, false) // when "submit" button clicked
        window.addEventListener('tryAgainEvent', Controller.tryAgainEventHandler, false) // when "Try Again" button clicked
        //window.addEventListener('scoreUpdateEvent', Controller.scoreUpdateEventHandler, false) // when quiz score is updated
        //window.addEventListener('resizeIframeEvent', Controller.resizeIframeEventHandler, false) // when an answer card is moved to a correct box
        //window.addEventListener('dropEvent', Controller.dropEventHandler, false) // when an answer card is dropped to a box
    }

    static submitEventHandler(event) {
        //let score = Controller.myQuiz.getRoundedQuizScore()
        //let passingScore = Controller.myQuiz.passingScore
        //Controller.myView.removeDraggableAll()
        let score = Number(document.getElementById('current-score').innerHTML)
        let passingScore = 80
        Controller.myView.displayResult(score, passingScore)
        Controller.myView.sendScoreToMoodle(score)
    }

    static tryAgainEventHandler(event) {
        location.reload()
    }

    static scoreUpdateEventHandler(event) {
        let score = Controller.myQuiz.getRoundedQuizScore()
        Controller.myView.updateCurrentScore(score)
    }

    static resizeIframeEventHandler(event) {
        parent.resizeIframe()
    }

    static dropEventHandler(event) {
        let dropped = event.detail.question
        let dragged = event.detail.answer

        let target = Controller.myQuiz.quiz.find(questionAnswerSet => questionAnswerSet.question == dropped)
        let foundAnswer = Controller.myQuiz.findAnswer(dragged)

        if (target.answers.includes(foundAnswer)) {
            // correct answer
            Controller.myQuiz.addQuizScore(foundAnswer)
            Controller.myView.removeDraggable(dragged)
            Controller.myView.moveAnswerCardToBox(dragged, dropped)
        } else {
            // wrong answer
            Controller.myQuiz.reduceAnswerScore(foundAnswer)
        }
    }
}
