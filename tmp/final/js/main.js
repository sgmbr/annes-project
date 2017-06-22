/* jshint undef: true, unused: true, esversion:6, asi: true, browser: true, jquery: true */
window.onload = function() {
    let game = new Game()
    let request = new XMLHttpRequest()
    request.open('GET', 'memory.xml', true)
	
	//Get the element of the xml file
	getElementValue = function(element, name) {
		let result = ""
		let nodes = element.getElementsByTagName(name)[0].childNodes
		for (let i = 0; i < nodes.length; i++){
			if (nodes[i].nodeName.match(/^i$|^b$|^sub$|^sup$/)){
				//sub,sup, i or b element
				result += "<" + nodes[i].nodeName + ">" + nodes[i].textContent + "</" + nodes[i].nodeName + ">"
			}
			else{
			// Presume normal text
				result += nodes[i].textContent;
			}
		}
		return result
    }
	
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            // Success
            let xml = request.responseXML
			let pairs =[]
			let questionsNum =  xml.getElementsByTagName('match')[0].getAttribute('numberofmemoryquestions')
			let sets = xml.getElementsByTagName('pair')
			for ( let aSet of sets ) {	
				pairs.push(
				{
					question: getElementValue(aSet, "question"),
					answer: getElementValue(aSet, "answer")
				})
			}
			//Configure the game, enter the data from the xml file
			game.startGame(pairs, questionsNum)
			// Knockout bindings. Display the data into html page
			ko.applyBindings(game)
			
            parent.resizeIframe()
        }
		else {
            // reached target server, but it returned an error
        }
    }
	
	request.onerror = function() {
		// There was a connection erro of some sort
	}

	request.send()
}