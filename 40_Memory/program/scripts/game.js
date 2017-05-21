define("game",["jquery","ko","lib/xml","memory_model","lib/" + config.reporting,"lib/sound","vendor/jquery.falldown"],function($,ko,xml_parser,memory_model,reporting,sound) {

 // the flip view model.
 var game = function() {
    var self = this;

    //memory tiles model
    self.memory_model = new memory_model();

    self.pair_array = null;
    self.game_xml_path = null;

    //observables
    self.active_tile = ko.observable();
    self.match_begun = ko.observable(false);
    self.final_message = ko.observable("");
	self.score = self.memory_model.score;
    self.$active_tile = null;
    self.$active_tile_original = null;
	self.flip_tile_number = 0;
    self.sounds = {
      victory: "victory",
      fail: "fail",
      correct: "correct",
      incorrect: "incorrect"
    };

    self.restart_game = function() {
      self.final_message("");
      self.memory_model.reset();
      self.start_game(self.game_xml_path);
      self.active_tile(null);
      self.match_begun(false);
      $("#answer-zone").fadeIn();
    }

	self.set_answer_zone = function(){

	}

    self.start_game = function(game_xml_path) {
      self.game_xml_path = game_xml_path;
      self.configure_game();
    };

    self.check_iframe_dimension = function() {
		notifyIframe();
	 }

    self.toggle_sudden_death = function() {
      self.sudden_death(! self.sudden_death());
    }

    self.configure_game = function() {
      xml_parser.load_xml_async(self.game_xml_path,
      {
        done: function() {
            self.pair_array = xml_parser.get_as_array();
            self.memory_model.set_pairs(self.pair_array);
            //let zone = document.getElementById('answer-zone')
            //let questions = xml_parser.question_number()
            //let height = 50*questions
            //document.getElementById('game').style.height = (height+50)+ 'px'
            //parent.resizeIframe(questions)
            //zone.style.height = height+ "px";
            self.check_iframe_dimension();
        }
      });

      self.attempt_answer = function(tile,event) {
        if ( ! tile.completed() && self.active_tile() !== tile ) {
          var $target = $(event.currentTarget);

          if ( ! self.active_tile() ) {
            self.active_tile(tile);
            self.$active_tile = $(event.currentTarget);
            self.$active_tile_original = self.$active_tile.get(0).innerHTML;
          }
          else {
            var $original_content = $target.get(0).innerHTML;
          }
		if(self.flip_tile_number<=1){
          $target.flip({
            direction: 'tb',
            content: $target.find(".card-back-wrapper"),
            color: "white",
            onBefore: function() {
              self.flip_tile_number = self.flip_tile_number+1;
            },
            onEnd: function() {
              setTimeout (function(){
                  //matching has begun. check if this tile matches the last one clicked
                  if ( self.match_begun() ) {
                    if ( self.memory_model.is_answer_a_match(self.active_tile(),tile) ) {
                      self.memory_model.attempt_match(self.active_tile(),tile);
                      $target.addClass('green');
                      self.$active_tile.addClass('green');
                      sound.play_sound(self.sounds["correct"]);
                        self.flip_tile_number = 0;
                    }
                    else {
                      var $rebound_active_tile;
                      var $rebound_answer_tile;
                      self.flip_tile_number = 0;

                      $target.flip({
                        direction: "tb",
                        content: $rebound_answer_tile = $.parseHTML($original_content),
                        color: "white"
                      });

                      self.$active_tile.flip({
                        direction: "tb",
                        content: $rebound_active_tile = $.parseHTML(self.$active_tile_original),
                        color: "white"
                      });

                      //rebind elements destroyed by flip
                      ko.cleanNode($rebound_answer_tile);
                      ko.cleanNode($rebound_active_tile);
                      sound.play_sound(self.sounds["incorrect"]);

                    }

                    self.match_begun(false);
                    self.active_tile(null);
                  }

                  else {
                    self.match_begun(true);
                  }

                  if ( self.memory_model.finished() ) {
                    self.finish();
                  }

              },500);

            }
          });

          }
        }
      }
    };

    self.finish = function() {
      $("#answer-zone").fadeOut({
          complete: function() {
            if ( self.memory_model.score() < 100 ) {
              //fail result
			  reporting.set_score(self.memory_model.score());
              reporting.report_status(reporting.status_codes.fail);
              self.final_message("Sorry you failed this time, but try again!");
            }
            else {
              //pass result
              reporting.report_status(reporting.status_codes.pass);
              self.final_message("Well done! A great result!");
            }

            reporting.set_score(self.memory_model.score());
            reporting.finish();
          }
      });
    };

 };

 return new game();
});
