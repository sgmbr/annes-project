/* jshint undef: true, unused: true, esversion: 6, asi: true */

function resizeIframe() {
    let iframe = document.getElementById('game_ifr')
    iframe.style.height = (iframe.contentWindow.document.body.offsetHeight + 20) + 'px'
}

let onResizeHandler = function(event) {
    setTimeout(function() {
        resizeIframe()
    }, 300)
}

window.addEventListener('resize', onResizeHandler, false)
window.addEventListener('orientationchange', onResizeHandler, false)
