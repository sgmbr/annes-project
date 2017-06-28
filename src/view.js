//Use attachEvent instead of addEventListener for IE < 9
//QuizView handles user input and output

/*jshint esversion: 6 */
/*globals $:false */
class QuizView {
    constructor(controller) {
        this.controller = controller;
        this.controller.attach(this);
        
        this.allMyCanvas = [];
        
        this.initialize();        
    }
    
    //Listen for click events. Call the corresponding methods if the event is triggered.
    initialize() {
        this.activeDOM = null; 
        this.borderColourOn = "rgb(255, 255, 0)";
        this.borderColourOff = "rgb(255, 255, 255)";
        
        this.floatSideBar();
         //Adds a click event listener to all buttons and inputs. Call throttleIFrame method if the event is triggered.        
        this.setupControl("btnShowInstruction", this.showInstruction);
        this.setupControl("btnHideInstruction", this.hideInstruction);
        this.setupControl("b", this.toggleBold);
        this.setupControl("i", this.toggleItalic);
        this.setupControl("u", this.toggleUnderline);
        this.setupControl("sup", this.toggleSuper);
        this.setupControl("sub", this.toggleSub);
        this.setupAnswerField();       
        this.setupAllControls("button", this.throttleIFrame);
        this.setupAllControls("input", this.throttleIFrame);
        this.setupAllControls("input", this.controller.updateScore, this.controller);
        this.setupControl("submit", this.controller.reportScoreToMoodle, this.controller);
        
        this.setupAnswerButtons();
        
        this.addCanvas("draw");
    }
    
    switchToMark(aButton) {
        let buttonNumber = parseInt(aButton.id);
        for (let aCanvas of this.allMyCanvas) {
            let containerNumber = parseInt(aCanvas.container.id);
            if (buttonNumber == containerNumber) {
                aCanvas.textToCanvas();
                aCanvas.saveRestorePoint();
                let url = aCanvas.canvas.toDataURL();
                aCanvas.canvas.remove();
                aCanvas.navBar.remove();
                aCanvas.canvasImg = document.createElement("img");
                aCanvas.canvasImg.src = url;
                let drawContainer = aCanvas.container;
                drawContainer.appendChild(aCanvas.canvasImg);
            }
        }
        this.findAndDisable(buttonNumber + "txt");
        this.findAndDisplay(buttonNumber + "answer");
        aButton.className = "hidden";
    }

    findAndDisable(items) {
        var container = document.getElementsByName(items);
        for (var i = 0; i < container.length; i++) {
            container[i].disabled = true;
        }
    }

    findAndDisplay(items) {
        var container = document.getElementsByName(items);
            for (var i = 0; i < container.length; i++) {
            container[i].className = "show";
        }
    }
    
    addCanvas(keyword) {
        let allCanvas = document.getElementsByTagName("canvas");
        for (let aCanvas of allCanvas) {
            let canvasObject = new Canvas(aCanvas.id);
            let context = aCanvas.parentNode.childNodes;
            for (let node of context) {
                let nodeNumber = parseInt(node.id);
                if (!isNaN(nodeNumber) && node.id.includes(keyword)) {  
                    canvasObject.setContainer(node.id);
                } else {
                    context = aCanvas.parentNode.parentNode.childNodes;
                    for (let node of context) {
                        let nodeNumber = parseInt(node.id);
                        if (!isNaN(nodeNumber) && node.id.includes(keyword)) {  
                            canvasObject.setContainer(node.id);
                        } else {
                            context = aCanvas.parentNode.parentNode.parentNode.childNodes;
                            for (let node of context) {
                                let nodeNumber = parseInt(node.id);
                                if (!isNaN(nodeNumber) && node.id.includes(keyword)) {  
                                    canvasObject.setContainer(node);
                                }
                            }
                        }
                    }
                }                                    
            }
            canvasObject.initialize();
            this.allMyCanvas.push(canvasObject); 
        }       
    }
    
    setupAllControls(controlName, handler, subject) {
        subject = subject || this;
        let allControls = document.getElementsByTagName(controlName);
        for (let aControl of allControls) {
            aControl.addEventListener("click", handler.bind(subject), false);
        }
    }
    
