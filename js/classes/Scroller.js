"use strict";
let Scroller = class {
    constructor(_w,_h,_msg, _textColours, _fontSize,_border,_depth,_bg={textBG: true, textBGColour: 0x0, fullScreenBG: true, fullScreenColour: 0x0A0A0A }) {
        // make sure incoming vars are valid
        if (!this.verifyIncomingVars(_w,_h,_msg, _textColours,_border,_depth)) return false;

        this.scene = scene;
        this.fontSize= !_fontSize  ? 32 : _fontSize;
        
        this.textBG = _bg.textBG;
        this.textBGCol = _bg.textBGColour;

        this.fullScreenBG = _bg.fullScreenBG;
        this.fullScreenBGCol = _bg.fullScreenColour;

        this.clickFrom = null;

        this.speed=1;
        this.paused=false;
        this.reverse=false;
        this.timeIncrementMultiplier=1; // can be 1 or -1

        // all vars are valid
        this.time = this.startTime = -this.height;

        this.loading=true;
        this.loadRequiredFiles();
    }

    loadRequiredFiles() { // entry point, loads all required files
        this.defaultAssetsFolder = 'assets/Scroller/';
        this.scene.load.setPath(this.defaultAssetsFolder);

        this.scene.load.atlas('scroller', `scroller.png`, `scroller.json`);

        this.scene.load.once('complete', ()=> { this.filesLoaded(); });
    }

    filesLoaded() {
        vars.DEBUG ? console.log(`Initialising the the scroller`) : null;
        this.loading=false;
        this.container = this.initContainer();
        this.initPhaserObject();
        this.initButtons();
    }

    verifyIncomingVars(_w,_h,_msg,_textColours,_border,_depth) { // before anything is done, this is run
        this.errors = [];
        // incoming vars valid?
        if (!Number.isInteger(_w) || !Number.isInteger(_h)) { this.errors.push(`Invalid width or height`); return false; };
        if (!Array.isArray(_msg) || !_msg.length) { this.errors.push(`Invalid message, or message length is 0`); return false; };



        // required vars look good
        // vars that can be null as they come into the class
        this.border = Number.isInteger(_border) ? _border : 0; // default border is 0, but can be over-ridden
        this.depth = Number.isInteger(_depth) ? _depth : 1; // default depth is 1, but can be over-ridden

        // make sure consts.canvas exists (as theyre required)
        this.cC;
        if (!consts || !consts.canvas) {
            this.cC = { width: 1920, height: 1080, cX: 1920/2, cY: 1080/2 }; // defaults
            this.errors.push(`WARNING: consts.canvas doesnt exist. Using defaults. If these arent the canvas vars, you need to modify the cC var in verifyIncomingVars. RESULT: CONTINUING`);
            console.table(this.cC);
        } else {
            this.cC = consts.canvas;
        };

        // set up the width and height of the scroller text (making sure theyre valid. invalid vars are flagged but dont stop execution)
        this.width = _w < this.cC.width+1 && _w>0 ? _w : this.cC.width;    // limit width
        this.height = _h < this.cC.height+1 && _h>0 ? _h : this.cC.height; // and height to screen size
        if (this.width<this.cC.width/10) {
            this.errors.push(`WARNING: The width requested (${this.width}) was less than ${this.cC.width/10}. RESULT_OF_WARNING: CONTINUING.`);
        };
        if (this.height<this.cC.height/10) {
            this.errors.push(`WARNING: The height requested (${this.height}) was less than ${this.cC.width/10}. RESULT_OF_WARNING: CONTINUING.`);
        };

        // get the colours (main colour, [outline colour], [thickness]) // thickness, if applicable is always 3, so it isnt passed into this class
        if (typeof _textColours==='string' && _textColours.startsWith('#')) { // incoming text colour is an html string
            this.textColours = [_textColours,_textColours,0]; // the 2nd colour is the same as the main colour, only difference is that stroke thickness is 0
        } else if (Array.isArray(_textColours) && _textColours.length===2) { // incoming array, text colour and outline colour
            this.textColours = [_textColours[0],_textColours[1],2];
        };

        // init the message
        this.message = _msg;

        return true;
    }

    initButtons() {
        let iV = vars.input;
        let pageButtons = iV.pageButtons;
        !pageButtons['scrollers'] ? pageButtons['scrollers'] = [] : null;
        let scrollerInt = this.scrollerInt = pageButtons['scrollers'].length;
        pageButtons['scrollers'][scrollerInt] = [];
        this.buttons = {}; // this has been generalised above as all pages now need fast access to all buttons due to KB cursor keys being added

        let x = this.cC.width*0.958;
        let y = this.cC.cY;
        let yOff = 200;

        let yOffsets = [0,-yOff,-yOff*2,yOff,yOff*2];
        let buttons = ['pause','reverse','top','x1','close'];
        let uiFS = 18;
        buttons.forEach((_b,_i)=> {
            let buttonName = `SCRL_${_b}`;
            let button = this.scene.add.image(x,y+yOffsets[_i],'scroller',_b).setName(buttonName).setDepth(this.depth).setInteractive();
            pageButtons['scrollers'][scrollerInt].push(buttonName);
            let text = scene.add.bitmapText(x, y+yOffsets[_i]+64, 'defaultFontSmall', _b !== 'x1' ? _b.toUpperCase() : 'SPEED', uiFS).setOrigin(0.5).setDepth(this.depth);
            this.buttons[_b] = { button: button, text: text };
            this.container.add([button,text]);
        });
    }

    initContainer() { // if we have valid vars, create a container for the text object
        // make sure scene.containers.scrollers exists
        !scene.containers ? scene.containers={} : null;
        !scene.containers.scrollers ? scene.containers.scrollers = [] : null; // scrollers is an array list and not a container! The array list contains ALL Scrollers

        // the container for this scroller
        let cInt = scene.containers.scrollers.length;
        this.containerName = `scroller_${cInt}`; // in case we need to know the container name outside of the class
        // (as there could be multiple - its basically a quick access var as the containers name is available after looking at this.container)
        // ive found these things to be useful in the past, so its been added here "in (the likely) case"
        let container = scene.add.container();
        container.setName(this.containerName).setDepth(this.depth).setVisible(false).setAlpha(1);
        scene.containers.scrollers.push(container);
        return container;
    }

    initPhaserObject() { // once we've got a container, we build the phaser object
        let font = { fontFamily: 'Consolas', fixedWidth: this.width-this.border*2, color: this.textColours[0], stroke: this.textColours[1], strokeThickness: this.textColours[2], fontSize: `${this.fontSize}px`, lineSpacing: 10, wordWrap: { width: this.width } };
        // if we have a border, we need to fix the wordWrap var above IMPORTANT TODO

        // the text object is created here, but its added to the container after building the backgrounds
        this.textObject = scene.add.text(this.cC.cX,0,this.message,font).setOrigin(0.5,0).setDepth(this.depth);
        this.maxHeight = this.textObject.height;
        if (this.textBG) {
            if (this.fullScreenBG) { // full scren bg requested
                let scale = [this.cC.width, this.cC.height];
                if ((this.fullScreenBGCol!==this.textBGCol)) { // different backgrounds for the text and actual bg
                    this.background = scene.add.image(this.cC.cX,0,'whitePixel').setTint(this.fullScreenBGCol).setOrigin(0.5,0).setScale(scale[0],scale[1]);
                    this.textBackground = scene.add.image(this.cC.cX,0,'whitePixel').setTint(this.textBGCol).setOrigin(0.5,0).setScale(this.width,this.height);
                    this.container.add([this.background, this.textBackground]);
                };
            } else { // not full screen
                this.textBackground = scene.add.image(this.cC.cX,0,'whitePixel').setTint(this.textBGCol).setOrigin(0.5,0).setScale(this.width,this.height);
                this.container.add(this.textBackground);
            };
        };
        // now we add the text object to the container
        this.container.add(this.textObject);

        // initialise the crop to the required height
        this.textObject.setCrop(0,this.startTime,this.width,this.height);
    }






    click(_name) { // called from vars.input
        _name = _name.replace('SCRL_','');
        switch (_name) {
            case 'close':
                this.fadeIn(false);
                return true;
            break; // break isnt required as i will be returning true for buttons. ill eventually move to removing these LIFE TODO

            case 'pause':
                let button = this.buttons.pause.button;
                let text = this.buttons.pause.text;
                if (button.frame.name==='pause') { // scroller is currently scrolling, pause it and switch icons
                    this.paused=true;
                    button.setFrame('unpause');
                    text.setText('UNPAUSE');
                } else {
                    this.paused=false;
                    button.setFrame('pause');
                    text.setText('PAUSE');
                    this.resetSpeed();
                };
            break;

            case 'reverse':
                let buttonReverse = this.buttons.reverse.button;
                buttonReverse.frame.name === 'reverse' ? buttonReverse.setFrame('unreverse') : buttonReverse.setFrame('reverse');
                this.reverse=!this.reverse;

                this.resetSpeed();
            break;

            case 'top':
                this.time=this.startTime;

                this.resetSpeed();
            break;

            case 'x1': // change the speed of the scroller
                let buttonx1 = this.buttons.x1.button;
                switch (buttonx1.frame.name) {
                    case 'x1': // currently speed 1, move to speed 2
                        this.speed = 2;
                    break;

                    case 'x2': // move to x4
                        this.speed = 4;
                    break;

                    case 'x4': // move to x1
                        this.resetSpeed();
                    break;
                };

                buttonx1.setFrame(`x${this.speed}`);
            break;

        }
    }

    cropText() { // called from the update function
        this.textObject.setCrop(0,this.time,this.width,this.height);
        this.textObject.y=-this.time;
    }

    fadeIn(_in=true) {
        let alphaTo = _in ? 1 : 0;
        if (_in) { // we're fading IN the scroller
            this.container.setVisible(true);
            this.container.setAlpha(0);
            this.time=this.startTime;
        } else { // we're fading OUT the scroller
            // where did we come from before showing the scroller?
            switch (this.clickFrom) {
                case 'mainScreen':
                    vars.containers.ignoreLoop=false;
                break;

                default:
                    console.warn(`Unabled to figure out where we came from before showing the scroller!`)
                    console.log(`"clickFrom" variable is: ${this.clickFrom}`);
                    debugger;
                    return false;
                break;
            };
        };

        // fadeIn/Out
        scene.tweens.add({
            targets: this.container,
            alpha: alphaTo,
            duration: 500,
            onComplete: (_t,_o)=> {
                !_o[0].alpha ? _o[0].setVisible(false) : null;
            }
        });
    }

    resetSpeed() {
        this.speed=1;
        this.buttons.x1.button.setFrame(`x${this.speed}`);
    }

    show(_show=true) { // called externally
        this.container.setVisible(_show);
    }

    update() { // if this.container is visible, we update the time var and crop the text object
        if (!this.loading && this.container.visible && !this.paused) {
            // increment or reset time
            if (!this.reverse) {
                this.time+this.speed >= this.maxHeight ? this.time=this.startTime : this.time+=this.speed;
            } else {
                this.time-this.speed >= this.startTime ? this.time-=this.speed: this.time=this.maxHeight;
            };
            this.cropText();
        }
    }

}