define("lib/scorm_api",["lib/reporting_status_codes"],function(status_list){
  // Scorm
  // http://doc.claroline.net/en/index.php/How_do_I_create_SCORM_content%3F
  var scorm_api = function() {
    var self = this;

    self.status_codes = status_list;

    // 'constants'
    self.STATUS = "cmi.core.lesson_status";
    self.SCORE = "cmi.core.score.raw";

    // Members
    self.API = null;

    self.find_api = function(p_window, is_recursed) {
      // Find the top level window
      while (p_window.API == null &&
           p_window.parent != null &&
           p_window.parent != p_window)
      {
        p_window = p_window.parent;
      }

      self.API = p_window.API;

      // Recursion (if API not found) :D
      if (!is_recursed && (self.API == null) && (p_window.opener != null))
      {
        // True prevents infinite recursion
        self.find_api(p_window.opener, true);
      }
    };

    self.initialise = function(p_window) {
      self.find_api(p_window, false);

      if (self.API)
      {
        self.API.LMSInitialize("");
      }
      else
      {
        console.log("SCORM API not found. Scores and progress will not be recorded.");
      }
    };

    self.finish = function() {
      if (self.API)
      {
        self.API.LMSFinish("");
      }
    };

    // Score must be int between 0-100
    self.set_score = function(p_score) {
      if (self.API == null) return;

      self.API.LMSSetValue(self.SCORE, p_score);
    };

    // passed, failed, completed, incomplete and browsed
    self.report_status = function(p_status) {
      if (self.API == null) return;

      //var value = self.API.LMSGetValue(self.SCORE);
      self.API.LMSSetValue(self.STATUS, p_status);
    };
  };

  var scorm = new scorm_api();
  scorm.initialise(window);
  return scorm;
});