/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */

window.onload = function() {
    let quiz
    let request = new XMLHttpRequest()
    request.open('GET', 'config.xml', true)

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            // success
            let xml = request.responseXML
            quiz = new Quiz(xml)
            View.setUp()
            let controller = new Controller(quiz, View)

            parent.resizeIframe()
            // wait for images to be loaded and do it again
            setTimeout(function() {
                parent.resizeIframe()
            }, 1000)
        } else {
            // reached target server, but it returned an error
        }
    }
    request.onerror = function() {
        // There was a connection erro of some sort
    }

    request.send()
}
