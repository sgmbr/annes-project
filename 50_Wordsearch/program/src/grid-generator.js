/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */

class GridGenerator {
    constructor() {
        this.grid = new Grid()
        /**
        * Returns the list of all of the possible orientations.
        * @api public
        */
        this.validOrientations = this.grid.allOrientations

        /**
        * Returns the orientation functions for traversing words.
        * @api public
        */
        this.orientations = this.grid.orientations
        this.answers = []
    }

    /**
     * Generates a new word find (word search) puzzle.
     *
     * Settings:
     *
     * height: desired height of the puzzle, default: smallest possible
     * width:  desired width of the puzzle, default: smallest possible
     * orientations: list of orientations to use, default: all orientations
     * fillBlanks: true to fill in the blanks, default: true
     * maxAttempts: number of tries before increasing puzzle size, default:3
     * preferOverlap: maximize word overlap or not, default: true
     *
     * Returns the puzzle that was created.
     *
     * @param {[String]} words: List of words to include in the puzzle
     * @param {options} settings: The options to use for this puzzle
     * @api public
     */
    newPuzzle(words, settings) {
        let wordList, puzzle, attempts = 0,
            opts = settings || {}

        // copy and sort the words by length, inserting words into the puzzle
        // from longest to shortest works out the best
        wordList = words.slice(0).sort((a, b) => (a.length < b.length) ? 1 : 0 )

        // initialize the options
        let options = {
            height: opts.height || wordList[0].length,
            width: opts.width || wordList[0].length,
            orientations: opts.orientations || this.grid.allOrientations,
            fillBlanks: opts.fillBlanks !== undefined ? opts.fillBlanks : true,
            maxAttempts: opts.maxAttempts || 3,
            preferOverlap: opts.preferOverlap !== undefined ? opts.preferOverlap : true
        }

        // add the words to the puzzle
        // since puzzles are random, attempt to create a valid one up to
        // maxAttempts and then increase the puzzle size and try again
        while (!puzzle) {
            while (!puzzle && attempts++ < options.maxAttempts) {
                puzzle = this.grid.fillPuzzle(wordList, options)
            }

            if (!puzzle) {
                options.height++
                options.width++
                attempts = 0
            }
        }

        // fill in empty spaces with random letters
        if (options.fillBlanks) {
            this.grid.fillBlanks(puzzle)
        }

        this.answers = this.grid.answers

        return puzzle
    }

}
