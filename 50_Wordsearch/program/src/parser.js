/* jshint undef: true, unused: true, esversion: 6, asi: true */

class Parser {
    constructor() {
        this.parsed = []
    }

    parseWordsearchXml(xml) {
        this.parsed = []
        let pairs = xml.getElementsByTagName('pair')
        Array.from(pairs).forEach( aPair => {
            let wordPair = {
                word: aPair.getElementsByTagName('answer')[0].innerHTML,
                meaning: aPair.getElementsByTagName('question')[0].innerHTML
            }
            this.parsed.push(wordPair)
        })
        return this.parsed
    }
}
