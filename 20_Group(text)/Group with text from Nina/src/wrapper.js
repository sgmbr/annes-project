/* jshint undef: true, unused: true, esversion: 6, asi: true */

function resizeIframe() {
    let iframe = document.getElementById('quiz')
    iframe.style.height = (iframe.contentWindow.document.body.scrollHeight) + 'px'
}
