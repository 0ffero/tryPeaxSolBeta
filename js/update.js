"use strict";
vars.update = {
    hue: 27,
    hueMin: 27,
    hueMax: 60,

    reverse: false,

    tick:() => {
        vars.DEBUG ? vars.debug.update() : null;

        if (scene.containers.mainScreen.visible && !scene.containers.splashScreen.visible) {
            vars.update.updateMainScreenButtons();
        };

        let cV = vars.containers;
        // make sure if we show the main screen and looping is false to enable looping
        !cV.looping && scene.containers.mainScreen.alpha===1 ? cV.looping=true : null;

        // SCROLLER (RULES and STUFF)
        if (vars.scrollers.available) {
            let scrollers = vars.scrollers.available;
            for (let slr in scrollers) { scrollers[slr].update(); };
        };


        // GAME SCREEN
        vars.game.deal ? vars.game.deal.update(): null; // update everything on the game screen (currently only updates the timer on screen)


        // MAIN SCREEN (contains "new game" button, "options" button, "highscore" button etc and a few particles)
        // IF THE MAIN SCREEN IS VISIBLE; WE UPDATE THE CARD SUITS PARTICLES
        if (cV.current==='mainScreen') { // main screen is visible
            !vars.particles.available.letterSparkle.active ? vars.particles.available.letterSparkle.setActive(true) : null;
            vars.mainScreen.cardSuitParticlesUpdate();
        } else {
            if (!vars.particles.available.letterSparkle) return false;
            vars.particles.available.letterSparkle.pause();
            vars.particles.available.letterSparkle.emitters.list[0].killAll();
        };



        // OPTIONS SCREEN
        // IF the OPTIONS SCREEN is visible and playing isnt null
        scene.containers.optionsScreen.visible && vars.music.playing ? vars.update.updateTrackBar() : null;



        // LOOT BOX EMULATOR
        // IF the LOOT BOX EMULATOR is running
        vars.game.unlockables && vars.game.unlockables.lbeVars && vars.game.unlockables.lbeVars.enabled ? vars.game.unlockables.scrollUpdate() : null;



        // DEALS WITH TRANSITIONING BETWEEN MAIN SCREEN AND HIGH SCORE SCREEN
        if (cV.waitingToPlayLoop.includes(cV.current) && !cV.ignoreLoop) { // if we're cycling and not ignoring the loop as the player just entered their name...
            if (cV.pauseTime) { cV.pauseTime--; return; } // reduce the pause time if it isnt 0 and jump out of the "if" statement
            cV.paused && !cV.pauseTime ? cV.paused=false : null; // if pause time has JUST hit 0, reset the paused var


            // if we get here there is no pause time and were currently cycling through the mainscreen set (waitingToPlayLoop)
            cV.waitingTimeOut ? cV.waitingTimeOut-- : null;
            if (cV.waitingTimeOut) return; // the time out is still higher than 0



            // if we get here  the timer has reached 0 and we are cycling... time to
            // reset the timeout based on which screen is about to be shown
            cV.waitingTimeOut = cV.current!=='mainScreen' ? cV.waitingTimeOutMax : cV.waitingTimeOutMax/2;


            // SWITCH SCREENS

            // GET THE CURRENT CONTAINER NAME (itll be the last in the array)
            let currentContainer = cV.waitingToPlayLoop.slice(-1)[0];
            currentContainer = cV.getByName(currentContainer);
            currentContainer.name==='mainScreen' ? vars.particles.suitShapeDisableAll() : vars.particles.cardSuitsEnabled=true;

            cV.ignoreLoop=true;

            scene.tweens.add({ // fade out the currently visible container
                targets: currentContainer,
                alpha: 0,
                duration: 1000,
                onComplete: (_t,_o)=> {
                    if (!vars.containers.looping) { return false; }; // make sure the game hasnt started between fades

                    _o[0].setVisible(false); // set the old container to invisible (alpha is already 0)

                    // GET THE NEXT CONTAINER TO FADE IN
                    let cV = vars.containers;
                    let newContainer = cV.waitingToPlayLoop.shift(); // grab the first available container
                    cV.waitingToPlayLoop.push(newContainer); // push it back onto the array
                    if (cV.pausedByUser) { return false; }
                    
                    // the loop hasnt being ignored
                    // grab the actual container
                    newContainer = cV.getByName(newContainer);
                    // set it to visible BUT alpha 0
                    newContainer.setVisible(true).setAlpha(0);
                    scene.tweens.add({ // fade it in
                        targets: newContainer,
                        alpha: 1,
                        duration: 1000,
                        onComplete: (_t,_o)=> {
                            vars.containers.ignoreLoop=false;
                            vars.containers.current = vars.containers.waitingToPlayLoop.slice(-1)[0];
                        }
                    })
                }
            });
        };
    },

    tintMainScreenButtons: (_hue)=> { // changes the hue of the text on the button, called from updateMainScreenButtons, below.
        // convert hue to 0-1
        let hue = _hue/360;
        let colour = Phaser.Display.Color.HSLToColor(hue,1,0.5).color;
        let container = scene.containers.mainScreen;
        ['newGame','hiScores','options', 'buy'].forEach((_key)=> { container.getByName(`MST_${_key}Text`).setTint(colour); });
        return;
    },

    updateMainScreenButtons: ()=> { // updates the hue then requests the buttons text tint
        let uV = vars.update;
        uV.hue+1<uV.hueMax && !uV.reverse ? uV.hue+=0.1 : uV.hue-1>uV.hueMin && uV.reverse ? uV.hue-=0.1 : uV.reverse=!uV.reverse;
        uV.tintMainScreenButtons(uV.hue);
    },

    updateTrackBar: (_reset=false)=> {
        let playTrackBar = vars.containers.getByName('optionsScreen').getByName('playingTrackBar');
        let wh = playTrackBar.getData('maxWH');
        if (_reset) {
            playTrackBar.setCrop(0,0,0,wh[1]);
            return true;
        };

        let playing = vars.music.playing;
        let percent = (playing.seek%playing.duration)/playing.duration;
        playTrackBar.setCrop(0,0,wh[0]*percent,wh[1]);

        return true;
    }
}