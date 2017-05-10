/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */

describe('AnswerCard', function() {
    let text, parser, xmlDoc, answerCard, quiz
    beforeAll(function() {
        text = '<set><box>Quantities</box>' +
        '<question>force</question>' +
        '<question>energy</question>' +
        '<question>speed</question>' +
        '<question>acceleration</question></set>'

        parser = new DOMParser()
        xmlDoc = parser.parseFromString(text, 'text/xml')

        answerCard = new AnswerCard(xmlDoc.getElementsByTagName('question')[0])

        quiz = new Quiz(xmlDoc)
        View.setUp()
        let controller = new Controller(quiz, View)
    })

    describe('setUpElement()', function() {
        let div, p
        beforeEach(function() {
            text = '<question>test</question>'
            xmlDoc = parser.parseFromString(text, 'text/xml')

            div = answerCard.setUpElement(xmlDoc.getElementsByTagName('question')[0])
            p = div.getElementsByTagName('p')[0]
        })

        it('returns a <div> containing <p> element', function() {
            expect(div).toBeDefined()
            expect(p).toBeDefined()
        })

        it('has set "answer-card" class', function() {
            expect(div.classList.contains('answer-card')).toBeTruthy()
        })

        it('has innerHTML set', function() {
            expect(p.innerHTML).toEqual('test')
        })
    })

    describe('Score calculation, when score = 8, incorrectWeight = 5', function() {
        let answerWeight, incorrectWeight
        beforeEach(function() {
            answerWeight = 8
            incorrectWeight = 5
            answerCard.setUpScore(answerWeight, incorrectWeight)
        })

        it('score is 3 when reduceScore() once', function() {
            answerCard.reduceScore()
            expect(answerCard.score).toBe(3)
        })

        it('score is 0 when reduceScore() twice (not -2)', function() {
            answerCard.reduceScore()
            answerCard.reduceScore()
            expect(answerCard.score).toBe(0)
        })
    })

    describe('AnswerCard.addScoreToQuiz function', function() {
        it('updates Quiz.score', function() {
            let answer = quiz.allMyQuestions[0].allMyAnswerCards[0]
            answer.addScoreToQuiz()
            expect(quiz.score).toEqual(answer.score)
        })
    })

    describe('setDraggable()', function() {
        it('sets draggable to this.element', function() {

        })
    })

    describe('removeDraggable()', function() {
        it('disables draggable of this.element', function() {

        })
    })

})
