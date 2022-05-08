"use strict";
let ScoreCard = class {
    constructor(scn) {
        if (!scn) { console.error(`You must pass in the scene that the score card will sit on`); return false; }


        this.score = null; // pushed in from deal
        this.time = null; // pushed in from deck
        this.solutionID = null; // pushed in from deal.saveSolution

        this.scene = scn;
        this.defaultAssetsFolder = 'assets';
        this.folder = 'scoreCard';
        this.scores = vars.localStorage.scores;
        this.containerNames = [];
        this.loadRequiredFiles();
    }

    loadRequiredFiles() { // entry point, loads all required files
        this.scene.load.setPath(this.defaultAssetsFolder);
        let folder = 'scoreCard';
        let toLoad = 0;

        // images
        let textures = this.scene.textures.getTextureKeys();
        ['whitePixel.png','scoreCardHiLight.png'].forEach((_image)=> {
            let key = _image.replace(/\.png|\.jpg/g, '');
            if (!textures.includes(key)) {
                this.scene.load.image(key, `${this.folder}/${_image}`);
                toLoad++;
            };
        });

        // font
        if (!this.scene.cache.bitmapFont.exists('scoreCard')) {
            this.scene.load.bitmapFont('scoreCard', `${folder}/scoreCard.png`, `${folder}/scoreCard.xml`);
            toLoad++;
        };

        if (toLoad>0) { this.scene.load.once('complete', ()=> { this.filesLoaded(); });
            this.scene.load.start();
        };
    }

    filesLoaded() {
        vars.DEBUG ? console.log(`Setting up the score card`) : null;
        this.init();
    }





    init() { // runs after all files have loaded
        this.initNameEntry();
        this.initHighScoreTable();

        // disable name entry until requested
        this.enableNameEntry(false);

        // initialise the keyboard used for entering name
        this.initKeyboard();
    }

    initHighScoreTable() {
        this.defaultSortBy = 'score';
        let cC = consts.canvas;
        let screenName = 'highScoreTable';
        let depth = consts.depths[screenName];
        this.highScoreTableContainer = this.scene.add.container().setName('highScoreTableContainer').setDepth(depth);
        this.containerNames.push(['highScoreTable', 'highScoreTableBG']);
        this.scene.containers.highScoreTable = this.highScoreTableContainer;


        // we only add 1 BUTTON at this time (as the high score table starts with only the "sort by" times button)
        vars.input.pageButtons[screenName] = ['times_HSTB'];

        let bg = this.scene.add.image(cC.cX, cC.cY,'whitePixel').setScale(cC.width,cC.height).setTint(0x0).setName('highScoreTableBG').setDepth(depth-1).setInteractive();
        // the shader image is moved between containers as the more we make the slower this game is on android
        this.shaderImage = this.scene.add.image(cC.cX,cC.cY, 'fireworks').setDepth(depth-1).setScale(1/vars.shaders.fireworksRes).setName(`hs_shader`);
        this.shaderContainer = 'highScoreTable';

        let hstBG = scene.add.image(cC.cX, cC.cY, 'highScoreTable', 'highScoreTableBG').setDepth(depth);
        // the next two buttons are only available when there are more than 1 page of scores
        let prevButton = scene.add.image(400, cC.cY, 'highScoreTable', 'highScoreTableSideButtons').setOrigin(1,0.5).setFlipX(true).setCrop(0,0,0,0).setName('previousPage_HSTB').setVisible(false).setInteractive();
        let nextButton = scene.add.image(1370, cC.cY, 'highScoreTable', 'highScoreTableSideButtons').setOrigin(0,0.5).setCrop(0,0,0,0).setName('nextPage_HSTB').setVisible(false).setInteractive();
        
        let scoresButton = scene.add.image(cC.width*0.75, cC.height*0.175, 'highScoreTable', 'bestScoresIcon').setDepth(depth).setName('scores_HSTB').setAlpha(0).setInteractive();
        let timesButton = scene.add.image(cC.width*0.75, cC.height*0.175, 'highScoreTable', 'bestTimesIcon').setDepth(depth).setName('times_HSTB').setAlpha(1).setInteractive();

        let hdrHS = scene.add.image(cC.cX, cC.height*0.175, 'highScoreTable', 'headerHighScores').setName('headerHighScores').setDepth(depth).setAlpha(1);
        let hdrBT = scene.add.image(cC.cX, cC.height*0.175, 'highScoreTable', 'headerBestTimes').setName('headerBestTimes').setDepth(depth).setAlpha(0);

        let closeButton = scene.add.image(cC.cX,cC.height*0.875, 'ui', 'closeOptionsIcon').setName('close_HSTB').setDepth(depth+1).setAlpha(1).setInteractive();

        this.highScoreTableContainer.add([bg,this.shaderImage,hstBG,prevButton,nextButton,scoresButton,timesButton,hdrBT,hdrHS,closeButton]);

        this.highScoreTableContainer.setVisible(false);


        this.buildHighScorePages(this.defaultSortBy);
        this.showHSTableButtons(false);
        this.showHSTableReplayButtons(false);

    }

    initKeyboard() {
        scene.input.keyboard.on('keyup', (_key)=> {
            this.inputKeyDown(_key);
        });
    }

    initNameEntry() {
        let depth = consts.depths.inputPlayerName;
        this.inputContainer = this.scene.add.container().setName('scoreCardContainer').setDepth(depth);
        this.containerNames.push(['inputName', 'scoreCardBG']);
        this.scene.containers.inputName = this.inputContainer;

        let name = vars.localStorage.playerName;
        this.player = { enteringName: true, name: name }; // I could use this variable to show and hide the high score table, but its dealt with elsewhere. Remember in future

        let cC = consts.canvas;
        let bg = this.scene.add.image(cC.cX, cC.cY,'whitePixel').setScale(cC.width,cC.height).setTint(0x0).setName('scoreCardBG').setInteractive(); // setInter here is so we cant accidentally click on icons behind the score card
        this.inputContainer.add(bg);
        // CREATE THE SCORE CARD
        this.scoreLetters = [
            [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J' ],
            [ 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T' ],
            [ 'U', 'V', 'W', 'X', 'Y', 'Z', '.', '-', '<', '>' ]
        ];
        this.name = this.player.name ? this.player.name : 'Enter Name...';

        let font = 'scoreCard';
        let x = 140; let y = 64; let xyInc = [80,96];
        this.scoreLetters.forEach((_row,_i)=> {
            _row.forEach((_col)=> {
                let input = this.scene.add.bitmapText(x, y, font, _col).setName(`HSL_${_col}`).setOrigin(0.5).setDropShadow(2,2).setTint(consts.tints.orange).setDepth(150).setInteractive();
                this.inputContainer.add(input);
                input.on('pointerup', (_p)=> {
                    let objectName = _p.manager._tempHitTest[0].name;
                    this.click(objectName);
                });
                x+=xyInc[0];
            });
            x=140; y+=xyInc[1];
        });

        // ADD HIGHLIGHT
        this.playerText = this.scene.add.bitmapText(cC.cX/2, 460, font, this.name, 64).setOrigin(0.5).setName('txtPlayerName').setLetterSpacing(3).setTint(0x0F78D1).setDropShadow(2,2);

        // add everything to the container
        this.inputContainer.add([this.playerText]);
        this.inputContainer.setScale(2).setVisible(false);
    }

    animateLetter(_object) {
        vars.audio.playSound('buttonClick');
        scene.tweens.add({
            targets: _object,
            scale: 1.2,
            duration: 125,
            yoyo: true
        });
    }

    animatePreviousNextButton(_show=true) {
        let prevButton = this.highScoreTableContainer.getByName('previousPage_HSTB');
        let nextButton = this.highScoreTableContainer.getByName('nextPage_HSTB');
        let rX = nextButton.x;

        let fromTo = _show ? [0,150] : [150,0];

        let xy = [0,150];
        scene.tweens.addCounter({
            from: fromTo[0], to: fromTo[1],
            duration: 500,
            ease: 'Quad.easeOut',
            onUpdate: (_t,_v)=> {
                let value = ~~(_v.value+0.5);
                if (_show) {
                    prevButton.setCrop(0,0,value,prevButton.height);
                    nextButton.setCrop(xy[1]-value,0,value,nextButton.height);
                    nextButton.x=rX+(value/150)*150;
                } else {
                    prevButton.setCrop(xy[0]-value,0,value,prevButton.height);
                    nextButton.setCrop(xy[1]-value,0,value,nextButton.height);
                    nextButton.x=rX-((xy[1]-value)/150)*150;
                };
            }
        });
    }

    buildHighScorePages(_sortBy='score') {
        _sortBy!=='time' ? _sortBy='score' : null;
        this.defaultSortBy = _sortBy; // remember what we're sorting by for next time the high score table is shown
        if (this.highScoreTableContainer.list.length>8) { // the first 8 children of this container is the bg, buttons and headers
            // everything else is a high score
            this.highScoreTableContainer.getAll().forEach((_c)=> {
                if (_c.getData('position') && Number.isInteger(_c.getData('position'))) {
                    _c.destroy();
                };
            });
        };

        let alphas = [0,1];
        let alphaT, alphaS;
        if (_sortBy==='time') {
            alphaT = alphas[1]; alphaS = alphas[0];
        } else {
            alphaT = alphas[0]; alphaS = alphas[1];
        };

        // switch the headers
        this.highScoreTableContainer.getByName('headerBestTimes').setAlpha(alphaT);
        this.highScoreTableContainer.getByName('headerHighScores').setAlpha(alphaS);
        
        // sort the array by score/time or time/score
        if (_sortBy==='score') {
            this.scores.sort((a,b)=> (b.score-a.score) || (a.time-b.time));
        } else {
            this.scores.sort((a,b)=> (a.time-b.time) || (a.score-b.score));
        };

        // build the ui
        this.highScoreTableBuildUIPages();
    }

    click(_oName) { // deal with the name entry screen
        if (!vars.input.enabled) return 'Input is currently disabled!';
        if (!_oName.startsWith('HSL_')) return false;

        let delay = vars.input.usingCursorKeys ? 50 : 200;
        vars.input.enableInput(false,delay); // disable input for 200ms (stops accidental double clicks)

        let letter = _oName.replace('HSL_','');
        let updateUI = false;
        vars.DEBUG ? console.log(`Adding letter ${letter} to current name`) : null;
        if (this.name==='Enter Name...') this.name='';
        switch (letter) {
            case '<': // delete character
                if (this.name.length>0) { this.name=this.name.slice(0,-1); }
                vars.audio.playSound('deleteLetter');
                updateUI=true;
            break;

            case '>': // submit name
                vars.audio.playSound('acceptName');
                this.enableNameEntry(false); // disable name entry
                this.updateHighScoreTable(); // update the high score table

                // move the shader image back into the high score table container
                this.moveShaderToNewContainer('highScoreTable');
                
                // show the hi score table
                vars.DEBUG ? console.log(`Showing the high score table`) : null;
                this.buildHighScorePages(this.defaultSortBy);
                this.showInputContainer(false);

                // show the high score table
                this.showHighScoreTable();
            break;

            default: // standard letter
                if (this.name.length>17) return false; // limit the players name to 18 characters
                this.name+=letter;
                let letterObject = this.inputContainer.getByName(`HSL_${letter}`);
                this.animateLetter(letterObject);
                updateUI=true;
            break;
        }

        updateUI ? this.playerText.setText(this.name) : null;
    }

    enableNameEntry(_enable=true) {
        if (_enable) {
            this.player.enteringName=true;
            // when we ENABLE NAME ENTRY, we DISABLE THE AUTO CYCLE to main screen as the USER must INTERACT with the high score table themselves, AFTER WHICH the NEW GAME CONTAINER is SHOWN
            vars.containers.startIntroLoop(false);
        } else {
            this.player.enteringName=false;
        };
    }

    highScoreTableBuildUIPages() {
        let cC = consts.canvas;
        let depth=consts.depths.highScoreTable;

        let scores = [...this.scores]; // shallow-ish copy the scores
        let pages = [];
        // split the scores into pages, each containing 10 scores
        while (scores.length) { pages.push(scores.splice(0,10)); };

        let font = 'scoreCard';

        this.currentPage=1; this.playersHiScorePage = 1;
        this.totalPages = 0;
        let overrideColour = 0x10ff10;
        let startY = 300;
        let tintDefault = consts.tints.highScores;
        let tintHighlight = consts.tints.orange;
        let tints = this.defaultSortBy === 'score' ? { score: tintHighlight, time: tintDefault } : { score: tintDefault, time: tintHighlight };
        vars.DEBUG ? console.groupCollapsed('%cHigh score pages >>>','color: #10FF10; font-size: 14px') : null;
        pages.forEach((_p,_pI)=> {
            this.totalPages=_pI+1; // set the total pages var (used for moving between pages. Starts at 1!)
            vars.DEBUG ? console.log(`PAGE: ${this.totalPages}`) : null;
            _p.forEach((_score,_y)=> {
                // position text
                let page = _pI+1;

                let tintOverride = false;
                if ((this.score && this.score===_score.score) && (this.time && this.time==_score.time)) { // this is the most recent score and time, highlight it green
                    // override colour
                    tintOverride=true;
                    // and set this page to the required page
                    this.playersHiScorePage = _pI+1;
                };

                let alpha = _pI ? 0: 1;
                let deltaY = _y%10;
                let positionID = _y+1 + (_pI*10);
                // get "n"th
                let ext = getStringExtForInt(positionID);
                let positionText = this.scene.add.bitmapText(cC.width*0.285, startY+(deltaY*60), font, `${positionID}${ext}`, 50).setOrigin(1,0.5).setLetterSpacing(2).setData({ page: page, position: deltaY+1 }).setTint(tintDefault).setDepth(depth).setAlpha(alpha);
                tintOverride ? positionText.setTint(overrideColour) : null; 
                let nameText = this.scene.add.bitmapText(cC.width*0.3, startY+(deltaY*60), font, _score.name, 50).setOrigin(0,0.5).setLetterSpacing(2).setData({ page: page, position: deltaY+1 }).setTint(tintDefault).setDepth(depth).setAlpha(alpha);
                tintOverride ? nameText.setTint(overrideColour) : null; 

                let solutionID = _score.solutionID ? _score.solutionID : 0;
                let scoreText = this.scene.add.bitmapText(cC.width*0.64, startY+(deltaY*60), font, _score.score, 50).setOrigin(1,0.5).setLetterSpacing(2).setData({ page: page, position: deltaY+1 }).setTint(tints.score).setDepth(depth).setAlpha(alpha);
                if (Number.isInteger(_score.time)) _score.time+='.0';
                tintOverride ? scoreText.setTint(overrideColour) : null; 
                let timeText = this.scene.add.bitmapText(cC.width*0.735, startY+(deltaY*60), font, `${_score.time}s`, 50).setOrigin(1,0.5).setLetterSpacing(2).setData({ page: page, position: deltaY+1 }).setTint(tints.time).setDepth(depth).setAlpha(alpha);
                tintOverride ? timeText.setTint(overrideColour) : null; 
                this.highScoreTableContainer.add([positionText,nameText,scoreText,timeText]);

                // should the replay icon be available?
                let aiPlayButton = null;
                if (solutionID) {
                    vars.DEBUG ? console.log(`%cSolution ID: ${solutionID} found for ${_score.score} in ${_score.time}, by ${_score.name} (page ${page}, alpha: ${alpha})`, 'color: #10FF10') : null;
                    aiPlayButton = this.scene.add.image(cC.width*0.755, startY+(deltaY*60)-5,'ui', 'aiReplayIcon').setOrigin(0.5,0.5).setData({ page: page, position: deltaY+1 }).setDepth(depth).setAlpha(alpha).setName(`hSSolutionID_${solutionID}`).setInteractive();
                } else {
                    vars.DEBUG ? console.log(`%cNo solution ID found for ${_score.score} in ${_score.time}, by ${_score.name}`, 'color: red') : null;
                };

                aiPlayButton ? this.highScoreTableContainer.add(aiPlayButton) : null;
            });
        });
        vars.DEBUG ? console.groupEnd() : null;

        
        let pageNavEnabled = pages.length>1 ? true : false;
        this.highScoreTableContainer.getByName('previousPage_HSTB').setVisible(pageNavEnabled);
        this.highScoreTableContainer.getByName('nextPage_HSTB').setVisible(pageNavEnabled);
        
        // show the exit button, prev and next
        this.showHSTableButtons(true);

        // jump to the appropriate page
        this.playersHiScorePage!==this.currentPage ? this.highScoreJumpToPage() : null;
    }

    /*highScoreCheck(_score) { // UNUSED!! DELETE?
        let playerScore = _score;
        let highScores = [];
        this.scoreDetails.forEach( (_sD)=> {
            highScores.push(_sD[3]);
        });

        let found=false;
        highScores.forEach((_hS,_i)=> {
            if (found===false && playerScore > _hS) { // the player score is better than this
                found=_i;
            };
        })
        if (found===false) { vars.DEBUG ? console.log(`%cScore ${playerScore} is NOT a high score`,'color: red') : null; this.showInputContainer(true); return false; }


        // HIGH SCORE FOUND!
        vars.DEBUG ? console.log(`%cHigh score found. Pushing into index ${found}`, 'color: green') : null;

        highScores.splice(found, 0, playerScore); // push score into the array
        highScores.pop(); // remove the last in the array
        vars.DEBUG ? console.log(highScores) : null;

        // now we have to push the score back into this.scoreDetails
        // and update the score card with the new scores
        for (let i=3; i>=found; i--) {
            this.scoreDetails[i+1][1]=this.scoreDetails[i][1];
            this.scoreDetails[i+1][3]=this.scoreDetails[i][3];

            let textLine = this.inputContainer.getByName(`scoreLine_${i}`);
            if (i===found) { // empty this name and set score to player score
                this.scoreDetails[i][1]='';
                this.scoreDetails[i][3]=playerScore;
                this.playerText.setY(textLine.y);
                textLine.setText(`${this.scoreDetails[i][0]}    ${this.scoreDetails[i][3]}   ${this.scoreDetails[i][1]}`).setTint(this.scoreDetails[i][2]);
            };

            // update the affected score lines (eg i+1)
            let nextLine = this.inputContainer.getByName(`scoreLine_${i+1}`);
            let sL = this.scoreDetails[i+1];
            nextLine.setText(`${sL[0]}    ${sL[3]}   ${sL[1]}`).setTint(sL[2]);
        };

        vars.DEBUG ? console.table(this.scoreDetails) : null;

        // allow entry of player name
        this.enableNameEntry(true);
        // now show the input container
        this.showInputContainer(true);
    }*/

    highScoreJumpToPage() { // after the player enters their name, we jump to the page with the new score
        this.oldPage = 1; // we set the old page to 1 (default page when building the pages)
        this.currentPage = this.playersHiScorePage; // the way showPage works we just set current page to required page
        this.showPage(); // now showPage will hide page 1 and show the players high score page instead
    }

    inputKeyDown(_key) { // handles keydown when entering name
        if (!this.player.enteringName) return false;
        vars.DEBUG ? console.log(`%cHigh Score table KEYDOWN.`,`color: #10FF10`) : null;

        if (_key.keyCode<65 || _key.keyCode>90) {
            if (_key.keyCode!==189 && _key.keyCode!==190 && _key.keyCode!==8 && _key.keyCode!==13) {
                console.log(`%cPlayer tried to enter an invalid character: ${_key.key} with char code ${_key.keyCode}`,'color: orange');
                return false;
            }
        };
    
        if ((_key.keyCode>=65 && _key.keyCode<=90) || (_key.keyCode===189 || _key.keyCode===190)) {
            let letter = _key.key.toUpperCase();
            vars.DEBUG ? console.log(`%cUser is entering the letter ${letter}`,'color: #10FF10') : null;
            // call click function
            this.click(`HSL_${letter}`);
            return true;
        };
    
        if (_key.keyCode===8) {
            vars.DEBUG ? console.log(`Deleting a character`) : null;
            // call click function
            this.click('HSL_<');
            return true;
        };
    
        if (_key.keyCode===13) {
            vars.DEBUG ? console.log(`Return key pressed. Entering name into High Score Table`) : null;
            // call click function
            this.click('HSL_>');
            return true;
        };
    
        // if we get here, the key hasnt been dealt with. ie we should never get here
        vars.DEBUG ? console.log(_key) : null;
          
    }

    moveShaderToNewContainer(_toContainerName=null) { // the from container is done by checks
        // THIS IS SLIGHTLY MORE COMPLEX THAN IT NEEDS TO BE
        // AS THIS WAS THE FIRST REAL CLASS TO HAVE MULTIPLE CONTAINERS
        // SO THE CONTAINERS ARENT EVEN THE RIGHT NAMES ETC, SO NORMAL this. IS QUITE DIFFICULT
        // UNTIL WE GET PASSED 1.0 THIS WILL STAY THIS WAY
        // UPON REFACTORING I WILL MOVE THE INDIVIDUAL CONTAINERS TO this.containers
        // AND I CAN THEN GRAB THEM BY USING .this.containers[containerName]
        // eventual TODO post 1.0
        if (!vars.checkType(_toContainerName,'string')) return false;
        if (!this.shaderContainer || this.shaderContainer===_toContainerName) return false; // this container already has the shader image

        // find the container holding the shader image
        let fromContainer = vars.containers.getByName(this.shaderContainer);
        
        // this is the container were moving the shader to
        let toContainer = vars.containers.getByName(_toContainerName);
        if (!toContainer || !fromContainer) return false;



        // If we get here the from container and to container are valid
        
        // remove the shader from the current container
        fromContainer.remove(this.shaderImage);
        // and push it into the new one
        toContainer.add(this.shaderImage);

        // now push the shader image to the back
        toContainer.sendToBack(this.shaderImage);
        // then the background
        let bgName = null;
        this.containerNames.every((_c)=> { if (_c[0]===_toContainerName) { bgName = _c[1]; return true; }; return true; });
        let bg = toContainer.getByName(bgName);
        if (!bg) { console.warn(`Unable to find the background image name for container ${_toContainerName}.\nThis means that containerNames is missing the container!`); return false; }
        toContainer.sendToBack(bg);

        this.shaderContainer = _toContainerName;
    }

    showHighScoreTable(_show=true) {
        let alpha = _show ? 1 : 0;
        this.showHSTableButtons(_show);
        this.showHSTableReplayButtons(_show);
        this.highScoreTableContainer.setVisible(_show);
        this.highScoreTableContainer.setAlpha(alpha);
    }

    showInputContainer(_show=true) {
        _show ? this.inputContainer.setVisible(true) : this.inputContainer.setVisible(false);
    }

    showHighScorePage(_next=true) {
        vars.audio.playSound('pageFlip');
        this.oldPage = this.currentPage;
        if (_next) { // show the next page
            this.currentPage < this.totalPages ? this.currentPage++ : this.currentPage=1;
        } else { // show the previous page
            this.currentPage > 1 ? this.currentPage-- : this.currentPage=this.totalPages;
        };
        this.showPage();
    }

    showHSTableButtons(_show=true) {
        let container = this.highScoreTableContainer;
        if (_show && container.getByName('previousPage_HSTB').alpha===1) return false;

        ['previousPage_HSTB','nextPage_HSTB','close_HSTB'].forEach((_button)=> {
            _show ? container.getByName(_button).setAlpha(1) : container.getByName(_button).setAlpha(0);
        });
        _show ? this.animatePreviousNextButton(true) : null;
    }

    showHSTableReplayButtons(_show=true) {
        let container = this.highScoreTableContainer;
        if (!_show) {
            container.getAll().forEach((_button)=> {
                if (_button.name.startsWith('hSSolutionID_')) { _button.setAlpha(0); ;}
            });
            vars.input.pageButtons.highScoreTable = vars.input.pageButtons.highScoreTable.slice(0,1); // remove all but the current sort by button
        } else { // we're showing the solution buttons
            let sC = vars.game.scoreCard;
            // first, make sure the only button in the button list is the sort by
            vars.input.pageButtons.highScoreTable = vars.input.pageButtons.highScoreTable.slice(0,1);
            container.getAll().forEach((_button)=> {
                if (_button.name.startsWith('hSSolutionID_')) {
                    if (_button.getData('page')===sC.currentPage) { // we're showing this button
                        _button.setAlpha(1);
                        vars.input.pageButtons.highScoreTable.push(_button.name); // add it to the button list
                    } else {
                        _button.setAlpha(0);
                    };
                };
            });
        };
        return false;
    }

    showPage() { // hide the old page and shows the new one
        vars.DEBUG ? console.log(`  %cHiding page ${this.oldPage} and showing page ${this.currentPage}`, 'color: black; background-color: yellow;') : null;
        let iV = vars.input;
        let pageButtons = iV.pageButtons;
        pageButtons.highScoreTable = pageButtons.highScoreTable.slice(0,1);
        this.highScoreTableContainer.getAll().forEach((_score)=> {
            if (_score.getData('page')) {
                let page = _score.getData('page');
                if (this.oldPage && page===this.oldPage) { _score.setAlpha(0); }; // hide all the stuff on the old page
                if (page===this.currentPage) { // show all the stuff on the new page
                    _score.setAlpha(1);
                    // and if this button starts with hSSolutionID_ add it to the pageButtons
                    if (_score.name.startsWith('hSSolutionID_')) {
                        pageButtons.highScoreTable.push(_score.name);
                    };
                };
            };
        });
        this.oldPage = null;
    }

    switchVisible() {
        let container = this.highScoreTableContainer;
        ['scores_HSTB','times_HSTB'].forEach((_button)=> {
            let object = container.getByName(_button);
            if (object.alpha) {
                object.setAlpha(0);
            } else {
                object.setAlpha(1);
                vars.input.pageButtons.highScoreTable[0] = _button;
            };
        });
    }

    updateHighScoreTable() {
        vars.DEBUG ? console.log(`Updating the high score table`) : null;
        if (this.name==='' || this.name==='Enter Name...') this.name='Player';
        this.player.name = this.name; vars.localStorage.savePlayerName(this.name); // save player name for later
        // adding this score to the list
        let scoreData = { name: this.player.name, score: this.score, time: this.time, solutionID: this.solutionID };
        this.solutionID=null; // reset the solution ID
        vars.DEBUG ? console.table({scoreData: scoreData}) : null;
        this.scores.push(scoreData);
        // now sort by score, ready for the HS table
        arraySortByKey(this.scores,'score').reverse();
        // save it to lS
        vars.localStorage.saveScores(this.scores);
    }
}