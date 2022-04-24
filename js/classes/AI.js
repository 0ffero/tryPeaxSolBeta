"use strict";
let AI = class {
    constructor(deck,solution,scoreData) {
        this.errors = [];
        this.alive = false;

        // INCOMING VARS
        this.scoreData = scoreData;
        this.deck = deck;
        this.aiDeck = [...deck.split(',')]; // shallow copy the deck, we'll need it later
        // fix the AI deck (cards 1-28 = cards dealt, 29 = current card, 30-52 cards left)
        // cards left need to be reversed
        let lowSet = this.aiDeck.splice(0,29);
        this.aiDeck.reverse();
        this.aiDeck = [...lowSet,...this.aiDeck];

        this.solution = solution;

        // INTERNAL VARS
        this.fingerMoveDuration = 1000/2; // travel takes 0.5s

        this.getDeckReadyForInit();
        this.getSolutionReadyForInit();

        if (this.errors.length) {
            this.showErrorPopUp();
            return false;
        };

        // if we get here the deck and solution appear to be valid
        this.init(); // builds ui elements needed by the UI (like the finger)
        this.alive=true;
    }

    init() {
        this.finger = scene.add.image(consts.canvas.cX+30, consts.canvas.height*0.9, 'ui', 'aiFingerMoving').setDepth(consts.depths.aiFinger).setAlpha(0).setData({ wasVisible: false, container: null, card: null });
        scene.tweens.add({
            targets: this.finger,
            alpha: 1,
            duration: this.fingerMoveDuration
        });

        this.containerOffsets = { cardsDealt: { }, cardsLeft: { } }; // updated after all cards are dealt (waitForDeal)
    }

    buildDeckAndDeal() {
        // EVERYTHING HAS BEEN HIDDEN. BUILD THE DECK, PUSH THE SOLUTION AND START THE MOVES
        let gV = vars.game;
        // create new deck
        gV.deck = new Deck();
        // over ride the cards
        gV.deck.cardSet = this.deckForDeckClass;
        
        // push the deck into deal
        gV.deal = new Deal(gV.deck);
        // pass in the solution
        gV.deal.solution = this.solution;

        // wait for the cards to be dealt
        this.waitForDeal();
    }

    generateScorePopUp() {
        // quickly fade the foreground in
        let fg = scene.children.getByName('game_fg');
        scene.tweens.add({ targets: fg, alpha: 0.5, duration: 250 });

        let depth = consts.depths.aiPopUp;
        let name = this.scoreData.name;
        let score = this.scoreData.score;
        let time = this.scoreData.time;
        let msg = `Well done ${name}\nYour final score was ${score}\nWith a time of ${time}`;
        let cC = consts.canvas;
        let AIScorePopUp  = scene.add.bitmapText(cC.cX, cC.height*0.6, 'defaultFont', msg, 78,1).setDropShadow(8,8).setName('AIPopUPScoreAndTime').setTint(consts.tints.orange).setOrigin(0.5).setDepth(depth).setAlpha(0);

        scene.tweens.add({
            targets: AIScorePopUp,
            alpha: 1,
            y: cC.height*0.4,
            duration: 500,
            hold: 3000,
            yoyo: true,
            onComplete: (_t,_o)=> { _o[0].destroy(); }
        });
    }

    getDeckReadyForInit() {
        this.deck = this.deck.split(',');

        if (this.deck.length!==52) this.errors.push(`The deck was invalid. The deck has ${this.deck.length} cards in it!`);

        this.deckForDeckClass = [];
        this.deck.forEach((_c)=> {
            let b = _c.slice(-1);
            _c = _c.replace(b,`_${b}`);
            this.deckForDeckClass.push(_c);
        });
    }

    getSolutionReadyForInit() {
        let solutionArray = this.solution.split(',');
        this.solution = [];

        // split the solution array into position and when
        while (solutionArray.length) {
            let position = solutionArray.shift();
            let when = solutionArray.shift();
            when = parseInt(when,consts.timeRadix);
            this.solution.push([position,when]);
        };

        if (this.solution.length<28 || this.solution.length>52) this.errors.push(`The solution was invalid. The solution has ${solutionArray.length} moves in it!`);
    }

    getUIReady() {
        vars.DEBUG ? console.log(`Getting the UI Ready!`) : null;
        this.hideTheContainers();
        this.buildDeckAndDeal();
        // fade out stuff thats no applicable on the game play ui
        vars.UI.showGameplayUI(false,0,'ai');
    }

    hideTheContainers(_hide=true) {
        // HIDE ALL FOREGROUND CONTAINERS AND BLOCKERS
        let cV = vars.containers;
        let show = _hide ? false : true;
        
        // hide the high scores container
        cV.show('highScoreTable', show);
        // hide the main container
        cV.show('mainScreen', show);
        // show the game container
        vars.UI.showForegroundBarrier(show);
        // reset all UI elements
        vars.game.newGameUIResets();
    }

    playNextMove() { // initially called from solve, then called by itself until there are no moves left to play
        // moves used in here are in the format [card position, time]. Time isnt used, but does hold the time from 0 when the card was clicked
        vars.DEBUG ? console.log(`AI: Getting next move!`) : null;
        if (!this.solution.length) { // no more moves left
            this.destroy();
            return true;
        };

        // GET NEXT MOVE
        let nextMove = this.solution.shift();
        let position = ~~nextMove[0];
        let timeOfOriginalClick = ~~nextMove[1];
        
        // get the cards position
        // find x and y
        let containerName = position>29 ? 'cardsLeft' : 'cardsDealt';
        let cXY = this.containerOffsets[containerName];

        let cName = this.aiDeck[position-1];
        let cardName = `card_${cName}`;
        this.finger.setData({ container: containerName, card: cardName, time: timeOfOriginalClick });
        let card = vars.containers.getByName(containerName).getByName(cardName);
        let positionXY = { x: card.x+cXY.x+30, y: card.y+cXY.y+30 };

        // move "pointer" to card
        // tween pointer to new position
        scene.tweens.add({
            targets: this.finger,
            x: positionXY.x, y: positionXY.y,
            duration: this.fingerMoveDuration,
            delay: this.fingerMoveDuration, // the first time this delaty happens its while the finger is fading in
            // after that, its used to delay the next move after "clicking" the card
            onComplete: (_t,_o)=> { // when the move is complete, change cursor to "clicking"
                // click the card at that position
                vars.DEBUG ? console.log(`Clicking on the card`) : null;

                // CHANGE FINGER TO "CLICKING"
                _o[0].setFrame('aiFingerClicking');
                vars.audio.playSound('cardLeftTurn');

                // UPDATE THE TIMER
                let timeOfOriginalClick = _o[0].getData('time');
                vars.AI.current.updateTimer(timeOfOriginalClick);

                // CLICK ON THE CARD
                let containerName = _o[0].getData('container');
                let cardName = _o[0].getData('card');
                let card = vars.containers.getByName(containerName).getByName(cardName);
                vars.game.deal.clickOnCard(card);


                scene.tweens.add({
                    targets: vars.AI.current.finger,
                    scale: 0.8,
                    duration: 125,
                    yoyo: true,
                    onComplete: (_t,_o)=> { _o[0].setFrame('aiFingerMoving'); }
                });
                vars.DEBUG ? console.log(`Waiting 500ms then Re-requesting playNextMove`) : null;
                scene.tweens.addCounter({
                    from: 0, to: 1,
                    duration: 500,
                    onComplete: vars.AI.requestNextMove
                });
            } // END OF onComplete
        });
    }

    showErrorPopUp() {
        let cC = consts.canvas;
        let depth = consts.depths.highScoreTable+5; // this is shown when the player clicks on a score (or time) but the solution or deck was invalid
        let errorPopUp = scene.add.bitmapText(cC.cX, cC.height*0.6, 'defaultFont', 'The solution or deck is invalid!\nUnable to replay game.',72,1).setOrigin(0.5).setAlpha(0).setDepth(depth).setScale(0.75);
        scene.tweens.add({
            targets: errorPopUp,
            scale: 1, y: cC.cY, alpha: 1,
            duration: 1000, hold: 2000, yoyo: true,
            onComplete: (_t,_o)=> { _o[0].destroy(); }
        });
    }

    solve() {
        vars.DEBUG ? console.log(`Doing solve!`) : null;
        this.playNextMove(); // this plays EVERY move
    }

    updateTimer(_timeInMs) {
        // convert time to 10th of a sec
        vars.UI.updateTimer(~~(_timeInMs/100)/10);
        return true;
    }

    waitForDeal() {
        if (vars.game.deal.allCardsDealt) {
            // init the container x and y's
            let aiClass = vars.AI.current;
            ['cardsDealt','cardsLeft'].forEach((_cName)=> {
                let container = vars.containers.getByName(_cName);
                aiClass.containerOffsets[_cName] = { x: container.x, y: container.y };
            });
            vars.AI.disableInteractiveOnAllCards();
            aiClass.solve();
        } else {
            scene.tweens.addCounter({
                from: 0, to: 1,
                duration: 500,
                onComplete: vars.AI.current.waitForDeal
            });
        };
    }

    destroy() { // ABANDON ALL HOPE, YE WHO ENTER HERE... (SPECIALLY AI's)
        // UPDATE THE SCORE AND TIME ON THE UI TO THE SAVED VARS
        let score = this.scoreData.score;
        let time = this.scoreData.time;
        let container = vars.containers.getByName('gamePlayingUI');
        container.getByName('scoreText').setText(`${score} - SCORE`);
        container.getByName('timerText').setText(`${time}s - TIME`);

        // FADE OUT THE FINGER, GENERATE SCORE POP UP, THEN KILL
        scene.tweens.add({
            targets: this.finger,
            alpha: 0,
            delay: 1000, duration: 2000,
            onComplete: (_t,_o)=> { 
                _o[0].destroy();
                // after a short delay show the high score table etc
                // during this delay we show the players score and time
                vars.AI.current.generateScorePopUp();
                // then
                scene.tweens.addCounter({
                    from: 0, to: 1,
                    duration: 4000,
                    onComplete: ()=> {
                        vars.containers.cardsDestroyAll();
                        // fade in the game play ui
                        vars.UI.showGameplayUI(true);
                        // show the fg, main screen and highscore table again
                        vars.AI.current.hideTheContainers(false);
                        this.alive=false;
                        vars.AI.destroy();
                    }
                });
            }
        });
    }
}