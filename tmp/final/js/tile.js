/* jshint undef: true, unused: true, esversion: 6, asi: true */
//The card and its attributes
function Tile(question,answer,isQuestion) {
    
	var self = this
    self.hiddenValue = ko.observable("")
    self.shownValue = ko.observable("")
    self.completed = ko.observable(false)
    self.question = ko.observable(question)
    self.answer = ko.observable(answer)
//If the card is a question card, it will show the question on the HTML page. 
//If not, it will display the answer.
    if ( isQuestion ) {
      self.hiddenValue(answer)
      self.shownValue(question)
    }
    else {
      self.hiddenValue(question)
      self.shownValue(answer)
    }
  }