/* jshint undef: true, unused: true, esversion: 6, asi: true */

function resizeIframe() {
    let iframe = document.getElementById('quiz')
    iframe.style.height = (iframe.contentWindow.document.body.offsetHeight) + 'px'
}

let onResizeHandler = function(event) {
    setTimeout(function() {
        resizeIframe()
    }, 500)
}

window.addEventListener('resize', onResizeHandler, false)
window.addEventListener('orientationchange', onResizeHandler, false)
