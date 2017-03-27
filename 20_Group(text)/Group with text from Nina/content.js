/* jshint undef: true, unused: true, esversion: 6, asi: true */

var description = [];
var answers = [];
var qno = 0;
var ano = 0;
var incorrect = 0;
$(document).ready(function() {
    // load xml file using jquery ajax
    $.ajax({
        type: "GET",
        url: "store.xml",
        dataType: "xml",
        success: function(d) {
            $(d).find('block').each(function() {
                var $book = $(this);
                var q = 0;
                $book.find('box').each(function() {
                    $("#box").append('<div id=q' + q + '><p style="text-align:center;background:#ffd;">' + $(this).text() + '</p></div>');
                    description.push($(this).text());
                    var iid = $(this).text();
                    q++;
                });
                console.log(q);
                var a = 0;
                $book.find('question').each(function() {
                    var ele = $('<div id=a' + a + '><p style="text-align:center;margin-left:8px;margin-right:8px;">' + $(this).text() + '</p></div>');
                    // console.log($(this).text());
                    $("#ans").append(ele);
                    var id = $(this).text();
                    answers.push($(this).text());
                    console.log(answers);
                    a++;
                });
                console.log(description.length);
            });


            $(function() {
                var parent = $("#ans");
                var divs = parent.children();
                while (divs.length) {
                    parent.append(divs.splice(Math.floor(Math.random() * divs.length), 1)[0]);
                }
                qno = $("#box > div").length;
                ano = $("#ans > div").length;
                console.log(qno);
                console.log(ano);
            });
        }
    });

    $.get('store.xml', function(d) {
        var n = 0;
        var aa = 0;
        $('block', d).children().each(function() {
            var x = $(this).find('box').text();
            $('#q' + n).droppable({
                accept: '#ans div',
                hoverClass: 'hovered',
                drop: handleCardDrop
            });
            $(this).find('question').each(function() {
                var y = $(this).text();
                console.log($(this).text());
                $('#a' + aa).attr('e', 'q' + n);
                $('#a' + aa).draggable({
                    containment: 'body',
                    stack: '#ans div',
                    cursor: 'move',
                    revert: true
                });
                //console.log(aa);
                aa++;
            });
            // alert($(this).text());
            n++;
        });
    });
});

var correct = 0;

function handleCardDrop(event, ui) {
    var slotNumber = $(this).prop('id');
    var cardNumber = ui.draggable.attr("e");

    if (slotNumber == cardNumber) {
        correct++;
        console.log(correct);
        ui.draggable.addClass('correct');
        ui.draggable.draggable('disable');
        //$(this).droppable( 'disable' );
        //ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } );
        ui.draggable.draggable('option', 'revert', false);
    } else {
        incorrect++;
    }
}

function coun() {
    var url = $(location).attr('href');
    var tech = url.substring(url.indexOf('=') + 1);
    console.log(tech);
    console.log('inc' + incorrect);
    console.log('an' + ano);
    console.log('ques' + qno);
    var cid = $('#4').val();
    console.log('break');
    console.log('the course id' + cid);
    var unplaced = ano - correct;
    var aqminus = ano * (qno - 1);
    console.log('unp' + unplaced);
    var score = 100 - (200 * incorrect / aqminus) - (100 * unplaced / ano);
    var sc = $('#region-main', window.parent.document).find('input[name="mark"]').attr('value', score);;
    console.log('scoe' + sc);
    console.log(score);
    $.ajax({
        url: 'score.php', //This is the current doc
        type: "POST",
        data: 'event=' + tech + '&score=' + score,
        success: function(data) {
            console.log(data);
        }
    })

    $('#res').show();
    $('#res').append('<div><h1>Your Score: ' + Math.round(score) + ' %</h1></div>');
    $('#res').append('<div><h1>Passing Score: 80% </h1></div>');
    $('#res').append('<hr></hr><div><h2></h2><br></div>');
    if (score > 80) {
        $('#res').append('</hr><div><h2>To save this score in Moodle click "Continue" at the bottom of this screen. If you do not return to the course  page, use your back button. To redo this activity without saving the score, click "Try Again".   </h2><br></div>');
    } else {
        $('#res').append('<div><h2>To save this score in Moodle click "Continue" at the bottom of this screen. If you do not return to the course  page, use your back button. To redo this activity without saving the score, click "Try Again".  </h2><br></div>');
    }
    $('#res').append('<div><button onclick=hide();>Try again</button><br></div>');
}

function hide() {
    $('#res').hide();
    location.reload();
}

function saveScore() {
    var url = $(location).attr('href');
    var tech = url.substring(url.indexOf('=') + 1);
    console.log(tech);
    console.log('inc' + incorrect);
    console.log('an' + ano);
    console.log('ques' + qno);
    var cid = $('#4').val();
    console.log('break');
    console.log('the course id' + cid);
    var unplaced = ano - correct;
    var aqminus = ano * (qno - 1);
    console.log('unp' + unplaced);
    var score = 100 - (200 * incorrect / aqminus) - (100 * unplaced / ano);
    var sc = $('#region-main', window.parent.document).find('input[name="mark"]').attr('value', score);;
    console.log('scoe' + sc);
    console.log(score);
    $.ajax({
        url: 'score.php', //This is the current doc
        type: "POST",
        data: 'event=' + tech + '&score=' + score,
        success: function(data) {
            console.log(data);
        }
    });
}
