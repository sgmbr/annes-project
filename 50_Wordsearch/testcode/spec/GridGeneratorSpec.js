/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */

describe('GridGenerator class', () => {
    let gridGenerator, words, settings, puzzle

    beforeEach(() => {
        gridGenerator = new GridGenerator()
        words = ['variation', 'recession', 'dna', 'gene']
        settings = {
            height: 3,
            width: 3,
            orientations: gridGenerator.validOrientations
        }
    })

    describe('newPuzzle function', () => {

        it('returns grid', () => {
            puzzle = gridGenerator.newPuzzle(words, settings)
            expect(Array.isArray(puzzle)).toBeTruthy()
            expect(Array.isArray(puzzle[0])).toBeTruthy()
        })

        it('stores answers', () => {
            puzzle = gridGenerator.newPuzzle(words, settings)
            expect(gridGenerator.answers.length).toBe(4)
        })

        it('expands grid size if words don\'t fit', () => {
            puzzle = gridGenerator.newPuzzle(words, settings)
            expect(puzzle.length).toBeGreaterThan(3)
            expect(puzzle[0].length).toBeGreaterThan(3)
        })

    })
})
