define("game",["jquery","ko","lib/xml","questions_model","lib/" + config.reporting,"lib/sound","vendor/jquery.falldown"],function($,ko,xml_parser,questions_model,reporting,sound) {

 // the flip view model.
 var game = function() {
    var self = this;

    self.questions = new questions_model();
    //global answer message to tell if question is correct or not.
    self.answer_message = ko.observable("");
    self.attempted_card_back = null;

    self.pair_array = null;
    self.game_xml_path = null;

    //observables
    self.final_message = ko.observable("");
    self.sudden_death = ko.observable(true);
    self.sudden_death_message = ko.computed(function() {
      var message = self.sudden_death() ? "Turn off sudden death" : "Turn on sudden death";
      return message;
    });

    self.sounds = {
      victory: "victory",
      fail: "fail",
      correct: "correct",
      incorrect: "incorrect"
    };

    self.restart_game = function() {
		if ( self.flipped == false)
		{
			self.final_message("");
			self.questions.reset();
			self.start_game(self.game_xml_path);
			$("#question-zone,#answer-zone").fadeIn();
		}
    }

    self.start_game = function(game_xml_path) {
      self.game_xml_path = game_xml_path;
      self.configure_game();

	  self.flipped = false;
      $('#region-main', window.parent.document).find('input[name="mark"]').attr('value', 0)
    };

    self.toggle_sudden_death = function() {
      self.sudden_death(! self.sudden_death());
    }

    self.configure_game = function() {
      xml_parser.load_xml_async(self.game_xml_path,
      {
        done: function() {
          self.pair_array = xml_parser.get_as_array();
          self.questions.set_pairs(self.pair_array);
          self.load_new_question();
          notifyIframe();
        }
      });

    document.getElementById("btnSubmit").addEventListener('click',function() {
		self.finish();
    });


	self.displayScore = function() {
        scoreElement = document.getElementById('scoreDisplay');
        scoreElement.innerHTML = "Score: " + self.questions.score() + "%";
    }

	self.attempt_answer = function(answer,event) {
        var $target = $(event.currentTarget);

        if ( ! answer.completed() && ( self.flipped == false)) {
		  self.flipped = true;
          if ( self.questions.is_answer_a_match(answer) ) {
            self.answer_message("Correct!");
            sound.play_sound(self.sounds["correct"]);

            $target.flip({
              direction: 'tb',
              content: $target.find(".card-back-wrapper"),
              color: "white",
              onEnd: function() {
                setTimeout (function(){
                    self.questions.attempt_match(answer);
					self.displayScore();
                    if ( self.questions.finished() ) {
                      self.finish();
                    }
                    else {
                      $target.flip({
                        direction: "tb",
                        content: $target.find(".card-wrapper"),
                        color: "white"
                      });
					  self.flipped = false;
                    }
                },500);
              }
            });
          }
          else {
            self.answer_message("Wrong!");
            sound.play_sound("incorrect");

            if ( self.sudden_death() ) {
              $target.flip({
                direction: 'tb',
                content: $target.find(".card-back-wrapper"),
                color: "white",
                onEnd: function() {
                  setTimeout (function(){
                    self.finish();
                  },500);
                }
              });
            }
			else
			{
				self.flipped = false;
			}
          }
        };
      }
    };

    self.load_new_question = function() {
      self.questions.load_random_question();
    };

    self.finish = function() {
      var falldown_effects = [
          'top-left',
          'top-right',
          'bottom-left',
          'bottom-right'
      ];

      $.each($(".answer-tile"), function() {
        var card = this;
        window.setTimeout(
          function() {
            $(card).fallDown(
              {
                corner: falldown_effects.random(),
                speed: Math.floor(Math.random() * (1500 - 500 + 1)) + 500
              }
            );
          },
          Math.floor(Math.random() * (1000 - 500 + 1)) + 500
        );

      });

      window.setTimeout(function(){
        $("#question-zone").fadeOut({
            complete: function() {
              if ( self.questions.score() < 80 ) {
                //fail result
                reporting.report_status(reporting.status_codes.fail);
                self.final_message("Sorry you failed this time, but try again!");
              }
              else {
                //pass result
                reporting.report_status(reporting.status_codes.pass);
                self.final_message("Well done! A great result!");
              }

			  $('#region-main', window.parent.document).find('input[name="mark"]').attr('value', self.questions.score())
              //reporting.set_score(self.questions.score());
              //reporting.finish();
            }
        });

        $("#answer-zone").fadeOut();
		self.flipped = false;
		notifyIframe(100);
      }, 2000);
    };


 };

 return new game();
});
