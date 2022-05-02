"use strict";
let Unlockables = class {
    constructor(_scn) {
        this.unlockableSet = vars.localStorage.unlockables; delete(vars.localStorage.unlockables);
        if (!_scn || typeof _scn!=='object'|| typeof _scn.add!=='object') return false;

        this.scene = _scn;
        
        this.folder = 'Unlockables';

        this.available = {
            cardSets: [],
            tints: []
        };

        // this is an array of unlock integers (ie the unlockables real ID when initialised)
        // used to cross reference unlocks to prevent simple cheating
        this.ULInts = vars.localStorage.options.ULInts; delete(vars.localStorage.options.ULInts);

        this.fadingContainer=false; // tracks a fade in/out of all containers
        this.showContainerDuration=750;
        this.optionsMinCount = 0;

        this.tweens = {};

        // loot box emulator variables
        this.cC = consts.canvas;
        this.lbeVars = null;
        this.lootBoxEmuFinished=true;

        this.state='Initialising'; // current state of readiness. Init/Build/Ready
        this.init();

        this.currentlyVisible = 'options';
    }

    // INIT FUNCTIONS
    init() {
        // BUILD THE LOADING CONTAINER
        let cC = consts.canvas;
        this.loadingContainer = this.scene.add.container();
        // create a background for the loader
        let bg = this.scene.add.image(cC.cX,cC.cY,'whitePixel').setTint(0x111122).setScale(cC.width,cC.height).setAlpha(0.95);
        // When an unlockable is loaded the ulIcon will pulse.
        this.ulIcon = this.scene.add.image(cC.cX,cC.height*0.4,'ui','unlockablesLoadingImage');
        
        // a text object that we can update as the files load
        this.ulsLoadedText = this.scene.add.bitmapText(cC.cX, cC.height*0.65, 'defaultFont', 'Unlockables Loaded: 0', 64, 1).setOrigin(0,0.5);
        this.ulsLoadedText.x-=this.ulsLoadedText.width/2;

        // add everything to the container
        this.loadingContainer.add([bg,this.ulIcon,this.ulsLoadedText]);




        // EVERYTHING BELOW HERE NEEDS LOADING!
        this.scene.load.setPath('assets/'); // initialise the loader to load from /assets/
        this.initCardSetsAndTints();
        this.initOtherFiles(); // anything else used by unlockables

        this.filesLoadedCount=0;
        // on loading each file
        this.scene.load.on('load', (_fileData)=> {
            let classUL = vars.game.unlockables;
            classUL.fileLoaded(_fileData);
        });
        // make sure we know when all files have loaded so we can build the unlock box on the OPTIONS screen
        this.scene.load.once('complete', this.filesLoaded, this);
        // and load everything
        this.scene.load.start();
    }


    initCardSetsAndTints() {
        this.available = { cardSets: [], tints: [] };
        for (let u in this.unlockableSet) {
            if (u.startsWith('cS')) {
                this.available.cardSets.push([u.replace('cS',''),this.unlockableSet[u].unlocked,this.unlockableSet[u].id]);
            } else if (u.startsWith('tint')) {
                let tint = u.replace('tint','');
                let intVal = Phaser.Display.Color.HexStringToColor(tint).color;
                this.unlockableSet[u].intVal = intVal;
                this.available.tints.push([tint,this.unlockableSet[u].unlocked,this.unlockableSet[u].id,intVal]);
            } else {
                console.warn(`Unknown type: ${u}`);
            };
        };

        this.readyCardSetsForLoader();
    }

    initOtherFiles() {
        // IMAGES AND ATLAS'
        this.scene.load.image(`bgLootFade`, `${this.folder}/ui/bgLootFade.png`);
        this.scene.load.atlas('unlockUI', `${this.folder}/ui/unlockable.png`, `${this.folder}/ui/unlockable.json`);

        // SOUNDS
        this.scene.load.audio('tick', `${this.folder}/audio/tick.ogg`);
    }

    destroyLoaderContainer() {// called from filesLoaded (after last file is loaded)
        this.filesLoadedCount = null; // let the fileLoaded function know we should ignore anything loaded after this point
        this.loadingContainer.destroy(); // destroy the container
    }

    fileLoaded(_fileData) { // used when a single file is loaded
        if (!vars.checkType(this.filesLoadedCount,'integer')) return false;
        if (_fileData.type!=='image') return false;
        // update the loaded counter
        this.filesLoadedCount++;
        this.ulsLoadedText.setText(`Unlockables Loaded: ${this.filesLoadedCount}`);
    }

    filesLoaded() { // after all files have loaded, we come here which then builds the UI
        this.destroyLoaderContainer(); // destroy the loader container

        this.buildUI(); // build the unlocklable pages

        // Now we can show the vanity page
        if (vars.isPhone) return true; // splash screen isnt show until loading image has fully faded out
        vars.UI.buildSplashScreen();
    }

    readyCardSetsForLoader() {
        let subFolder = 'cardSets';
        this.available.cardSets.forEach((_cS)=> {
            this.scene.load.atlas(_cS[0], `${this.folder}/${subFolder}/${_cS[0]}/unlockable.png`, `${this.folder}/${subFolder}/${_cS[0]}/unlockable.json`);
        });
    }



    // FUNCTIONS THAT RUN AFTER INITS (BUILDS)
    animateRandomRollButton() {
        this.tweens.randomRollButton = this.scene.tweens.add({
            targets: this.randomRollText,
            scale: 1.1,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Power1',
            paused: true
        });
    }

    buildLootBoxEmu() { // called from buildUI
        let container = this.containers.lootboxemu;

        let cC = this.cC; // this container is full screen!
        // add the black background
        this.scrollerBG = this.scene.add.image(cC.cX,cC.cY,'whitePixel').setScale(cC.width,cC.height).setTint(0x0).setName('lootboxemuBG').setInteractive();
        container.add(this.scrollerBG);
        this.scrollerBG.on('pointerup', this.click, this.scrollerBG);

        // we add a fading image to the left and the right of the container. Its depth is 10 (above the background and scrolling unlockables)
        this.fgFade          = this.scene.add.image(0,0,'bgLootFade').setOrigin(0).setScale(1, consts.canvas.height).setDepth(5).setName(`fgFade`);
        this.topPointer      = this.scene.add.image(this.cC.cX,0+10,'unlockUI','pointerDown').setOrigin(0.5,0).setDepth(3).setName(`topPointer`);
        this.lowerPointer    = this.scene.add.image(this.cC.cX,this.cC.height-10,'unlockUI','pointerDown').setOrigin(0.5,1).setDepth(3).setName(`lowerPointer`).setFlipY(true);
        this.winHighlight    = this.scene.add.image(this.cC.cX,this.cC.cY,'unlockUI','winHighlight').setDepth(5).setName(`winHighlight`);

        let fS = 20; let fF = 'Consolas';
        this.unlockName = this.scene.add.text(this.cC.cX, this.cC.cY-150, '???', { fontFamily: fF, fontSize: fS, color: consts.htmlColours.orange }).setName(`unlockName`);
        this.unlockName.setStroke(consts.htmlColours.blueDark, 2).setOrigin(0.5).setDepth(4).setData({ actualID: null });
        this.unlockName.setShadow(2, 2, "#333333", 2, true, true);
        
        this.typeTextObject = this.scene.add.text(this.cC.cX, this.cC.cY+150, '???', { fontFamily: fF, fontSize: fS, color: consts.htmlColours.orange }).setName(`unlockTypeText`);
        this.typeTextObject.setStroke(consts.htmlColours.blueDark, 2).setOrigin(0.5).setDepth(4);
        this.typeTextObject.setShadow(2, 2, "#333333", 2, true, true);


        container.add([this.fgFade,this.topPointer,this.lowerPointer,this.winHighlight, this.typeTextObject, this.unlockName]);

        // we only build the actual unlockables list when the user requests a random roll
        // its in generate loot box scoller
    }

    buildOptions() { // called from buildUI
        let container = this.containers.options;
        let container2 = this.containers.unlocked;

        // OTHER BUTTONS
        // UNLOCKABLES
        let prev = this.scene.add.image(235,615,'ui','previousIcon').setName(`UNL_previous`).setInteractive();
        let pageText = this.scene.add.bitmapText(515, 613,'defaultFont',`PAGE ${this.currentPage+1} of ${this.totalPages}`,48).setOrigin(0.5).setDepth(2);
        let next = this.scene.add.image(805,615,'ui','nextIcon').setName(`UNL_next`).setInteractive();
        container.add([prev,next,pageText]);
        // UNLOCKED
        let prevULD = this.scene.add.image(100,725,'ui','previousIcon').setName(`UNLD_previous`).setInteractive();
        let pageTextULD = this.scene.add.bitmapText(380, 723,'defaultFont',`PAGE 0 of 0`,48).setOrigin(0.5).setDepth(2);
        let nextULD = this.scene.add.image(670,725,'ui','nextIcon').setName(`UNLD_next`).setInteractive();
        container2.add([prevULD,pageTextULD,nextULD]);
        
        
        // input for next/prev buttons (options container AND unlocked containers)
        prev.on('pointerup', this.click, prev);
        next.on('pointerup', this.click, next);

        prevULD.on('pointerup', this.click, prevULD);
        nextULD.on('pointerup', this.click, nextULD);

        this.UIButtonsAndText = { prev: prev, pageText: pageText, next: next };
        this.UIButtonsAndTextUnlocked = { prev: prevULD, pageText: pageTextULD, next: nextULD };

        // HEADINGS AND SHIZ
        let optionsHeaderLeft = this.scene.add.image(40,-15,'unlockUI','selectorLeft').setOrigin(0,1);
        let optLeftWidth = optionsHeaderLeft.width;
        let optionsHeaderRight = this.scene.add.image(40+optLeftWidth,-15,'unlockUI','selectorRight').setOrigin(0,1);
        let centre = optionsHeaderRight.getCenter();
        this.randomRollText = this.scene.add.image(centre.x,centre.y,'unlockUI','randomRollText').setName('randomRoll').setInteractive();
        this.animateRandomRollButton();
        this.showRandomRollButton();
        this.randomRollText.on('pointerup', this.click, this.randomRollText);
        this.currentTypeText = scene.add.bitmapText(60, -70, 'defaultFont', 'CARDSETS',64).setName('options_currentType').setOrigin(0,0.5).setTint(consts.tints.orange);
        container.add([optionsHeaderLeft,optionsHeaderRight,this.randomRollText,this.currentTypeText]);

        // ticks for current tint and card set
        this.tintTick = scene.add.image(100,400,'ui','yesIcon').setOrigin(0.5,1).setData({ page: 1, delete: false }); // x and y position doesnt matter as its re-positioned before the player sees it
        this.cardTick = scene.add.image(100,400,'ui','yesIcon').setOrigin(0.5,1).setData({ page: 1, delete: false }); // same for this
        container2.add([this.tintTick,this.cardTick]);


        // position the containers
        container.setPosition(625,325);
        container2.setPosition(765,190);

        // set the min count
        this.optionsMinCount = container.length;

        // set up the unlockKeys
        this.unlockKeys = [];
        let uS = this.unlockableSet;
        for (let _ul in uS) {
            if (!uS[_ul].unlocked) { this.unlockKeys.push(_ul); };
        };

        // BUILD THE PAGES
        this.buildPages();
    }

    buildUI() {
        this.state='Building';
        // CONTAINERS
        this.containersAndGroupsInit();

        // FIRST, build the options container that will sit in the optionScreen container
        this.buildOptions();
        // NEXT, the loot box emulator
        this.buildLootBoxEmu();

        // hide all the containers
        this.hideAllContainers();

        this.state='Ready';
    }

    containersAndGroupsInit() {
        this.containers = { options: null, lootboxemu: null, unlocked: null };

        // we need three containers. The two thats on the options page (unlockable and unlocked),
        // the 2nd is the loot box emulator
        let depths = consts.depths;
        this.containers.options = this.scene.add.container().setName('options').setDepth(depths.options+10); // both of these containers are at the same depth
        this.containers.unlocked = this.scene.add.container().setName('unlocked').setDepth(depths.options+10);
        this.containers.lootboxemu = this.scene.add.container().setName('lootBoxEmu').setDepth(depths.options+15); // this one sits aboce both of them

        this.unlockGroup = this.scene.add.group().setName('unlockGroup'); // used by the loot box emulator
    }




    // THE UI HAS BEEN BUILT
    // THESE FUNCTIONS DEAL WITH INTERACTIVITY, MANIP etc
    animatedUnlock(_pV=null) { // after checking that the player has enough unlock points and the new UP is saved, we enter here
        if (_pV===null) return false;
        // OK, we need to pop the tint image out of the container
        let container = this.containers.options;
        let type;
        if (_pV.name.startsWith('tint_')) {
            type = 'tint';
        } else if (_pV.name.startsWith('cardSet_')) {
            type = 'cardSet';
        } else {
            console.error(`Passed object name (${_pV.name}) doesnt start with tint or cardSet. Failing gracefully!`);
            return false;
        };
        
        if (type==='tint') {
            let tintImage = _pV;
            let xOffset = container.x;
            let yOffset = container.y;
            let depth = container.depth;
            container.remove(tintImage); // pop it out
            tintImage.setPosition(tintImage.x+xOffset+tintImage.scaleX/2, tintImage.y+yOffset+tintImage.scaleY/2).setDepth(depth+5).setOrigin(0.5);

            // theres a delay between popping something out of a container and its depth being set (of 1 frame)
            // so we need to wait a bit (100ms) before moving it. If we dont wait the depth will NOT be set
            // (and hence you wont see it above the black background)
            // NOTE: I think this is what the .dirty var deals with, not sure though. If it is, Im assuming I wont need the delay...
            scene.tweens.addCounter({
                from: 0,
                to: 1,
                duration: 100,
                onComplete: vars.UI.displayUnlock,
                onCompleteParams: [ tintImage ]
            });
            return true;
        } else if (type==='cardSet') {
            console.log(`Animating Card Set Unlock!`)
            return true;
        };
        
        // If we get here the type hasnt been implemented yet
        console.error(`This unlock (${_pV.name}) has no handler code yet!`);
        return false;
    }

    click () {
        let iV = vars.input;
        if (!iV.enabled) return '%cInput is currently disabled!','color: #FF0000';

        // as we enter here from a phaser click, "this" is actually the sprite, NOT this class
        let gV = vars.game;
        let classObject = gV.unlockables;
        if (this.name.startsWith('UNL_')) { // UNLOCKABLES prev/next button
            iV.enableInput(false,100);
            if (this.name.endsWith('previous')) {
                classObject.optionsShowPage(false);
                return true;
            } else if (this.name.endsWith('next')) {
                classObject.optionsShowPage(true);
                return true;
            };
        } else if (this.name.startsWith('UNLD_')) { // UNLOCKEDs prev/next buttond
            iV.enableInput(false,100);
            if (this.name.endsWith('previous')) {
                classObject.optionsShowPageULD(false);
                return true;
            } else if (this.name.endsWith('next')) {
                classObject.optionsShowPageULD(true);
                return true;
            };
        } else if (this.name==='lootboxemuBG') { // CLOSES LBE after its finished
            if (!classObject.lootBoxEmuFinished) return false; // if the emulator IS already running (ie NOT finished), ignore the click.
            // hiding the container
            gV.unlockables.scrollerSwipe();
            return true;
        } else if (this.name==='randomRoll') { // start the loot box emulator
            let uP = consts.unlockPoints;
            if (gV.unlockPoints>=uP.randomRoll) {
                // disable all input
                iV.enableInput(false); // re-enabled after showing win message
                classObject.lootBoxEmuFinished=false; // disable input
                gV.unlockables.useUnlockPoints(uP.randomRoll); // deduct the UP's for a random roll
                vars.game.unlockables.startScroller(); // and start the emulator
                return true;
            };
            return false; // false is returned if there arent anough unlock points
        } else if (this.name.startsWith('CSU_') || this.name.startsWith('TU_')) { // UNLOCKED CARD SET OR TINT CLICKED ON
            if (this.name.startsWith('CSU_')) {
                iV.enableInput(false,200);
                console.log(`Unlocked card set clicked on. Swapping current card set with this one.`);
                
                let cardSetName = this.getData('cardSetName');
                // save card set selection to lS and update the gV
                vars.localStorage.saveCardSet(cardSetName);
                
                // move the tick to the new card set
                gV.unlockables.moveCardTick(this);

                // save the card set name, replace the card set image and json & show pop up while loading
                gV.setCardSet(cardSetName);

                return true;
            } else if (this.name.startsWith('TU_')) {
                let tintAsString = this.name.replace('TU_','');
                vars.DEBUG ? console.log(`Unlocked tint set clicked on. Swapping current background tint with this one (#${tintAsString}).`) : null;
                let currentTint = vars.localStorage.options.tint;
                if (currentTint.toString(16).toUpperCase()===tintAsString) return false; // ignore the request if the current tint is the tint the player just clicked on
                
                // if we get here the tint isnt the current one, so, do the thing
                iV.enableInput(false); // show tint actually shows the game screen, so it disables and enables input itself
                gV.setBGTint(tintAsString);
                gV.unlockables.moveTintTick(this);
                return true;
            };
        };

        vars.DEBUG ? console.log(`Button ${this.name} has no handler!`) : null;
    }

    buildPages() { // shortcut to rebuildPages. the fn name just makes more sense the first time "rebuild" is called
        this.rebuildPages();
    }

    destroyAllPages() {
        this.containers.options.getAll().forEach((_u)=> {
            _u.getData('delete') ? _u.destroy() : null;
        });
        this.containers.unlocked.getAll().forEach((_u)=> {
            _u.getData('delete') ? _u.destroy() : null;
        });
    }

    displayUnlock(_pV) { // called from v.g.displayUnlock
        let tintImage = _pV;
        let type = _pV.name.startsWith('tint_') ? 'tint' : _pV.name.startsWith('cardSet_') ? 'cardSet' : null;
        if (!type) return false;
        // generate temporary black screen
        let depth = this.containers.options.depth;
        let deletableBackground = this.scene.add.image(this.cC.cX, this.cC.cY, 'whitePixel').setScale(this.cC.width, this.cC.height).setDepth(depth+3).setAlpha(0).setTint(0x0);
        let unlockText = this.scene.add.bitmapText(this.cC.cX, this.cC.cY/2, 'defaultFont', `NEW ${type.toUpperCase()} UNLOCKED`,64).setLetterSpacing(5).setOrigin(0.5).setTint(consts.tints.orange).setAlpha(0).setDepth(depth+4);
        let fadeIn = 100;
        let holdDuration = 2000; let spinDuration = 1000;
        
        scene.tweens.add({
            targets: [unlockText,deletableBackground],
            alpha: 1,
            duration: fadeIn,
            onComplete: (_t,_o)=> { // once the background has faded in, start rebuilding the pages
                console.log('Rebuilding pages');
                vars.game.unlockables.rebuildPages();
            }
        });
        
        if (type==='tint') {
            scene.tweens.add({
                targets: tintImage, angle: -360,
                x: consts.canvas.cX, y: consts.canvas.cY,
                delay: fadeIn, duration: spinDuration, hold: holdDuration,
                yoyo: true,
                onYoyo: ()=> { // as the tintImage spins back to the start position
                    scene.tweens.add({ // fade it out
                        targets: [tintImage,deletableBackground,unlockText],
                        alpha: 0,
                        duration: 1000*0.9
                    });
                },
                onComplete: ()=> {
                    tintImage.destroy();
                    deletableBackground.destroy();
                    unlockText.destroy();
                }
            });
        }
    }

    getCardSetName(_original) {
        let cardSetName = _original.toUpperCase();
        if (cardSetName.includes('_')) {
            cardSetName = cardSetName.split('_');
            let tempName = cardSetName.shift();
            cardSetName.push(tempName)
            cardSetName = cardSetName.join(' ');
        };
        return cardSetName;
    }

    getSetName() { // show what unlock types are available on this page
        let types = [];
        for (let ultype in this.unlockableSets[`page_${this.currentPage}`]) {
            let type = ultype.split('_')[0];
            !types.includes(type) ? types.push(type) : null;
        };

        let typesText = '';
        types.forEach((_t)=> { typesText += `${_t.toUpperCase()}S & `; });

        return typesText.slice(0,-3);
    }

    hideAllContainers() { // instantly hides any visible Unlockable containers
        for (let _c in this.containers) {
            this.containers[_c].setAlpha(0).setVisible(false);
        };
    }

    moveCardTick(_phaserObject=null) { // not currently used. will be used to move card tick after user selects it
        if (!_phaserObject) return false;

        let page = _phaserObject.getData('page');
        let bC = _phaserObject.getBottomCenter();
        this.cardTick.setPosition(bC.x,bC.y-20);
        this.cardTick.setData({ page: page });
        this.cardTick.setAlpha(1).setVisible(true);
    }

    moveTintTick(_phaserObject=null) {
        if (!_phaserObject) return false;

        let page = _phaserObject.getData('page');
        let bC = _phaserObject.getBottomCenter();
        this.tintTick.setPosition(bC.x,bC.y-20);
        this.tintTick.setData({ page: page });
        this.tintTick.setAlpha(1).setVisible(true);
    }

    optionsShowPage(_next=true) { // show a specific page of UNLOCKS.
        // NOTE: We can only enter here if there IS more than 1 page (as the previous and next buttons will be invisible otherwise)
        // HIDE THE CURRENT PAGE
        let page = this.unlockableSets[`page_${this.currentPage}`];
        for (let _set in page) {                        // for each of the sets
            page[_set].objects.forEach((_o,_i)=> {      // and each of the objects in the set
                _o.setVisible(false);
            });
        };

        // SET THE NEXT OR PREVIOUS PAGE
        if (_next) { // next page
            this.currentPage+1<this.totalPages ? this.currentPage++ : this.currentPage=0; // cP+1<total ? cP++ : cP=0;
        } else { // previous page
            this.currentPage>0 ? this.currentPage-- : this.currentPage=this.totalPages-1; // cP>0 ? cP-- : cP=total-1;
        };

        // SHOW THE NEW PAGE
        page = this.unlockableSets[`page_${this.currentPage}`];
        for (let _set in page) { // for each of the sets
            page[_set].objects.forEach((_o,_i)=> {
                _o.setVisible(true);
            });
        };

        // UPDATE THE PAGE TEXT
        this.UIButtonsAndText.pageText.setText(`PAGE ${this.currentPage+1} of ${this.totalPages}`);
        // and the header for the unlockables page
        let heading = this.getSetName();
        this.currentTypeText.setText(heading);
    }

    optionsShowPageULD(_next=true) { // show a specific page of UNLOCKEDS.
        // HIDE THE CURRENT PAGE
        let container = this.containers.unlocked;

        // SET THE NEXT OR PREVIOUS PAGE
        let oldPage = this.ULd.currentPage;
        if (_next) { // next page
            this.ULd.currentPage+1<this.ULd.pages ? this.ULd.currentPage++ : this.ULd.currentPage=0; // cP+1<total ? cP++ : cP=0;
        } else { // previous page
            this.ULd.currentPage>0 ? this.ULd.currentPage-- : this.ULd.currentPage=this.ULd.pages-1; // cP>0 ? cP-- : cP=total-1;
        };

        container = vars.game.unlockables.containers.unlocked;
        container.getAll().forEach((_uld)=> {
            if (_uld.data) {
                if (_uld.getData('page')===oldPage) {
                    _uld.setAlpha(0).setVisible(false);
                };
                if (_uld.getData('page')===this.ULd.currentPage) {
                    _uld.setAlpha(1).setVisible(true);
                };
            };
        });

        // UPDATE THE PAGE TEXT
        this.UIButtonsAndTextUnlocked.pageText.setText(`PAGE ${this.ULd.currentPage+1} of ${this.ULd.pages}`);
    }

    rebuildPages() { // requests destroyAllPages then REBUILDS UNLOCKABLE AND UNLOCKED PAGES. CALLED FROM buildOptions && unlockRandomRoll.
        vars.DEBUG ? console.groupCollapsed(`%cRebuilding unlockables pages >>>`,`${consts.console.defaults} ${consts.console.colours.important}`) : null;
        let container = this.containers.options;

        let containerUL = this.containers.unlocked;
        // unlocked vars
        this.ULd = {
            xMin: 60, x: 60, xInc: 200,
            yMin: 60, y: 60, yInc: 300,
            tintWidth: 154, tintHeight: 234,
            unlockedCount: 0, pages: 0, currentPage: 0,
            maxPerPage: 10
        };

        // IMPORTANT! The optionsMinCount below is the count before ANY unlocks are added to the container (if something weird happens this MAY be athe problem - shouldnt be a problem ever, but just in case)
        container.length > this.optionsMinCount ? this.destroyAllPages() : null;
        
        this.currentPage=0;
        let xInc=80; let xPush=500;
        let yOffset = 300;
        let leftBorder = 35;

        let scale = 1;
        this.totalPages = 0; let cardSetsPerPage=4;
        this.unlockableSets = {
            page_0: { }
        };


        let gV = vars.game;
        let page=0;
        let set=-1; let imageHeight = 0;
        let buttonWidth = 472;
        let fS = 26; let fF = 'Consolas';
        // DO CARD SETS FIRST
        this.cardSetContainers = { };
        this.available.cardSets.forEach((_cS)=> {
            let imageSet = this.unlockableSets[`page_${page}`];
            if (!_cS[1]) { // this CARD SET has NOT been unlocked
                set++;
                let ulName = _cS[0];
                let y = ~~(set/2)*yOffset%(yOffset*2);
                page = ~~(set/cardSetsPerPage); this.totalPages=page+1;
                // we now generate seperate containers for each card set
                !this.cardSetContainers[`page_${page}`] ? this.cardSetContainers[`page_${page}`] = {} : null; // make sure the page exists in cardSetContainers
                this.cardSetContainers[`page_${page}`][ulName] = [];
                let cardSetGroup = this.scene.add.group().setName(`page_${page}_${ulName}`);
                this.cardSetContainers[`page_${page}`][ulName].push(cardSetGroup);


                !this.unlockableSets[`page_${page}`] ? imageSet = this.unlockableSets[`page_${page}`] = {} : null; // make sure the page exists in unlockables
                imageSet[`cardSet_${ulName}`]= {}; // eg imageSet[page_0][blue]
                imageSet[`cardSet_${ulName}`].unlocked = false;
                imageSet[`cardSet_${ulName}`].objects = [];

                // draw the five cards of the set (AH,AD,AC,AS & 00)
                let visible = !page ? true : false;
                let startX = false;
                ['AH','AD','AS','AC','00']. forEach((_frame,_i)=> {
                    let x = _i*xInc + (set%2)*xPush + leftBorder;
                    startX===false ? startX = x : null;
                    let image = this.scene.add.image(x,y,ulName,_frame).setName(`ulCard`).setData({ delete: true, moving: false }).setScale(scale).setOrigin(0).setVisible(visible);
                    !imageHeight ? imageHeight = image.height*scale : null;
                    imageSet[`cardSet_${ulName}`].objects.push(image);

                    container.add(image); // add each image to the container
                    cardSetGroup.add(image);
                });

                // add the unlock bar/button
                let cost = ulName.includes('gold') ||ulName.includes('silver') || ulName.includes('bronze') ? consts.unlockPoints.special : consts.unlockPoints.cardSet;
                let button = this.scene.add.image(startX+1,y+imageHeight,'whitePixel').setData({ delete: true, cost: cost }).setName(`unlock_cS_${ulName}`).setAlpha(0.7).setVisible(visible).setScale(buttonWidth,90).setOrigin(0,1).setTint(0x0).setInteractive();
                let unlockIcon = this.scene.add.image(startX+buttonWidth,y+7,'unlockUI','unlockIcon').setData({ delete: true, cost: cost }).setName(`unlock_cSUI_${ulName}`).setVisible(visible).setOrigin(1,0).setInteractive();
                let cardSetName = this.getCardSetName(ulName);
                let buttonText = this.scene.add.text(startX+buttonWidth/2,y+imageHeight-12,`${cardSetName} card set`, { fontFamily: fF, fontSize: fS, color: consts.htmlColours.orange }).setData({ delete: true }).setOrigin(0.5,1).setVisible(visible);
                let costText = this.scene.add.text(startX+buttonWidth/2,y+imageHeight-50,`${cost} UPs`, { fontFamily: fF, fontSize: fS, color: consts.htmlColours.orange }).setData({ delete: true }).setOrigin(0.5,1).setVisible(visible).setStroke(consts.htmlColours.blueDark, 2).setShadow(2, 2, "#333333", 2, true, true);
                buttonText.setStroke(consts.htmlColours.blueDark, 2);
                buttonText.setShadow(2, 2, "#333333", 2, true, true);
                imageSet[`cardSet_${ulName}`].objects.push(button,buttonText,unlockIcon,costText);

                container.add([button,buttonText,unlockIcon,costText]);
                cardSetGroup.addMultiple([button,buttonText,unlockIcon,costText]);
            } else { //  // this CARD SET HAS been unlocked
                vars.DEBUG ? console.log(`%cUnlocked: ${_cS}`,`${consts.console.defaults}${consts.console.colours.good}`) : null;
                let cardSetName = this.getCardSetName(_cS[0]);
                let page = ~~(this.ULd.unlockedCount/this.ULd.maxPerPage);
                let csName = _cS[0];
                let cardSetUnlocked = this.scene.add.image(this.ULd.x, this.ULd.y, csName, 'AH').setOrigin(1,0).setName(`CSU_${cardSetName}`).setData({ page: page, delete: true }).setInteractive();
                cardSetUnlocked.on('pointerup', this.click, cardSetUnlocked);

                if (csName===gV.cardSet) { // this is the current card set
                    let bC = cardSetUnlocked.getBottomCenter();
                    this.cardTick.setPosition(bC.x,bC.y-20);
                    this.cardTick.setData({ page: page });
                    page ? this.cardTick.setAlpha(0) : this.cardTick.setAlpha(1);
                };

                page ? cardSetUnlocked.setAlpha(0).setVisible(false) : null;
                cardSetUnlocked.setData({ page: page, delete: true, cardSetName: _cS[0] });
                this.ULd.unlockedCount++;
                containerUL.add(cardSetUnlocked);

                // increase x
                this.ULd.x+this.ULd.xInc<this.ULd.xInc*5+this.ULd.xMin ? this.ULd.x += this.ULd.xInc : this.ULd.x=this.ULd.xMin;

                // if x was reset. we need to update y
                if (this.ULd.x===this.ULd.xMin) { this.ULd.y<this.ULd.yInc ? this.ULd.y+=this.ULd.yInc : this.ULd.y=this.ULd.yMin; };
            };
        });

        // INITIALISE the unlockable TINTS
        this.graphicSets = {};

        let tints = this.available.tints;
        tints.forEach((_tint)=> {
            if (!_tint[1]) { // this TINT has NOT been unlocked
                set++;
                let _t=_tint[0];
                let tint = _tint[3];
                let tintString = _t;
                let tintName = `tint_${tintString}`;

                let x = (set%2)*xPush + leftBorder;
                let y = ~~(set/2)*yOffset%(yOffset*2);
                page = ~~(set/cardSetsPerPage); this.totalPages=page+1;
                !this.unlockableSets[`page_${page}`] ? this.unlockableSets[`page_${page}`] = {} : null; // make sure the page exists in unlockables
                let imageSet = this.unlockableSets[`page_${page}`];
                imageSet[tintName]= {}; // eg unlockableSets["page_0"]["00FF00"]
                imageSet[tintName].unlocked = false;
                
                let visible = !page ? true : false;
                
                // draw the image of the tint
                let cost = consts.unlockPoints.tint;
                let tintImage = this.scene.add.image(x,y,'whitePixel').setTint(tint).setData({ delete: true, moving: false, tintAsInt: tint, unlockRRName: `tint${_tint[0]}` }).setName(tintName).setOrigin(0,0).setScale(buttonWidth,imageHeight).setVisible(visible);
                imageSet[tintName].objects = [tintImage];
                let button = this.scene.add.image(x,y+imageHeight,'whitePixel').setData({ delete: true, cost: cost, tintAsInt: tint, unlockRRName: `tint${_tint[0]}` }).setName(`unlock_tint_${tintString}`).setAlpha(0.7).setVisible(visible).setScale(buttonWidth,90).setOrigin(0,1).setTint(0x0).setInteractive();

                let costText = this.scene.add.text(x+buttonWidth/2,y+imageHeight-50,`${cost} UPs`, { fontFamily: fF, fontSize: fS, color: consts.htmlColours.orange }).setData({ delete: true }).setOrigin(0.5,1).setVisible(visible).setStroke(consts.htmlColours.blueDark, 2).setShadow(2, 2, "#333333", 2, true, true);
                let buttonText = this.scene.add.text(x+buttonWidth/2,y+imageHeight-12,`TINT: ${tintString.toUpperCase()}`, { fontFamily: fF, fontSize: fS, color: consts.htmlColours.orange }).setData({ delete: true }).setOrigin(0.5,1).setVisible(visible);
                buttonText.setStroke(consts.htmlColours.blueDark, 2);
                buttonText.setShadow(2, 2, "#333333", 2, true, true);

                let unlockIcon = this.scene.add.image(x+buttonWidth,y+7,'unlockUI','unlockIcon').setData({ delete: true, cost: cost, tintAsInt: tint, unlockRRName: `tint${_tint[0]}` }).setName(`unlock_tintUI_${tintString}`).setVisible(visible).setOrigin(1,0).setInteractive();

                imageSet[tintName].objects.push(button,buttonText,unlockIcon, costText);
                container.add([tintImage,button,buttonText,unlockIcon,costText]);
            } else { // this TINT HAS been unlocked
                vars.DEBUG ? console.log(`%cUnlocked ${_tint}`,`${consts.console.defaults} #${_tint[0]}`) : null;
                let tintString = _tint[0];
                let tintUnlocked = this.scene.add.image(this.ULd.x, this.ULd.y,'whitePixel').setOrigin(1,0).setTint(_tint[3]).setName(`TU_${tintString}`).setScale(this.ULd.tintWidth,this.ULd.tintHeight).setInteractive();
                let tintFG = this.scene.add.image(this.ULd.x, this.ULd.y,'unlockUI','unlockedTintFG').setOrigin(1,0);
                let tintText = this.scene.add.bitmapText(this.ULd.x-80,this.ULd.y+10,'defaultFontSmall',`TINT\n${tintString}`,20,1).setLetterSpacing(5).setName(`ulName_${tintString}`).setOrigin(0.5,0);
                tintUnlocked.on('pointerup', this.click, tintUnlocked);
                let page = ~~(this.ULd.unlockedCount/this.ULd.maxPerPage);
                if (page) {
                    tintUnlocked.setAlpha(0).setVisible(false);
                    tintText.setAlpha(0).setVisible(false);
                    tintFG.setAlpha(0).setVisible(false);
                };
                page+1 > this.ULd.pages ? this.ULd.pages=page+1:null;
                console.log(`Adding tint (${_tint[0]}) to page ${page}`);

                if (_tint[3]===vars.gameScreen.tint) { // this is the current tint, move the tick mark to it the ticks page number
                    let bC = tintUnlocked.getBottomCenter();
                    this.tintTick.setPosition(bC.x,bC.y-20);
                    this.tintTick.setData({ page: page });
                    page ? this.tintTick.setAlpha(0) : this.tintTick.setAlpha(1);
                }

                tintUnlocked.setData({ page: page, delete: true });
                tintFG.setData({ page: page, delete: true });
                tintText.setData({ page: page, delete: true })
                this.ULd.unlockedCount++;
                containerUL.add([tintUnlocked,tintFG,tintText]);

                // increase x
                this.ULd.x+this.ULd.xInc<this.ULd.xInc*5+this.ULd.xMin ? this.ULd.x += this.ULd.xInc : this.ULd.x=this.ULd.xMin;
                if (this.ULd.x===this.ULd.xMin) { // x was reset. we need to update y
                    this.ULd.y<this.ULd.yInc ? this.ULd.y+=this.ULd.yInc : this.ULd.y=this.ULd.yMin;
                };
            };
        });

        vars.DEBUG ? console.groupEnd() : null;

        // update the pages text
        // NOTE: this is the unlockables
        this.UIButtonsAndText.pageText.setText(`PAGE ${this.currentPage+1} of ${this.totalPages}`); // unlockables always shows a page number
        let vis = this.totalPages>1 ? true : false; let alpha = vis ? 1 : 0;
        for (let child in this.UIButtonsAndText) {
            this.UIButtonsAndText[child].setAlpha(alpha).setVisible(vis);
        };
        // unlocked
        //this.ULd.pages = ~~(this.ULd.unlockedCount/this.ULd.maxPerPage)+1;
        vis = this.ULd.pages>1 ? true : false; alpha = vis ? 1 : 0;
        if (this.ULd.pages>1) { // whereas unlockables has to have at least one page
            this.UIButtonsAndTextUnlocked.pageText.setText(`PAGE ${this.ULd.currentPage+1} of ${this.ULd.pages}`);
        };
        for (let child in this.UIButtonsAndTextUnlocked) {
            this.UIButtonsAndTextUnlocked[child].setAlpha(alpha).setVisible(vis);
        };

        // bring the two ticks to the foreground
        this.containers.unlocked.bringToTop(this.tintTick);
        this.containers.unlocked.bringToTop(this.cardTick);
    }

    showContainer(_container) {
        if (!this.containers[_container]) return false;

        // The requested container exists
        let container = this.containers[_container];
        let visible = !container.visible;
        let alpha = visible ? 1 : 0;
        container.setAlpha(alpha).setVisible(visible);
    }

    showRandomRollButton() { // SHOW RANDOM ROLL BUTTON IF PLAYER HAS ENOUGH UPs (and vice versa)
        if (vars.game.unlockPoints<consts.unlockPoints.randomRoll) {
            this.randomRollText.setFrame('randomRollUnavailableText').disableInteractive();
            this.tweens.randomRollButton.pause();
            this.randomRollText.setScale(1);
        } else {
            this.randomRollText.setFrame('randomRollText').setInteractive();
            this.tweens.randomRollButton.resume();
        };
    }

    switchVisibleContainer() {// swaps the visible container on the options screen
        let optionsContainer = this.containers.options;
        let unlockedContainer = this.containers.unlocked;

        let optionsVisible = optionsContainer.visible ? true: false;
        let unlockedVisible = unlockedContainer.visible ? true: false;

        if (optionsVisible===unlockedVisible) return false; // both containers are either visible or invisible. This should NEVER happen

        // IF we get here one container is visible, ones invisible
        let c1; let c2; // c1 is currently visible
        if (optionsVisible) {
            c1 = optionsContainer;
            c2 = unlockedContainer;
        } else {
            c1 = unlockedContainer;
            c2 = optionsContainer;
        };

        let frame = optionsVisible ? 'unlockedHeader' : 'unlockablesHeader';
        let container = scene.containers.optionsScreen;
        container.getByName('unlockablesHeader').setFrame(frame);
        frame = optionsVisible ? 'optUnlockedButton' : 'optLockedButton'
        container.getByName('unlockablesHeader_button').setFrame(frame);

        scene.tweens.add({ // hide the currently visible container
            targets: c1,
            alpha: 0,
            duration: 250,
            onComplete: (_t,_o)=> { // show the new container
                _o[0].setVisible(false);
                c2.setVisible(true);
                scene.tweens.add({
                    targets: c2,
                    alpha: 1,
                    duration: 250
                })
            }
        })
    }

    unlockableShake(_objects) { // called from unlock specific when user doesnt have enough unlock points
        if (_objects[0].data.list.moving) return false;

        _objects.forEach((_o)=> {
            _o.setData('moving', true);
            scene.tweens.add({
                targets: _o, x: _o.x-5,
                duration: framesToMs(5), yoyo: true, repeat: 2,
                onComplete: (_t,_o)=> { _o[0].setData('moving', false); }
            });
        });
    }

    unlockSpecific(_object,_type) { // used to unlock a specific unlockable
        // convert the _name to something we can use
        let oName = _object.name;
        let uName;
        if (_type==='tint') {
            uName = oName.replace('unlock_tint_','').replace('unlock_tintUI_','');
        } else if (_type==='cardSet') {
            uName = oName.replace('unlock_cS_','').replace('unlock_cSUI_','');
        } else {
            vars.DEBUG ? console.log(`Unknown type (${_type}). Failing gracefully`) : null;
            return false;
        };

        // if we get here the type is known
        let cost = _object.getData('cost');
        if (!cost) { console.error(`Cost wasnt found!`); return false; };

        // if we get here we have a valid cost and type
        if (cost>vars.game.unlockPoints) { // player does NOT have enough points to unlock this
            vars.DEBUG ? console.log(`Player doesnt have enough UP's to unlock this. Giving visual feedback.`) : null;
            
            let uS = this.unlockableSets;
            let lookingFor = uName;
            let objects = [];
            for (let _uS in uS) {
                if (!objects.length) {
                    let csName = `${_type}_${lookingFor}`;
                    if (uS[_uS][csName]) { objects = uS[_uS][csName].objects; };
                };
            };

            objects.length ? this.unlockableShake(objects) : null;
            return false;
        };

        // if we get here the player has enough points to unlock this
        this.useUnlockPoints(cost); // use the required amount of unlock points
        // save it
        if (_type==='tint') {
            // SAVE the tint
            vars.game.unlockables.unlockRandomRoll(false,`tint${uName}`);
        } else if (_type==='cardSet') { // unlock is a cardSet
            debugger;
        };
        // do unlock animation
        // the object we pass is the unlock image (not whatever clicked on as that will be the unlock icon of background - NOT the unlockable)
        let unlockable = `${_type}_${uName}`;
        let uObject = this.containers.options.getByName(unlockable);
        
        this.animatedUnlock(uObject);
    }

    updateUIUnlockPoints() {
        let UPs = vars.game.unlockPoints;
        UPs>99999 ? UPs='>99999' : null;
        vars.containers.getByName('optionsScreen').getByName(`optionsScreenUPCount`).setText(UPs);
        vars.containers.getByName('gamePlayingUI').getByName(`playersUPCount`).setText(UPs);
        vars.containers.getByName('mainScreen').getByName(`playersUPCountMainScreen`).setText(`${UPs} Unlock Points`);
    }

    useUnlockPoints(_points) { // currently only used by randomRoll, but will be used for outright unlocking
        let gV = vars.game;
        let available = gV.unlockPoints;
        if (_points>available) return false;

        gV.unlockPoints -=_points;
        
        vars.localStorage.updateUnlockPoints(); // update the stored var

        // update the UI
        this.updateUIUnlockPoints();
        this.showRandomRollButton();
    }



    // SCROLLER FUNCTIONS (IN ORDER OF CALL)
    startScroller() { // CALLED FROM .click
        this.generateLootBoxScroller();   
        this.showContainer('lootboxemu');
        // hide cursor
        vars.input.enableInput(false);

        // now start it scrolling
        this.scrollTheEmu();
    }

    generateLootBoxScroller() { // GENERATE THE LOOT BOX EMULATOR
        // initialise lbe vars
        let cardWidth = 154; let cardHeight = 234;
        this.lbeVars = { speed: 0, maxSpeed: 100, speedingUp: true, delay: 180, enabled: true, speedScale: 1, cardWidth: cardWidth, cardHeight: cardHeight };
        let cC = this.cC;
        this.onScreen = [];
        let container = this.containers.lootboxemu;

        let x=38; let xInc = 200;
        let y=cC.cY;
        let randomUnlockableList = shuffle(this.unlockKeys);

        while (x<cC.width+cardWidth) {
            let unlockableName = randomUnlockableList.shift(); // get the first unlockable and remove it from the array of unlockables (will be re-added when the unlockable scrolls off the screen)

            let randomObject;
            if (unlockableName.startsWith('cS')) {
                let key = unlockableName.replace('cS','');
                randomObject = this.scene.add.image(x,y,key,'AH').setOrigin(1,0.5).setName(unlockableName).setDepth(2);
            } else if (unlockableName.startsWith('tint')) {
                let tint = this.unlockableSet[unlockableName].intVal;
                randomObject = this.scene.add.image(x,y,'whitePixel').setOrigin(1,0.5).setScale(cardWidth,cardHeight).setTint(tint).setName(unlockableName).setDepth(2);
            };

            container.add(randomObject);
            this.unlockGroup.add(randomObject);

            x+=xInc;
        };

        this.scrollerBringToTops();
    }

    scrollTheEmu() { // CALLED AFTER THE EMULATOR HAS BEEN GENERATED
        vars.DEBUG ? console.log(`STARTING THE SCROLLER!`) : null;
        this.scrollUpdate();
    }

    scrollUpdate() { // STARTS, UPDATES AND ENDS THE SCROLLING
        let lbe = this.lbeVars;
        if (!lbe.enabled) return false;

        if (lbe.speed<lbe.maxSpeed && lbe.speedingUp) {
            lbe.speed++;
        } else if (lbe.delay>0) {
            lbe.delay--;
        } else if (lbe.speed>0 && !lbe.speedingUp) {
            lbe.speed-=0.25;
        } else if(lbe.speedingUp) {
            lbe.speedingUp=false;
        } else if (!lbe.speed && !lbe.speedingUp) { // finished
            this.lbeVars = null;
            lbe.enabled=false;
            this.scrollToNearest();
            return true;
        };

        this.unlockGroup.incX(-lbe.speed)

        if (this.unlockGroup.getFirstAlive().getLeftCenter().x<=-lbe.cardWidth) { // left most card has just left the screen. kill it and push the key back into the unlockKeys array
            let fA = this.unlockGroup.getFirstAlive();
            let diff = 0-fA.getRightCenter().x;
            let key = fA.name;
            fA.destroy();
            // shuffle the array
            shuffle(this.unlockKeys);
            // replace it with a new unlockable
            this.addUnlockableToGroup(diff);
            // push the old unlockable back onto the array
            this.unlockKeys.push(key);
        };

        if (this.unlockGroup.children.entries[5].getLeftCenter().x<1032 && !this.unlockGroup.children.entries[5].shown) {
            vars.audio.playSound('tick');
            let entry5 = this.unlockGroup.children.entries[5];
            entry5.shown=true;
            let type = entry5.name.startsWith('tint') ? 'TINT' : entry5.name.startsWith('cS') ? 'CARD SET' : '???';
            this.typeTextObject.setText(type);
            let text = '';
            if (type==='TINT') {
                text=entry5.name.replace('tint','');
            } else if (type==='CARD SET') {
                let e5Name = entry5.name;
                text = e5Name.replace('cS','').replaceAll('_', '\n');
                if (text.includes('SOS')) {
                    text = 'Satin ' + text;
                    text = text.replace('SOS', 'Original Set');
                } else if (text.includes('OS')) {
                    text = text.replace('OS', 'Original Set');
                };
            } else { // UNKNOWN TYPE!
                text='???';
            };
            this.unlockName.setText(text).setData({ actualID: entry5.name });
        };


        if (!lbe.enabled) {
            console.log(`Scroller has just stopped, panning to the closest unlock.`);
        };
    }

    addUnlockableToGroup(_diff=0) { // ADDS A NEW UNLOCKABLE TO THE CONTAINER AS OLD ONES LEAVE THE SCREEN
        let unlockableName = this.unlockKeys.shift();
        let x = this.cC.width+280-_diff; let y = this.cC.cY;
        let container = this.containers.lootboxemu;

        let randomObject;
        if (unlockableName.startsWith('cS')) {
            let key = unlockableName.replace('cS','');
            randomObject = this.scene.add.image(x,y,key,'AH').setOrigin(1,0.5).setName(unlockableName).setDepth(2);
        } else if (unlockableName.startsWith('tint')) {
            let tint = this.unlockableSet[unlockableName].intVal;
            randomObject = this.scene.add.image(x,y,'whitePixel').setOrigin(1,0.5).setScale(this.lbeVars.cardWidth, this.lbeVars.cardHeight).setTint(tint).setName(unlockableName).setDepth(2);
        };

        container.add(randomObject);
        this.unlockGroup.add(randomObject);

        this.scrollerBringToTops();
    }

    scrollerBringToTops() { // pulls stuff like the fgFade to top after adding a new unlockable to the container
        // bring the fg fade etc to the top
        this.containers.lootboxemu.bringToTop(this.fgFade);
        this.containers.lootboxemu.bringToTop(this.winHighlight);
    }



    // THE SCROLLER HAS JUST STOPPED
    scrollToNearest() { // SCROLLER HAS FINISHED, SCROLL TO THE NEAREST UNLOCK

        vars.game.unlockables.scrollerWaitingOnCount=0;
        this.unlockGroup.getChildren().forEach((_uL)=> {
            vars.game.unlockables.scrollerWaitingOnCount++;
            this.scene.tweens.add({
                targets: _uL,
                x: _uL.x-101,
                delay: 250,
                duration: 1000,
                ease: 'Quad.easeInOut',
                onComplete: ()=> {
                    let uL = vars.game.unlockables;
                    uL.scrollerWaitingOnCount--;
                    !uL.scrollerWaitingOnCount ? vars.game.scrollerHideNotWons() : null;
                }
            });
        });
    }

    scrollerHideNotWons() { // HIDE THE "NOT WONS" AND SAVE the unlock to lS
        this.unlockRandomRoll();

        // start fading the NOT WONs out
        let index = 1; let reverse = false;
        let count = 0;

        let group = this.unlockGroup;
        group.getChildren().forEach((_c)=> {
            count++;
            _c.index=count;
            let delay = 250*(index-1);
            if (index===6 && !reverse) { delay=0; reverse=true; };

            if (index!==6) {
                this.scene.tweens.add({
                    targets: _c,
                    alpha: 0.1,
                    delay: delay,
                    duration: 500,
                    onComplete: (_t,_o)=> {
                        _c.index===5 ? vars.game.scrollerZoomInOnWin():null;
                        _o[0].destroy();
                    }
                });
            };

            !reverse && index<6 ? index++ : null;
            reverse ? index-- : null;
        });
    }

    unlockRandomRoll(_rR=true,_ulName=null) { // AFTER HIDING NOT WONs WE SAVE THE UNLOCKABLE AS UNLOCKED, REMOVE IT FROM THE unlockKeys,available and unlockableSet
        vars.DEBUG ? console.log(`LOOTBOXEMU: Unlocking random roll!`) : null;
        let unlockID = _rR ? this.unlockName.getData('actualID') : _ulName;
        if (!_rR && !unlockID) return false;

        this.unlockableSet[unlockID].unlocked=true;

        // remove this unlockable from the unlockKeys (used by the LOOT BOX EMULATOR)
        this.unlockKeys.every((_ulName,_i)=> {
            if (_ulName===unlockID) {
                vars.DEBUG ? console.log(`Found unlock ${_ulName} at index ${_i}. Removing it from the unlockKeys array.`) : null;
                this.unlockKeys.splice(_i,1);
                return true;
            };
            return true;
        });
        
        // UPDATE THE AVAILABLE VAR (WHICH IS USED TO REBUILD THE PAGES)
        let searchingFor = '';
        let available = null;
        if (unlockID.startsWith('tint')) {
            searchingFor = unlockID.replace('tint','');
            available = this.available.tints;
        } else if (unlockID.startsWith('cS')) {
            searchingFor = unlockID.replace('cS','');
            available = this.available.cardSets;
        } else { // unknown unlockable type
            console.error('Unknown unlock type!');
        };

        if (searchingFor && available) { // once weve set the "searching for" var and the "array set" were looping thru
            let lV = vars.localStorage;
            available.every((_t,_i)=> {
                if (searchingFor===_t[0]) { // this is the unlock we're looking for
                    _t[1]=true; // set it to "unlocked"
                    let unlockIDInteger = _t[2]; // this int is saved and is the unlock integer
                    this.ULInts.push(unlockIDInteger); // push it into the unlocked's
                    lV.saveUnlockIDs(this.ULInts); // save the unlocked list
                    return true; // we found the var and updated it, exit the loop
                };
                return true; // keep looping through "available" until the above return is fired
            });

            // save the new unlockable set
            lV.saveUnlocks(this.unlockableSet);

            if (!_rR) return true;

            // we now need to rebuild the pages if this was a random roll (other screens do this themselves)
            vars.DEBUG ? console.log(`REBUILDING THE UNLOCKABLE and UNLOCKED PAGES`) : null;
            this.rebuildPages();
        } else {
            console.error(`Searching for (${searchingFor}) or available array isnt valid!`);
        };
    }

    scrollerZoomInOnWin() { // ZOOMS INTO THE WINNING UNLOCK
        let cam = scene.cameras.main;
        if (cam.zoom!==1) return false;

        // fade out the upper and lower pointers
        this.scene.tweens.add({
            targets: [this.lowerPointer,this.topPointer],
            alpha: 0,
            duration: 750
        });

        this.scene.tweens.add({
            targets: cam,
            zoom: 1.9,
            duration: 2000,
            hold: 500, // during the hold we'll do a particle splash
            ease: 'Quad.easeInOut',
            onComplete: ()=> {
                scene.tweens.add({
                    targets: scene.cameras.main,
                    zoom: 1,
                    duration: 500,
                    onComplete: vars.game.scrollerShowWinMessage
                });
            }
        });

        scene.tweens.addCounter({ // after 2s do a particle splash
            from: 0, to: 120,
            onComplete: ()=> { //
                console.log(`>> Particle Splash!`);
                vars.game.scrollerShaderAdd();
            }
        })
    }

    scrollerShaderAdd() { // GENERATES THE SHADER FOR THE WIN SCREEN
        let shaderImage = vars.shaders.generateTextureFromFireworksShader();
        let container = this.containers.lootboxemu;
        container.add(shaderImage);
        container.sendToBack(shaderImage);
        container.sendToBack(this.scrollerBG);
        this.fgFade.setAlpha(0);
    }

    scrollerShowWinMessage() { // CREATE THE WELL DONE SCREEN
        let container = this.containers.lootboxemu;

        let wellDoneText = this.scene.add.image(this.cC.cX,0+20,'unlockUI','wellDoneText').setOrigin(0.5,0);
        let newUnlockText = this.scene.add.image(this.cC.cX,this.cC.height-20,'unlockUI','newUnlockText').setOrigin(0.5,1);

        container.add([wellDoneText, newUnlockText]);

        this.winTweens = [];
        let tween = this.scene.tweens.add({
            targets: [wellDoneText,newUnlockText], scale: 0.8,
            duration: 2000, hold: 500,
            repeat: -1, yoyo: true,
            ease: 'Bounce.easeOut'
        });
        this.winTweens.push(tween);

        this.lootBoxEmuFinished=true;

        // re-enable input
        vars.input.enableInput(true);
    }

    scrollerSwipe() { // HIDES the scroller after win screen is clicked
        let c = vars.game.unlockables.containers.lootboxemu;
        scene.tweens.add({
            targets: c,
            y: -1080,
            alpha: 0,
            duration: 250,
            ease: 'Quad.easeIn',
            onComplete: vars.game.scrollerDestroy
        });
    }

    scrollerDestroy() { // DESTROYS THE LOOT BOX EMULATORS UNLOCK CHILDREN (IF ANY EXIST) THEN HIDES IT
        let container = this.containers.lootboxemu;
        // destroy the tweens
        this.winTweens.forEach((_t)=> { _t.remove(); });
        // destroy the kids
        let ignoreList = ['unlockName','unlockTypeText','lootboxemuBG','topPointer','lowerPointer','fgFade','winHighlight'];
        container.getAll().forEach((_c)=> { if (!ignoreList.includes(_c.name)) { _c.destroy(); } else { _c.setAlpha(1); } });
        
        container.setPosition(0,0).setAlpha(0).setVisible(false); // reset the angle, alpha and visibility
        vars.input.enableInput(true); // enable input
    }
}