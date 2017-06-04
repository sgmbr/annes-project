/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */
/**
* Wordfind.js 0.0.1
* (c) 2012 Bill, BunKat LLC.
* Wordfind is freely distributable under the MIT license.
* For all details and documentation:
*     http://github.com/bunkat/wordfind
*/

/**
* Generates a new word find (word search) puzzle provided a set of words.
* Can automatically determine the smallest puzzle size in which all words
* fit, or the puzzle size can be manually configured.  Will automatically
* increase puzzle size until a valid puzzle is found.
*
* WordFind has no dependencies.
*/
class Grid {
    /**
    * Initializes the WordFind object.
    *
    * @api private
    */
    constructor() {
        // Letters used to fill blank spots in the puzzle
        this.letters = 'abcdefghijklmnoprstuvwxyz'

        /**
        * Definitions for all the different orientations in which words can be
        * placed within a puzzle. New orientation definitions can be added and they
        * will be automatically available.
        */

        // The list of all the possible orientations
        this.allOrientations = ['horizontal','horizontalBack','vertical','verticalUp',
                               'diagonal','diagonalUp','diagonalBack','diagonalUpBack']

        // The definition of the orientation, calculates the next square given a
        // starting square (x,y) and distance (i) from that square.
        this.orientations = {
            horizontal:     (x,y,i) => { return {x: x+i, y: y  } },
            horizontalBack: (x,y,i) => { return {x: x-i, y: y  } },
            vertical:       (x,y,i) => { return {x: x,   y: y+i} },
            verticalUp:     (x,y,i) => { return {x: x,   y: y-i} },
            diagonal:       (x,y,i) => { return {x: x+i, y: y+i} },
            diagonalBack:   (x,y,i) => { return {x: x-i, y: y+i} },
            diagonalUp:     (x,y,i) => { return {x: x+i, y: y-i} },
            diagonalUpBack: (x,y,i) => { return {x: x-i, y: y-i} }
        }

        // Determines if an orientation is possible given the starting square (x,y),
        // the height (h) and width (w) of the puzzle, and the length of the word (l).
        // Returns true if the word will fit starting at the square provided using
        // the specified orientation.
        this.checkOrientations = {
            horizontal:     (x,y,h,w,l) => { return w >= x + l },
            horizontalBack: (x,y,h,w,l) => { return x + 1 >= l },
            vertical:       (x,y,h,w,l) => { return h >= y + l },
            verticalUp:     (x,y,h,w,l) => { return y + 1 >= l },
            diagonal:       (x,y,h,w,l) => { return (w >= x + l) && (h >= y + l) },
            diagonalBack:   (x,y,h,w,l) => { return (x + 1 >= l) && (h >= y + l) },
            diagonalUp:     (x,y,h,w,l) => { return (w >= x + l) && (y + 1 >= l) },
            diagonalUpBack: (x,y,h,w,l) => { return (x + 1 >= l) && (y + 1 >= l) }
        }

        // Determines the next possible valid square given the square (x,y) was ]
        // invalid and a word lenght of (l).  This greatly reduces the number of
        // squares that must be checked. Returning {x: x+1, y: y} will always work
        // but will not be optimal.
        this.skipOrientations = {
            horizontal:     (x,y,l) => { return {x: 0,   y: y+1  } },
            horizontalBack: (x,y,l) => { return {x: l-1, y: y    } },
            vertical:       (x,y,l) => { return {x: 0,   y: y+100} },
            verticalUp:     (x,y,l) => { return {x: 0,   y: l-1  } },
            diagonal:       (x,y,l) => { return {x: 0,   y: y+1  } },
            diagonalBack:   (x,y,l) => { return {x: l-1, y: x>=l-1?y+1:y    } },
            diagonalUp:     (x,y,l) => { return {x: 0,   y: y<l-1?l-1:y+1  } },
            diagonalUpBack: (x,y,l) => { return {x: l-1, y: x>=l-1?y+1:y  } }
        }
    }

    /**
    * Initializes the puzzle and places words in the puzzle one at a time.
    *
    * Returns either a valid puzzle with all of the words or null if a valid
    * puzzle was not found.
    *
    * @param {[String]} words: The list of words to fit into the puzzle
    * @param {[Options]} options: The options to use when filling the puzzle
    */
    fillPuzzle(words, options) {

        let puzzle = [],
            i, j, len

        // initialize the puzzle with blanks
        for (i = 0; i < options.height; i++) {
            puzzle.push([])
            for (j = 0; j < options.width; j++) {
                puzzle[i].push('')
            }
        }

        // add each word into the puzzle one at a time
        for (i = 0, len = words.length; i < len; i++) {
            if (!this.placeWordInPuzzle(puzzle, options, words[i])) {
                // if a word didn't fit in the puzzle, give up
                return null
            }
        }

        // return the puzzle
        return puzzle
    }

    /**
     * Adds the specified word to the puzzle by finding all of the possible
     * locations where the word will fit and then randomly selecting one. Options
     * controls whether or not word overlap should be maximized.
     *
     * Returns true if the word was successfully placed, false otherwise.
     *
     * @param {[[String]]} puzzle: The current state of the puzzle
     * @param {[Options]} options: The options to use when filling the puzzle
     * @param {String} word: The word to fit into the puzzle.
     */
    placeWordInPuzzle(puzzle, options, word) {

        // find all of the best locations where this word would fit
        let locations = this.findBestLocations(puzzle, options, word)

        if (locations.length === 0) {
            return false
        }

        // select a location at random and place the word there
        let sel = locations[Math.floor(Math.random() * locations.length)]
        this.placeWord(puzzle, word, sel.x, sel.y, this.orientations[sel.orientation])

        return true
    }

