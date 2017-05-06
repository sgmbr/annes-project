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

      var node_list_array = [];

      //node list to array
      for(var i = xml_pairs.length; i--; node_list_array.unshift(xml_pairs[i]));

      node_list_array.shuffle();

      for ( var i = 0; i < node_list_array.length; i++ ) {
        pairs.push(
          {
            question: self.get_element_value(node_list_array[i], "question"),
            answer: self.get_element_value(node_list_array[i],"answer")
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
          result += "<img src=\"" + config.base_url + "scripts/res/images/" + nodes[i].getAttribute("src") + "\" />";
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
