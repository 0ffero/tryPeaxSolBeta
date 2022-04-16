"use strict";
let Deck = class {
    constructor() {
        vars.DEBUG ? console.log(`Class: Deck`) : null;
        this.cardSet = [];

        this.init();

        this.playerScore = 0;
        this.currentStreak = 0;
        this.realStreak=0;
    }

    init() {
        let suits = ['S','C','H','D'];
        let cards = ['A',2,3,4,5,6,7,8,9,10,'J','Q','K'];
        suits.forEach((_s)=> {
            cards.forEach((_v)=> {
                this.cardSet.push(`${_v}_${_s}`);
            });
        });

        if (vars.DEBUG && vars.debug && vars.debug.stackedDeck) {
            // we need to set the deck so that the cards sent to the table (tri peaks)
            // are 
            return true;
        };

        let times = getRandom(30,70);
        for (let t=0; t<times; t++) {
            shuffle(this.cardSet);
        }
    }

    decreaseScore() {
        this.playerScore>=100 ? this.playerScore-=100 : this.playerScore=0;
    }

    increaseScore(_x,_y,_bonus=false) {
        let points = 0;
        if (!_bonus) {
            // up the streak
            this.increaseStreak();
            // figure out how many points the player is getting
            points = this.currentStreak * 100;
            // generate points popup
            vars.UI.newMessage(points, _x, _y-120, 0, 2000, 24, 0xff00);
        } else {
            points=_bonus;
        }

        // update the players score var
        this.playerScore += points;

        // update the UI
        vars.UI.updateScore(this.playerScore);
    }

    increaseStreak() {
        this.currentStreak < 10 ? this.currentStreak++ : null;
        this.realStreak++;
        let pV = vars.particles;
        if (this.currentStreak===1) {
            pV.multiplierHighlightStart(true);
        };
        pV.multiplierHighlightChangeColour();

        scene.groups.cardsDealt.length ? vars.audio.playSound(`collectCard${this.currentStreak}`) : null;
        vars.UI.updateMultiplier(this.currentStreak);
        this.realStreak > vars.game.deal.bestStreak ? vars.game.deal.bestStreak=this.realStreak : null;
    }

    lose() {
        // reenable after unlock points are counted
        let score = this.playerScore; let time = this.currentTime;
        vars.game.getUnlockPoints(score, time);
    }

    resetStreak() {
        this.currentStreak=0;
        this.realStreak=0;
        vars.UI.updateMultiplier(this.currentStreak);
        vars.particles.multiplierHighlightStart(false);
    }

    win() { // called from Deal
        // promote "card current"s depth
        scene.groups.cardCurrent.setDepth(4);
        this.resetStreak(); // reset the streak before giving the player points
        // count up the remaining cards
        let cardsLeft = scene.groups.cardsLeft.getAll();
        let cardCount = cardsLeft.length;
        cardsLeft.forEach((_cL)=> {
            // pop the card, set depth and reposition
            vars.game.deal.showNextRemainingCard(_cL,true);
        });

        let duration = 250;
        let totalDuration = duration * cardCount;
        scene.tweens.addCounter({
            from: 0,
            to: 1,
            duration: totalDuration,
            onComplete: ()=> {
                let score = this.playerScore; let time = vars.game.deal.currentTime;
                vars.game.getUnlockPoints(score, time);
            }
        });

    }
};