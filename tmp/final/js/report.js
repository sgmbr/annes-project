/* jshint undef: true, unused: true, esversion:6, asi: true, browser: true, jquery: true */
var hotpot_api = function() {
    var self = this
    // Members
    self.FORM = null
    self.m_startTime = null
    self.m_score = null

    self.findAPI = function(p_window, is_recursed) {
      // Find the top level window
		while (p_window.document.getElementById("store") === null &&
			p_window.parent !== null &&
			p_window.parent !== p_window)
		{
			p_window = p_window.parent
		}
		self.FORM = p_window.document.getElementById("store")

		// Recursion (if API not found) :D
		if (!is_recursed && (self.FORM === null) && (p_window.opener !== null)){
			// True prevents infinite recursion
			self.findAPI(p_window.opener, true)
		}
    }

    self.initialise = function(p_window) {
		self.findAPI(p_window, false);

		if (self.FORM){
			self.m_startTime = (new Date()).getTime()
		}
		else{
			console.log("HotPot Form not found!")
		}
    }

    self.finish = function() {
		if (self.FORM === null) return
		if (self.m_score === null) return
		self.FORM.starttime.value = self.m_startTime
		self.FORM.endtime.value = (new Date()).getTime()
		self.FORM.mark.value = self.m_score
		//self.FORM.detail.value = Detail
		self.FORM.submit()
    }

	// Score must be int between 0-100
    self.set_score = function(p_score) {
		if (self.FORM === null) return
		self.m_score = p_score
    }

    // passed, failed, completed, incomplete and browsed
    self.report_status = function(p_status) {
		if (self.FORM === null) return;
    }
  }
