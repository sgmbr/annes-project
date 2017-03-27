/* jshint undef: true, unused: true, esversion: 6, asi: true */

/*
function NavBtnOver(Btn){
  if (Btn.className != 'NavButtonDown'){Btn.className = 'NavButtonUp';}
}

function NavBtnOut(Btn){
  Btn.className = 'NavButton';
}

function NavBtnDown(Btn){
  Btn.className = 'NavButtonDown';
}
*/
//this script is needed to set the dimensions of the iframe
function resizeIframe(obj) {
    obj.style.height = (obj.contentWindow.document.body.scrollHeight) + 'px'
}
