define("memory_model",["ko","lib/util","lib/xml"],function(ko,utils,xml_parser) {

  var tile = function(question,answer,options) {
    var self = this;

    self.hidden_value = ko.observable("");
    self.shown_value = ko.observable("");

    self.completed = ko.observable(false);
    self.answer_correct = ko.observable(false);
    self.attempted = ko.observable(false);
    self.question = ko.observable(question);
    self.answer = ko.observable(answer);
    self.open = ko.observable(false);
  

    //all tiles contain both answer and question to simplify checking
    //if an answer is correct
    if ( options.is_question ) {
      self.hidden_value(answer);
      self.shown_value(question);
    }
    else {
      self.hidden_value(question);
      self.shown_value(answer);
    }
  };


  //the model that contains the memory tiles
  var memory_model = function() {
    var self = this;

    //observables
    self.memory_tiles = ko.observableArray();
    self.questions_attempted = ko.observable(0);
    self.questions_correct = ko.observable(0);

    self.incomplete_questions = ko.computed(function(){
      return ko.utils.arrayFilter(self.memory_tiles(),function(tile){
        return ! tile.completed();
      });
    });

    self.finished = ko.computed(function() {
      return self.incomplete_questions().length == 0
    });

    self.score = ko.computed(function(){
      return Math.round((self.questions_correct() / (self.memory_tiles().length / 2)) * 100);
    });

    self.reset = function() {
      self.memory_tiles([]);
      self.questions_attempted(0);
      self.questions_correct(0);
    };

    self.is_answer_a_match = function(tile, other_tile) {
      if ( tile.question() == other_tile.question() ) {
        return true;
      }
      else {
        return false;
      }
    };

    self.attempt_match = function(tile, other_tile) {
      self.questions_attempted(self.questions_attempted() + 1);

      if ( tile.question() == other_tile.question() ) {
        tile.completed(true);
        other_tile.completed(true);
        self.questions_correct(self.questions_correct() + 1);
        return true;
      }
      else {
        return false;
      }
    };

    //get pairs from loaded array and map to the model
    self.set_pairs = function(pairs_array) {
		pairs_array.shuffle();
      var question_count = xml_parser.question_number();
      var memory_tiles = [];
	   
      if ( config.number_of_questions && config.number_of_questions <= question_count ) {
        question_count = config.number_of_questions;
      }
      else {
        question_count = question_count
      }

      for ( var i = 0; i < question_count; i++ ) {

        //add a tile for each question and a tile for each answer
        memory_tiles.push(
          new tile(
            pairs_array[i].question,
            pairs_array[i].answer,
            { is_question: true }
          )
        );

        memory_tiles.push(
          new tile(
            pairs_array[i].question,
            pairs_array[i].answer,
            { is_question: false }
          )
        )
      }

      memory_tiles.shuffle();
      self.memory_tiles(memory_tiles);
    };
  };

  return memory_model;

});
