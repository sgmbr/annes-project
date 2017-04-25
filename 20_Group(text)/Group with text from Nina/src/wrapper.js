/* jshint undef: true, unused: true, esversion: 6, asi: true */

function resizeIframe() {
    let iframe = document.getElementById('quiz')
    iframe.style.height = (iframe.contentWindow.document.body.offsetHeight) + 'px'
}

window.addEventListener('orientationchange', function() {
    setTimeout(function() {
        resizeIframe()
    }, 500)
}, false)
