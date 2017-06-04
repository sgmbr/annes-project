/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */

class View {
    static setUp() {
        View.setUpRebuildBtn('btn-rebuild')
        View.setUpShowAnswerBtn('btn-show-answer')
        View.setUpSubmitBtn('btn-submit')
        View.setUpTryAgainBtn('btn-try-again')
    }

    static fireEvent(eventName) {
        let eventInput = new Event(eventName)
        window.dispatchEvent(eventInput)
    }

    static setUpRebuildBtn(tagId) {
        document.getElementById(tagId).onclick = function(event) {
            View.fireEvent('rebuildEvent')
        }
    }

    static setUpShowAnswerBtn(tagId) {
        let element = document.getElementById(tagId)
        element.onmousedown = function(event) {
            View.fireEvent('showAnswerEvent')
        }
        element.onmouseup = function(event) {
            View.fireEvent('hideAnswerEvent')
        }
        element.addEventListener("touchstart", (event) => {
            event.preventDefault()
            View.fireEvent('showAnswerEvent')
        }, false)
        element.addEventListener("touchend", (event) => {
            event.preventDefault()
            View.fireEvent('hideAnswerEvent')
        }, false)
    }

    static setUpSubmitBtn(tagId) {
        document.getElementById(tagId).onclick = function(event) {
            View.fireEvent('submitEvent')
        }
    }

    static setUpTryAgainBtn(tagId) {
        document.getElementById(tagId).onclick = function(event) {
            View.fireEvent('tryAgainEvent')
        }
    }

    static fireGridEvent(eventName, letter) {
        let eventInput = new CustomEvent(eventName, {
            'detail': {
                'x' : Number(letter.getAttribute('x')),
                'y' : Number(letter.getAttribute('y'))
            }
        })
        window.dispatchEvent(eventInput)
    }


    static setUpGrid() {
        let letters = document.querySelectorAll('.puzzleSquare')
        for (let letter of letters) {
            letter.onmousedown = (event) => {
                View.fireGridEvent('startTurnEvent', letter)
            }
            letter.onmouseenter = (event) => {
                View.fireGridEvent('selectEvent', letter)
            }
            letter.onmouseup = (event) => {
                View.fireGridEvent('endTurnEvent', letter)
            }
            letter.addEventListener("touchstart", (event) => {
                event.preventDefault()
                View.fireGridEvent('startTurnEvent', letter)
            }, false)
            letter.addEventListener("touchmove", (event) => {
                event.preventDefault()
                let xPos = event.touches[0].pageX;
                let yPos = event.touches[0].pageY;
                let targetElement = document.elementFromPoint(xPos, yPos);
                View.fireGridEvent('selectEvent', targetElement)
            }, false)
            letter.addEventListener("touchend", (event) => {
                event.preventDefault()
                View.fireGridEvent('endTurnEvent', letter)
            }, false)
        }
    }

    /**
     * Draws the puzzle by inserting rows of buttons into el.
     *
     * @param {String} el: The jQuery element to write the puzzle to
     * @param {[[String]]} puzzle: The puzzle to draw
     */
    static drawGrid(grid) {
        let el = '#grid'
        let output = ''
        // for each row in the puzzle
        for (let i = 0, height = grid.length; i < height; i++) {
            // append a div to represent a row in the puzzle
            let row = grid[i]
            output += '<div>'
            // for each element in that row
            for (let j = 0, width = row.length; j < width; j++) {
                // append our button with the appropriate class
                output += '<button class="puzzleSquare" x="' + j + '" y="' + i + '">'
                output += row[j] || '&nbsp;'
                output += '</button>'
            }
            // close our div that represents a row
            output += '</div>'
        }

        $(el).html(output)
    }

    /**
     * Draws the words by inserting an unordered list into el.
     *
     * @param {String} el: The jQuery element to write the words to
     * @param {[String]} words: The words to draw
     */
    static drawQuestions(questions) {
        let el = '#questions'
        let output = '<ul>'
        for (let i = 0, len = questions.length; i < len; i++) {
            let question = questions[i]
            output += '<li class="word ' + question.word + '">' + question.meaning
        }
        output += '</ul>'

        $(el).html(output)
    }

    static addSelected(x, y) {
        let element = $(`[x="${x}"][y="${y}"]`)
        element.addClass('selected')
    }

    static removeSelected(x, y) {
        let element = $(`[x="${x}"][y="${y}"]`)
        element.removeClass('selected')
    }

    static removeSelectedAll() {
        $('.selected').removeClass('selected');
    }

    static found(word) {
        $('.selected').addClass('found');
        $('.' + word).addClass('wordFound');
    }

    static complete() {
        $('.puzzleSquare').addClass('complete');
    }

    static showSelectedWord(word, meaning) {
        $('#selected-word').html(word);
        $('#selected-meaning').html(meaning);
    }

    static showAnswer(word, orientation, x, y, next) {
        if (!$('.' + word).hasClass('wordFound')) {
            for (let i = 0, size = word.length; i < size; i++) {
                var nextPos = next(x, y, i);
                $('[x="' + nextPos.x + '"][y="' + nextPos.y + '"]').addClass('solved');
            }
        }
    }

    static hideAnswer() {
        $('.puzzleSquare').removeClass('solved');
    }

    static updateCurrentScore(score) {
        let currentScoreElement = document.getElementById('current-score')
        currentScoreElement.innerHTML = score
    }

    static sendScoreToMoodle(score) {
        let form = window.parent.document.getElementById("store")
        form.mark.value = score
        //form.submit() //commented out because it refreshes page
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

        let resultElement = document.getElementById('result')
        resultElement.style.display = 'block'
    }
}
