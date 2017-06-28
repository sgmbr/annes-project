//QuizController delegate tasks to QuizView and Quiz
//Notifies QuizView as Quiz.totalScore is updated
class QuizController {
    constructor(quiz) {
        this.view = [];
        this.model = quiz;
    } 
    
    attach(view) {
        this.view = view;
    }
    
    updateScore() {
        this.model.setTotalCheckboxes(this.view.getCheckboxCount());
        this.model.setScoreCount(this.view.getTickedCheckboxCount());        
        this.model.calculateScore();      
        this.notifyScore();
    }
    
    notifyScore(value) {
        this.view.printScore(this.model.getScore());
    }
    
    initialize() {
        window.addEventListener("onbeforeunload", this.view.saveScore, false);   
        window.addEventListener("resize", this.view.throttleIframe, false);
        window.addEventListener("orientationchange", this.view.throttleIframe, false);
        this.view.notifyIFrame();
    }
    
    reportScoreToMoodle() {
        this.updateScore();
        this.view.saveScore(this.model.getScore());
        this.view.displayResult(this.model.getScore());
        this.view.disableAllCheckboxes();
    }
}