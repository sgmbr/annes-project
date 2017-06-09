/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */

describe('Grid class', () => {
    let grid, options

    beforeEach(() => {
        grid = new Grid()
        options = {
            height: 3,
            width: 3,
            orientations: grid.allOrientations,
            fillBlanks: true,
            maxAttempts: 3,
            preferOverlap: true
        }
    })

    describe('fillPuzzle function', () => {
        let words, puzzle

        beforeEach(() => {
            words = ['cow', 'car', 'row']
        })

        it('returns options.height length array of options.width length arrays', () => {
            puzzle = grid.fillPuzzle(words, options)
            expect(puzzle.length).toBe(3)
            expect(puzzle[0].length).toBe(3)
            expect(puzzle[1].length).toBe(3)
            expect(puzzle[2].length).toBe(3)
        })

        it('stores answers in an attribute', () => {
            puzzle = grid.fillPuzzle(words, options)
            expect(grid.answers.length).toBe(3)
        })

        it('returns null when it fails to place all words', () => {
            words = ['aaa', 'bbb', 'ccc', 'ddd']
            puzzle = grid.fillPuzzle(words, options)
            expect(puzzle).toBe(null)
        })
    })

    describe('placeWordInPuzzle function', () => {
        let puzzle, word

        beforeEach(() => {
            puzzle = [
                ['c', 'a', 'a'],
                ['o', '', ''],
                ['', '', '']
            ]
            word = 'cow'
        })

        it('locates a word where the most letters overlap', () => {
            let result = grid.placeWordInPuzzle(puzzle, options, word)
            expect(puzzle[2][0]).toBe('w')
            expect(grid.answers[0].x).toBe(0)
            expect(grid.answers[0].y).toBe(0)
            expect(grid.answers[0].orientation).toBe('vertical')
        })

        it('returns true when it finds a place', () => {
            let result = grid.placeWordInPuzzle(puzzle, options, word)
            expect(result).toBeTruthy()
        })

        it('returns false when the word doesn\'t fit', () => {
            word = 'fdsa'
            let result = grid.placeWordInPuzzle(puzzle, options, word)
            expect(result).not.toBeTruthy()
        })
    })

    describe('calcOverlap function', () => {
        let puzzle, word, x, y, fnGetSquare

        beforeEach(() => {
            puzzle = [
                ['c', 'a', 'a'],
                ['o', '', ''],
                ['', '', '']
            ]
            word = 'co'
            x = y = 0
            fnGetSquare = grid.orientations['vertical']
        })

        it('returns -1 if the entire word is overlapping', () => {
            let result = grid.calcOverlap(word, puzzle, x, y, fnGetSquare)
            expect(result).toBe(-1)
        })
    })

    describe('fillBlanks function', () => {
        let words, options, puzzle

        beforeEach(() => {
            words = ['cow', 'car', 'row']
            options = {
                height: 3,
                width: 3,
                orientations: grid.allOrientations,
                fillBlanks: true,
                maxAttempts: 3,
                preferOverlap: true
            }
            puzzle = grid.fillPuzzle(words, options)
            grid.fillBlanks(puzzle)
        })

        it('returns grid, each filled with a letter', () => {
            puzzle.forEach(row => {
                row.forEach(grid => {
                    expect(grid.match(/[a-z]/)).toBeTruthy()
                })
            })
        })

    })
})
