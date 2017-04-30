/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */

class View {
    static setup() {
        View.setupSubmitBtn('btnSubmit')
        View.setupTryAgainBtn('btnTryAgain')
    }

    static fireCustomEvent(eventName) {
        let eventInput = new Event(eventName)
        window.dispatchEvent(eventInput)
    }

    static setupSubmitBtn(tagId) {
        document.getElementById(tagId).onclick = function(event) {
            View.fireCustomEvent('submitEvent')
        }
    }

    static setupTryAgainBtn(tagId) {
        document.getElementById(tagId).onclick = function(event) {
            View.fireCustomEvent('tryAgainEvent')
        }
    }

    static getQuestionDiv() {
        return document.getElementById('box')
    }

    static getAnswerDiv() {
        return document.getElementById('ans')
    }

    static getResultDiv() {
        return document.getElementById('res')
    }

    static showCurrentScore(score) {
        let currentScoreElement = document.getElementById('currentScore')
        currentScoreElement.innerHTML = score
    }

    static sendScoreToMoodle(score) {
        $('#region-main', window.parent.document).find('input[name="mark"]').attr('value', score)
    }

    static displayResult(score, passingScore) {
        let scoreElement = document.getElementById('score')
        scoreElement.innerHTML = score

        let passingScoreElement = document.getElementById('passing-score')
        passingScoreElement.innerHTML = passingScore

        let finalMessage = document.getElementById('final-message')
        if (score >= passingScore) {
            finalMessage.innerHTML = 'Well done! A great result!'
        } else {
            finalMessage.innerHTML = 'Sorry you failed this time, but try again!'
        }

        let resultElement = View.getResultDiv()
        resultElement.style.display = 'block'
    }
}