    setupAnswerButtons() {
        let buttons = document.getElementsByTagName("input");
        for (let aButton of buttons) {
            if (aButton.type.toLowerCase() == "button") {
                let buttonNumber = parseInt(aButton.id);
                if (!isNaN(buttonNumber)) {            
                    aButton.addEventListener("click", function () {this.switchToMark(aButton)}.bind(this), false);
                }
            }
        }
    }
    
    setupControl(controlName, handler, subject) {
        subject = subject || this;
        let aControl = document.getElementById(controlName);
        aControl.addEventListener("click", handler.bind(subject), false);
    }
    
    getAllCheckboxes() {
        let inputs = document.getElementsByTagName("input");
        let allMyCheckboxes = [];
        for (let anInput of inputs) {
            if (anInput.type.toLowerCase() == "checkbox") {
                allMyCheckboxes.push(anInput);
            }
        }        
        return allMyCheckboxes;
    }
    
    //Required for Quiz.totalCheckboxes
    getCheckboxCount() {
        let checkboxesCount = this.getAllCheckboxes().length;
        return checkboxesCount;
    }
    
    //Required for Quiz.scoreCount
    getTickedCheckboxCount() {
        let tickedCheckboxes = [];
        for (let aCheckbox of this.getAllCheckboxes()) {
            if (aCheckbox.checked == true) {
                tickedCheckboxes.push(aCheckbox);
            }
        }        
        let checkboxesCount = tickedCheckboxes.length;
        return checkboxesCount;
    }
    
    disableAllCheckboxes() {
        for (let aCheckbox of this.getAllCheckboxes()) {
            aCheckbox.disabled = true;
        }     
    }
    
    floatSideBar() {
        $(parent.window).scroll(function() { 
            let scroll = $(parent.window).scrollTop();
            //TODO: Look for a better alternative to detect Moodle
            if (scroll >= 50 && $('#region-main', window.parent.document).length >= 1) {
               $("#sidebar").css({"margin-top": ((scroll - 50) /16) + "rem"});
            }
            else
            {
                $("#sidebar").css({"margin-top": (scroll / 16) + "rem"});             
            }
        }); 
    }
    
    setupAnswerField() {
        let allMyAnswerFields = document.getElementsByClassName("answerField");
        for (let anAnswerField of allMyAnswerFields) {
            anAnswerField.addEventListener("mouseup", this.checkTextFormat.bind(this), false);
        }
    }
    
    setBorderColourOn(newColour) {
        this.borderColourOn = newColour;
    }
    
    setBorderColourOff(newColour) {
        this.borderColourOff = newColour;
    }
    
    //Highlights border
    //Indicates which button is selected
    highlightBorder(buttonId) {
        let formatButton = document.getElementById(buttonId);
        if (formatButton.style.borderColor == this.borderColourOff) {
            formatButton.style.borderColor =  this.borderColourOn;
        }
        else if (formatButton.style.borderColor ==  this.borderColourOn) {
            formatButton.style.borderColor =  this.borderColourOff;
        } 
    }
    
    formatBorder(tagId, color) {
        document.getElementById(tagId).style.borderColor = color;
    }
    
    //Clear or highlight borders
    checkTextFormat() {
        this.activeDOM = this.getActiveDOM();
        console.log(this.activeDOM);
        
        if (this.textIsFormatted("bold") && !this.borderIsHighlighted("b")) {
            this.formatBorder("b", this.borderColourOn);
        } else if (!this.textIsFormatted("bold") && this.borderIsHighlighted("b")) {
            this.formatBorder("b", this.borderColourOff);
        }
        
        if (this.textIsFormatted("italic") && !this.borderIsHighlighted("i")) {
            this.formatBorder("i", this.borderColourOn);
        } else if (!this.textIsFormatted("italic") && this.borderIsHighlighted("i")) {
            this.formatBorder("i", this.borderColourOff);
        }
        
        if (this.textIsFormatted("underline") && !this.borderIsHighlighted("u")) {
            this.formatBorder("u", this.borderColourOn);
        } else if (!this.textIsFormatted("underline") && this.borderIsHighlighted("u")) {
            this.formatBorder("u", this.borderColourOff);
        }
        
        if (this.textIsFormatted("subscript") && !this.borderIsHighlighted("sub")) {
            this.formatBorder("sub", this.borderColourOn);
        } else if (!this.textIsFormatted("subscript") && this.borderIsHighlighted("sub")) {
            this.formatBorder("sub", this.borderColourOff);
        }
        
        if (this.textIsFormatted("superscript") && !this.borderIsHighlighted("sup")) {
            this.formatBorder("sup", this.borderColourOn);
        } else if (!this.textIsFormatted("superscript") && this.borderIsHighlighted("sup")) {
            this.formatBorder("sup", this.borderColourOff);
        }
    }
    
