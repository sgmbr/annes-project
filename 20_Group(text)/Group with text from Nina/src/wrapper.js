/* jshint undef: true, unused: true, esversion: 6, asi: true */

//this script is needed to set the dimensions of the iframe
function resizeIframe() {
    let iframe = document.getElementById('quiz')
    iframe.style.height = (iframe.contentWindow.document.body.scrollHeight) + 'px'
}
