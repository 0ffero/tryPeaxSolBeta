"use strict";
let Deal = class {
    constructor(deck) {
        this.deck = deck.cardSet;
        //this.deckCacheString = deck.cardSet.join(',');
        this.deckCache = [];
        this.deck.forEach((_c)=> {
            this.deckCache.push(_c.replace('_',''));
        });
        this.deckCache = this.deckCache.join(',');
        this.penaliseErrors = vars.game.penaliseErrors;

        this.rows = [
            [1,2,3],
            [4,5,6,7,8,9],
            [10,11,12,13,14,15,16,17,18],
            [19,20,21,22,23,24,25,26,27,28]
        ];

        this.cardEnables = {
             1: [ 4, 5],
             2: [ 6, 7],
             3: [ 8, 9],
             4: [10,11],
             5: [11,12],
             6: [13,14],
             7: [14,15],
             8: [16,17],
             9: [17,18],
            10: [19,20],
            11: [20,21],
            12: [21,22],
            13: [22,23],
            14: [23,24],
            15: [24,25],
            16: [25,26],
            17: [26,27],
            18: [27,28]
        };

        this.cardValue = { A: 1, J: 11, Q: 12, K: 13 };
        this.currentDepth=4;
        this.lastRemainingCard = false;
        this.allCardsDealt=false; // used by the AI

        this.solution = [];

        this.dealCards();

        this.bestStreak=0;
        this.cardsMoved=0;
        this.currentTime=0;
        this.startTime=null; vars.UI.updateTimer(0);
        this.win=false;
        this.winDelay = 0;
        this.winDelayInc = 125;
    }

    // DEAL FUNCTIONS
    dealCards() {
        this.dealRows();
        this.dealCurrentCard();
        this.dealRemainingCards();
    }

    dealCurrentCard() {
        let container = scene.groups.cardCurrent;

        let cardID = this.deck.shift();
        let card = cardID.split('_');
        let cardValue = card[0];
        let cardSuit = card[1];
        let cardImage = cardID.replace('_','');
        let cardInt = this.getCardInt(cardValue);
        let x = consts.canvas.cX;
        let y = consts.layout.gameArea.lowestSetY;
        let cardPhaser = scene.physics.add.image(x, y, 'cards', cardImage).setName(`card_${cardImage}`).setData({ value: cardValue, cardInt: cardInt, suit: cardSuit, position: 29, faceUp: true, row: 0 }).setDepth(this.currentDepth).setAlpha(0);
        container.add(cardPhaser);
        this.showCard(cardPhaser, 29);

        this.currentCardPosition = [x,y];
        this.currentCardValue = cardInt;
    }

    dealRemainingCards() {
        let container = scene.groups.cardsLeft;
        let offX = 205; let offY = 0;
        container.setPosition(offX,0);
        let y = consts.layout.gameArea.lowestSetY;
        let x = 60;
        let _c = 30;
        this.deck.reverse(); // reverse the remaining card before placing them

        while (this.deck.length>0) {
            let cardID = this.deck.shift();
            let card = cardID.split('_');
            let cardValue = card[0];
            let cardSuit = card[1];
            let cardImage = cardID.replace('_','');
            let cardInt = this.getCardInt(cardValue);
            let cardPhaser = scene.physics.add.image(x, y, 'cards', '00').setName(`card_${cardImage}`).setData({ value: cardValue, cardInt: cardInt, suit: cardSuit, position: _c, faceUp: false, row: 5, rIndex: _c-30, cOffset: [offX,offY] }).setAlpha(0);

            !this.deck.length ? cardPhaser.setInteractive() : null; // set the last card to interactive

            container.add(cardPhaser);
            this.showCard(cardPhaser, _c);
            x+=15; _c++;
        };

    }

    dealRows() {
        let layout = consts.layout;

        let container = scene.groups.cardsDealt;
        let gAC = consts.layout.gameArea;
        let gAPadding = gAC.padding;
        let offX = gAPadding.x; let offY = gAPadding.y; 
        let lowPos = [consts.canvas.cX-offX, gAC.lowestSetY];

        let yInc = layout.card.height/2;
        let cardWidth = layout.card.width; let hCW = cardWidth/2;
        let y = 0;
        let peak = layout.gameArea.peak;
        let peakId = 0;
        let xPos = peak[peakId];
        let alpha = 1;

        this.rows.forEach((_r,_i)=> {
            switch(_i) {
                case 0:
                    _r.forEach((_c,_cI)=> {
                        let cardID = this.deck.shift();
                        let card = cardID.split('_');
                        let cardValue = card[0];
                        let cardSuit = card[1];
                        let cardImage = cardID.replace('_','');
                        let cardInt = this.getCardInt(cardValue);
                        xPos = peak[_cI];
                        let cardPhaser = scene.physics.add.image(lowPos[0], lowPos[1], 'cards', '00').setName(`card_${cardImage}`).setData({ value: cardValue, cardInt: cardInt, suit: cardSuit, position: _c, faceUp: false, row: 4-_i, cOffset: [offX,offY], pos: [ xPos, y ] }).setAlpha(alpha);
                        container.add(cardPhaser);
                        this.showCard(cardPhaser, _c);
                    });
                break;

                case 1:
                    _r.forEach((_c,_cI)=> {
                        if (_cI && _cI%2===0) { peakId++; }; // next peak

                        if (_cI%2===0) { // left card
                            xPos = peak[peakId] - hCW - 5;
                        } else { // right card
                            xPos = peak[peakId] + hCW + 5;
                        };

                        let cardID = this.deck.shift();
                        let card = cardID.split('_');
                        let cardValue = card[0];
                        let cardSuit = card[1];
                        let cardImage = cardID.replace('_','');
                        let cardInt = this.getCardInt(cardValue);
                        let cardPhaser = scene.physics.add.image(lowPos[0], lowPos[1], 'cards', '00').setName(`card_${cardImage}`).setData({ value: cardValue, cardInt: cardInt, suit: cardSuit, position: _c, faceUp: false, row: 4-_i, cOffset: [offX,offY], pos: [ xPos, y ] }).setAlpha(alpha);
                        container.add(cardPhaser);
                        this.showCard(cardPhaser, _c);
                    });
                break;

                case 2:
                    peakId = 0;
                    xPos = peak[peakId];
                    _r.forEach((_c,_cI)=> {
                        if (_cI && _cI%3===0) { peakId++; };  // next peak

                        if (_cI%3===0) { // left card
                            xPos = peak[peakId] - cardWidth - 5;
                        } else if (_cI%3===1) { // middle card
                            xPos = peak[peakId];
                        } else { // right card
                            xPos = peak[peakId] + cardWidth + 5;
                        };

                        let cardID = this.deck.shift();
                        let card = cardID.split('_');
                        let cardValue = card[0];
                        let cardSuit = card[1];
                        let cardImage = cardID.replace('_','');
                        let cardInt = this.getCardInt(cardValue);
                        let cardPhaser = scene.physics.add.image(lowPos[0], lowPos[1], 'cards', '00').setName(`card_${cardImage}`).setData({ value: cardValue, cardInt: cardInt, suit: cardSuit, position: _c, faceUp: false, row: 4-_i, cOffset: [offX,offY], pos: [ xPos, y ] }).setAlpha(alpha);
                        container.add(cardPhaser);
                        this.showCard(cardPhaser, _c);
                    });
                break;

                case 3:
                    xPos = peak[0] - 1.5 * (cardWidth+5);
                    _r.forEach((_c,_cI)=> {
                        let cardID = this.deck.shift();
                        let card = cardID.split('_');
                        let cardValue = card[0];
                        let cardSuit = card[1];
                        let cardImage = cardID.replace('_','');
                        let cardInt = this.getCardInt(cardValue);
                        let cardPhaser = scene.physics.add.image(lowPos[0], lowPos[1], 'cards', cardImage).setName(`card_${cardImage}`).setData({ value: cardValue, cardInt: cardInt, suit: cardSuit, position: _c, faceUp: true, row: 4-_i, cOffset: [offX,offY], pos: [ xPos, y ] }).setAlpha(alpha).setInteractive();
                        container.add(cardPhaser);
                        this.showCard(cardPhaser, _c);
                        xPos+=cardWidth+5;
                    });
                break;
            };

            y+=yInc;
        });
    }



    afterLastCardDealt() {
        vars.UI.showGameplayUI(true);
    }

    checkDealtCard(_card) {
        // get the clicked on card's value
        let cardValue = ~~_card.getData('cardInt');

        let cards = this.getLowHigh();
        let check1 = cards[0]; let check2 = cards[1];

        let deck = vars.game.deck;

        // if it is valid, update the current card value
        if (cardValue===check1) {
            this.currentCardValue = check1;
        } else if (cardValue===check2) { 
            this.currentCardValue = check2;
        } else {
            this.shakeInvalidCard(_card);
            if (this.penaliseErrors) {
                deck.resetStreak();
                deck.decreaseScore();
            };
            return false;
        };



        // IF WE GET HERE, THE CARD IS VALID
        this.updateCardsMoved(); // increases the "cards moved" lifetime var
        // remove interactive
        _card.disableInteractive();
        // pop the card out of its container and set its new depth
        scene.groups.cardsDealt.remove(_card);
        let gAPad = consts.layout.gameArea.padding;
        let x = _card.x+gAPad.x; let y = _card.y+gAPad.y
        _card.setPosition(x, y);
        this.currentDepth++; _card.setDepth(this.currentDepth);
        // and push it into the current container
        scene.groups.cardCurrent.add(_card);

        // move it
        let duration = Phaser.Math.Distance.Between(_card.x, _card.y, this.currentCardPosition[0], this.currentCardPosition[1])/2;
        scene.tweens.add({
            targets: _card,
            x: this.currentCardPosition[0],
            y: this.currentCardPosition[1],
            duration: duration
        });

        let position = ~~_card.getData('position');
        this.updateSolution(position); // update the solution

        // update the score and streak
        deck.increaseScore(x,y);
        // and update the card enables var (SHOW CARD UNDERNEATH IF APPROPRIATE)
        let found=false;
        for (let setIndex in this.cardEnables) {
            let set = this.cardEnables[setIndex];
            if (set.includes(position)) {
                set.forEach((_p,_i)=> {
                    if (_p===position) { found=_i; };
                });

                this.cardEnables[setIndex].splice(found,1);

                if (this.cardEnables[setIndex].length===0) { // no more cards in this enables
                    // show card below this pair
                    this.unhideCard(~~setIndex);
                }
            }
        }


        // check if bonus should be given
        if (this.checkUpperRowForBonus(position)) {
            deck.increaseScore(null, null, 500);
        }


        // check if this was the final card from the dealt container
        if (!scene.groups.cardsDealt.length) {
            this.gameWinLose(true);
            return true;
        }

        // check if there are more moves available
        if (!this.checkIfAnyMoreMovesAreAvailable()) {
            this.gameWinLose(false);
            return false;
        }


    }

    checkIfAnyMoreMovesAreAvailable() {
        if (!scene.groups.cardsLeft.list.length) { // we've ran out of "turnable" cards
            // check if there are face up cards that are playable with players current card
            let cards = this.getLowHigh();
            let cardLow=cards[0]; let cardHigh = cards[1];
            let found = [];
            scene.groups.cardsDealt.getAll().forEach((_c,_i)=> {
                if (_c.getData('faceUp') && (_c.getData('cardInt')===cardLow || _c.getData('cardInt')===cardHigh)) {
                    found.push(_c.name);
                };
            });
            if (found.length) { return true; } else { return false; };
        }

        return true; // this function returns true as the default as we're initially checking for 0 cardsLeft
    }

    checkUpperRowForBonus(_pos) {
        if ([1,2,3].includes(_pos)) {
            vars.anims.animate500();
            return true;
        }

        return false;
    }

    clickOnCard(_card) {
        if (!this.startTime) this.startTime = new Date();

        let row = _card.getData('row');
        if (!row) return false;

        if (row===5) { // special case - this is one of the remaining cards
            this.showNextRemainingCard(_card);
            this.updateCardsMoved();
            return true;
        };

        this.checkDealtCard(_card);
    }

    dupeCard(_card) { // CURRENTLY UNUSED!
        let frame = _card.frame.name;
        let depth = 22 - _card.getData('rIndex') + 50;
        let offsets = _card.getData('cOffset');
        let offX = offsets[0];
        let offY = offsets[1];
        let clone = scene.physics.add.image(_card.x+offX, _card.y+offY, 'cards', frame).setDepth(depth).setData();
        clone.setInteractive().setName(_card.name);
        clone.data = _card.data;
        // remove the original
        _card.disableInteractive().setDepth(-1).setAlpha(0);

        return clone;
    }

    enableNextRemainingCard(_rIndex) { // called from showNextRemainingCard
        if (this.lastRemainingCard) return false; // there are no more cards to show

        let rIndex = _rIndex-1;
        if (rIndex===0) { this.lastRemainingCard=true; } // last remaining card …
        // … this stops us trying to get the "next" card when we click on this new (last) card

        let card = scene.groups.cardsLeft.getAt(rIndex);

        card.setInteractive();

        // move the rest of the pile towards the player card
        let cardsLeft = scene.groups.cardsLeft.getAll();

        cardsLeft.forEach((_cL)=> {
            scene.tweens.add({
                targets: _cL,
                x: '+=15',
                duration: framesToMs(2)
            })
        });
    }

    getLowHigh() {
        let cCV = this.currentCardValue;
        let cardLow = cCV-1>0 ? cCV-1 : 13;
        let cardHigh = cCV+1<14 ? cCV+1 : 1;

        return [cardLow,cardHigh];
    }

    gameLose() {
        vars.DEBUG ? console.log(`No moves available to player.\nLet them know\nGive them options to new deal etc`) : null;
        // disable input

        // wait for the final card to have finished moving
        scene.tweens.addCounter({
            from: 0,
            to: 1,
            duration: 1000,
            onComplete: ()=> {
                // show unlucky message
                vars.UI.newMessage(`LOOKS LIKE YOU'RE\nALL OUT OF PLAYS...`, null,null, 3000, 1000, 82, consts.tints.orange);
                this.startTime=null;
                scene.tweens.addCounter({
                    from: 0,
                    to: 1,
                    duration: 5000,
                    onComplete: ()=> {
                        // show options
                        vars.game.deck.lose();
                    }
                });
            }
        });
    }

    gameWin() { // simply fires a win in deck but can be used to do anything else required before a win
        vars.DEBUG ? console.log(`%c^^ WIN! ^^`, 'font-weight: bold; font-size: 16px; color: #00FF00') : null;
        vars.game.deck.win(); // note that this resets startTime (after increasing the score with cardsLeft)
    }

    gameWinLose(_win=true) { // on WIN or LOSE, we come here first
        if (vars.AI.current) { // IF THE AI WAS PLAYING, IGNORE THIS FUNCTION AS THE AI DEALS WITH THE SCREEN
            return false;
        };

        // player has won or lost
        if (_win) { // im leaving the full "IF" as there will be code going in here to count the coins TODO
            this.win = true;
            vars.game.playerStats.gamesWon++;
            this.gameWin();
        } else {
            vars.game.playerStats.gamesLost++;
            this.gameLose();
        };

        // this runs on wins and losses
        // update the player stats
        this.saveSolution(_win);
        this.updatePlayerStats();
        // fade out the game ui
        vars.UI.showGameplayUI(false,0.1,'winLose');
    }

    getCardInt(_value=0) {
        if (!_value) return false;

        let cardInt=0;

        if ('AJQK'.includes(_value)) {
            cardInt = this.cardValue[_value];
        } else {
            cardInt = ~~_value;
        }

        return cardInt;
    }

    moveToPile(_card,_win=false) { // called from showNextRemainingCard
        // push it into the current container
        scene.groups.cardCurrent.add(_card);
        _card.disableInteractive();
        let delay = 0;
        _win && !this.win ? this.win=true : null;

        this.win ? delay = this.winDelay+=this.winDelayInc : null;
        // move it
        scene.tweens.add({
            targets: _card,
            x: this.currentCardPosition[0],
            y: this.currentCardPosition[1],
            delay: delay,
            duration: 250,
            onStart: ()=> { _win ? vars.game.deck.increaseScore(this.currentCardPosition[0],this.currentCardPosition[0]) : null; vars.game.deck.resetStreak(); }
        });
    }

    saveSolution(_win=false) {
        let tempVars = [];
        let solution = this.solution.join(','); // join the solution together
        let deckCache = this.deckCache; // 159 bytes
        tempVars.push(_win,deckCache,solution);
        let solutionID = vars.localStorage.saveSolution(tempVars);
        // push the solution ID into the scoreCard
        vars.game.scoreCard.solutionID = solutionID;
        return true;
    }

    shakeInvalidCard(_card) {
        let card = _card;
        card.disableInteractive();
        card.x-=10;
        scene.tweens.add({
            targets: card,
            x: card.x+10,
            duration: framesToMs(2),
            yoyo: true,
            repeat: 3,
            onComplete: (_t,_o)=> { _o[0].x+=10; card.setInteractive(); }
        })
    }

    showCard(_card,_id) { // used when dealing the deck
        let pos = _card.getData('pos');

        // the next 2 lines should bring the card to the front, but it simply doesnt.
        // I need to remove all the non containers (and change them to groups)
        scene.groups.cardsDealt.sendToBack(_card);
        _card.setDepth(3).setAlpha(0);
        let duration = 500;
        if (!pos) { pos = [_card.x,_card.y]; duration = 100; };
        let cardNumber = _card.data.list['position'];
        scene.tweens.add({
            targets: _card,
            x: pos[0], y: pos[1], alpha: 1,
            delay: (_id-1)*66, duration: duration,
            onStart: ()=> {
                scene.groups.cardsDealt.bringToTop(_card);
            },
            onComplete: (_t,_o)=> {
                _card.setDepth(0);
                scene.sound.play(getRandom(vars.audio.available.newCard));
                if (_o[0].data.list['position']===52) {
                    this.allCardsDealt=true; // let the ai know the cards have been dealt
                    // re-enable input
                    vars.input.enableInput(true);
                };
            }
        });
    }

    showNextRemainingCard(_card,_win=false) { // called from clickOnCard (from cardsLeft)
        let card = _card;
        let frame = card.name.replace('card_','');

        // turn the card over
        card.setFrame(frame).setData('faceUp', true);
        this.currentCardValue = ~~card.getData('cardInt');
        let position = card.getData('position');

        // play card turn audio
        !_win ? vars.audio.playSound('cardLeftTurn') : null; // only play the sound if the player clicked on the card

        // pop the card out of its container and set its new depth
        scene.groups.cardsLeft.remove(card);
        card.setPosition(card.x+205, card.y);
        this.currentDepth++; card.setDepth(this.currentDepth);

        this.moveToPile(card,_win); // move it to the current pile (and disables interactive)


        // ONLY runs if this is NOT being requested by the win function (ie the player asked for this card to be turned)
        if (!_win) {
            this.updateSolution(position); // update the solution
            let thisIndex = _card.getData('rIndex'); // get the rIndex so we can enable the next remaining card (if any)
            this.enableNextRemainingCard(thisIndex); // enable the next remaining card
            vars.game.deck.resetStreak(); // reset the streak

            // check if there are more moves available
            if (!this.checkIfAnyMoreMovesAreAvailable()) {
                this.gameWinLose(false);
                return false;
            };
        };
    }

    unhideCard(_position) {
        let card=null;
        scene.groups.cardsDealt.list.forEach((_c)=> {
            if (!card) {
                if (_c.getData('position')===_position) {
                    card=_c;
                }
            }
        });
        let frame = card.name.replace('card_','');
        card.setFrame(frame).setData('faceUp', true).setInteractive();
    }

    update() {
        this.updateTimer();
    }

    updateCardsMoved() { // updates var after move from cards left or dealt
        if (vars.AI.current) return false;
        this.cardsMoved++;
        vars.game.playerStats.cardsMoved++;
    }

    updatePlayerStats() { // move to deal (or deck?)
        if (!this.startTime) return false; // stats have already been updated for this game (This WAS a fic for a BUG. Bug is now fixed at root of problem. It is best to check anyway as startTime is nulled below)

        vars.DEBUG ? console.log(`Updating player stats`) : null;
        let gV = vars.game;
        let pStats = gV.playerStats;

        // get total time for game
        let time = ~~((new Date()-this.startTime)/100)/10; // date-olddate = time in ms /100 to give tenths of a s, then/10 to give s
        this.startTime=null;
        // and push it to the scoreCard
        vars.game.scoreCard.time = time;


        // UPDATE PLAYER STATS
        // add this time to the total time playing var
        pStats.totalTimePlaying=~~((pStats.totalTimePlaying+time)*100)/100;
        // increase the amount of games played
        pStats.gamesPlayed++;


        // update best streak
        this.bestStreak>pStats.bestStreak ? pStats.bestStreak=this.bestStreak : null;

        // GET NEW AVERAGES
        // get average time to 3 decimal places
        pStats.averageCompletionTime = ~~((pStats.totalTimePlaying/pStats.gamesPlayed)*1000)/1000;

        if (!vars.checkType(pStats.averageCompletionTime,'number') || pStats.averageCompletionTime<=0) {
            console.error(`Problem with the new average`);
            console.log(pStats);
            debugger;
        }

        // save to lS
        vars.localStorage.savePlayerStats();

    }

    updateSolution(_position) {
        if (vars.AI.current) return false;

        let time = new Date() - this.startTime;
        time = time.toString(consts.timeRadix);
        this.solution.push([_position, time]);
    }

    updateTimer() {
        if (vars.AI.current) return false; // if the AI is running we ignore this as it will update the timer
        if (!this.startTime) return false;

        let newTime = ~~((new Date()-this.startTime)/100)/10;
        this.currentTime = newTime;
        vars.UI.updateTimer(newTime);
    }
};