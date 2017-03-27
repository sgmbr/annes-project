/* jshint undef: true, unused: true, esversion: 6, asi: true */

//this script is needed to set the dimensions of the iframe
function resizeIframe(obj) {
    obj.style.height = (obj.contentWindow.document.body.scrollHeight) + 'px'
}
