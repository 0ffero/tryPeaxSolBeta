"use strict";
/*
    EXAMPLES:
    image on path
    http://labs.phaser.io/edit.html?src=src\physics\arcade\body%20on%20a%20path.js  
*/
let winDance = class {
    constructor(_force) {
        this.force = vars.checkType(_force,'string') ? _force : false;
        vars.DEBUG ? this.force===false ? console.log(`Running random win dance`) : console.log(`Running win dance ${_force}`) : null;
        this.preInit();
        this.init();
    }

    preInit() {
        let cC = consts.canvas;
        this.winDanceSets = {
            simpleDiamond: {
                type: 'tween',
                points: [
                    [cC.width*0.2,cC.cY],
                    [cC.cX, cC.cY*0.3],
                    [cC.width*0.8,cC.cY],
                    [cC.cX, cC.height*0.8]
                ],
                repeat: 2,
            },

            betterDiamond: { // http://127.0.0.1/phaser354-examples-master/public/edit.html?src=src/paths/path%20add%20line%20curve.js
                type: 'tween',
                points: [
                    [cC.cX, cC.height*0.7], //bottom
                    [cC.width*0.4, cC.height*0.5], // left
                    [cC.cX, cC.height*0.3], // top
                    [cC.width*0.6, cC.cY], // right
                    // join
                    [cC.cX, cC.height*0.8], // join
            
                    [cC.width*0.7, cC.cY], // far right
                    [cC.cX, cC.height*0.2], // top top
                    [cC.width*0.3, cC.height*0.5], // far left
                    [cC.cX, cC.height*0.8], // bottom bottom
                ],
                repeat: 0
            },

            simpleSquare: {
                type: 'tween',
                points: [
                    [cC.width*0.2, cC.height*0.8],
                    [cC.width*0.2, cC.height*0.2],
                    [cC.width*0.8, cC.height*0.2],
                    [cC.width*0.8, cC.height*0.8],
                    [cC.cX, cC.height*0.8]
                ],
                repeat: 2,
            },

            simpleX: {
                type: 'tween',
                points: [
                    [cC.cX,cC.cY], // move to centre
                    [cC.width*0.2, cC.height*0.8], // move to bottom left
                    [cC.width*0.1, cC.height*0.7], // angle away from other cards
                    [cC.cX*0.8, cC.cY], // back to centre
                    [cC.width*0.1,cC.height*0.3], // upper left
                    [cC.width*0.2,cC.height*0.2], // angle away from other cards
                    [cC.cX,cC.cY*0.8], // back to centre
                    [cC.width*0.8,cC.height*0.2], // upper right
                    [cC.width*0.9,cC.height*0.3], // angle away from other cards
                    [cC.cX*1.2,cC.cY], // back to centre
                    [cC.width*0.9, cC.height*0.7], // move to bottom right
                    [cC.width*0.8, cC.height*0.8], // angle away from other cards
                    [cC.cX, cC.cY], // back to centre
                    [cC.cX, cC.height*0.8]
                ],
                repeat: 2,
            },

            winText: {
                type: 'tween',
                points: [
                    [-100, cC.height*0.8], // move the cards off the screen
                    [-100, cC.height*0.2],
                    [60,150],   // start the W
                    [210,850],
                    [360,450],
                    [510,850],
                    [660,150],
                    [960,150],  // join to I
                    [960,850],  // I
                    [1260,850], // join to N
                    [1260,150], // N
                    [1860,850],
                    [1860,150],
                    [cC.width*1.1, cC.height*0.2],
                    [cC.width*1.1, cC.height*0.8],
                    [cC.cX, cC.height*0.8]
                ],
                repeat: 1,
            }
        };
    }

    init() {
        vars.audio.playSound('applause');
        // move all cards to the winDance group
        this.moveAllCardsToWD();

        this.complete=0; // used to check if all cards have finished their animations

        let winPoints = this.getRandomWinDance();

        let repeat = 1;


        let kids = scene.groups.winDance.getChildren();
        this.totalCards = kids.length;
        let toX = winPoints[0][0]; let toY = winPoints[0][1];
        
        kids.forEach((_k,_i)=> {
            let duration = Phaser.Math.Distance.Between(_k.x, _k.y, toX, toY)/2;
            _k.setData({ repeat: repeat, winPoints: winPoints, currentWP: 0 });

            scene.tweens.add({
                targets: _k,
                x: toX,
                y: toY,
                duration: duration,
                delay: _i*framesToMs(2),
                onComplete: (_t,_o)=> {
                    // do something with the object
                    this.generateNextTween(_o[0]);
                }
            });
        })
    }

    destroyAllCardsAfterWinDance() {
        scene.groups.winDance.children.entries.forEach((_c,_i)=> {
            scene.groups.winDance.children.entries.length === _i+1 ? _c.setData({ lastCard: true}) : _c.setData({ lastCard: false} );
            scene.tweens.add({
                targets: _c,
                alpha: 0,
                delay: _i*framesToMs(3),
                duration: 500,
                onComplete: (_t,_o)=> { 
                    _o[0].getData('lastCard') ? vars.UI.buildWellDone() : null;
                    _o[0].destroy(); // destroy the card
                }
            });
        });

        scene.children.getByName('skipWinDance') ? scene.children.getByName('skipWinDance').destroy() : null;
    }

    destroyAllTweensAndCards() {
        scene.groups.winDance.children.entries.forEach((_c,_i)=> {
            let tweens = scene.tweens.getTweensOf(_c);
            if (tweens.length) {
                scene.tweens.getTweensOf(_c)[0].remove();
            }
            _c.destroy();
        });
    }

    generateNextTween(_o) {
        let object = _o;
        let wP = object.getData('winPoints');
        let cWP = object.getData('currentWP');
        if (wP && wP.length-1 === cWP) { // we have reached the end on the winPoints array
            let rep = object.getData('repeat');

             // should we repeat the entire animation?
            if (rep>0) { // yes
                rep--;
                object.setData({ repeat: rep, currentWP: -1 }); // note cWP is set to -1 as we simply re-request genNxtTwn

                this.generateNextTween(object);
            } else {
                this.complete++;
                if (this.complete===this.totalCards) {
                    this.throwCards();
                }
            }
        } else if (wP) { // we still have win points to move to, get the next one and update position
            // update the current winPoint
            cWP++; object.setData({currentWP: cWP });

            // get the new toX, toY and duration
            let toX = wP[cWP][0]; let toY = wP[cWP][1];
            let duration = Phaser.Math.Distance.Between(object.x,object.y,toX,toY)/2;

            // generate the new tween
            scene.tweens.add({
                targets: object,
                x: toX,
                y: toY,
                duration: duration,
                onComplete: (_t,_o)=> {
                    // do something with the object
                    this.generateNextTween(_o[0]);
                }
            });
        }
    }

    getRandomWinDance() {
        let sets = this.winDanceSets;
        let available = Object.keys(sets);

        if (this.force===false) {
            let sS = getRandom(available);
            let set = this.winDanceSets[sS];
            this.repeat = set.repeat ? set.repeat : 0;
            return set.points;
        } else {
            if (available.includes(this.force)) {
                let set = this.winDanceSets[this.force];
                this.repeat = set.repeat ? set.repeat : 0;
                return set.points;
            } else {
                let sS = getRandom(available);
                let set = this.winDanceSets[sS];
                this.repeat = set.repeat ? set.repeat : 0;
                return set.points;
            }
        }
    }

    moveAllCardsToWD() {
        if (scene.groups.winDance.getLength()===52) return true;

        let depth = 13*4+5; // make sure the groups lowest card is higher than the board (bg)
        let wD = scene.groups.winDance;
        let moveTo = [];
        let allChildren = [];


        // move all the cards from their containers and put them into the win dance group. set their start position
        let cCG = scene.groups.cardCurrent;
        cCG.list.forEach((_c)=> {
            if (!moveTo.length) { moveTo = [_c.x, _c.y]; } // initialise the moveTo pos

            _c.setPosition(moveTo[0],moveTo[1]).setDepth(depth);
            depth--;
            allChildren.push(_c);
        });
        cCG.removeAll();

        let cDG = scene.groups.cardsDealt;
        cDG.list.forEach((_c)=> {
            _c.setPosition(moveTo[0],moveTo[1]).setDepth(depth);
            depth--;
            allChildren.push(_c);
        });
        cDG.removeAll();

        let cLG = scene.groups.cardsLeft;
        cLG.list.forEach((_c)=> {
            _c.setPosition(moveTo[0],moveTo[1]).setDepth(depth);
            depth--;
            allChildren.push(_c);
        });
        cLG.removeAll();

        // add them all to the group
        wD.addMultiple(allChildren);
        
        // for every card, disable interactive, make it collide with the screen bounds and give it a drag factor
        scene.groups.winDance.children.entries.forEach((_c)=> {
            _c.setCollideWorldBounds(true,0.75,0.75).setDragX(30);
            _c.disableInteractive();
        });

        // place a bg image above everything that we can click to skip the winDance
        let cC = consts.canvas;
        let skipWinDance = scene.add.image(cC.cX, cC.cY, 'whitePixel').setScale(cC.width, cC.height).setName('skipWinDance').setAlpha(0.01).setDepth(255).setInteractive();
        skipWinDance.on('pointerup', ()=> {
            // showing the win screen
            vars.DEBUG ? console.log(`Skipping winDance!`) : null;
            scene.children.getByName('skipWinDance').destroy();
            this.destroyAllTweensAndCards();
            //vars.UI.buildWellDone();
            this.destroyAllCardsAfterWinDance(); // default destroy function if winDance isnt skipped
            // this is still used as it will also 
        });

        return true;

    }

    throwCards() {
        if (!scene.groups.winDance.children.entries.length) return false; // ignore the throw request if the player has skipped winDance

        scene.groups.winDance.children.entries.forEach((_card)=> {
            let xVel = getRandom(-50,50)*10;
            let yVel = getRandom(-100,-50)*10;
            _card.body.setVelocity(xVel,yVel);
        })
        scene.physics.resume();

        scene.tweens.addCounter({
            from: 0,
            to: 1,
            duration: 12000,
            onComplete: ()=> {
                vars.DEBUG ? console.log(`Pausing physics. Fading out and killing all the cards in winGroup`) : null;
                scene.physics.pause(); 
                this.destroyAllCardsAfterWinDance();
            }
        })
    }

}