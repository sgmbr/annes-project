/* jshint undef: true, unused: true, esversion: 6, asi: true */

//this script is needed to set the dimensions of the iframe
function resizeIframe() {
    let iframe = document.getElementById('game_ifr')
    iframe.style.height = (iframe.contentWindow.document.body.scrollHeight) + 'px'
}

/*
function resizeIframeEventHandler(event) {
    let iframe = document.getElementById('game_ifr')
    resizeIframe(iframe)
}

let iframe = document.getElementById('game_ifr')
window.addEventListener('resizeIframeEvent', resizeIframeEventHandler, false)
*/
