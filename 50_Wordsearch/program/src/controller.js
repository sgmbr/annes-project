/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */

class Controller {
    constructor(newQuiz, newView) {
        Controller.myQuiz = newQuiz     // Model: Quiz instance
        Controller.myView = newView     // View: View class

        Controller.startSquare = null
        Controller.selectedSquares = []
        Controller.curOrientation = null
        Controller.curWord = ''

        Controller.drawQuiz()
        Controller.setUpEventListeners()
    }

    static drawQuiz() {
        Controller.myView.drawGrid(Controller.myQuiz.grid)
        Controller.myView.drawQuestions(Controller.myQuiz.questions)
        Controller.myView.setUpGrid()
        Controller.myView.showSelectedWord('', '')
    }

    static setUpEventListeners() {
        window.addEventListener('rebuildEvent', Controller.rebuildEventHandler, false) // when "Rebuild" button clicked
        window.addEventListener('showAnswerEvent', Controller.showAnswerEventHandler, false) // when "Show Answer" button activated
        window.addEventListener('hideAnswerEvent', Controller.hideAnswerEventHandler, false) // when "Show Answer" button deactivated
        window.addEventListener('submitEvent', Controller.submitEventHandler, false) // when "Submit" button clicked
        window.addEventListener('tryAgainEvent', Controller.tryAgainEventHandler, false) // when "Try Again" button clicked
        window.addEventListener('startTurnEvent', Controller.startTurnEventHandler, false)
        window.addEventListener('selectEvent', Controller.selectEventHandler, false)
        window.addEventListener('endTurnEvent', Controller.endTurnEventHandler, false)
        window.addEventListener('scoreUpdateEvent', Controller.scoreUpdateEventHandler, false) // when quiz score is updated
    }

    static rebuildEventHandler(event) {
        Controller.myQuiz.initialize()
        Controller.drawQuiz()
    }

    static showAnswerEventHandler(event) {
        Controller.myQuiz.reduceScorePerWord()
        let solutions = Controller.myQuiz.solution.found
        for (let solution of solutions) {
            let word = solution.word,
                orientation = solution.orientation,
                x = solution.x,
                y = solution.y,
                next = Controller.myQuiz.gridGenerator.orientations[orientation]

                Controller.myView.showAnswer(word, orientation, x, y, next)
        }
    }

    static hideAnswerEventHandler(event) {
        Controller.myView.hideAnswer()
    }

    static submitEventHandler(event) {
        let score = Controller.myQuiz.getRoundedQuizScore()
        let passingScore = Controller.myQuiz.passingScore
        Controller.myView.displayResult(score, passingScore)
        Controller.myView.sendScoreToMoodle(score)
    }

    static tryAgainEventHandler(event) {
        location.reload()
    }

    static scoreUpdateEventHandler(event) {
        let score = Controller.myQuiz.getRoundedQuizScore()
        Controller.myView.updateCurrentScore(score)
        Controller.myView.sendScoreToMoodle(score)
    }

    static resizeIframeEventHandler(event) {
        parent.resizeIframe()
    }

    /**
     * Game play events.
     *
     * The following events handle the turns, word selection, word finding, and
     * game end.
     *
     */

    /**
     * Event that handles mouse down on a new square. Initializes the game state
     * to the letter that was selected.
     *
     */
    static startTurnEventHandler(e) {
        Controller.startSquare = e.detail;
        Controller.selectedSquares.push(e.detail);
        Controller.curWord = Controller.myQuiz.grid[e.detail.y][e.detail.x]
        Controller.myView.addSelected(e.detail.x, e.detail.y)
    }

