//Quiz handles the back end logic
class Quiz {
    constructor() {
    this.totalScore = 0;
    this.scoreCount = 0;
    this.totalCheckboxes = 0;
    }
    
    calculateScore() {
        this.totalScore = Math.floor((100 * this.scoreCount) / this.totalCheckboxes);
    }
    
    setScore(newValue) {
        this.totalScore = newValue;
    }
    
    setScoreCount(newValue) {
        this.scoreCount = newValue;
    }
    
    setTotalCheckboxes(newValue) {
        this.totalCheckboxes = newValue;
    }
    
    getScore() {
        return this.totalScore;
    }
    
    getScoreCount() {
        return this.scoreCount;
    }
    
    getTotalCheckboxes() {
        return this.totalCheckboxes;
    }
}