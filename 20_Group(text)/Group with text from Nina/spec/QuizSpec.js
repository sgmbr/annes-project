/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */

describe('Quiz, given "Quantities and units Group" xml', function() {
    let quiz
    let request = new XMLHttpRequest()

    beforeAll(function(done) {
        request.open('GET', 'config.xml', true)
        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                // success
                let xml = request.responseXML
                quiz = new Quiz(xml)
                View.setup()
                let controller = new Controller(quiz, View)

                // async support: 'it' runs after this
                done()
            }
        }
        request.send()
    })

    it('should create 2 QuestionBox objects', function() {
        expect(quiz.numberOfBoxes).toBe(2)
    })

    it('should create 15 AnswerCard objects', function() {
        expect(quiz.numberOfAnswers).toBe(15)
    })

    it('has score attribute', function() {
        expect(quiz.score).toBeDefined()
    })

    describe('QuestionBox DOM', function() {
        let boxDiv, boxNamePs, boxNames

        beforeEach(function() {
            boxDiv = document.getElementById('box')
            boxNamePs = boxDiv.getElementsByTagName('p')
            boxNames = Array.from(boxNamePs).map(a => a.innerHTML)
        })

        it('should have 2 QuestionBox DOM objects', function() {
            expect(boxDiv.getElementsByTagName('div').length).toBe(2)
        })

        it('should have "Quantities" box', function() {
            expect(boxNames).toContain('Quantities')
        })

        it('should have "Units" box', function() {
            expect(boxNames).toContain('Units')
        })

        it('are all set to droppable', function() {
            let boxes = boxDiv.getElementsByTagName('div')

            Array.from(boxes).forEach(a => {
                expect(a.classList.contains('ui-droppable')).toBeTruthy()
            })
        })
    })

    describe('AnswerCard DOM', function() {
        let ansDiv, ansStrPs, ansStrs

        beforeEach(function() {
            ansDiv = document.getElementById('ans')
            ansStrPs = ansDiv.getElementsByTagName('p')
            ansStrs = Array.from(ansStrPs).map(a => a.innerHTML)
        })

        it('should have 15 AnswerCard DOM objects', function() {
            expect(ansDiv.getElementsByTagName('div').length).toBe(15)
        })

        it('should have first card: "force"', function() {
            expect(ansStrs).toContain('force')
        })

        it('should have decorated card: "m s<sup>-2</sup>"', function() {
            expect(ansStrs).toContain('m s<sup>-2</sup>')
        })

        it('should have last card: "cm"', function() {
            expect(ansStrs).toContain('cm')
        })

        it('should have all other 12 cards', function() {
            expect(ansStrs).toContain('energy')
            expect(ansStrs).toContain('speed')
            expect(ansStrs).toContain('acceleration')
            expect(ansStrs).toContain('work')
            expect(ansStrs).toContain('mass')
            expect(ansStrs).toContain('time')
            expect(ansStrs).toContain('distance')
            expect(ansStrs).toContain('second')
            expect(ansStrs).toContain('kg')
            expect(ansStrs).toContain('metre per second')
            expect(ansStrs).toContain('newton')
            expect(ansStrs).toContain('joule')
        })

        it('should be shuffled', function() {
            let defaultOrder = [
                'force', 'energy', 'speed', 'acceleration', 'work',
                'mass', 'time', 'distance', 'second', 'kg',
                'metre per second', 'newton', 'joule', 'm s<sup>-2</sup>', 'cm'
            ]

            expect(ansStrs).not.toEqual(defaultOrder)
        })

        it('are all set to draggable', function() {
            let ansCards = ansDiv.getElementsByTagName('div')

            Array.from(ansCards).forEach(a => {
                expect(a.classList.contains('ui-draggable')).toBeTruthy()
            })
        })
    })

    describe('Current score DOM', function() {
        let currentScore

        beforeEach(function() {
            currentScore = document.getElementById('currentScore')
        })

        it('is set to 0 by default', function() {
            expect(currentScore.innerHTML).toBe('0')
        })

        it('can be updated', function() {
            quiz.score = 20
            expect(currentScore.innerHTML).toBe('20')
            quiz.score = 0
        })

    })

    describe('Submit button', function() {
        let submit

        beforeEach(function() {
            submit = document.getElementById('btnSubmit')
        })

        it('exists', function() {
            expect(submit).toBeDefined()
        })
    })

    describe('QuestionBox object',function() {
        it('contains its answers', function() {
            let quantities = quiz.allMyQuestions[0]
            let answers = quantities.allMyAnserCards.map(a => a.element.innerHTML)
            expect(answers).toContain('<p>force</p>')
            expect(answers).toContain('<p>energy</p>')
            expect(answers).toContain('<p>speed</p>')
            expect(answers).toContain('<p>acceleration</p>')
            expect(answers).toContain('<p>work</p>')
            expect(answers).toContain('<p>mass</p>')
            expect(answers).toContain('<p>time</p>')
            expect(answers).toContain('<p>distance</p>')
        })
    })

    describe('AnswerCard object',function() {
        it('score is set for every AnswerCard', function() {
            let score = 100 / 15
            quiz.allMyQuestions.forEach(q => {
                q.allMyAnserCards.forEach(a => {
                    expect(a.score).toEqual(score)
                })
            })
        })

        it('incorrectWeight is set for every AnswerCard', function() {
            let incorrectWeight = 100 / 15
            quiz.allMyQuestions.forEach(q => {
                q.allMyAnserCards.forEach(a => {
                    expect(a.incorrectWeight).toEqual(incorrectWeight)
                })
            })
        })
    })

    describe('Quiz.getAnswerCardFromInnerHTML function', function() {
        let result
        beforeEach(function() {
            result = quiz.getAnswerCardFromInnerHTML('<p>force</p>')
        })

        it('should return AnswerCard instance', function() {
            expect(result instanceof AnswerCard).toBeTruthy()
        })

        it('should return correct instance', function() {
            expect(result.element.innerHTML).toEqual('<p>force</p>')
        })
    })

    describe('Setting Quiz.score attribute', function() {
        let currentScore

        beforeEach(function() {
            currentScore = document.getElementById('currentScore')
        })

        it('should update current score DOM', function() {
            quiz.score = 20
            expect(currentScore.innerHTML).toBe('20')
            quiz.score = 0
        })
    })

    describe('Quiz.getPassingScore function', function() {
        let result
        beforeEach(function() {
            result = quiz.getPassingScore()
        })

        it('should return a number', function() {
            expect(typeof result).toBe('number')
        })

        it('should return correct number', function() {
            expect(result).toBe(80)
        })
    })

    describe('Quiz.finish function', function() {
        it('disables draggable of all answer cards', function() {
            quiz.finish()
            let answerCards = document.getElementById('ans').getElementsByTagName('div')
            Array.from(answerCards).forEach(a => {
                expect(a.classList.contains('ui-draggable-disabled')).toBeTruthy()
            })
        })
    })

    xdescribe('Drag and dropping answer cards', function() {
        let ansDiv, ansStrPs, ansStrs

        beforeEach(function() {
            ansDiv = document.getElementById('ans')
            ansStrPs = ansDiv.getElementsByTagName('p')
            ansStrs = Array.from(ansStrPs).map(a => a.innerHTML)
        })

        it('can be dragged', function() {
            //let card = ansDiv.getElementsByTagName('div')[0]
            let card = $('#ans > div')[0]
            card.simulate( 'drag', {
                dx: 50,
                dy: 50
            })
        })

        it('when dropped to wrong answer, returns to where it was', function() {

        })

        it('when dropped to correct answer, its position is fixed and not draggable', function() {

        })
    })

})
