//Call Javascript code automatically on page load. 
//Instantiate Model, View and Controller.
//Initialize Controller.
$(document).ready(function(){
    let controller = new QuizController(new Quiz);
    let view = new QuizView(controller);
    controller.initialize();
});