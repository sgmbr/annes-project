/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */

describe('Quiz class', () => {
    let quiz

    beforeEach(() => {
        quiz = new Quiz()
        quiz.questions = [
            {word: 'foo', meaning: 'foooo', answered: false},
            {word: 'bar', meaning: 'baaaa', answered: false},
            {word: 'car', meaning: 'caaaa', answered: false},
            {word: 'bike', meaning: 'bikee', answered: false}
        ]
        quiz.options = {
            height: 3,
            width: 3,
            orientations: quiz.gridGenerator.validOrientations
        }
        quiz.passingScore = 80
    })

    describe('initialize function', () => {
        beforeEach(() => {
            quiz.initialize()
        })

        it('creates grid', () => {
            expect(Array.isArray(quiz.grid)).toBeTruthy()
        })

        it('sets score to 0', () => {
            expect(quiz.score).toBe(0)
        })

        it('sets scorePerWord to 25 when 4 questions', () => {
            expect(quiz.scorePerWord).toBe(25)
        })

        it('sets scoreReduceBy to 20% of scorePerWord: 5', () => {
            expect(quiz.scoreReduceBy).toBe(5)
        })

        it('sets answers to this.questions', () => {
            expect(typeof quiz.questions[0].x).toBe('number')
            expect(typeof quiz.questions[0].y).toBe('number')
            expect(typeof quiz.questions[0].orientation).toBe('string')
        })
    })

    describe('addQuizScore function', () => {
        it('adds specified score to this.score', () => {
            quiz.addQuizScore(8)
            expect(quiz.score).toBe(8)
        })
    })

    describe('reduceScorePerWord function', () => {
        beforeEach(() => {
            quiz.initialize()
        })

        it('reduces scorePerWord by scoreReduceBy', () => {
            quiz.reduceScorePerWord()
            expect(quiz.scorePerWord).toBe(20)
        })

        it('reduces to 0 when result is a negative number', () => {
            quiz.reduceScorePerWord()
            quiz.reduceScorePerWord()
            quiz.reduceScorePerWord()
            quiz.reduceScorePerWord()
            quiz.reduceScorePerWord()
            quiz.reduceScorePerWord()
            expect(quiz.scorePerWord).toBe(0)
        })
    })
})
