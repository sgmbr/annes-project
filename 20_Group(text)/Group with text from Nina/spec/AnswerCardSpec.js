/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */

describe('AnswerCard', function() {
    let answerCard
    beforeEach(function() {
        answerCard = new AnswerCard('<question>force</question>')
    })

    it('has an element', function() {
        expect(answerCard.element).toBeDefined()
    })

    xdescribe('setupElement()', function() {
        it('returns a <div> containing <p> element', function() {
            let result = answerCard.setupElement('<question>test</question>')

            let expectation = document.createElement('div')
            let p = document.createElement('p')
            p.innerHTML = 'test'
            expectation.appendChild(p)

            expect(result).toEqual(expectation)
        })
    })

    describe('Score calculation when score = 8, incorrectWeight = 5', function() {
        let answerWeight, incorrectWeight
        beforeEach(function() {
            answerWeight = 8
            incorrectWeight = 5
            answerCard.setupScore(answerWeight, incorrectWeight)
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

})