    textIsFormatted(formatType) {
        if (document.queryCommandState) {
            return document.queryCommandState(formatType);
        }
    }
    
    borderIsHighlighted(buttonName) {
        return (document.getElementById(buttonName).style.borderColor == this.borderColourOn);
    }
    
    getActiveDOM() {
        let focused = document.activeElement;
        if (!focused || focused == document.body) {
            focused = null;
        }
        else if (document.querySelector) {
            focused = document.querySelector(":focus");
        }
        return focused;
    }
    
    //Apply format as text is typed or to selected text 
    toggleBold() {
        document.execCommand ('bold', false, null);
        if (this.activeDOM != null) {
            this.activeDOM.focus();
        }
        this.highlightBorder("b"); 
    }

    toggleItalic() {
        document.execCommand ('italic', false, null);
        if (this.activeDOM != null) {
            this.activeDOM.focus();
        }
        this.highlightBorder("i"); 
    }

    toggleUnderline() {
        document.execCommand ('underline', false, null);
        if (this.activeDOM != null) {
            this.activeDOM.focus();
        }
        this.highlightBorder("u"); 
    }

    toggleSub() {
        document.execCommand ('subscript', false, null);
        if (this.activeDOM != null) {
            this.activeDOM.focus();
        }
        this.highlightBorder("sub"); 
    }

    toggleSuper() {
        document.execCommand ('superscript', false, null);
        if (this.activeDOM != null) {
            this.activeDOM.focus();
        }
        this.highlightBorder("sup");   
    }
    
    saveScore(score) {
        $('#region-main', window.parent.document).find('input[name="mark"]').attr('value', score);
    }
    
    showInstruction() {
        document.getElementById("btnShowInstruction").style.display = "none";
        document.getElementById("btnHideInstruction").style.display = "block";
        document.getElementById("divInstruction").style.display = "block";
    }

    hideInstruction() {
        document.getElementById("btnShowInstruction").style.display = "block";
        document.getElementById("btnHideInstruction").style.display = "none";
        document.getElementById("divInstruction").style.display = "none";
    }
    
    //This code is for the popup box that shows when Submit is pressed.
    displayResult(score) {
        let result = document.getElementById("result");
        let divNode = document.createElement("div");
        divNode.id = "resultText";
        let hrNode = document.createElement("hr");
        let brNode = document.createElement("br");
        result.style.display = "block";
        divNode.append("Your Score: " + Math.round(score) + " %");
        divNode.appendChild(hrNode);
        divNode.append("Thank you. Your score has now been saved.");
        divNode.appendChild(brNode);
        divNode.append("Press Continue to send this score to Moodle.");
        result.appendChild(divNode);

        document.getElementById("submit").style.display = "none";
    }
    
    printScore(score) {
        document.getElementById('totalScore').innerHTML = "Total Score: " + score + " %";
    }

    //Create a timer before resizing the iFrame to prevent a chain of resize events from triggering.
    //Reduces memory usage
    throttleIFrame() {
        let resizeTimer;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(this.notifyIFrame, 100);
    }
    
    //This method is called after the timer has stopped
    notifyIFrame() {
        parent.document.getElementById("ifrQuiz").style.height = document.getElementById("container").offsetHeight + 20 + "px";
    }
}