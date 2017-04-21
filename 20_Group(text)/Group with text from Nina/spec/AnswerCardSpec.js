describe('AnswerCard', function() {
    let answerCard, answerWeight, incorrectWeight
    beforeEach(function() {
        answerCard = new AnswerCard('<question>force</question>')
    })

    it('has an element', function() {
        expect(answerCard.element).toBeDefined()
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
