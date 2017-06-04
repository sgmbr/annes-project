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

        return puzzle
    }

    /**
     * Returns the starting location and orientation of the specified words
     * within the puzzle. Any words that are not found are returned in the
     * notFound array.
     *
     * Returns
     *   x position of start of word
     *   y position of start of word
     *   orientation of word
     *   word
     *   overlap (always equal to word.length)
     *
     * @param {[[String]]} puzzle: The current state of the puzzle
     * @param {[String]} words: The list of words to find
     * @api public
     */
    solve(puzzle, words) {
        let options = {
                height: puzzle.length,
                width: puzzle[0].length,
                orientations: this.grid.allOrientations,
                preferOverlap: true
            },
            found = [],
            notFound = []

        for (let i = 0, len = words.length; i < len; i++) {
            let word = words[i],
                locations = this.grid.findBestLocations(puzzle, options, word)

            if (locations.length > 0 && locations[0].overlap === word.length) {
                locations[0].word = word
                found.push(locations[0])
            } else {
                notFound.push(word)
            }
        }

        return {
            found: found,
            notFound: notFound
        }
    }

    /**
     * Outputs a puzzle to the console, useful for debugging.
     * Returns a formatted string representing the puzzle.
     *
     * @param {[[String]]} puzzle: The current state of the puzzle
     * @api public
     */
    print(puzzle) {
        let puzzleString = '';
        for (let i = 0, height = puzzle.length; i < height; i++) {
            let row = puzzle[i];
            for (let j = 0, width = row.length; j < width; j++) {
                puzzleString += (row[j] === '' ? ' ' : row[j]) + ' ';
            }
            puzzleString += '\n';
        }

        console.log(puzzleString);
        return puzzleString;
    }

}