    /**
     * Iterates through the puzzle and determines all of the locations where
     * the word will fit. Options determines if overlap should be maximized or
     * not.
     *
     * Returns a list of location objects which contain an x,y cooridinate
     * indicating the start of the word, the orientation of the word, and the
     * number of letters that overlapped with existing letter.
     *
     * @param {[[String]]} puzzle: The current state of the puzzle
     * @param {[Options]} options: The options to use when filling the puzzle
     * @param {String} word: The word to fit into the puzzle.
     */
    findBestLocations(puzzle, options, word) {

        let locations = [],
            height = options.height,
            width = options.width,
            wordLength = word.length,
            maxOverlap = 0 // we'll start looking at overlap = 0

        // loop through all of the possible orientations at this position
        for (let k = 0, len = options.orientations.length; k < len; k++) {

            let orientation = options.orientations[k],
                check = this.checkOrientations[orientation],
                next = this.orientations[orientation],
                skipTo = this.skipOrientations[orientation],
                x = 0,
                y = 0

            // loop through every position on the board
            while (y < height) {

                // see if this orientation is even possible at this location
                if (check(x, y, height, width, wordLength)) {

                    // determine if the word fits at the current position
                    let overlap = this.calcOverlap(word, puzzle, x, y, next)

                    // if the overlap was bigger than previous overlaps that we've seen
                    if (overlap >= maxOverlap || (!options.preferOverlap && overlap > -1)) {
                        maxOverlap = overlap
                        locations.push({ x: x, y: y, orientation: orientation, overlap: overlap })
                    }

                    x++
                    if (x >= width) {
                        x = 0
                        y++
                    }
                } else {
                    // if current cell is invalid, then skip to the next cell where
                    // this orientation is possible. this greatly reduces the number
                    // of checks that we have to do overall
                    var nextPossible = skipTo(x, y, wordLength)
                    x = nextPossible.x
                    y = nextPossible.y
                }
            }
        }

        // finally prune down all of the possible locations we found by
        // only using the ones with the maximum overlap that we calculated
        return options.preferOverlap ?
            this.pruneLocations(locations, maxOverlap) :
            locations
    }

    /**
     * Determines whether or not a particular word fits in a particular
     * orientation within the puzzle.
     *
     * Returns the number of letters overlapped with existing words if the word
     * fits in the specified position, -1 if the word does not fit.
     *
     * @param {String} word: The word to fit into the puzzle.
     * @param {[[String]]} puzzle: The current state of the puzzle
     * @param {int} x: The x position to check
     * @param {int} y: The y position to check
     * @param {function} fnGetSquare: Function that returns the next square
     */
    calcOverlap(word, puzzle, x, y, fnGetSquare) {
        let overlap = 0

        // traverse the squares to determine if the word fits
        for (let i = 0, len = word.length; i < len; i++) {

            let next = fnGetSquare(x, y, i),
                square = puzzle[next.y][next.x]

            // if the puzzle square already contains the letter we
            // are looking for, then count it as an overlap square
            if (square === word[i]) {
                overlap++
            }
            // if it contains a different letter, than our word doesn't fit
            // here, return -1
            else if (square !== '') {
                return -1
            }
        }

        // if the entire word is overlapping, skip it to ensure words aren't
        // hidden in other words
        return overlap
    }

    /**
     * If overlap maximization was indicated, this function is used to prune the
     * list of valid locations down to the ones that contain the maximum overlap
     * that was previously calculated.
     *
     * Returns the pruned set of locations.
     *
     * @param {[Location]} locations: The set of locations to prune
     * @param {int} overlap: The required level of overlap
     */
    pruneLocations(locations, overlap) {

        let pruned = []
        for (let i = 0, len = locations.length; i < len; i++) {
            if (locations[i].overlap >= overlap) {
                pruned.push(locations[i])
            }
        }

        return pruned
    }

    /**
     * Places a word in the puzzle given a starting position and orientation.
     *
     * @param {[[String]]} puzzle: The current state of the puzzle
     * @param {String} word: The word to fit into the puzzle.
     * @param {int} x: The x position to check
     * @param {int} y: The y position to check
     * @param {function} fnGetSquare: Function that returns the next square
     */
    placeWord(puzzle, word, x, y, fnGetSquare) {
        for (var i = 0, len = word.length; i < len; i++) {
            var next = fnGetSquare(x, y, i);
            puzzle[next.y][next.x] = word[i];
        }
    }

    /**
     * Fills in any empty spaces in the puzzle with random letters.
     *
     * @param {[[String]]} puzzle: The current state of the puzzle
     * @api public
     */
    fillBlanks(puzzle) {
        for (let i = 0, height = puzzle.length; i < height; i++) {
            let row = puzzle[i];
            for (let j = 0, width = row.length; j < width; j++) {

                if (!puzzle[i][j]) {
                    let randomLetter = Math.floor(Math.random() * this.letters.length);
                    puzzle[i][j] = this.letters[randomLetter];
                }
            }
        }
    }

}
