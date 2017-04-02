/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */

var description = [];
var answers = [];
var qno = 0;
var ano = 0;
var incorrect = 0;
$(document).ready(function() {
    // load xml file using jquery ajax
    // TODO: change to native JavaScript
    $.ajax({
        type: "GET",
        url: "store.xml",
        dataType: "xml",
        success: function(d) {
            $(d).find('block').each(function() {
                var $book = $(this); // = block
                // create boxes under #box
                var q = 0;
                $book.find('box').each(function() {
                    $("#box").append('<div id=q' + q + '><p>' + $(this).text() + '</p></div>');
                    description.push($(this).text());
                    q++;
                });
                // create answer cards under #ans
                var a = 0;
                $book.find('question').each(function() {
                    var ele = $('<div id=a' + a + '><p>' + $(this).html() + '</p></div>');
                    $("#ans").append(ele);
                    answers.push($(this).text());
                    a++;
                });
            });

            // shorthand for $(document).ready(function() { ... });
            // jQuery not necessary
            $(function() {
                var parent = $("#ans");
                var divs = parent.children();
                // divs.length is implicit true if not 0
                while (divs.length) {
                    // randomizing the order of answer cards
                    parent.append(divs.splice(Math.floor(Math.random() * divs.length), 1)[0]);
                }
                // counting for score calculation
                qno = $("#box > div").length;
                ano = $("#ans > div").length;
            });
        }
    });

    // shorthand for ajax function.
    //   url: 'store.xml',
    //   success: function(d) {...}
    $.get('store.xml', function(d) {
        var n = 0;
        var aa = 0;
        // second parameter(d) is context
        $('block', d).children().each(function() {
            // setting the boxes droppable by using jQuery UI
            // can be done with JavaScript or should use jQuery UI?
            $('#q' + n).droppable({
                accept: '#ans div',
                hoverClass: 'hovered',
                drop: handleCardDrop
            });

            // question element is not used inside.
            // just used to loop for the number of answers.
            $(this).find('question').each(function() {
                // setting attribute (e="q0" or e="q1") to each answer cards
                $('#a' + aa).attr('e', 'q' + n);

                // setting the answer cards draggable by using jQuery UI
                $('#a' + aa).draggable({
                    containment: 'body',
                    stack: '#ans div',
                    cursor: 'move',
                    revert: true
                });
                aa++;
            });
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
        ui.draggable.addClass('correct');
        ui.draggable.draggable('disable');
        ui.draggable.draggable('option', 'revert', false);
    } else {
        incorrect++;
    }
}

function coun() {
    var url = $(location).attr('href');
    var tech = url.substring(url.indexOf('=') + 1);
    var unplaced = ano - correct;
    var aqminus = ano * (qno - 1);
    var score = 100 - (200 * incorrect / aqminus) - (100 * unplaced / ano);
    $.ajax({
        url: 'score.php', //This is the current doc
        type: "POST",
        data: 'event=' + tech + '&score=' + score,
    })

    // TODO: this part can be done without jQuery
    // this should be done by View
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
