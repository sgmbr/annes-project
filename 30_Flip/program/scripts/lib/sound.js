define("lib/sound",["jquery","lib/vendor/buzz.min"],function($,buzz) {

  var sound = function() {
    var self = this;
    self.sounds = {};

    self.configure_sounds = function() {
      if (config.sounds) {
        $.each(config.sounds, function(key,value) {
          self.sounds[key] = new buzz.sound(config.base_url + config.sounds_url + "/" + value);
        });
      }
    };

    self.play_sound = function(key) {
      if ( self.sounds[key] ) {
        self.sounds[key].play();
      }
    };
  };

  var lib = new sound();
  lib.configure_sounds();
  return lib;

});