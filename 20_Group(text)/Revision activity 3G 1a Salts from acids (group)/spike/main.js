/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */

window.onload = function() {
    let request = new XMLHttpRequest()
    request.open('GET', 'store.xml', true)

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            // success
            let xml = request.responseXML
            let quiz = new Quiz(xml)
            quiz.setup()

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
