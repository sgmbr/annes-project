/* jshint undef: true, unused: true, esversion:6, asi: true, browser: true, jquery: true */
//The model that contains the memory tiles
function MemoryModel () {
    var self = this

    //observables
    self.memoryTiles = ko.observableArray()
    self.questionsAttempted = ko.observable(0)
    self.questionsCorrect = ko.observable(0)
		
	//Whether the question is completed.
    self.incompleteQuestions = ko.computed(function(){
		return ko.utils.arrayFilter(self.memoryTiles(),function(tile){
			return ! tile.completed()
		})
    })
	
	//Whether all the questions are completed.
    self.finished = ko.computed(function() {
		return self.incompleteQuestions().length === 0
    })
	
	//Calculate the score.
    self.score = ko.computed(function(){
		return Math.round((self.questionsCorrect() / (self.memoryTiles().length / 2)) * 100)
    })
	
	//Reset the model.
    self.reset = function() {
		self.memoryTiles([])
		self.questionsAttempted(0)
		self.questionsCorrect(0)
    }
	
	//Check whether two tiles are matched
    self.isMatch = function(tile1, tile2) {
		if ( tile1.question() == tile2.question() ) {
			return true
		}
		else {
			return false
		}
    }
	
	//Shuffle function to shuffle a given array.
	self.shuffle = function (tilesArray){
		let currentIndex = tilesArray.length, temporaryValue, randomIndex

		// While there remain elements to shuffle.
		while ( currentIndex > 0 ) {

			// Pick a remaining element.
			randomIndex = Math.floor(Math.random() * currentIndex)
			currentIndex -= 1

			// And swap it with the current element.
			temporaryValue = tilesArray[currentIndex]
			tilesArray[currentIndex] = tilesArray[randomIndex]
			tilesArray[randomIndex] = temporaryValue
		}

		return tilesArray
	}
	
	//Match two cards. If these two cards are matched, set the cards complete attrbute to be true. 
    self.attemptMatch = function(tile1, tile2) {
		self.questionsAttempted(self.questionsAttempted() + 1)

		if ( tile1.question() == tile2.question() ) {
			tile1.completed(true)
			tile2.completed(true)
			self.questionsCorrect(self.questionsCorrect() + 1)
			return true
		}
		else {
			return false
		}
    }

    //Get pairs from loaded array and map to the model.
    self.setPairs = function(pairsArray,number) {
		self.shuffle(pairsArray)
		
		let tilesArray = []
		
		for ( var i = 0; i < number; i++ ) {

			//Add a tile for each question and a tile for each answer.
			tilesArray.push(
				new Tile(pairsArray[i].question, pairsArray[i].answer, true )
			)

			tilesArray.push(
				new Tile(pairsArray[i].question, pairsArray[i].answer, false)
			)
		}
		
		//Shuffle the tiles array.
		self.shuffle(tilesArray)
		
		//Map the tiles array to the model.
		self.memoryTiles(tilesArray)
	}

}
	
