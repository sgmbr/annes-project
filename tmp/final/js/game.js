/* jshint undef: true, unused: true, esversion:6, asi: true, browser: true, jquery: true */
// the flip view model.
function Game () {
    var self = this

    //Memory tiles model
    self.memoryModel = new MemoryModel()
	//Report score api.
	self.api = new hotpot_api()
	
	//Set the pairs to be none.
    self.pairArray = null
	
	//Set the default question number to be 10.
	self.questionsNum = 10
	self.flippedNum = 0
    //observables
    self.activeTile = ko.observable()
    self.matchBegin = ko.observable(false)
	self.finalMessage = ko.observable("")
	self.score = self.memoryModel.score
    self.$activeTile = null
    self.$activeTileOriginal = null
	
    self.soundsPath = {
		correct: "sounds/correct.wav",
		incorrect: "sounds/incorrect.wav"
    }
	
	self.scoreStatus = {
		incomplete: "incomplete",
		pass: "passed",
		fail: "failed"
	}
	
	//Restart the game.
	self.restartGame = function() {
		self.finalMessage("")
		self.memoryModel.reset()
		self.startGame(self.pairArray, self.questionsNum)
		self.activeTile(null)
		self.matchBegin(false)
		self.flippedNum = 0
		$("#answer-zone").fadeIn()
    }
	
	//Start the game.
	self.startGame = function( pairArray, questionsNum ) {
		self.pairArray = pairArray
		if (self.questionsNum >= questionsNum){
			self.questionsNum =  questionsNum
		}
		self.configureGame()
	}
	
	//Configure the game.
	self.configureGame = function() {
		
		self.memoryModel.setPairs (self.pairArray,self.questionsNum)
		//Click the card and attemp answer.
		self.attemptAnswer = function(tile,event) {
			//At most two tiles can be flipped at the same time.
			if (self.flippedNum <= 1){
				
				//Only the unflipped card and encompleted card can be flipped to front side. 
				if ( ! tile.completed() && self.activeTile() !== tile ) {
					var $target = $(event.currentTarget)
					
					//Check the card you click is the first or second card.
					//If it is the first one, the match will not begin.
					//If it is the second one, the match will begin to check whether these two cards are matched.
					if ( ! self.activeTile() ) {
						self.activeTile(tile)
						self.$activeTile = $(event.currentTarget)
						self.$activeTileOriginal = self.$activeTile.get(0).innerHTML
					}
					else {
						var $originalContent = $target.get(0).innerHTML
					}
		
					//Flip the card you click.
					//Define the flip direction, find the content after flip, the color and actions before and after flip.
					$target.flip({
						direction: 'tb',
						content:  $target.find(".card-back-wrapper"),
						color: "white",			
						onBefore: function() {
							//Increase the flipped card number, as only two cards can be flipped at the same time.
							self.flippedNum = self.flippedNum+1
						},
						onEnd: function() {
							setTimeout (function(){
							  //Matching has begun. Check if this tile matches the last one clicked
								if ( self.matchBegin() ) {
									//If these two cards are matched.
									if ( self.memoryModel.isMatch(self.activeTile(),tile) ) {
										self.memoryModel.attemptMatch(self.activeTile(),tile)
										$target.addClass('complete')
										self.$activeTile.addClass('complete')
										//Play the sound of correct.
										new buzz.sound(self.soundsPath.correct).play()
										
										//Clear the number of flipped cards.
										self.flippedNum = 0
									}
									
									//If these two cards are not matched, both of them flip back.
									else {								
										var $reboundActiveTile
										var $reboundAnswerTile
								
										$target.flip({
											direction: "tb",
											content: $reboundAnswerTile = $.parseHTML($originalContent),
											color: "white",
											onEnd: function() {
											
											}
										})

										self.$activeTile.flip({
											direction: "tb",
											content: $reboundActiveTile = $.parseHTML(self.$activeTileOriginal),
											color: "white",
											onEnd: function() {
												self.flippedNum = 0
											}
										})
									
										//Rebind elements destroyed by flip
										ko.cleanNode($reboundAnswerTile)
										ko.cleanNode($reboundActiveTile)
										//Play the sound of incorrect.
										new buzz.sound(self.soundsPath.incorrect).play()
								 
									}
									//Set the match not to begin and clear the stored tile.
									self.matchBegin(false)
									self.activeTile(null)
								
								}

								else {
									self.matchBegin(true)
								}
								
								//When all the cards are matched, the game is finished. 
								if ( self.memoryModel.finished() ) {
									self.finish()								
								}

							},500)
						}
					})
				}
			}
		}
	}
	
	//Actions when finishing the game.
	self.finish = function() {
		self.api.initialise(window)
		//Answer zone is hidden.
		$("#answer-zone").fadeOut({
			complete: function() {
				//Set the fail mark.	
				if ( self.score() < 100 ) {
					//fail result
					self.api.set_score(self.score())
					self.api.report_status(self.scoreStatus.fail)
					self.finalMessage("Sorry you failed this time, but try again!")
				}
				else {
					self.api.set_score(self.score())
					self.api.report_status(self.scoreStatus.pass)
					self.finalMessage("Well done! A great result!")
				}
				self.api.finish()
			}
		})
    }
	
}