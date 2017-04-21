/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */

describe('Quiz', function() {
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

    it('should have 2 QuestionBox objects', function() {
        expect(quiz.numberOfBoxes).toBe(2)
    })

    it('should have 15 AnswerCard objects', function() {
        expect(quiz.numberOfAnswers).toBe(15)
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

        it('should have "force" card', function() {
            expect(ansStrs).toContain('force')
        })

        it('should have "energy" card', function() {
            expect(ansStrs).toContain('energy')
        })

        it('should have "speed" card', function() {
            expect(ansStrs).toContain('speed')
        })

        it('should have "acceleration" card', function() {
            expect(ansStrs).toContain('acceleration')
        })

        it('should have "work" card', function() {
            expect(ansStrs).toContain('work')
        })

        it('should have "mass" card', function() {
            expect(ansStrs).toContain('mass')
        })

        it('should have "time" card', function() {
            expect(ansStrs).toContain('time')
        })

        it('should have "distance" card', function() {
            expect(ansStrs).toContain('distance')
        })

        it('should have "second" card', function() {
            expect(ansStrs).toContain('second')
        })

        it('should have "kg" card', function() {
            expect(ansStrs).toContain('kg')
        })

        it('should have "metre per second" card', function() {
            expect(ansStrs).toContain('metre per second')
        })

        it('should have "newton" card', function() {
            expect(ansStrs).toContain('newton')
        })

        it('should have "joule" card', function() {
            expect(ansStrs).toContain('joule')
        })

        it('should have "m s<sup>-2</sup>" card', function() {
            expect(ansStrs).toContain('m s<sup>-2</sup>')
        })

        it('should have "cm" card', function() {
            expect(ansStrs).toContain('cm')
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

})
