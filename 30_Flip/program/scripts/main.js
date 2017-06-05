(function () {
  "use strict"

  //define functions
  var boot;
  var define_3rd_party_libs;
  var load_falldown_plugin;
  var run;

  require.config({
      paths: {
          lib: 'lib',
          vendor: 'lib/vendor',
          res: 'res',
          text: 'lib/vendor/text',
          ko: 'lib/vendor/knockout-2.3.0',
          jquery: 'lib/vendor/jquery-1.12.4.min'
      },
      shim: {
        "vendor/buzz.min": {
          exports: "buzz"
        },
        "vendor/jquery-ui": {
          deps: ["jquery"]
        },
        "vendor/jquery.flip": {
          deps: ["jquery","vendor/jquery-ui"]
        },
        "vendor/jquery.falldown": {
          deps: ["jquery"]
        },
        "vendor/jquery-animate-css-rotate-scale": {
          deps: ["jquery"]
        },
        "vendor/jquery-css-transform": {
          deps: ["jquery"]
        }
      },
      config: {
        text: {
          //for local testing
          useXhr: function (url, protocol, hostname, port) {
            if ( protocol == "file" ) {
              return false;
            }
            else {
              return true;
            }
          }
        }
      }
  });

  load_falldown_plugin = function() {
    require(["vendor/jquery-animate-css-rotate-scale","vendor/jquery-css-transform"],function(){
      //loaded deps of jquery falldown
      require(["vendor/jquery.falldown"],function(){
        //loaded falldown
      });
    });
  }

  boot = function () {
      load_falldown_plugin();
      run();
  };

  run = function () {
    require(["game","ko","lib/util","lib/custom_bindings","vendor/jquery.flip"], function (game,ko) {
        ko.applyBindings(game, document.getElementById("game"));
        game.start_game(config.xml_path);
    });
  };

  boot();

})();
