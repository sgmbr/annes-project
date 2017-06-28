class Canvas {
    constructor(id) {
        //console.log(window.location.hostname);
        //document.domain = "middleton.school.nz";
        //document.domain = "localhost" //For testing in local webserver
        this.id = id;
        this.container;
        this.navBar;
        this.black = "#000000";
        this.blue = "#0000cc";
        this.red = "#cc0000";
        this.green = "#339933";
        this.curColor = this.black;
        this.one = 1;
        this.four = 4;
        this.eight = 8;
        this.curThick = this.one;
        this.canvas;
        this.ctx;
        this.canvasOffset;
        this.offsetX;
        this.offsetY;
        this.mouseX;
        this.mouseY;
        this.prevX;
        this.prevY;
        this.isDown;
        this.startX;
        this.startY;
        this.childX;
        this.childY;
        this.y;
        this.drawCircle = false;
        this.drawRect = false;
        this.drawLine = false;
        this.erase = false;
        this.restorePoints = [];
        this.undoDisabled = true;
        this.textMode = false;
        this.subMode = false;
        this.superMode = false;
        this.size12 = 16;
        this.size18 = 20;
        this.size26 = 26;
        this.curFontSize = this.size12;
        this.t;
        this.minTxtId = 100;
        this.currTxtId = this.minTxtId;
        this.canvasImg;
        this.canvasAnswer;
        this.devX;
        this.devY;
        this.freeHandMode = true;        
    }
    
    initialize() {
        this.setupCanvas();
        this.createNavBar();
        
        this.btnSmall.addEventListener("click", this.smallBrush.bind(this), false);
        this.btnMedium.addEventListener("click", this.mediumBrush.bind(this), false);
        this.btnLarge.addEventListener("click", this.largeBrush.bind(this), false);
        
        this.btnBlack.addEventListener("click", this.blackCurrent.bind(this), false);
        this.btnBlue.addEventListener("click", this.blueCurrent.bind(this), false);
        this.btnGreen.addEventListener("click", this.greenCurrent.bind(this), false);
        this.btnRed.addEventListener("click", this.redCurrent.bind(this), false);
        
        this.btnText.addEventListener("click", this.addText.bind(this), false);
        this.btnSuperscript.addEventListener("click", this.superText.bind(this), false);
        this.btnSubscript.addEventListener("click", this.subText.bind(this), false);
        
        this.btnFree.addEventListener("click", this.freeHand.bind(this), false);
        this.btnLine.addEventListener("click", this.aLine.bind(this), false);
        this.btnCircle.addEventListener("click", this.aCircle.bind(this), false);
        this.btnRectangle.addEventListener("click", this.aRect.bind(this), false);
        
        this.btnEraser.addEventListener("click", this.eraseMe.bind(this), false);
        
        this.btnUndo.addEventListener("click", this.undoDrawOnCanvas.bind(this), false);
        this.btnClear.addEventListener("click", this.clearCanvas.bind(this), false);        
    
        this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
        this.canvas.addEventListener("touchstart", this.handleMouseDown.bind(this));
    
        this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
        this.canvas.addEventListener("touchmove", this.handleMouseMove.bind(this) /*, {passive: true} */);
        
    
        this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
        this.canvas.addEventListener("touchend", this.handleMouseUp.bind(this));
    
        this.canvas.addEventListener("mouseout", this.handleMouseOut.bind(this));
        this.canvas.addEventListener("touchleave", this.handleMouseOut.bind(this));
                
        window.addEventListener("resize", this.resizeCanvas.bind(this),false);
        window.addEventListener("resize", this.drawImage.bind(this), false);
    }
    
    createNavBar() {  
        this.navBar = document.createElement("div");
        this.navBar.className = "nav";
        
        this.btnSmall = document.createElement("button");
        this.btnSmall.innerHTML = "&#9615;";
        this.btnSmall.id = "small";
        this.btnSmall.className = "thickOn";
        this.btnMedium = document.createElement("button");        
        this.btnMedium.innerHTML = "&#9612;";
        this.btnMedium.id = "medium";
        this.btnMedium.className = "thickOff";
        this.btnLarge = document.createElement("button");
        this.btnLarge.innerHTML = "&#9608;";
        this.btnLarge.id = "large";
        this.btnLarge.className = "thickOff";
        
        this.btnBlack = document.createElement("button");
        this.btnBlack.innerHTML = "Black";
        this.btnBlack.className = "blackOn";
        this.btnBlue = document.createElement("button");
        this.btnBlue.innerHTML = "Blue";
        this.btnBlue.className = "blueOff";
        this.btnGreen = document.createElement("button");
        this.btnGreen.innerHTML = "Green";
        this.btnGreen.className = "greenOff";
        this.btnRed = document.createElement("button");
        this.btnRed.innerHTML = "Red";
        this.btnRed.className = "redOff";
        
        let divTextLayout = document.createElement("div");
        divTextLayout.style.position = "relative";
        divTextLayout.style.height = 3.7 + "rem";
        let divTextLayout1 = document.createElement("div");
        divTextLayout1.style.float = "right";
        divTextLayout1.style.width = "50%";
        this.btnText = document.createElement("button");
        this.btnText.innerHTML = "Text";
        this.btnText.id = "text";
        this.btnText.className = "thickOff";
        this.btnSuperscript = document.createElement("button");
        this.btnSuperscript.innerHTML = "t<sub>2</sub>"
        this.btnSuperscript.id = "sup";
        this.btnSuperscript.className = "thickOff";
        this.btnSubscript = document.createElement("button");
        this.btnSubscript.id = "sub";
        this.btnSubscript.innerHTML = "t<sup>2</sup>"
        this.btnSubscript.className = "thickOff";
        
        this.btnFree = document.createElement("button");
        this.btnFree.innerHTML = "&#65374;";
        this.btnFree.className = "thickOn";
        this.btnLine = document.createElement("button");
        this.btnLine.innerHTML = "&#9473;";
        this.btnLine.className = "thickOff";
        this.btnCircle = document.createElement("button");
        this.btnCircle.innerHTML = "&#9711;";
        this.btnCircle.className = "thickOff";        
        this.btnRectangle = document.createElement("button");
        this.btnRectangle.innerHTML = "&#9634;";
        this.btnRectangle.className = "thickOff";
        
        this.btnEraser = document.createElement("button");
        this.btnEraser.innerHTML = "Erase";
        this.btnEraser.className = "thickOff";
        
        this.btnUndo = document.createElement("button");
        this.btnUndo.innerHTML = "&#8634;";
        this.btnUndo.disabled  = true;        
        this.btnClear = document.createElement("button");
        this.btnClear.innerHTML = "Clear";
        this.btnClear.disabled  = true;
        
        let hrNode = document.createElement("hr");
        let hrNode1 = document.createElement("hr");
        let hrNode2 = document.createElement("hr");
        let hrNode3 = document.createElement("hr");
        let hrNode4 = document.createElement("hr");
        
        this.navBar.appendChild(this.btnSmall);
        this.navBar.appendChild(this.btnMedium);
        this.navBar.appendChild(this.btnLarge);
        this.navBar.appendChild(hrNode);
        this.navBar.appendChild(this.btnBlack);
        this.navBar.appendChild(this.btnBlue);
        this.navBar.appendChild(this.btnGreen);
        this.navBar.appendChild(this.btnRed);
        this.navBar.appendChild(hrNode1);
        divTextLayout1.appendChild(this.btnSuperscript);
        divTextLayout1.appendChild(this.btnSubscript);
        this.navBar.appendChild(divTextLayout1)
        divTextLayout.appendChild(this.btnText);
        divTextLayout.appendChild(divTextLayout1);
        this.navBar.appendChild(divTextLayout);
        this.navBar.appendChild(hrNode2);
        this.navBar.appendChild(this.btnFree);
        this.navBar.appendChild(this.btnLine);
        this.navBar.appendChild(this.btnCircle);
        this.navBar.appendChild(this.btnRectangle);
        this.navBar.appendChild(hrNode3);
        this.navBar.appendChild(this.btnEraser);
        this.navBar.appendChild(hrNode4);
        this.navBar.appendChild(this.btnUndo);
        this.navBar.appendChild(this.btnClear);        
        this.navBar.style.display = "block";
          
        this.container.appendChild(this.navBar);
        this.textDiv = document.createElement("div");
        this.textDiv.className = "window";
        this.textDiv.style.zIndex = "-1";
        this.textDiv.style.position = "absolute";
        this.canvas.parentNode.parentNode.appendChild(this.textDiv);               
    }    
    
    resizeCanvas() {
        if (this.canvas != null) {
            let navHeight = this.navBar.offsetHeight;
            let width  = $(window).width() - 150;        
            let height = navHeight - 6;
            let tempCanvas = document.createElement("canvas");
            let tempContext = tempCanvas.getContext("2d");
            tempCanvas.width = width; 
            tempCanvas.height = height;
            tempContext.drawImage(this.canvas, 0, 0);        
            this.canvas.width  = width;
            this.canvas.height = height;
            //set min and max size of canvas
            if (this.canvas.width <= 100) {
                this.canvas.width = 100;         
            } else if (this.canvas.width >= 400) {
                this.canvas.width = 400;
            }
            this.ctx.drawImage(tempCanvas, 0, 0);
        }
    }   
    
    setupCanvas() {
        this.canvas = document.getElementById(this.id);
        this.index = this.canvas.tabIndex;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        let canvasOffset = $(document.getElementById(this.id));
        this.canvasOffset = canvasOffset.offset();
        this.isDown = false;     
    }
    
    setId(newId) {
        this.id = newId;
    }
    
    setContainer(newContainer) {
        this.container = newContainer;
    }
    
    drawImage() {
        for (let i=0; i < this.canvas.childNodes.length; i += 1) {
            let nodeNumber = parseInt(this.canvas.childNodes[i].id);
                if (!isNaN(nodeNumber) && this.canvas.childNodes[i].id.includes("img")) {
                    this.imageObj = this.canvas.childNodes[i];
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.ctx.drawImage(this.imageObj, this.canvas.width /3, this.canvas.height /3);    
                }
        }
    }
    
    handleMouseDown(e) {
        e.preventDefault();
        let canvasOffset = $(document.getElementById(this.id));
        this.canvasOffset = canvasOffset.offset();
        this.offsetX = this.canvasOffset.left;
        this.offsetY = this.canvasOffset.top;
        this.startX = parseInt(e.clientX - this.offsetX) || e.touches[0].clientX - this.offsetX;
        this.startY = parseInt(e.clientY - this.offsetY) || e.touches[0].clientY - this.offsetY;
        this.prevX = this.startX;
        this.prevY = this.startY;        
        this.mouseX = this.startX;
        this.mouseY = this.startY;    
        
        this.isDown = true;
        if (this.textMode) {
            this.isDown = false;
            this.cleanUp();
            this.textToCanvas();
            if (this.startY < this.canvas.height - this.curFontSize) {
                this.t = this.textDiv;
                this.t.style.zIndex = 1;
                
                let input = document.createElement("div");
                input.contentEditable = true;
                this.currTxtId++;
                input.id = this.currTxtId;
                input.innerHTML = "Edit Me&nbsp;";
                input.style.position = "absolute";
                input.style.top = this.startY;
                input.style.left = this.startX;
                input.style.paddingRight = "8px";
                input.style.paddingLeft = "2px";
                input.style.whiteSpace = "nowrap";
                input.style.width = this.canvas.width + "px";
                input.style.overflowX = "hidden";
                input.style.fontSize = this.curFontSize + "px";
                input.style.color = this.curColor;
                input.style.backgroundColor = "transparent";
                input.style.verticalAlign = "inherit";
                $(input).bind("keypress", this.input.bind(this));
                
                //Text draggable
                let dragging = document.createElement("span");
                dragging.className = "cross";
                dragging.innerHTML = "&#10021";
                dragging.contentEditable = false;
                dragging.style.cursor = "move";
                dragging.style.backgroundColor = "yellow";
                dragging.style.position = "static";
                input.appendChild(dragging);
                this.t.appendChild(input);
                let aType = e.type || e.touches[0].type;
                this.undoIsDisabled(false);
                this.btnClear.disabled = false;
                
                if (aType == "mousedown") {
                    $(input).draggable({
                        handle: dragging
                    });
                } else {
                    let touchY,
                        touchX,
                        distX = 0,
                        distY = 0,
                        touchobj = null;
                    dragging.addEventListener('touchstart', function (e) {
                        touchobj = e.changedTouches[0];
                        touchX = parseInt(touchobj.clientX);
                        touchY = parseInt(touchobj.clientY);
                    }, false);

                    dragging.addEventListener('touchmove', function (e) {
                        e.preventDefault();
                        e = e || window.e; // cross-browser event
                        if (e.stopPropagation) {
                            e.stopPropagation(); // W3C standard
                            e.stopImmediatePropagation();
                        } else {
                            e.cancelBubble = true; // IE
                        }
                        touchobj = e.changedTouches[0];
                        distX = parseInt(touchobj.clientX) - touchX;
                        distY = parseInt(touchobj.clientY) - touchY;
                        // move box according to starting pos plus dist
                        // with lower limit 0 and upper limit 380 so it doesn't move outside track:
                        input.style.left = ((this.startX + distX > 380) ? 380 : (this.startX + distX < 0) ? 0 : this.startX + distX) + 'px';
                        input.style.top = ((this.startY + distY > 380) ? 380 : (this.startY + distY < 0) ? 0 : this.startY + distY) + 'px';
                    }, false);
                }
            }
        } else {
            ////console.log("else");
            //Start drawing
            this.saveRestorePoint();
            this.ctx.beginPath();
            if (this.erase) {
                this.ctx.lineWidth = this.curThick * 3;
                this.ctx.fillStyle = "#fff";
            } else {
                this.ctx.fillStyle = this.curColor;
            }                    
            this.ctx.arc(this.startX, this.startY, this.curFontSize / 10, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }
    
    input(e) {
        if (e.keyCode == 13 && !$(this).data('multiline')) {
            return false;
        }
        if (e.which) {
            // Ensure we only handle printable keys, excluding enter and space
            let charCode = typeof e.which == "number" ? e.which : e.keyCode;
            if (charCode && charCode > 32) {
                e.preventDefault();
                this.insertChar(charCode);
            }
        }
    }

    handleMouseUp(e) {
        ////console.log("MouseUP");
        let x1, y1;
        e.preventDefault();
        this.isDown = false;
        if (this.textMode) return;
        if (this.startX == this.mouseX) return;
        
        if (this.drawLine) { 
            ////console.log("drawLine");
            this.undoDrawOnCanvas();
            this.saveRestorePoint();
            this.ctx.moveTo(this.startX, this.startY);
            this.ctx.lineTo(this.mouseX, this.mouseY);
            this.ctx.stroke();
            this.ctx.closePath();
        } else if (this.drawRect) {
            ////console.log("drawRect");
            this.undoDrawOnCanvas();
            this.saveRestorePoint();
            this.ctx.lineWidth = this.curThick;
            this.ctx.strokeStyle = this.curColor;
            this.ctx.strokeRect(this.startX, this.startY, this.mouseX - this.startX, this.mouseY - this.startY);
        } else if (this.drawCircle) {
            ////console.log("drawCircle");
            this.undoDrawOnCanvas();
            this.saveRestorePoint();
            this.ctx.strokeStyle = this.curColor;
            this.ctx.beginPath();
            this.ctx.lineWidth = this.curThick;
            this.ctx.strokeStyle = this.curColor;
            if (this.startX < this.mouseX) {
                x1 = this.mouseX - this.startX;
            } else {
                x1 = this.startX - this.mouseX;
            }
            if (this.startY < this.mouseY) {
                y1 = this.mouseY - this.startY;
            } else {
                y1 = this.startY - this.mouseY;
            }
            this.ellipse(x1, y1);
            this.ctx.stroke();
            this.ctx.closePath();
        }
        if (this.undoDisabled) {
            this.undoIsDisabled(false);
        }
        this.btnClear.disabled = false;
    }

    handleMouseOut(e) {
        e.preventDefault();
        this.mouseX = parseInt(e.clientX - e.offsetX) || e.touches[0].clientX - e.offsetX;
        this.mouseY = parseInt(e.clientY - e.offsetY) || e.touches[0].clientY - e.offsetY + this.iFrameScrollY;
        this.isDown = false;
    }

    handleMouseMove(e) {
        let x1, y1;
        e.preventDefault();

        if (!this.isDown) {
            return;
        } else {
        // Sam    
            this.mouseX = parseInt(e.clientX - this.offsetX) || e.touches[0].clientX - this.offsetX;
            this.mouseY = parseInt(e.clientY - this.offsetY) || e.touches[0].clientY - this.offsetY;
            this.prevX = this.mouseX;
            this.prevY = this.mouseY;
        
        //Freehand
            if (this.freeHandMode) {
                this.ctx.beginPath();
                this.ctx.fillStyle = this.curColor;
                this.ctx.arc(this.mouseX, this.mouseY, this.curFontSize / 10, 0, 2 * Math.PI);
                this.ctx.fill();
            }
        //------------------------------ 
        //------------------------------   Rect
        //------------------------------ 
            else if (this.drawRect) {
                this.undoDrawOnCanvas();
                this.saveRestorePoint();
                this.preset();
                this.ctx.fillRect(this.startX - this.devX, this.startY - this.devY, this.prevX - this.startX + 2 * this.devX, this.prevY - this.startY + 2 * this.devY);
                this.ctx.strokeRect(this.startX, this.startY, this.mouseX - this.startX, this.mouseY - this.startY);
                this.prevX = this.mouseX;
                this.prevY = this.mouseY;
            //------------------------------ 
            //------------------------------   Ellipse
            //------------------------------ 
            } else if (this.drawCircle) {
                this.undoDrawOnCanvas();
                this.saveRestorePoint();
                this.ctx.fillStyle = '#fff';
                this.ctx.lineWidth = this.curThick;
                if (this.startX < this.prevX) {
                    x1 = this.prevX - this.startX + 3 * this.curThick;
                } else {
                    x1 = this.startX - this.prevX + 3 * this.curThick;
                }
                if (this.startY < this.prevY) {
                    y1 = this.prevY - this.startY + 3 * this.curThick;
                } else {
                    y1 = this.startY - this.prevY + 3 * this.curThick;
                }
                this.ellipse(x1, y1);
                this.ctx.fill();
                this.ctx.closePath();
                if (this.startX < this.mouseX) {
                    x1 = this.mouseX - this.startX;
                } else {
                x1 = this.startX - this.mouseX;
                }
                if (this.startY < this.mouseY) {
                    y1 = this.mouseY - this.startY;
                } else {
                    y1 = this.startY - this.mouseY;
                }
                this.ellipse(x1, y1);

                this.ctx.strokeStyle = this.curColor;
                this.ctx.stroke();
                this.ctx.closePath();
                this.prevX = this.mouseX;
                this.prevY = this.mouseY;
            } else {
                //------------------------------ 
                //-------------------------------   Line
                //------------------------------ 
                if (this.drawLine) {
                    this.undoDrawOnCanvas();
                    this.saveRestorePoint();
                    this.ctx.beginPath();
                    this.ctx.lineWidth = this.curThick;
                    this.ctx.strokeStyle = this.curColor;
                    this.ctx.moveTo(this.startX, this.startY);
                    this.ctx.lineTo(this.mouseX, this.mouseY);
                    this.ctx.stroke();
                    this.ctx.closePath();
                }
        
                this.ctx = this.canvas.getContext("2d");
                this.ctx.beginPath();
                this.ctx.lineWidth = this.curThick;
                //------------------------------ 
                //-------------------------------   Erase
                //------------------------------ 
                if (this.erase) {
                    this.ctx.strokeStyle = "#fff";
                    this.ctx.lineWidth = this.curThick * 3;
                } else {
                    this.ctx.strokeStyle = this.curColor;
                }
                this.ctx.moveTo(this.startX, this.startY);
                this.ctx.lineTo(this.mouseX, this.mouseY);
                this.ctx.stroke();
                this.ctx.closePath();
                if (!this.drawLine) {
                    this.startX = this.mouseX;
                    this.startY = this.mouseY;
                } else {
                    this.prevX = this.mouseX;
                    this.prevY = this.mouseY;
                }
            }
        }
    }
    
    preset() {
        if (this.prevX < this.startX) {
            this.devX = -this.curThick;
        } else {
            this.devX = this.curThick;
        }
        if (this.prevY < this.startY) {
            this.devY = -this.curThick;
        } else {
            this.devY = this.curThick;
        }
        this.ctx.fillStyle = '#fff';
        this.ctx.lineWidth = this.curThick;
        this.ctx.strokeStyle = this.curColor;
    }

    saveRestorePoint() {
        this.restorePoints.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
    }

// ===============================================          DRAWING TOOL                

//
    //    Free Hand
    freeHand() {       
        if (this.textMode) {
            this.addText(this.btnText);
        }
        this.btnFree.className = "thickOn";
        this.freeHandMode = true;
        this.drawCircle = false;
        this.btnCircle.className = "thickOff";
        this.drawRect = false;
        this.btnRectangle.className = "thickOff";
        this.erase = false;
        this.btnEraser.className = "thickOff";
        this.drawLine = false;
        this.btnLine.className = "thickOff";
    }

    //    Line
    aLine() {
        if (this.textMode) {
            this.addText(this.btnText);
        }
        this.drawLine = true;
        this.btnLine.className = "thickOn";
        this.freeHandMode = false;
        this.btnFree.className = "thickOff";
        this.drawCircle = false;
        this.btnCircle.className = "thickOff";
        this.drawRect = false;
        this.btnRectangle.className = "thickOff";
        this.erase = false;
        this.btnEraser.className = "thickOff";    
    }

    //    Ellipse
    aCircle() {
        if (this.textMode) {
            this.addText(this.btnText);
        }
        this.drawCircle = true;
        this.btnCircle.className = "thickOn";
        this.freeHandMode = false;
        this.btnFree.className = "thickOff";
        this.drawLine = false;
        this.btnLine.className = "thickOff";
        this.drawRect = false;
        this.btnRectangle.className = "thickOff";
        this.erase = false;
        this.btnEraser.className = "thickOff";
    }

ellipse(width, height) {
    this.ctx.beginPath();
    this.ctx.moveTo(this.startX, this.startY - height);
    this.ctx.bezierCurveTo(
        this.startX + width, this.startY - height,
        this.startX + width, this.startY + height,
        this.startX, this.startY + height);
    this.ctx.bezierCurveTo(
        this.startX - width, this.startY + height,
        this.startX - width, this.startY - height,
        this.startX, this.startY - height);
}

    //    Rectangle
    aRect() {
        if (this.textMode) {
            this.addText(this.btnText);
        }
        this.drawRect = true;
        this.btnRectangle.className = "thickOn";
        this.freeHandMode = false;
        this.btnFree.className = "thickOff";
        this.drawLine = false;
        this.btnLine.className = "thickOff";
        this.drawCircle = false;
        this.btnCircle.className = "thickOff";
        this.erase = false;
        this.btnEraser.className = "thickOff";
    }

    //    Eraser
    eraseMe() {
        if (this.textMode) {
            this.addText(this.btnText);
        }
        this.erase = true;
        this.btnEraser.className = "thickOn";
        this.freeHandMode = false;
        this.btnFree.className = "thickOff";
        this.drawLine = false;
        this.btnLine.className = "thickOff";
        this.drawCircle = false;
        this.btnCircle.className = "thickOff";
        this.drawRect = false;
        this.btnRectangle.className = "thickOff";
        this.btnRed.className = "redOff";
        this.btnBlack.className = "blackOff";
        this.btnBlue.className = "blueOff";
        this.btnGreen.className = "greenOff";
    }

//===============================================                C O L O R

//                                                                          
    blackCurrent() {
        if (this.erase) return;
        this.curColor = this.black;
        this.btnBlack.className = "blackOn";
        this.btnBlue.className = "blueOff";
        this.btnRed.className = "redOff";
        this.btnGreen.className = "greenOff";
        if (this.textMode) {
            if (this.hasSelection()) {
                document.execCommand("foreColor", false, this.curColor);
                this.cleanUp();
            }
        }
    }

    blueCurrent() {
        if (this.erase) return;
        this.curColor = this.blue;
        this.btnBlue.className = "blueOn";
        this.btnBlack.className = "blackOff";
        this.btnRed.className = "redOff";
        this.btnGreen.className = "greenOff";
        if (this.textMode) {
            if (this.hasSelection()) {
                document.execCommand("foreColor", false, this.curColor);
                this.cleanUp();
            }
        }
    }

    redCurrent() {
        if (this.erase) return;
        this.curColor = this.red;
        this.btnRed.className = "redOn";
        this.btnBlack.className = "blackOff";
        this.btnBlue.className = "blueOff";
        this.btnGreen.className = "greenOff";
        if (this.textMode) {
            if (this.hasSelection()) {
                document.execCommand("foreColor", false, this.curColor);
                this.cleanUp();
            }
        }
    }

    greenCurrent() {
        if (this.erase) return;
        this.curColor = this.green;
        this.btnGreen.className = "greenOn";
        this.btnBlack.className = "blackOff";
        this.btnBlue.className = "blueOff";
        this.btnRed.className = "redOff";
        if (this.textMode) {
            if (this.hasSelection()) {
                document.execCommand("foreColor", false, this.curColor);
                this.cleanUp();
            }
        }
    }

//                                                                          

//======================================================       T H I C K 

//                                                                          
    smallBrush() {
        this.curThick = this.one;
        this.curFontSize = this.size12;
        this.btnSmall.className = "thickOn";
        this.btnMedium.className = "thickOff";
        this.btnLarge.className = "thickOff";
        if (this.textMode) {
            if (this.hasSelection()) {
                this.changeFont();
            }
        }
    }

    mediumBrush() {
        this.curThick = this.four;
        this.curFontSize = this.size18;
        this.btnSmall.className = "thickOff";
        this.btnMedium.className = "thickOn";
        this.btnLarge.className = "thickOff";
        if (this.textMode) {
            if (this.hasSelection()) {
                this.changeFont();
            }
        }
    }
    
    largeBrush() {
        this.curThick = this.eight;
        this.curFontSize = this.size26;
        this.btnSmall.className = "thickOff";
        this.btnMedium.className = "thickOff";
        this.btnLarge.className = "thickOn";
        if (this.textMode) {
            if (this.hasSelection()) {
                this.changeFont();
            }
        }
    }

//                                                                          

//==================================================              C L E A R

//                                                                          
 clearCanvas() {
    if (this.textMode) {
        this.removeChildren();
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.restorePoints = [];
    this.undoIsDisabled(true);        
    this.btnClear.disabled = true;
}

 removeChildren() {
    let textHolder = this.textDiv;
    while (textHolder.hasChildNodes()) {
        textHolder.removeChild(textHolder.firstChild);
    }
    this.currTxtId = this.minTxtId;
}
//                                                                          
 cleanUp() {
    if (window.getSelection) {
        if (window.getSelection().empty) {
            window.getSelection().empty();
        } else if (window.getSelection().removeAllRanges) {
            window.getSelection().removeAllRanges();
        }
    } else if (document.selection) {
        document.selection.empty();
    }
}

    undoDrawOnCanvas() {
        if (this.textMode) {
            if (this.currTxtId > this.minTxtId) {
                let item = document.getElementById(this.currTxtId);
                item.parentNode.removeChild(item);
                this.currTxtId--;
                if (this.restorePoints.length >= 1) {
                    this.textMode = false;
                    this.btnText.className = "thickOff";
                    this.btnFree.className = "thickOn";
                } else if ( this.currTxtId <= this.minTxtId) {
                    this.undoIsDisabled(true);
                    this.btnClear.disabled = true;
                }
            }
        } else {
            if (this.restorePoints.length > 1) {
                this.ctx.putImageData(this.restorePoints.pop(), 0, 0);
            } else {
                this.ctx.putImageData(this.restorePoints.pop(), 0, 0);
                this.undoIsDisabled(true);
                this.btnClear.disabled = true;
            }
        }
    }

    undoIsDisabled(bool) {
        this.undoDisabled = bool;
        this.btnUndo.disabled = bool;
    }

//                                                                          

//==========================================              T X T   To Canvas

//                                                                          
 textToCanvas() {
    this.t = this.textDiv;
    let childDivs = this.t.getElementsByTagName("div");
    if (childDivs.length) {
        this.childX = parseInt(childDivs[0].style.left);
        this.childY = parseInt(childDivs[0].style.top);
        this.y = parseInt(childDivs[0].style.fontSize);
        this.recurse(this.t);
    }
    this.removeChildren();
}

 recurse(aParent) {
    let children = aParent.childNodes;
    let col;
    let size;
    let textContent;
    let alining;
    if (aParent.className != "cross") {
        if (children.length) {
            for (let i = 0; i < children.length; i++) {
                if (aParent.className != "cross") {
                    this.recurse(children[i]);
                }
            }
        } else {
            this.saveRestorePoint();
            textContent = aParent.textContent;
            if (aParent.nodeName == "#text") {
                col = aParent.parentNode.color;
                if (!col) {
                    col = aParent.parentNode.style.color;
                    let par = aParent.parentNode;
                    while (!col) {
                        par = par.parentNode;
                        if (par.color) {
                            col = par.color;
                        } else if (par.style.color) {
                            col = par.style.color;
                        }
                    }
                }
                size = aParent.parentNode.style.fontSize;
                if (!size) {
                    let par = aParent.parentNode;
                    while (!size) {
                        par = par.parentNode;
                        if (par.size) {
                            size = par.size;
                        } else if (par.style.fontSize) {
                            size = par.style.fontSize;
                        }
                    }
                }
                size = size + " Arial";
                alining = aParent.parentNode.nodeName;
            }
            let p = $(aParent.parentNode);
            let position = p.position();
            //$("#test").text("left: " + position.left + ", top: " + position.top);

            //console.log("Details \nnode name = "+aParent.nodeName+"\nParent is = "+aParent.parentNode.nodeName+"\n textContent= "+textContent+"\nParent.style.top = "+aParent.parentNode.style.top+"\nParent.style.left = "+aParent.parentNode.style.left+"\n color = "+col+" size = "+size.toString()+"\nchildX "+this.childX+";\n childY "+this.childY);
            let ad;
            if (alining.toLowerCase() == "sub") {
                ad = (this.childY + this.y - parseInt(size) / 2);
                size = "10px Arial";
            } else if (alining.toLowerCase() == "sup") {
                ad = (this.childY - parseInt(size) / 3);
                size = "10px Arial";
            } else {
                ad = this.childY + this.y - parseInt(size);
            }            
            if (textContent !== "✥") {                
                //console.log(aParent.parentNode.nodeName.toLowerCase())
                this.ctx.font = "bold " + size
                this.ctx.fillStyle = col;
                this.ctx.fillText(textContent, this.childX, ad);
                this.childX += this.ctx.measureText(textContent).width;
            }
        }
    }
}

//===========================================                      T e x t 

//                                                                          
    addText() {
        if (this.btnText.className == "thickOff") {
            this.textMode = true;
            this.btnText.className = "thickOn";
            if (!(this.currTxtId > this.minTxtId)) {
                this.undoIsDisabled(true);
            } else {
                this.undoIsDisabled(false);
            }
            this.btnFree.className = "thickOff";
            this.drawCircle = false;
            this.btnCircle.className = "thickOff";
            this.drawRect = false;
            this.btnRectangle.className = "thickOff";
            this.erase = false;
            this.btnEraser.className = "thickOff";
            this.drawLine = false;
            this.btnLine.className = "thickOff";
            this.btnClear.disabled = true;
        } else {
            this.textMode = false;
            this.superMode = false;
            this.subMode = false;
            this.btnText.className = "thickOff";
            this.btnSuperscript.className = "thickOff";
            this.btnSubscript.className = "thickOff";
            this.btnFree.className = "thickOn";
            this.textToCanvas();
            if (this.restorePoints.length > 1) {
                this.undoIsDisabled(false);
                this.btnClear.disabled = false;
            } else {
                this.undoIsDisabled(true);
            }
        }
    }

    superText() {
        if (!this.textMode) return;
        if (this.btnSuperscript.className == "thickOff") {
            this.btnSuperscript.className = "thickOn";
            this.superMode = true;
            this.subMode = false;
            this.btnSubscript.className = "thickOff";
        } else {
            this.btnSuperscript.className = "thickOff";
            this.superMode = false;
        }
        if (this.hasSelection()) {
            this.changeSup();
        }
    }

    subText() {
        if (!this.textMode) return;
        if (this.btnSubscript.className == "thickOff") {
            this.btnSubscript.className = "thickOn";
            this.subMode = true;
            this.superMode = false;
            this.btnSuperscript.className = "thickOff";
        } else {
            this.btnSubscript.className = "thickOff";
            this.subMode = false;
        }
        if (this.hasSelection()) {
            this.changeSub();
        }
    }

 changeSub() {
    document.execCommand("subscript", false, null);
    this.cleanUp();
}

 changeSup() {
    document.execCommand("superscript", false, null);
    this.cleanUp();
}

 insertChar(aChar) {
    let charStr = String.fromCharCode(aChar);
    let styledChar = document.createElement("font");
    let styledAlign;
    if (this.subMode) {
        styledAlign = document.createElement("SUB");
        styledAlign.innerHTML = charStr;
        styledAlign.style.fontSize = (this.curFontSize - 4) + "px";
        styledAlign.style.color = this.curColor;
        styledChar.appendChild(styledAlign);
    } else if (this.superMode) {
        styledAlign = document.createElement("SUP");
        styledAlign.innerHTML = charStr;
        styledAlign.style.fontSize = (this.curFontSize - 4) + "px";
        styledAlign.style.color = this.curColor;
        styledChar.appendChild(styledAlign);
    } else {
        styledChar.innerHTML = charStr;
        styledChar.style.fontSize = this.curFontSize + "px";
        styledChar.style.color = this.curColor;
    }
    let range;
    let sel;
    if (window.getSelection) {
        sel = window.getSelection();
        range = sel.getRangeAt(0);
        range.deleteContents();
        range.insertNode(styledChar);
    } else if (document.selection) {
        sel = document.selection;
        range = document.selection.createRange();
        range.deleteContents();
        range.insertNode(styledChar);
    }
    range.setStartAfter(styledChar);
    range.setEndAfter(styledChar);
    sel.removeAllRanges();
    sel.addRange(range);
}

 hasSelection() {
    let selectionRange;
    if (window.getSelection) { // all browsers, except IE before version 9
        selectionRange = window.getSelection();
    } else if (document.selection) {
        selectionRange = document.selection.createRange();
    }
    if (!(selectionRange.isCollapsed)) {
        return true;
    } else return false;
}

 changeFont() {
    let range;
    let sel;
    if (window.getSelection) {
        sel = window.getSelection();
        range = sel.getRangeAt(0);
        /*
    //MIKE alert("startContainer = "+range.startContainer+"\nendContainer = "+range.endContainer+"\nparent = "+range.startContainer.parentNode+"\nrange.startOffset = "+range.startOffset+"\nrange.endOffset = "+range.endOffset);
    */
    }
    // store the start and end points of the current selection, because the selection will be removed
    let startContainer = range.startContainer;
    let startOffset = range.startOffset;
    let endContainer = range.endContainer;
    let endOffset = range.endOffset;
    // because of Opera, we need to remove the selection before modifying the DOM hierarchy
    //sel.removeAllRanges ();

    if (startContainer == endContainer) {
        //alert("startContainer == endContainer");
        ColorizeNodeFromTo(startContainer, startOffset, endOffset);
    } else {
        let childNode = startContainer.firstChild;
        //alert("startContainer NOT= endContainer"+"\nfirst child = "+childNode);
        if (startContainer.firstChild) { //a
            let startLeaf = startContainer.childNodes[startOffset];
        } else {
            let startLeaf = GetNextLeaf(startContainer); //b 
            ColorizeLeafFromTo(startContainer, startOffset, -1)
        }

        if (endContainer.firstChild) {
            if (endOffset > 0) {
                let endLeaf = endContainer.childNodes[endOffset - 1];
            } else {
                let endLeaf = GetPreviousLeaf(endContainer);
            }
        } else {
            let endLeaf = GetPreviousLeaf(endContainer);
            ColorizeLeafFromTo(endContainer, 0, endOffset);
        }
        while (startLeaf) {
            let nextLeaf = GetNextLeaf(startLeaf);
            ColorizeLeaf(startLeaf);
            if (startLeaf == endLeaf) {
                break;
            }
            startLeaf = nextLeaf;
        }
    }
}

 ColorizeNodeFromTo(node, from, to) {
    let childNode = node.firstChild;
    if (!childNode) {
        ColorizeLeafFromTo(node, from, to);
        return;
    }

    for (let i = from; i < to; i++) {
        ColorizeNode(node.childNodes[i]);
    }
}

 ColorizeNode(node) {
    let childNode = node.firstChild;
    if (!childNode) {
        ColorizeLeaf(node);
        return;
    }

    while (childNode) {
        // store the next sibling of the childNode, because colorizing modifies the DOM structure
        let nextSibling = childNode.nextSibling;
        ColorizeNode(childNode);
        childNode = nextSibling;
    }
}

 GetPreviousLeaf(node) {
    while (!node.previousSibling) {
        // alert("Node = "+node+"\nparentNode = "+node.parentNode+" Content = "+node.textContent);
        node = node.parentNode;
        if (!node) {
            return node;
        }
    }
    let leaf = node.previousSibling;
    while (leaf.lastChild) {
        leaf = leaf.lastChild;
        //alert("node.previousSibling = "+leaf+" Content = "+leaf.textContent);
    }
    //alert("returning leaf= "+leaf+"\leaf Content = "+leaf.textContent);
    return leaf;
}

 ColorizeLeafFromTo(node, from, to) {
    let text = node.textContent;
    if (from < 0)
        from = 0;
    if (to < 0)
        to = text.length;

    if (from == 0 && to >= text.length) {
        // to avoid unnecessary span elements
        this.ColorizeLeaf(node);
        return;
    }

    let part1 = text.substring(0, from);
    let part2 = text.substring(from, to);
    let part3 = text.substring(to, text.length);

    let parentNode = node.parentNode;
    let nextSibling = node.nextSibling;

    parentNode.removeChild(node);
    if (part1.length > 0) {
        let textNode = document.createTextNode(part1);
        parentNode.insertBefore(textNode, nextSibling);
    }
    if (part2.length > 0) {
        let span = document.createElement("span");
        span.style.fontSize = this.curFontSize + "px";
        let textNode = document.createTextNode(part2);
        span.appendChild(textNode);
        parentNode.insertBefore(span, nextSibling);
    }
    if (part3.length > 0) {
        let textNode = document.createTextNode(part3);
        parentNode.insertBefore(textNode, nextSibling);
    }
}

 ColorizeLeaf(node) {
    let parentNode = node.parentNode;
    // if the node does not have siblings and the parent is a span element, then modify its color
    if (!node.previousSibling && !node.nextSibling) {
        if (parentNode.tagName.toLowerCase() == "span") {
            parentNode.style.fontSize = this.curFontSize + "px";
            return;
        }
    }

    // Create a span element around the node
    let span = document.createElement("span");
    span.style.fontSize = this.curFontSize + "px";
    let nextSibling = node.nextSibling;
    parentNode.removeChild(node);
    span.appendChild(node);
    parentNode.insertBefore(span, nextSibling);
}

 GetNextLeaf(node) {
    while (!node.nextSibling) {
        //alert("Node = "+node+"\nparentNode = "+node.parentNode+" Content = "+node.textContent);
        node = node.parentNode;
        if (!node) {
            return node;
        }
    }
    let leaf = node.nextSibling;
    //alert("node.nextSibling = "+leaf+" Content = "+leaf.textContent);
    while (leaf.firstChild) {
        //alert("node.nextSibling = "+leaf+"\nfirstChild = "+leaf.firstChild+"\nChild Content = "+leaf.textContent);
        leaf = leaf.firstChild;
    }
    // alert("returning leaf= "+leaf+"\leaf Content = "+leaf.textContent);
    return leaf;
}

}