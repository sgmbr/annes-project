define("lib/xml",["text"],function() {

  var xml_parser = function() {
    var self = this;

    this.xml_doc = null;
    this.xml_string = null;

    this.get_as_array = function() {
      if (self.xml_string) {
        var xml = self.string_to_xml(self.xml_string);
        //filter just pairs
        return self.xml_pairs_to_array(xml.getElementsByTagName("pair"));

      }
      else {
        return [];
      }
    };

	this.question_number = function() {
		var array = []
		if (self.xml_string) {

        //filter question number
        array = self.string_to_xml(self.xml_string).getElementsByTagName("match")
		var number_of_memory_questions =  array[0].getAttribute('numberofmemoryquestions');
		//console.log(xml.getElementsByTagName("match").getAttribute('numberofmemoryquestions'))
		console.log('dddd')
		return number_of_memory_questions
      }

	}

    this.load_xml_async = function(file_path,callbacks) {
      require(["text!" + file_path],
        function(xml) {
          self.xml_string = xml;
          callbacks.done();
        }
      );
    };

    this.string_to_xml = function(xml_string) {
      if (window.DOMParser) {
          return ( new window.DOMParser() ).parseFromString(xml_string, "text/xml");
      } else if (typeof window.ActiveXObject != "undefined" && new window.ActiveXObject("Microsoft.XMLDOM")) {
        var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(xml_string);
        return xmlDoc;
      }
    }

    this.xml_pairs_to_array = function(xml_pairs) {
      // Create the return object
      var pairs = [];

      for ( var i = 0; i < xml_pairs.length; i++ ) {
        pairs.push(
          {
            question: self.get_element_value(xml_pairs[i], "question"),
            answer: self.get_element_value(xml_pairs[i],"answer")
          }
        );
      }

      return pairs;
    };

    //helper for invalid html content in the xml
    this.get_element_value = function(element, name) {
      var result = "";
      var nodes = element.getElementsByTagName(name)[0].childNodes;
      for (var i = 0; i < nodes.length; i++)
      {
        if (nodes[i].nodeName == "img")
        {
          result += "<img src=\"" + config.base_url + nodes[i].getAttribute("src") + "\" />";
        }
        else if (nodes[i].nodeName.match(/^i$|^b$|^sub$|^sup$/))
        {
          //sub,sup, i or b element
          result += "<" + nodes[i].nodeName + ">" + nodes[i].textContent + "</" + nodes[i].nodeName + ">";
        }
        else
        {
          // Presume normal text
          result += self.force_unicode_encoding(nodes[i].textContent);
        }
      }
      return result;
    }

    //helper to convert iso format strings to UTF-8
    this.force_unicode_encoding = function(string) {
      //hack to strip weird cp-1252 chars from the terrible hotpot xml
      string = string.replace(/â€™/,"'");
      var fixed_string;

      try {
        fixed_string = decodeURIComponent(escape(string));
      }
      catch(e) {
        fixed_string = string;
      }

      return fixed_string;

    };

  };

  return new xml_parser();
});
