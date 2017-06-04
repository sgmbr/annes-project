/* jshint undef: true, unused: true, esversion: 6, asi: true */

class Parser {
    constructor() {
        this.parsed = []
    }

    parseOptions(xml) {
        let out
        let options = xml.getElementsByTagName('options')[0]
        let orientationsXml = options.getElementsByTagName('orientations')[0]
        let orientations = []

        Array.from(orientationsXml.children).forEach(orientation => {
            if (orientation.innerHTML.toLowerCase() == 'on') {
                orientations.push(orientation.tagName)
            }
        })

        out = {
            height: Number(options.getElementsByTagName('height')[0].innerHTML) || 3,
            width:  Number(options.getElementsByTagName('width')[0].innerHTML) || 3,
            orientations: orientations
        }

        return out
    }

    parseQuestions(xml) {
        this.parsed = []
        let pairs = xml.getElementsByTagName('pair')
        Array.from(pairs).forEach( aPair => {
            let wordPair = {
                word: aPair.getElementsByTagName('answer')[0].innerHTML,
                meaning: aPair.getElementsByTagName('question')[0].innerHTML,
                answered: false
            }
            this.parsed.push(wordPair)
        })
        return this.parsed
    }

    parsePassingScore(xml) {
        let passingScoreXml = xml.getElementsByTagName('passing-score')[0]
        let passingScore = Number(passingScoreXml.innerHTML)
        return passingScore
    }
}
