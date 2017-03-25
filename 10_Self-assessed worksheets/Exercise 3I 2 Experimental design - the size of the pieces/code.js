
var score = 0;
var totalScore = 0;
var visibleCheckboxes = 0;
var totalCheckboxes = 15;
var iFrameScrollY= 0;
var headTop = 0;
var headHeight = 0;


$(parent.window).scroll(function() {  
    var scroll = $(parent.window).scrollTop();
  $("#div").css({"margin-top": ($(parent.window).scrollTop() + $(document).scrollTop()) +"px"});
});

function scrolled(el){
	document.getElementById("div").style.top = document.body.scrollTop+8;
}
function toggleBold (obj) {
    document.execCommand ('bold', false, null);
	highlight(obj);
}
function toggleItalic (obj) {
    document.execCommand ('italic', false, null);
	highlight(obj);
}
function toggleUnderline (obj) {
    document.execCommand ('underline', false, null);
	highlight(obj);
}
function toggleSub (obj) {
    document.execCommand ('subscript', false, null);
	highlight(obj);
}
function toggleSuper (obj) {
    document.execCommand ('superscript', false, null);
	highlight(obj);
}
 
function highlight(obj){
	if(obj.style.borderColor  === 'rgb(255, 255, 255)'){
		obj.style.borderColor = "#CCC";
	}else{
		obj.style.borderColor = "#FFF";}
}
function myFunction(e) {
	cleanBorders();
    var x = e.target;
	var obj = e.target.nodeName.toLowerCase();
	if(obj != "p"){
		while(obj != "p"){
			if(obj  == 'i'){
				document.getElementById("i").style.borderColor="#CCC";
			}
			if(obj  == 'u'){
				document.getElementById("u").style.borderColor="#CCC";
			}
			if(obj  == 'b'){
				document.getElementById("b").style.borderColor="#CCC";
			}
			if(obj  == 'sub'){
				document.getElementById("sub").style.borderColor="#CCC";
			}
			if(obj  == 'sup'){
				document.getElementById("sup").style.borderColor="#CCC";
			}
			x = x.parentNode.nodeName;
			obj = x.toLowerCase();
		}
	}
}
function cleanBorders(){
		var btns = document.getElementsByClassName("intLink");
		for(var i=0; i<btns.length; i++){
			btns[i].style.borderColor="#FFF";
		}
}
function SwitchToMark(Btn){
                var bID = parseInt(Btn.id);
                findAndDisable(bID+'txt');
                findAndDisplay(bID+'hiddenText');
                Btn.className = 'hidden';
}

function findAndDisable(first){
	var container = document.getElementsByName(first);
	for(var i=0; i<container.length; i++){
	container[i].contentEditable = "false";
	}
}
function findAndEnable(first){
	var container = document.getElementsByName(first);
	for(var i=0; i<container.length; i++){
	container[i].disabled = false;
	}
}
function findAndDisplay(first){
	var container = document.getElementsByName(first);
	for(var i=0; i<container.length; i++){
	container[i].className='showBlock';
	}
}
function adjustScore(chb){
	if(chb.checked){
		score++;
	}else{
		score--;
	}
	printScore();
}

function printScore(){
	totalScore = Math.floor((100*score)/totalCheckboxes);
	document.getElementById('ttt').innerHTML = "Total Score:&nbsp;"+totalScore+" %";
}
function coun(Btn){
	
	var url=$(location).attr('href');
	var tech= url.substring(url.indexOf('=')+1);
	var cid=$('#4').val();

	var sc=$('#region-main', window.parent.document).find('input[name="mark"]').attr('value',totalScore);

	console.log(totalScore);
  	$.ajax({
            url: 'score.php',
            type: "POST",
            data: 'event='+tech+'&score='+totalScore,
            success: function(data){
				console.log(data);
           }
        });
	$('#res').show();
	$('#res').append('<div><br/>&nbsp;&nbsp;<b> Your Score: '+Math.round(totalScore) +' %</b></div>');
	$('#res').append('<hr/>');
	$('#res').append('<div>&nbsp;&nbsp; Thank you. Your score has now been saved.</div><div>&nbsp;&nbsp; Press Continue to send this score to Moodle.</div>');
	Btn.className="hidden";
}

function ShowInsruction(Btn){
	Btn.className="hidden";
	document.getElementById("instrtn").className="showBlock";
}
function hideInstructn(){
	document.getElementById("instrtn").className="hidden";
	document.getElementById("insn").className="showBlock";
}
function saveScore(){
	var url=$(location).attr('href');
	var tech= url.substring(url.indexOf('=')+1);
	var cid=$('#4').val();

	var sc=$('#region-main', window.parent.document).find('input[name="mark"]').attr('value',0);
  	$.ajax({
            url: 'score.php',
            type: "POST",
            data: 'event='+tech+'&score='+totalScore,
            success: function(data){
				console.log(data);
           }
        });
}