    /**
     * Event that handles mouse over on a new square. Ensures that the new square
     * is adjacent to the previous square and the new square is along the path
     * of an actual word.
     *
     */
    static selectEventHandler(e) {
        // if the user hasn't started a word yet, just return
        if (!Controller.startSquare) {
            return
        }

        // if the new square is actually the previous square, just return
        let lastSquare = Controller.selectedSquares[Controller.selectedSquares.length - 1];
        if (lastSquare == e.detail) {
            return
        }

        // see if the user backed up and correct the selectedSquares state if
        // they did
        let backTo
        for (let i = 0; i < Controller.selectedSquares.length; i++) {
            let selectedSquare = Controller.selectedSquares[i]
            if (selectedSquare.x == e.detail.x && selectedSquare.y == e.detail.y) {
                backTo = i + 1
                break
            }
        }

        while (backTo < Controller.selectedSquares.length) {
            let target = Controller.selectedSquares[Controller.selectedSquares.length - 1]
            Controller.myView.removeSelected(target.x, target.y)

            Controller.selectedSquares.splice(Controller.selectedSquares.length - 1, 1);
            Controller.curWord = Controller.curWord.substr(0, Controller.curWord.length - 1)
            lastSquare = Controller.selectedSquares[Controller.selectedSquares.length - 1]
        }

        // see if this is just a new orientation from the first square
        // this is needed to make selecting diagonal words easier
        let newOrientation = Controller.calcOrientation(
            Controller.startSquare.x,
            Controller.startSquare.y,
            e.detail.x,
            e.detail.y
        )

        if (newOrientation) {
            Controller.selectedSquares.forEach( sq => {
                Controller.myView.removeSelected(sq.x, sq.y)
            })
            Controller.myView.addSelected(Controller.startSquare.x, Controller.startSquare.y)

            Controller.selectedSquares = [Controller.startSquare]
            Controller.curWord = Controller.myQuiz.grid[Controller.startSquare.y][Controller.startSquare.x]
            Controller.curOrientation = newOrientation
            lastSquare = Controller.startSquare
        }

        // see if the move is along the same orientation as the last move
        let orientation = Controller.calcOrientation(
            lastSquare.x,
            lastSquare.y,
            e.detail.x,
            e.detail.y
        )

        // if the new square isn't along a valid orientation, just ignore it.
        // this makes selecting diagonal words less frustrating
        if (!orientation) {
            return
        }

        // finally, if there was no previous orientation or this move is along
        // the same orientation as the last move then play the move
        if (!Controller.curOrientation || Controller.curOrientation === orientation) {
            Controller.curOrientation = orientation;
            Controller.playTurn(e.detail);
        }
    }

    static mouseMove() {
        Controller.selectEventHandler(this);
    }

    /**
     * Updates the game state when the previous selection was valid.
     *
     * @param {el} square: The jQuery element that was played
     */
    static playTurn(square) {

        // make sure we are still forming a valid word
        for (let question of Controller.myQuiz.questions) {
            let word = question.word
            let letter = Controller.myQuiz.grid[square.y][square.x]
            if (word.indexOf(Controller.curWord + letter) === 0) {
                Controller.selectedSquares.push(square)
                Controller.curWord += letter
                Controller.myView.addSelected(square.x, square.y)
                break;
            }
        }
    }

    /**
     * Event that handles mouse up on a square. Checks to see if a valid word
     * was created and updates the class of the letters and word if it was. Then
     * resets the game state to start a new word.
     *
     */
    static endTurnEventHandler() {

        // see if we formed a valid word
        for (let question of Controller.myQuiz.questions) {
            if (!question.answered && question.word === Controller.curWord) {
                question.answered = true
                Controller.myQuiz.addQuizScore(Controller.myQuiz.scorePerWord)

                Controller.myView.found(question.word)
                Controller.myView.showSelectedWord(question.word, question.meaning)
            }
        }

        let remain = Controller.myQuiz.questions.filter(question => question.answered === false)
        if (remain.length === 0) {
            Controller.myView.complete()
        }

        // reset the turn
        Controller.myView.removeSelectedAll()
        Controller.startSquare = null
        Controller.selectedSquares = []
        Controller.curWord = ''
        Controller.curOrientation = null
    }

    /**
     * Given two points, ensure that they are adjacent and determine what
     * orientation the second point is relative to the first
     *
     * @param {int} x1: The x coordinate of the first point
     * @param {int} y1: The y coordinate of the first point
     * @param {int} x2: The x coordinate of the second point
     * @param {int} y2: The y coordinate of the second point
     */
    static calcOrientation(x1, y1, x2, y2) {

        for (let orientation in Controller.myQuiz.gridGenerator.orientations) {
            let nextFn = Controller.myQuiz.gridGenerator.orientations[orientation];
            let nextPos = nextFn(x1, y1, 1);

            if (nextPos.x === x2 && nextPos.y === y2) {
                return orientation;
            }
        }

        return null;
    }
}
