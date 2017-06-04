define("questions_model",["ko","lib/util"],function(ko,utils){


  //define the question answer pair object
  var question_answer_pair = function(question,answer) {
    var self = this;

    self.question = ko.observable(question);
    self.answer = ko.observable(answer);
    self.completed = ko.observable(false);
    self.answer_correct = ko.observable(false);
    self.attempted = ko.observable(false);

    self.answer_question = function(is_correct) {
      if ( is_correct ) {
        self.answer_correct(true);
        self.completed(true);
      }
    }
  };

  //the model that contains the question answer pairs
  var questions_model = function() {
    var self = this;

    //observables
    self.current_question = ko.observable(new question_answer_pair("",""));
    self.question_answer_pairs = ko.observableArray();
    self.questions_attempted = ko.observable(0);
    self.questions_correct = ko.observable(0);

    self.incomplete_questions = ko.computed(function(){
      return ko.utils.arrayFilter(self.question_answer_pairs(),function(pair){
        return ! pair.completed();
      });
    });

    self.finished = ko.computed(function() {
      return self.incomplete_questions().length == 0
    });

    self.score = ko.computed(function(){
      return Math.round((self.questions_correct() / self.question_answer_pairs().length) * 100);
    });

    self.reset = function() {
      self.current_question(null);
      self.question_answer_pairs([]);
      self.questions_attempted(0);
      self.questions_correct(0);
    };

    self.is_answer_a_match = function(answer) {
      if ( answer.question() == self.current_question().question() ) {
        return true;
      }
      else {
        return false;
      }
    };

    self.attempt_match = function(answer) {
      self.questions_attempted(self.questions_attempted() + 1);
      answer.attempted(true);

      if ( answer.question() == self.current_question().question() ) {
        self.question_answer_pairs()[self.question_answer_pairs.indexOf(answer)].answer_question(true);
        self.load_random_question();
        self.questions_correct(self.questions_correct() + 1);
        return true;
      }
      else {
        return false;
      }
    };

    //get pairs from loaded json object and map to the model
    self.set_pairs = function(pairs_array, question_count) {
      if ( !question_count || question_count > pairs_array.length ) {
        question_count = pairs_array.length
      }

      for ( var i = 0; i < question_count; i++ ) {

        self.question_answer_pairs.push(
          new question_answer_pair(
            pairs_array[i].question,
            pairs_array[i].answer
          )
        );
      }
    };

    self.load_random_question = function() {
      self.current_question(self.incomplete_questions().random());
    };
  };

  return questions_model;

});
