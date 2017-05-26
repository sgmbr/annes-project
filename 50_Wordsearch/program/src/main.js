/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */

window.onload = function() {
    let request = new XMLHttpRequest()
    request.open('GET', 'config.xml', true)

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            // success
            let xml = request.responseXML
            // parse xml
            let parser = new Parser()
            let options = parser.parseOptions(xml)
            let words = parser.parseWords(xml)
            // create wordsearch
            //var words = [{word: 'cows', meaning: 'animal'}, {word: 'tracks', meaning: 'a type of cars'}, {word: 'arrived', meaning: 'state of just being there'}];

            // start a word find game
            var gamePuzzle = wordfindgame.create(words, '#puzzle', '#words', options);

            $('#show-answer').mousedown( function() {
              wordfindgame.showAnswer(gamePuzzle, words);
            });
            $('#show-answer').mouseup( function() {
              wordfindgame.hideAnswer();
            });
            $('#rebuild').click(function() {
                gamePuzzle = wordfindgame.create(words, '#puzzle', '#words', options);
            })

            //let quiz = new Quiz(xml)
            //View.setUp()
            //let controller = new Controller(quiz, View)

            // resize iframe at the beginning of the quiz
            parent.resizeIframe()
        } else {
            // reached target server, but it returned an error
        }
    }
    request.onerror = function() {
        // There was a connection erro of some sort
    }

    request.send()
}
