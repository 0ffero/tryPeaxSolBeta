"use strict";
var vars = {
    version: 0.99,
    revision: 'rev 096.008',
    // rev [aaa].[bbb] where [bbb] is the sub revision with regards to speeding up the game on phones
    revisionInfo: [
        'Beta State: Unlocks are now fully set up. Still to implement switching card sets. Tints work though :)',
        'Version: 0.99 - Everything thats meant to be in the game is now in the game.',
        '   Just need to finish all systems so they interact properly.',
        '   + polish',
        'Release of demo build should be available very soon.',
        'Revision 001   - AI was introduced.',
        'Revision 004   - AI FINISHED.',
        'Revision 005   - Switching tints now works',
        'Revision 006   - Limited the particles on the main screen (was 4000 per second and looked awesome but was very slow). Now theres approx 310. Particles are also killed when switching screens.',
        '                   - OK, I wasnt expecting that kind of difference in performance. Only problem is the fireworks shader. When this game is played on the gateway.. umm.. lol?',
        '                   - The shader is used on the high score table as well as on the unlockables loot box emulator and the win screen',
        '                   - (its created on demand for the win screen)',
        'Revision 007   - Player no longer gets 100 points for simply turning a remaining card.',
        'Revision 008   - I changed a few things with regards to unlocks (specifically card sets), however was forced to reset all data (0.07). Linking to card sets images have been delayed. But it should work now. Due to this reset Im simply testing the game.',
        '                   - I could just give myself 3000 UPs and quickly test CARD SET unlocks, but Id rather put the testing time in to find any problems before this goes live.',
        'Revision 009   - When entering your name the fireworks shader is pushed into the input container. When clicking OK it moves it back to the high score table',
        'Revision 010   - High score input update. Added a couple of shadows. Centred input panel (wasnt noticable before fireworks was added to bg).',
        'Revision 011   - High score table, when sorted by score is using a new function that takes into consideration the times.',
        'Revision 012   - Same with times rev 011 (untested until I have two times that are equal - again, im going to play the game rather than change a saved time. More play test time)',
        'Revision 013   - More High score table updates. inc moving the replay button to its own icon',
        'Revision 014   - Fixed a bug with the time coins (user was getting the full 90, instead of 90-their time)',
        'Revision 015a  - Tightened up the UI transitions between mainScreen and highScoreTable.',
        '                   - If a transition is interrupted a new container var holds that fact.',
        '                   - When closing the interrupter the mainScreen is shown again if applicable. Still needs some work coz apparently its 4:42am :S',
        '                   - This is a good reason to create a UI and Containers class next time so we can track tweens.',
        'Revision 016   - Most recent high score is now highlighted (in green). After entering player name the page with the new score is automatically shown first.',
        '               - Changing "sort by" will also regenerate the pages and show players auto display the appropriate page',
        'Revision 017a  - UI Updates. Added shadows to well done screens text. Mostly implemented Replay buttons: Currently you have to change pages before the buttons show.',
        '         017b  - Replay buttons are now shown on entering the high score table.',
        '               - When clicking on the sort by while main screen is looping, it will pause looping until the highscores page is closed.',
        'Revision 018, 019 and 020 - Updated the UI so I can hide or show specific things on the game play UI. Used when showing tints, when AI replays a deal, when counting UPs and on standard game deal.',
        'Revision 021   - When selecting an unlocked tint the tint tick now move to the right page and alpha is set to 1. ie Its working perfectly now. The tint just needs to be saved now.',
        'Revision 022   - Update to how UP coins are counted. Now shows the score bonus without the time bonus, then changes the counter to the time bonus total. Thanks Alex.',
        'Revision 023   - Unlockeds card sets are now displaying properly (had to change the default font name from default to defaultFont as this is the default card set name.',
        'Revision 024, 025 and 026 - Unlocked card sets can now be selected. Card Tick moves appropriately. Selected card set is saved. When loading a new card set it will hide the UI and do the card spread. Added loading text.',
        'Revision 027   - Added 10 new card sets which have the default look front face. Added lV function to update card sets if new sets arent in the lS var.',
        'Revision 028   - As my saved games were getting quite big (56ish KB) Ive added LZ compression. Compression ability is tested and saved as a lS var. A new helper function has been added to return the solutions as an uncompressed string.',
        'Revision 029   - Added 12 more card sets.',
        'Revision 030   - The new _SOS (Satin Original Style) card sets now have a border on the back card (makes them stand out better).',
        'Revision 031   - Most, if not all, buttons now have a timeout associated with them to stop accidental double clicks (primarily, but is also used when dealing the cards etc)',
        'Revision 032   - External update to batch files. One copies the tryPeax folder to the beta folder. The other compresses those files and pushes it into the git folder',
        'Revision 033   - Added sign in bonus, given each day. Theres no pop up or anything, it just gives you it.',
        'Revision 034   - Bug Fix: If compression was enabled after solutions was created a bug caused the wins and losses to fail, causing the game to halt.',
        'Revision 035   - Daily log in bonus is now shown',
        'Revision 036   - Daily log in bonus is now fully implemented',
        'Revision 037   - Fixed a bug that was stopping you clicking after using the loot box emulator. The input enable was on a tween that runs forever, hence never completes,. So Ive moved the enable input elsewhere',
        'Revision 038   - Added a delay to the debug updater (60 times a second was overkill, changed to 1/10s)',
        'Revision 039   - Added Loader for unlockables, which delays the splash screen as it was reducing it to a few frames per second (as the textures were being created)',
        'Revision 040   - Increased the particle count for the main screen for non phones (as phones no longer show sparkles on main screen).',
        'Revision 041   - Bug Fix. Fixed a weird bug where moving all cards to winDance would be ignored if DEBUG was false... wtf? TESTED WORKING',
        'Revision 042   - Changed LBE so it comes to a more gradual stop',
        'Revision 043   - Lol. So I created the unlockables icon on the Gateway and its colour accuracy is just horrible. Remade in on Main. Also added it to ui atlas.',
        'Revision 044   - Bug fix. UL Tint. When clicking on a tint, upon coming back to options it didnt re-enable input',
        'Revision 045   - Added button on unlocks page to switch between unlockables and unlockeds',
        'Revision 046   - Moved the unlock points type to a new container above the cards',
        'Revision 047   - Coins werent in a container (they just had a depth of 1 - The reason for this was to have the coins above the gameplayui) so now theyre in the same bonus container as 046',
        'Revision 048 - 051 - Modified the mainScreen so it shows the current UP count for the player',
        'Revision 052   - Fixed debug overlay',
        'Revision 053 - 061 - Adding keyboard movement to the game. Implemented game ui control',
        'Revision 062   - Added button list to all screens, which will be used to navigate said pages',
        'Revision 063 - 065 - Added the ability to enter name via keyboard',
        'Revision 066   - Disabled input when moving from main screen to high score table whilst looping to stop weirdness when user has clicked on a main screen button as its fading out.',
        'Revision 067, 068  - Modified UP counts on each page to show >99999 where applicable',
        'Revision 069 - 072 - More changes to allow cusror movement on pages. Cursor now hides during screen transition. And auto selects the main button on the page.',
        'Revision 073   - Fixed gamePlayingUI (the first thing created) to be invisible until the game is actually being played (required to add game screen buttons without it always "bring on top")',
        'Revision 074   - Unlocked page count should now work properly.',
        'Revision 075   - LBE now hides and shows pointer at approp times.',
        'Revision 076   - Added lS function to generate unlock id',
        'Revision 077   - Added animated buttons (prev/next) on high score page',
        'Revision 078   - Fixed minor bug when dealing with cursor keys',
        'Revision 079   - The vanity screen was originally going to have a colour fade on the white parts of the logo. But, phones really dont like updating the hue every frame. So, its been replaced with a new shiny gold and silver logo :)',
        'Revision 080   - Added the options screens main buttons to the list of availables so I can enable closing the options page with the escape key',
        'Revision 081   - Escape key works on all pages apart from mainScreen.',
        'Revision 082   - Left and right keys now works on all pages with multiple sub pages (unlockeds/unlocks, hs)',
        'Revision 083   - Added grey scale shader for the give 2k button. Integrated into the initial main screen UP count',
        'Revision 084   - Modified the UP animation (mainScren) to allow for the give2k to animate to the new UP count',
        'Revision 085   - Fixed a bug introduced by now having an unlocked version of the game (grey scale shader was being called on a button that might not exist',
        'Revision 086, 087  - Difficulty warning is completed. Just need to pop up at the appropriate times (such as when selecting/unlocking an OS cS). New awesome sound effect when the message is "typing"',
        'Revision 088   - Fixed a minor bug where user would be shown the "options" container (unlockables) after changing it to unlockeds upon closing and re-entering the options screen',
        'Revision 089   - Fixed the unlocking of tints. It now works like its meant to. Still to do card sets',
        'Revision 090   - Added the warning pop up when selecting non OS card sets. Players will see the message until they click the "Dont show again" button.',
        'Revision 091   - While the mS UP counts up the give2K button is disabled. After UP count finishes, it enables',
        'Revision 092   - Added sound effect to card spread',
        'Revision 093   - Default card set was being caught as not OS. Fixed.',
        'Revision 094   - Fixed space/enter and left right keys. Inlcluding  adding code to deal with ulHeader_button',
        'Revision 095   - Keyboard input works on all pages now',
        'Revision 096   - Keyboard input now works on game screen. Starts timer on first good click',


        'SPEED UP REVISIONS (mainly for phones)',
        'Revision 001   - Started speeding everything up. Removed crossfades for phones as theyre pretty slow',
        'Revision 002 - 006 - Replaced the splashScreen for phones only. (changes to rotators and particles).',
        'Revision 007   - Reduced the render resolution of the particles shader for PCs to 1/3',
        'Revision 008   - Reduced the amount of sparkles on PCs',

        'FUTURE REVISIONS:',
        'Unlockable tints work. Unlockable cards, not so much.'

    ],

    DEBUG: true,

    debug: {
        delay: null, delayMax: null,
        stackedDeck: false,
        overlayObject: null,
        overlayBG: null,

        overlayInit: ()=> {
            let cC = consts.canvas;
            let dV = vars.debug;
            dV.overlayObject = scene.add.text(cC.width-10,cC.height-120, [],{ fontSize: '18px', fontWeight: 'bold', lineSpacing: 7 }).setOrigin(1).setData({wh:[0,0]}).setDepth(999).setVisible(false);
            dV.updateOverlay();

            !scene.cursors ? scene.cursors = scene.input.keyboard.createCursorKeys() : null;
            scene.input.keyboard.on('keydown-DELETE', (_e)=> {
                _e.stopPropagation();
                vars.debug.switchOverlayVisibility();
            });
        },

        checkAllCards: ()=> { // shows a virtual representation of all cards dealt (as I once noticed while debugging that 2 cards were the same (AD), but it may just be phaser acting weird as Ive never seen it again)
            let cards = { C: [], D: [], H: [], S: [] };
            let groups = scene.groups;
            ['cardsDealt','cardsLeft','cardCurrent'].forEach((_g)=> {
                groups[_g].list.forEach((_c)=> {
                    let cName = _c.name;
                    a = cName[cName.length-1]
                    cards[a].push(cName);
                    cards[a].sort();
                });
            });
            console.table(cards);
        },

        move: ()=> {
            return false;
            let dV = vars.debug;
            if (!dV.overlayBG.visible) return false;

            let xy = [0,0];
            if (scene.cursors.left.isDown) { xy[0] = -50; } else if (scene.cursors.right.isDown) { xy[0] = 50; };
            if (scene.cursors.up.isDown) { xy[1] = -50; } else if (scene.cursors.down.isDown) { xy[1] = 50; };

            dV.overlayBG.x+=xy[0];
            dV.overlayBG.y+=xy[1];
            dV.overlayObject.x+=xy[0];
            dV.overlayObject.y+=xy[1];
        },

        switchOverlayVisibility: ()=> {
            let dV = vars.debug;
            let show = dV.overlayBG.visible ? false : true;
            dV.overlayBG.visible=show;
            dV.overlayObject.visible=show;
        },

        update: ()=> {
            let dV = vars.debug;
            if (dV.delay===null) return false;

            if (dV.delay) { dV.delay--; return false; }
            dV.delay!==null && !dV.overlayObject ? dV.overlayInit() : null;
            if (!dV.overlayBG || !dV.overlayBG.visible || dV.delay===null) return false;
            
            dV.delay=dV.delayMax;
            dV.updateOverlay();
            dV.move();
        },

        updateOverlay: ()=> {
            let header = [[`VERSION: ${vars.version} ${vars.revision}`],''];
            let pStats = vars.game.playerStats;
            let statArray = ['PLAYER STATS:'];
            for (let stat in pStats) {
                statArray.push([stat, pStats[stat]])
            };

            let cV = vars.containers;
            let containerArray = ['CONTAINERS:'];
            ['current','ignoreLoop','looping','pauseTime','pauseTimeOutMax','pausedByUser','waitingTimeOut'].forEach((_var)=> {
                containerArray.push([_var,cV[_var]]);
            });
            containerArray.push('');

            let pV = vars.particles;
            let particleArray = ['PARTICLES'];
            ['cardSuitsEnabled','currentlyRunning','mainScreenSuitInt','mainScreenSuitTimeout'].forEach((_var)=> {
                particleArray.push([_var,pV[_var]]);
            });
            particleArray.push('');

            let othersArray = [ '', 'OTHERS', 'INPUT', `Enabled: ${vars.input.enabled}`, '' ];

            if (vars.game.deal) {
                let iV = vars.input; let c = iV.cursor;
                let faceUps = JSON.stringify(c.cachedFaceUps).split('{');
                faceUps.shift();
                othersArray.push(`Cursor Over: ${c.phaserObject.data.list.over}`,`Previously Over: ${c.previousObjectOver}`);
                othersArray = [...othersArray,...faceUps];//`Cached ${faceUps}`
            };

            let fullArray = [...header, ...particleArray, ...containerArray,...statArray,...othersArray];

            let debug = vars.debug.overlayObject;
            debug.setText(fullArray);

            if (JSON.stringify(debug.getData('wh'))==='[0,0]') {
                debug.setData({ wh: [debug.width,debug.height] });
                // generate a backgroud for the text
                let centre = debug.getCenter();
                vars.debug.overlayBG = scene.add.image(centre.x,centre.y, 'whitePixel').setTint(0x0).setAlpha(0.5).setScale(debug.width+20,debug.height+20).setDepth(998).setVisible(false);
            };

        },

        moveAllCardsToSP: ()=> {
            if (!vars.DEBUG) return false;
            if (scene.groups.winDance.getLength()===52) return true;

            let depth = 13*4+5; // make sure the groups lowest card is higher than the board (bg)
            let wD = scene.groups.winDance;
            let cCG = scene.groups.cardCurrent;
            let moveTo = [cCG.list[0].x, cCG.list[0].y];

            let allChildren = [];
            allChildren.push(cCG.list[0]);
            cCG.removeAt(0);



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

            wD.addMultiple(allChildren);
        },

        testWinDance(_force=false) {
            vars.debug.moveAllCardsToSP();
            new winDance(_force);
        }
    },

    BUGS: [
        'When viewing a replay of a game after entering your name, the multiplier etc is faded out. This is because youve won a game, so alphas are already set low. Hence ignoring the bonusFG etc IS simply leaving them as is.',
        'Fix: On replay reset everything to 1 alpha then fade everything out again. This might need to be "remembered" so we can fade out the appropriate stuff for the next game.'
    ],

    TODO: [
        ['UNLOCKABLES'],
        ['  Allow user to unlock (buy with UPs) card sets and tints by clicking on them.'],
        ['UNLOCKEDs'],
        ['  An extra page is being created when then are multiples of 10 unlockables unlocked (ie 5 pages. 4 pages full. 5th page empty']
    ],

    init: function(_phase) {
        switch (_phase) {
            case 'PRELOAD': // PRELOADS
                vars.localStorage.init();
                vars.files.loadAssets();
            break;
            case 'CREATE': // CREATES
                // we can safely delete the loader var
                delete(vars.loader);
                
                vars.audio.init();
                vars.containers.init();
                vars.groups.init();

                // the groups and container have now been built, which means we can start building UI stuff
                vars.game.unlockables = new Unlockables(scene); // initialise the unlockables. Loads its own files and generates new UI with container
                
                // init stuff needed for the game and specifically for the main screen
                vars.input.init();
                vars.music.init();
                vars.paths.init();
                vars.shaders.init();
                vars.UI.init();

                // Build the score card
                vars.game.scoreCard = new ScoreCard(scene);
                vars.scrollers.init();
            break;
            case 'GAMESCREENS':
                vars.UI.initMainScreen(); // also initialises PARTICLES
                vars.UI.initDifficultyWarning();
                vars.UI.initGameScreen();
                vars.UI.initOptionsScreen();
            break;
            case 'STARTAPP': // GAME IS READY TO PLAY
                vars.game.init();
            break;

            default:
                console.error(`Phase (${_phase}) was invalid!`);
                return false;
            break; // this break isnt needed (obviously). but I feel dirty not including it
        }
    },

    checkType: (_variable, _type)=> {
        let valid = false; // the default response is "false"

        switch (_type) {
            case 'array':
                valid = Array.isArray(_variable) ? true: false;
            break;

            case 'boolean': case 'bool':
                valid = typeof _variable === 'boolean' ? true : false;
            break;

            case 'float':
                valid = !Number.isInteger(_variable) && typeof _variable==='number' ? true : false;
            break;

            case 'integer': case 'int':
                valid = Number.isInteger(_variable) ? true : false;
            break;

            case 'number':
                valid = typeof _variable === 'number' ? true : false;
            break;

            case 'object':
                valid = typeof _variable === 'object' ? true : false;
            break;

            case 'string': case 'str':
                valid = typeof _variable === 'string' ? true : false;
            break;

            default:
                console.error(`This type (${_type}) has no check!\nUnable to test variables validity.`);
                valid = false;
            break;
        }

        return valid;
    },

    files: {
        audio: {
            load: function() {
                vars.DEBUG ? console.log('  >> Startup > 🖪 Loading Audio') : null;

                let aV = vars.audio;
                let folder = 'sounds';
                aV.available.newCard = [];

                scene.load.audio('deleteLetter', `${folder}/deleteLetter.ogg`);
                scene.load.audio('acceptName', `${folder}/acceptName.ogg`);

                Phaser.Utils.Array.NumberArray(0,9,'newCard').forEach((_key)=> {
                    scene.load.audio(_key, `${folder}/${_key}.ogg`);
                    aV.available.newCard.push(_key);
                });

                aV.available.collectCard = [];
                Phaser.Utils.Array.NumberArray(1,10,'collectCard').forEach((_key)=> {
                    scene.load.audio(_key, `${folder}/${_key}.ogg`);
                    aV.available.collectCard.push(_key);
                });

                aV.available.turnCard = [];
                Phaser.Utils.Array.NumberArray(1,5,'cardTurn').forEach((_key)=> {
                    scene.load.audio(_key, `${folder}/${_key}.ogg`);
                    aV.available.turnCard.push(_key);
                });

                // cards dealt from the cards left use this specific card turn
                scene.load.audio('cardLeftTurn', `${folder}/cardTurn.ogg`);

                // coins
                scene.load.audio('coin', `${folder}/coin.ogg`);

                scene.load.audio('buttonClick', `${folder}/buttonClick.ogg`);

                scene.load.audio('shuffle1', `${folder}/shuffle1.ogg`);
                scene.load.audio('shuffle2', `${folder}/shuffle2.ogg`);
                aV.available.shuffle = ['shuffle1','shuffle2'];

                scene.load.audio('applause', `${folder}/applause.ogg`);
                scene.load.audio('letterShow', `${folder}/letterShow.ogg`);

                // music
                folder='music';
                Phaser.Utils.Array.NumberArray(1,6,'track').forEach((_key)=> {
                    scene.load.audio(_key, `${folder}/${_key}.ogg`);
                });

                scene.load.audio('logoSound', `${folder}/logoSound.ogg`);
            }
        },

        fonts: {
            load: ()=> {
                vars.DEBUG ? console.log('  >> Startup > 🖪 Loading Fonts') : null;
                scene.load.bitmapFont('defaultFont', 'font/rdFont.png', 'font/rdFont.xml');
                scene.load.bitmapFont('defaultFontSmall', 'font/rdFontSmall.png', 'font/rdFontSmall.xml');
            }
        },

        images: {
            load: function() {
                vars.DEBUG ? console.log('  >> Startup > 🖪 Loading Images') : null;
                let folder = 'images';
                scene.load.image('gameBG', `${folder}/game_background.jpg`);
                scene.load.image('whitePixel', `${folder}/whitePixel.png`);
                scene.load.image('mainScreenMask', `${folder}/mainScreen/welcomeText.png`);


                // card sets
                let cardSet = vars.game.cardSet;
                scene.load.atlas('cards', `${folder}/cards/${cardSet}/cardset.png`, `${folder}/cards/${cardSet}/cardset.json`);

                if (vars.localStorage.dailyBonusGiven) { scene.load.image('dailyBonusImage', `${folder}/ui/dailyBonusSplash.png`); }; // only required when the daily bonus is being given

                // coins
                scene.load.atlas('coins', `${folder}/coins/coins.png`, `${folder}/coins/coins.json`);

                // mainScreen, UI and high score table stuff
                let hst = 'highScoreTable';
                scene.load.atlas(hst, `${folder}/${hst}/${hst}.png`, `${folder}/${hst}/${hst}.json`);
                scene.load.atlas('mainScreen', `${folder}/mainScreen/mainScreen.png`, `${folder}/mainScreen/mainScreen.json`);
                scene.load.atlas('ui', `${folder}/ui/ui.png`, `${folder}/ui/ui.json`);

                // logo
                let lS = 'logoScreen';
                scene.load.atlas(lS, `${folder}/${lS}/logoScreen.png`, `${folder}/${lS}/logoScreen.json`);

                // options
                scene.load.image('optionsBG', `${folder}/optionsBG.png`);

                // particles
                folder = 'particles'
                scene.load.atlas('flares', `${folder}/sparks.png`, `${folder}/sparks.json`);
            }
        },

        shaders: {
            load: ()=> {
                scene.load.glsl('fireworks', `shaders/fireworks/fireworks.frag`);

                scene.load.plugin('rexgrayscalepipelineplugin', 'plugins/grayscalepipelineplugin.min.js', true);
            }
        },

        loadAssets: ()=> {
            scene.load.setPath('assets');

            let fV = vars.files;
            fV.audio.load();
            fV.fonts.load();
            fV.images.load();
            fV.shaders.load();
        },

        loadCardSet: (_cardSetName)=> { // lmao, its like 3:45am and this actually works... wtf!
            // TODO CONTINUE FROM HERE 0.06
            scene.textures.list.cards.destroy();
            scene.load.setPath('assets');
            scene.load.atlas('cards', `images/cards/${_cardSetName}/cardset.png`, `images/cards/${_cardSetName}/cardset.json`);
            scene.load.start();
            scene.load.once('complete', ()=> { vars.files.cardSetLoaded(); });

            let c = consts;
            scene.add.bitmapText(c.canvas.cX,c.canvas.cY,'defaultFont',`Please Wait...\n\nLoading ${_cardSetName.replace('_','')} card set.`,48,1).setTint(c.tints.orange).setDropShadow(8,8).setOrigin(0.5).setDepth(c.depths.unlockedCardSpread).setName('loadingCardSet');
        },
        cardSetLoaded: ()=> { // only ever called from the above function
            // fade out loading text
            let loadingText = scene.children.getByName('loadingCardSet');
            scene.tweens.add({ targets: loadingText, alpha: 0, duration: 500, onComplete: (_t,_o)=> { _o[0].destroy(); } });
            // show the card spread
            vars.UI.showCardSpread();
        }
    },

    containers: {
        current: null,
        ignoreLoop: true, // this is set to TRUE when the player has just entered their name after finishing a deal
        looping: false,
        paused: false, // this is set to true if the player clicks on one of the NON main screen containers as they are cycling
        pauseTime: 0,
        pauseTimeOutMax: 5*60, // the pause is always 5 seconds. this gives the player 15 seconds to click an option on the mainScreen
        pausedByUser: false,
        waitingToPlayLoop: ['highScoreTable', 'mainScreen'],
        waitingToPlayLoopDefaults: ['highScoreTable', 'mainScreen'],
        waitingTimeOut: 15*60, // 15 seconds
        waitingTimeOutMax: 15*60,

        init: ()=> {
            vars.DEBUG ? console.log(`%cFN: containers > init`, `${consts.console.defaults} ${consts.console.colours.functionCall}`) : null;

            let depths = consts.depths;
            let gAVars = consts.layout.gameArea;
            scene.groups = { };
            scene.groups.cardsDealt  = scene.add.container().setName('cardsDealt');
            scene.groups.cardsDealt.setDepth(1).setSize(gAVars.width, gAVars.height).setPosition(gAVars.padding.x, gAVars.padding.y);

            scene.groups.cardsLeft   = scene.add.container().setName('cardsLeft');
            scene.groups.cardsLeft.setDepth(1);

            scene.groups.cardCurrent = scene.add.container().setName('cardCurrent');
            scene.groups.cardCurrent.setDepth(1);

            scene.groups.gamePlayingUI = scene.add.container().setName('gamePlayingUI');
            scene.groups.gamePlayingUI.setDepth(0).setVisible(false).setAlpha(0);

            scene.groups.winDance = scene.add.group().setName('winDance');

            scene.containers = { };
            scene.containers.mainScreen = scene.add.container().setName('mainScreen');
            scene.containers.mainScreen.setDepth(depths.mainScreen).setVisible(true).setAlpha(1);

            scene.containers.optionsScreen = scene.add.container().setName('optionsScreen');
            scene.containers.optionsScreen.setDepth(depths.options).setVisible(false).setAlpha(0);

            scene.containers.NGoptions = scene.add.container().setName('newGameOptions');
            scene.containers.NGoptions.setDepth(10).setVisible(false).setAlpha(0);

            scene.containers.playerLose = scene.add.container().setName('playerLose');
            scene.containers.playerLose.setDepth(10).setVisible(false).setAlpha(0);

            scene.containers.wellDone = scene.add.container().setName('wellDone');
            scene.containers.wellDone.setDepth(15).setVisible(false).setAlpha(0);

            scene.containers.splashScreen = scene.add.container().setName('splashScreen');
            scene.containers.splashScreen.setDepth(depths.splashScreen).setVisible(true).setAlpha(0);

            scene.containers.fiveHundred = scene.add.container().setName('fiveHundred');
            scene.containers.fiveHundred.setDepth(depths.fiveHundred).setVisible(false).setAlpha(0).setPosition(0,70);

            scene.containers.bonusPoints = scene.add.container().setName('bonusPoints');
            scene.containers.bonusPoints.setDepth(depths.bonusPointsContainier).setVisible(false).setAlpha(0);
            
            scene.containers.difficultyWarning = scene.add.container().setName('difficultyWarning').setDepth(depths.difficultyWarning);
            scene.containers.difficultyWarningCardSet = scene.add.container().setName('difficultyWarningCardSet').setDepth(depths.difficultyWarning+1);

            scene.containers.unlockedCardSpread = scene.add.container().setName('unlockedCardSpread').setDepth(depths.unlockedCardSpread).setAlpha(0).setVisible(false);
        },

        cardsDestroyAll() {
            let containers = scene.groups;

            let children = containers.cardsDealt.getAll();
            children.forEach((_c)=> { _c.destroy(); });

            children = containers.cardsLeft.getAll();
            children.forEach((_c)=> { _c.destroy(); });

            children = containers.cardCurrent.getAll();
            children.forEach((_c)=> { _c.destroy(); });
            containers.cardCurrent.setDepth(1);
        },

        empty: (_containerName)=> {
            if (!scene.containers[_containerName]  && !scene.groups[_containerName]) return false;

            if (scene.containers[_containerName]) {
                scene.containers[_containerName].getAll().forEach((_c)=> {
                    _c.destroy();
                });
            } else {
                scene.groups[_containerName].getAll().forEach((_c)=> {
                    _c.destroy();
                });
            }
        },

        getByName: (_containerName)=> {
            return scene.groups[_containerName] ? scene.groups[_containerName] : scene.containers[_containerName] ? scene.containers[_containerName] : false;
        },

        resetLoopVarsOnContainerQuickSwitch: ()=> {
            let cV = vars.containers;

            cV.current='mainScreen'; // this is automatically happening due to using the show function, but Im making sure
            cV.pauseTime=cV.pauseTimeOutMax; // set the loop to pause for [max] seconds
            cV.paused=true;

            // now move the containers array back to default
            cV.waitingToPlayLoop = cV.waitingToPlayLoopDefaults;

            // resetting waiting time out
            cV.waitingTimeOut=cV.waitingTimeOutMax;
        },

        show: (_container, _show=true)=> { // any container that simply hides when changed to uses this function
            if (scene.containers[_container]) {
                let alpha = _show ? 1 : 0;
                scene.containers[_container].setVisible(_show).setAlpha(alpha);
                if (_container==='mainScreen' && !_show) {
                    vars.particles.available.letterSparkle.pause();
                    vars.particles.available.letterSparkle.emitters.list[0].killAll()
                 } else if (_container==='mainScreen' && _show) {
                    vars.particles.available.letterSparkle.resume();
                 };

                // if we hiding the mainScreen disable the suitShape particles
                _container==='mainScreen' && !alpha ? vars.particles.suitShapeDisableAll() : null;
                _container==='mainScreen' && alpha ? vars.particles.cardSuitsEnabled=true : null;
                vars.containers.current = _container;
            }
        },

        showNG: (_show=true)=> {
            let alpha = _show ? 1 : 0;
            let container = scene.containers.NGoptions;
            _show ? container.setVisible(true) : null;
            scene.tweens.add({
                targets: container,
                alpha: alpha,
                duration: 250,
                onComplete: (_t,_o)=> {
                    !_o[0].alpha ? _o[0].setVisible(false) : null;
                }
            });
            return true;
        },

        startIntroLoop: (_start=true)=> {
            _start!==true ? _start=false: null; // force start to true or false
            let cV = vars.containers;
            // if we're showing the intro loop, we set ignore loop to false and vece versa
            cV.ignoreLoop=!_start;
            // whether we're starting or stopping the loop, we reset the timeout to max
            cV.waitingTimeOut=cV.waitingTimeOutMax;
        },

        showNGOnFail: (_show=true)=> {
            let alpha = _show ? 1 : 0;
            let container = scene.containers.playerLose;
            alpha ? container.setVisible(true) : null;
            scene.tweens.add({
                targets: container,
                alpha: alpha,
                duration: 250,
                onComplete: (_t,_o)=> {
                    !_o[0].alpha ? _o[0].setVisible(false) : null;
                }
            });
            return true;
        },

        transitionToNewScreen: (_cV)=> {
            let cV = _cV;
            // GET THE CURRENT CONTAINER NAME (itll be the last in the array)
            let currentContainer = cV.waitingToPlayLoop.slice(-1)[0];
            currentContainer = cV.getByName(currentContainer);
            currentContainer.name==='mainScreen' ? vars.particles.suitShapeDisableAll() : vars.particles.cardSuitsEnabled=true;

            cV.ignoreLoop=true;

            // deal with the cursor object
            let iV = vars.input;
            // is it currently visible?
            if (iV.cursor.phaserObject.visible) {
                iV.cursor.phaserObject.setData({ wasVisible: true });
            } else { // no
                iV.cursor.phaserObject.setData({ wasVisible: false });
            };
            iV.cursor.quickShow(false);

            // disable input
            
            iV.enableInput(false);

            scene.tweens.add({ // fade out the currently visible container
                targets: currentContainer,
                alpha: 0,
                duration: 1000,
                onComplete: (_t,_o)=> {
                    if (!vars.containers.looping) { return false; }; // make sure the game hasnt started between fades - no longer needed as I disable input when transitioning TODO ?

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
                            // re-enable input
                            vars.input.enableInput(true);
                            if (vars.input.cursor.phaserObject.getData('wasVisible')) {
                                vars.input.cursor.quickShow(true);
                                vars.input.cursor.moveToInitialPageButton();
                            };
                        }
                    });
                }
            });
        }
    },

    graphics: { // initialised after the paths have init'd
        available: {
            fiveHundred: null,
        },

        init: ()=> {
            vars.DEBUG ? console.log(`%cFN: graphics > init`, `${consts.console.defaults} ${consts.console.colours.functionCall}`) : null;

            let gV = vars.graphics;
            let graphics = gV.available.fiveHundred = scene.add.graphics();
            //graphics.clear();
            graphics.lineStyle(15, 0x0, 1);
            let path = vars.paths.available.fiveHundred;
            path.draw(graphics);

            // graphics gets added to the 500 container
            let container = vars.containers.getByName('fiveHundred');
            container.add(graphics);
        }
    },

    groups: {
        init: function() {
            vars.DEBUG ? console.log(`%cFN: groups > init`, `${consts.console.defaults} ${consts.console.colours.functionCall}`) : null;
            !scene.groups ? scene.groups = { } : null;

            scene.groups.gamePlayingUIButtons = scene.add.group().setName('gamePlayingUIButtons');
        }
    },

    loader: null,

    localStorage: {
        canCompress: false,
        cardSets: ['cSdefault','cSblue','cSblue_satin','cSbrown','cSbrown_satin','cSgold','cSgreen_dark','cSgreen_muted','cSgreen_satin','cSgreen_muted_satin','cSgreen_shiny_satin','cSorange','cSorange_satin','cSpink','cSpink_satin','cSpurple','cSpurple_muted','cSpurple_muted_satin','cSpurple_satin','cSred','cSred_satin','cSyellow','cSyellow_vibrant','cSyellow_vibrant_satin',
        'cSblue_OS', 'cSbrown_OS', 'cSgreen_bright_OS', 'cSgreen_dark_OS', 'cSorange_OS', 'cSpink_OS', 'cSpurple_muted_OS', 'cSpurple_OS', 'cSred_OS', 'cSyellow_OS', 'cSyellow_vibrant_OS',
        'cSblue_SOS','cSbrown_SOS','cScopper_SOS','cSgold_SOS','cSgreen_bright_SOS','cSorange_SOS','cSpink_SOS','cSplatinum_SOS','cSpurple_SOS','cSred_SOS','cSsilver_SOS','cSyellow_SOS','cSyellow_vibrant_SOS'],
        exampleWins: '[{"id":"7tp01ji1des","deck":"2D,10H,5H,3S,6H,QS,8H,JC,5D,JS,3C,2S,3H,5S,3D,8D,JH,9D,5C,10C,8C,4S,2H,4C,4H,AH,QH,JD,7D,10S,4D,9H,QD,6C,7C,2C,KH,7H,9C,QC,AS,AD,KD,7S,KS,6S,10D,9S,KC,6D,AC,8S","solution":"21,0,52,16q,28,49i,27,4pl,51,6hv,19,983,22,abl,50,bca,20,cpp,18,ecr,49,fas,10,gl6,48,hfs,47,k6f,46,lcq,26,n6r,23,ntp,13,pd4,12,pub,11,qfq,24,r75,4,s2u,25,snp,14,tcl,5,u1o,45,vnl,6,11pa,17,12es,44,13gk,16,1541,43,1607,42,180g,8,19kr,41,1adh,1,1bi5,15,1c5k,40,1d55,39,1efh,38,1fnf,7,1gql,37,1him,36,1igi,9,1joe,35,1kt8,34,1m5b,2,1n55,33,1nnn,32,1oj3,3,1ps6"},{"id":"8s0ervoggbb","deck":"8D,2C,8H,8C,2D,KD,9C,QD,JS,5S,6C,6D,7S,4H,5H,KH,4D,QC,3D,10D,10H,KS,AS,AH,7H,6H,3H,QH,2S,AD,5D,9D,2H,KC,3S,JD,JC,10S,4S,3C,8S,9S,6S,9H,QS,7D,4C,AC,JH,10C,7C,5C","solution":"23,1,22,sd,24,35b,52,4f2,51,5sp,26,91j,25,bhf,50,f30,21,h29,49,it7,19,l0d,14,n6b,15,ofb,12,pec,13,qc3,48,rie,28,tvc,16,ut0,47,1040,46,11rl,20,141p,7,168k,45,179c,44,1934,43,1alk,10,1cdb,11,1cqh,42,1e1r,5,1fmg,27,1get,17,1h77,41,1ib9,40,1kes,4,1m98,39,1o2n,38,1pjh,1,1r63,37,1s3o,6,1u89,18,1v2i,9,20th,8,21fk,36,231d,3,2472,35,251c,34,25rk,2,26tp"},{"id":"6mm92i142nv","deck":"6S,10D,6H,4D,5H,AD,9C,4C,QS,AS,7S,8S,9S,KC,2D,10H,8C,KH,4H,4S,8H,JC,7C,QH,3D,9H,3H,5C,2S,KD,5D,7D,8D,KS,JD,9D,AH,JH,10C,6C,7H,3S,QD,AC,JS,3C,2H,2C,10S,5S,6D,QC","solution":"27,0,20,pr,25,1md,19,2es,28,3jh,52,4s5,24,85g,22,93t,51,9v0,50,ccj,21,f34,23,gl0,12,isk,26,koc,16,mrt,13,nde,17,okc,11,pgr,49,r34,48,t9f,10,v19,14,10jq,6,11f0,15,12bf,47,1471,46,15vn,45,17g3,18,19ev,9,1anh,44,1bj3,43,1coo,7,1ech,2,1fk0,42,1ghp,5,1j21,8,1k13,41,1lfo,3,1ml2,40,1ngm,4,1ojt,39,1pdb,38,1q7l,37,1qss,36,1reo,35,1s5l,34,1sp4,33,1tbt,32,1tun,1,1utc"},{"id":"1o6ie3fa4o0","deck":"5S,3S,8D,4D,2C,8C,4C,6D,AD,10S,2H,QC,2D,7D,7C,AH,8S,2S,6H,5H,3H,KC,9D,9S,QH,KD,4S,7S,5D,AS,9C,10D,4H,KS,10C,AC,6S,6C,QD,5C,KH,9H,7H,8H,JH,JD,JS,QS,3C,10H,JC,3D","solution":"27,1,20,10n,19,1rd,28,33r,52,4e3,22,64c,25,781,26,801,16,905,18,9rc,21,ai7,11,bgg,51,cdp,17,iak,24,k29,10,l3j,23,m72,50,nat,49,q1r,48,ttg,12,108c,47,11j8,46,13f3,13,15a5,9,168e,5,170m,45,183n,14,1alq,8,1bf8,15,1c2m,6,1cp0,44,1dla,43,1fh4,42,1gml,4,1hv1,1,1iom,7,1jbc,2,1kch,41,1l68,40,1lqd,3,1n8i"},{"id":"14nrquure8g","deck":"4H,6C,10C,7C,QH,8S,KC,JC,2S,5C,AC,AD,8H,QS,AS,KH,2C,3S,4C,7H,3C,6H,7S,6S,8C,QD,JS,5S,KS,4D,10D,5D,2H,9S,2D,3D,JH,QC,AH,10S,JD,KD,5H,9C,8D,6D,3H,9D,4S,10H,7D,9H","solution":"26,0,27,j9,52,1qg,28,3gn,22,4i3,23,55l,25,7b9,20,8hf,24,9rj,51,as4,50,cd5,19,dtr,21,gme,17,i90,15,jul,16,kmc,12,mg4,49,nj5,11,qqt,48,rrq,13,t73,47,ubt,18,vvf,9,1104,46,125e,45,13a4,14,14jc,7,16r6,5,17fp,8,186q,3,19a2,44,1adb,43,1bms,42,1cl7,41,1dob,40,1f2o,39,1frm,38,1gof,6,1i2h,37,1ive,36,1jud,10,1l2k,2,1m29,4,1mk2,35,1njd,1,1on7"},{"id":"8nr9jvpf031","deck":"JH,KH,QD,KC,AC,8S,JD,6D,5H,9C,KS,6H,4C,4H,10C,10D,9D,AD,10H,4D,7D,5C,7H,3D,8H,7S,JS,JC,QC,6C,4S,8C,3S,8D,10S,5D,6S,2S,5S,9S,QS,2D,AH,KD,3C,7C,AS,9H,QH,2H,2C,3H","solution":"27,0,19,190,28,28r,52,5q0,26,76v,25,7sa,21,i2l,51,jvu,24,m48,20,mvd,22,nmu,12,oog,23,pd9,50,r6h,10,ufm,16,vcm,17,103f,15,11nn,49,12oj,14,162d,48,17ak,47,18na,7,1arb,46,1bo0,13,1d3j,45,1eob,44,1h0v,18,1i9h,11,1jl0,5,1kjq,4,1l5l,43,1mlc,8,1oic,9,1p1a,42,1qef,6,1rhr,41,1snc,2,1u9e,3,1v0f,1,1vom"},{"id":"5gjaes1pkod","deck":"KD,QC,2S,10D,3C,8H,9H,JC,JS,5D,AH,9C,8D,6H,9S,JD,2C,AD,7S,KC,3D,AS,10H,9D,2H,4C,3H,QD,5C,8C,4D,2D,7D,QH,10C,3S,KH,6S,10S,5H,QS,4S,5S,7C,8S,4H,KS,JH,6D,6C,AC,7H","solution":"26,0,27,m2,25,1qa,22,31f,17,3ui,21,8m4,52,a0d,24,evl,23,gpg,16,m8t,28,osn,20,qfh,18,rl8,51,t65,50,vs4,11,11eh,49,12ee,14,18c4,19,194p,13,1ahs,15,1bog,6,1d9n,12,1ds7,48,1fab,8,1hao,47,1iif,7,1juf,46,1lji,45,1nt6,2,1p62,9,1pr4,44,1qsm,10,1s6o,43,1t4a,42,1ucc,41,205f,40,216k,5,22cv,3,22v3,39,246g,38,2589,37,25ud,36,26o9,35,27f2,34,28i6,4,2a1e,33,2avt,32,2bk7,31,2c8d,1,2d5j"},{"id":"216vsbhf61j","deck":"KC,QH,JD,AD,10H,10D,8C,5H,9H,7C,KS,6H,6D,5D,AS,9D,7D,9C,7S,4D,KD,3C,QS,4S,AH,JH,2D,8S,QD,6C,5S,8H,10C,JC,8D,6S,2C,5C,QC,9S,4H,3S,JS,3D,7H,3H,AC,2H,2S,4C,KH,10S","solution":"21,0,23,n9,26,2a2,52,3h2,19,6nq,28,7m1,51,8mm,24,aag,22,b19,27,fbd,25,gh1,50,i9i,17,mmj,13,npg,14,og1,20,p3q,49,qq6,18,tvh,6,va8,16,102a,48,11m7,47,13nd,10,15mt,12,1699,8,16uj,46,17rn,45,18up,15,1ach,11,1b36,4,1bso,44,1d44,43,1dqc,42,1ek4,5,1fur,9,1grm,7,1hjk,41,1ina,40,1l2s,39,1lqc,2,1n9a,1,1q8s,38,1r2k,37,1rop,36,1siq,35,1t5o,34,1u5t,33,1uuv,32,1vh5,31,203s,30,211m,3,226n"}]',
        options: null,
        playerName: null,
        pre: 'TPX',
        scores: [],
        solutionIDs: null,
        unlockables: null,


        init: ()=> {
            let lV = vars.localStorage;
            let lS = window.localStorage;

            let pre = lV.pre;

            // CHECK IF SAVED DATA CAN BE COMPRESSED
            if (!lS[`${lV.pre}_canCompress`]) {
                lS[`${lV.pre}_canCompress`] = LZString.compressToUTF16('CanCompress') === 'ᡢఽ堾惖\x90Ꭱ☦㭈  ' ? 'true' : 'false';
            };
            lV.canCompress = lS[`${lV.pre}_canCompress`]==='true' ? true : false;

            // MAKE SURE ALL COMPRESSABLE DATA IS ACTUALLY COMPRESSED (as compression was added after the creation of some vars that use it, we need to compress them if we can)
            if (lV.canCompress) {
                // SOLUTION DATA
                if (lS.TPX_solutions && lS.TPX_solutions.includes('wins') && lS.TPX_solutions.includes('losses')) { // solutions already exists in a non compressed form
                    lS.TPX_solutions = LZString.compressToUTF16(lS.TPX_solutions); // compress the solutions that already exist
                };
            };

            // SCORES
            if (!lS[`${pre}_scores`]) lS[`${pre}_scores`] = '[{"name":"OFFER0","score":10000,"time":55},{"name":"OFFER0","score":7500,"time":65},{"name":"OFFER0","score":5000,"time":75}]';
            lV.scores = JSON.parse(lS[`${pre}_scores`]);

            // PLAYER NAME
            if (!lS[`${pre}_name`]) lS[`${pre}_name`] = 'Enter Name...';
            lV.playerName = lS.TPX_name;

            // PLAYER STATS
            if (!lS[`${pre}_pStats`]) lS[`${pre}_pStats`] = JSON.stringify({ averageCompletionTime: 0, bestStreak: 0, cardsMoved: 0, gamesLost: 0, gamesWon: 0, gamesPlayed: 0, totalTimePlaying: 0 });
            vars.game.playerStats = JSON.parse(lS[`${pre}_pStats`]);

            // OPTIONS
            let aV = vars.audio;
            let gV = vars.game;
            let gSV = vars.gameScreen;
            let mV = vars.music;
            if (!lS[`${pre}_options`]) {
                // INITLIALISE THE OPTIONS
                let availableTracks = Phaser.Utils.Array.NumberArray(1,6,'track');

                // all tracks are enabled initially
                let trackList = {};
                availableTracks.forEach((_t)=> {
                    trackList[`${_t}`] = true;
                });

                // set up the default options variable
                let defaultOptions = {
                    music: trackList, // from above. looks like track1: true, track2: true ...
                    userID: generateUserID(),
                    volume: 3,
                    cardSet: 'default',
                    tint: 7584255
                };


                lS[`${pre}_options`] = JSON.stringify(defaultOptions);
                lV.options = defaultOptions;
                mV.enabled = true;
                mV.loop = false;
                mV.available = availableTracks;
                aV.volume=defaultOptions.volume;
                gV.cardSet = defaultOptions.cardSet;
                gSV.tint = defaultOptions.tint;
            } else {
                // load the options var
                let options = lV.options = JSON.parse(lS[`${pre}_options`]);

                // add tracks that are true to the available list
                let trackList = options.music;
                for (let track in trackList) {
                    trackList[track] ? mV.available.push(track) : null;
                };

                // set the volume
                aV.volume = options.volume;

                // set the loop and enabled vars
                mV.loop = mV.available.length===1 ? true : false; // only one track enabled? loop it
                mV.enabled = !mV.available.length ? false : true; // if there are tracks enabled set the mV enabled

                gV.cardSet = options.cardSet;
                gSV.tint = options.tint;
            };

            // SOLUTIONS
            if (!lS[`${pre}_solutions`]) {
                let initData = '{"wins":[],"losses":[]}';
                if (lV.canCompress) { initData = LZString.compressToUTF16(initData); };
                lS[`${pre}_solutions`] = initData;
            };
            let solutions = lV.savedSolutionsLoader();
            let solutionIDs = [];
            for (let sol in solutions) {
                solutions[sol][0] ? solutionIDs.push(solutions[sol][0].id) : null;
            };
            lV.solutionIDs = solutionIDs;

            // Unlock Points
            !lS[`${pre}_UP`] ? lS[`${pre}_UP`]=0 : null;
            gV.unlockPoints = ~~lS[`${pre}_UP`];
            !lS[`${lV.pre}_lastLogin`] ? lS[`${lV.pre}_lastLogin`] = (~~(new Date().toISOString().split('T')[0].replaceAll('-',''))).toString(32): null;
            lV.lastLogin = parseInt(lS[`${lV.pre}_lastLogin`],32); lV.bonusUPsCheck(lV.lastLogin);

            // unlockable list
            if (!lS[`${pre}_unlockables`]) { // initialise the unlockables list if it doesnt exist
                let cardSets = lV.cardSets;
                // FULL COLOUR TINTS
                let tints = Phaser.Display.Color.ColorSpectrum(65); tints.pop();
                let tintArray = [];
                tints.forEach((_t)=> {
                    tintArray.push(`tint${_t.color.toString(16).toUpperCase().padStart(6,'0')}`);
                });
                // PASTEL TINTS
                let pastels = [];
                for (let h=0; h<360; h+=6) {
                    let colour = Phaser.Display.Color.HSLToColor(h/360,0.35,0.5);
                    pastels.push(`tint${colour.color.toString(16).toUpperCase().padStart(6,'0')}`);
                };

                let allSets = [...cardSets,...tintArray,...pastels];
                let unlockObject = {};
                allSets.forEach((_u)=> {
                    let id = generateRandomID();
                    if (_u!=='cSdefault') {
                        unlockObject[_u] = { unlocked: false, id: id };
                    };
                });
                unlockObject[`tint73B9FF`] = { unlocked: true, id: '1010101' };
                unlockObject[`cSdefault`] = { unlocked: true, id: '0101010' };
                lS[`${pre}_unlockables`] = JSON.stringify(unlockObject);
            };
            lV.unlockables = JSON.parse(lS[`${pre}_unlockables`]); // load the saved unlockables
            if (!Object.keys(lV.unlockables).includes('cSblue_OS')) { // check if the default _OS card exists in the unlockables object
                vars.DEBUG ? console.groupCollapsed(`%cAdding new Original Set card sets to the unlockables list as they dont currently exist.`,'color: #10FF10; font-size: 14px') : null;
                // get the new OS card sets
                lV.addNewCardSets('_OS');
                vars.DEBUG ? console.groupEnd() : null;
            };
            if (!Object.keys(lV.unlockables).includes('cSblue_SOS')) { // check if the default _SOS card exists in the unlockables object
                vars.DEBUG ? console.groupCollapsed(`%cAdding new Satin Original Set card sets to the unlockables list as they dont currently exist.`,'color: #20FF20; font-size: 14px') : null;
                // get the new OS card sets and add them to the unlockables
                lV.addNewCardSets('_SOS');
                vars.DEBUG ? console.groupEnd() : null;
            };
            delete(lV.cardSets);

            // unlocked IDs
            if (!lS[`${pre}_ULInt`]) lS[`${pre}_ULInt`] = '["1010101","0101010"]';
            lV.options.ULInts = JSON.parse(lS[`${pre}_ULInt`]); // temporary var thats imported into unlockables class

            if (!lS[`${pre}_WDSA`]) lS[`${pre}_WDSA`]=false; // the "dont show again" var for the warning container
            lV.WDSA = lS[`${pre}_WDSA`]==='true' ? true : false;

            // store browser info
            if (!lS[`${pre}_uData`]) {
                if (window.navigator) {
                    let nav = window.navigator;
                    let bData = { platform: nav.platform, appVersion: nav.appVersion, downSpeedInMbps: nav.connection.downlink, totalThreads: nav.hardwareConcurrency, language: nav.language, languagesAvailable: nav.languages.join(','), online: nav.onLine, uA: nav.userAgent, browserVendor: nav.vendor };
                    lS[`${lV.pre}_uData`] = JSON.stringify(bData);
                };
            };

            if (!lS[`${pre}_unlockKey`]) {
                lS[`${pre}_unlockKey`]='';
            };
            lV.unlocked = lS[`${pre}_unlockKey`] ? true : false;

        },

        addNewCardSets: (_ending=null)=> {
            if (!_ending) return false;

            let lV = vars.localStorage;
            let lS = window.localStorage;
            lV.cardSets.forEach((_csName)=> { // for every card set
                if (_csName.endsWith(_ending)) { // if name ends with _ending
                    lV.unlockables[_csName] = { unlocked: false, id: generateRandomID() }; // add it to the unlockables with a new ID
                    vars.DEBUG ? console.log(`Added ${_csName} to the unlockables list.`) : null;
                };
            });
            // push the updated list to lS
            lS[`${lV.pre}_unlockables`] = JSON.stringify(lV.unlockables);
        },

        bonusUPsCheck: (_lL=null)=> {
            if (!_lL) return false; if (_lL<~~(new Date().toISOString().split('T')[0].replaceAll('-','')) && _lL>20220415) { vars.localStorage.giveBonusUPs(); };
        },

        generateUnlockedKeyForUser: ()=> { // generates and saves an unlock key for user
            let endNum=0; let count=0; let cScount=0; let a=JSON.parse(window.localStorage.TPX_unlockables);
            for (let b in a) {
                if (a[b].id!=='1010101' && a[b].id!=='0101010') {
                    count%2 ? endNum-=~~(a[b].id) : endNum+=~~(a[b].id); b.startsWith('cS') ? cScount++:null; count++;
                };
            };
            let unlockID = `${endNum.toString(16).toUpperCase()}-${count.toString(16).toUpperCase()}-${cScount.toString(16).toUpperCase()}-${vars.version.toString().replace('.','')}`;
            
            // save it
            let lV = vars.localStorage; let lS = window.localStorage; let pre = lV.pre;
            lS[`${pre}_unlockKey`] = unlockID; lV.unlocked=true;
        },

        giveBonusUPs: ()=> {
            vars.DEBUG ? console.log(`Giving log in bonus points`) : null;
            let bonus = consts.unlockPoints.loginBonusUPs;
            let lS = window.localStorage; lS.TPX_UP = ~~lS.TPX_UP+bonus;
            vars.game.unlockPoints += bonus;
            vars.localStorage.dailyBonusGiven=true;
            lS.TPX_lastLogin = (~~(new Date().toISOString().split('T')[0].replaceAll('-',''))).toString(32);
        },

        loadSolution: (_solutionName=null)=> {
           vars.DEBUG ? console.log(`\n%cFN: localStorage > loadSolution ${_solutionName}`, `${consts.console.defaults} ${consts.console.colours.important}`) : null;
           if (!_solutionName || !_solutionName.includes('hSSolutionID_')) return false;

            let solutionName = _solutionName;
            let solutionID = solutionName.replace('hSSolutionID_','');

            // load the deck and solution
            let lS = window.localStorage;
            let lV = vars.localStorage;

            let data = { deck: null, solution: null };
            JSON.parse(lV.savedSolutionsLoader()).wins.every((_s)=> {
                if (_s.id===solutionID) {
                    vars.DEBUG ? console.log(`Solution found for ID ${solutionID}!`) : null;
                    data.deck = _s.deck;
                    data.solution = _s.solution;
                    return true;
                }

                return true;
            });

            vars.DEBUG ? console.log(data) : null;
            if (data.solution && data.deck) {
                // get the score data
                let scoreID = solutionID;
                let scoreData = { name: null, score: null, time: null };
                vars.localStorage.scores.every((_s)=> {
                    if (_s.solutionID===scoreID) {
                        scoreData = { name: _s.name, score: _s.score, time: _s.time };
                        return true;
                    }

                    return true;
                });

                data.scoreData = scoreData;
                vars.AI.new(data);
                return true;
            };

            return false;
        },

        resetAll: ()=> { // resets all saved variables
            for (let vName in window.localStorage) {
                if (vName.startsWith('TPX_')) {
                    vars.DEBUG ? console.log(`Deleting ${vName}`) : null;
                    delete(window.localStorage[vName])
                };
            };
        },

        saveCardSet: (_csName)=> {
            if (!vars.checkType(_csName,'string')) return false;

            let lS = window.localStorage;
            let lV = vars.localStorage;
            lV.options.cardSet = _csName;
            lS[`${lV.pre}_options`] = JSON.stringify(lV.options)
        },

        saveUnlocks: (_unlockSet)=> { // _unlockSet is passed from the unlockables class
            if (!vars.checkType(_unlockSet,'object')) return false;

            let lV = vars.localStorage; let lS = window.localStorage;
            lS[`${lV.pre}_unlockables`] = JSON.stringify(_unlockSet);
        },

        saveUnlockIDs: (_ulList)=> {
            if (!vars.checkType(_ulList,'array')) return false;

            let lV = vars.localStorage; let lS = window.localStorage;
            lS[`${lV.pre}_ULInt`] = JSON.stringify(_ulList);
        },

        savePlayerName: (_name)=> {
            let lV = vars.localStorage; let lS = window.localStorage;

            // update the scores var
            lV.playerName = _name;
            //save scores
            lS.TPX_name = _name;

            return true;
        },

        savePlayerStats: ()=> {
            let lV = vars.localStorage;
            let lS = window.localStorage;
            let pStats = vars.game.playerStats;
            lS[`${lV.pre}_pStats`] = JSON.stringify(pStats);

            return true;
        },

        saveScores: (_scores)=> {
            let lV = vars.localStorage;
            let lS = window.localStorage;

            // update the scores var
            lV.scores = _scores;
            //save scores
            lS.TPX_scores = JSON.stringify(_scores);

            return true;
        },

        saveSolution: (_vars)=> {
            let lV = vars.localStorage; let lS = window.localStorage;
            // MAKE SURE THE SOLUTION ID ISNT A DUPLICATE (theres no point in taking the chance)
            let startLength = lV.solutionIDs.length;
            let solutionID;
            do {
                solutionID = generateRandomID(true);
                let bInt = BigInt(solutionID); solutionID = bInt.toString(32);
                if (!lV.solutionIDs.includes(solutionID)) {
                    lV.solutionIDs.push(solutionID);
                } else {
                    vars.DEBUG ? console.warn(`Solution ID ${solutionID} already exists!\nYou will probably never see this msg as the IDs are 16 random numbers.`) : null;
                };
            } while(lV.solutionIDs.length==startLength);

            // load solutions from lS
            let solutions = JSON.parse(lV.savedSolutionsLoader()); // get the saved solutions (as they can be compressed we have a function that will return the decompressed string)

            // push the new solution into the approp array
            let solutionType = _vars[0] ? 'wins' : 'losses';
            let deck = solutionType === 'wins' ? _vars[1] : null; // only wins save the deck. losses can be reconstructed enough from the solution (as we only ever have to count the points, not show the moves that were played)
            solutions[solutionType].push({ id: solutionID, deck: deck, solution: _vars[2]});

            // now save it
            let solutionsString = lV.canCompress ? LZString.compressToUTF16(JSON.stringify(solutions)) : JSON.stringify(solutions);
            lS[`${lV.pre}_solutions`] = solutionsString;

            return solutionID;
        },

        savedSolutionsLoader: ()=> {
            let lV = vars.localStorage;
            let lS = window.localStorage;
            let solutionsString = null;
            if (lV.canCompress) { // the solutions need to be decompressed
                let compressedSolutions = lS[`${lV.pre}_solutions`];
                solutionsString = LZString.decompressFromUTF16(compressedSolutions)
            } else { // solutions are in plain text format
                solutionsString = lS[`${lV.pre}_solutions`];
            };

            return solutionsString;
        },

        saveTint: (_tintAsInt)=> {
            vars.DEBUG ? console.log(`%cSaving newly unlocked tint ${_tintAsInt}`,'color: #10FF10; font-size: 14px'):null;
            let lV = vars.localStorage;
            let lS = window.localStorage;

            let options = lV.options; // load the saved options
            options.tint = _tintAsInt; // change the tint
            lS[`${lV.pre}_options`] = JSON.stringify(options);
        },

        saveVolume: ()=> {
            let lS = window.localStorage;
            let lV = vars.localStorage
            let options = lV.options;
            options.volume = vars.audio.volume;
            lS[`${lV.pre}_options`] = JSON.stringify(options);
        },

        saveDontShowAgain: ()=> {
            window.localStorage.TPX_WDSA=true;
            vars.localStorage.WDSA=true;
            return true;
        },

        updateTrackList: (_track,_enabled)=> {
            if (_track==='trackAll') return false;
            if (!vars.checkType(_enabled,'bool')) {
                console.error(`Invalid enabled (${_enabled})`);
                return false;
            }

            !vars.checkType(_track, 'string') && Number.isInteger(_track) ? _track = `track${_track}` : null; // track was passed as an integer, change it to a trackname

            let lV = vars.localStorage;
            let options = lV.options;
            options.music[_track]=_enabled;

            let lS = window.localStorage;
            lS[`${lV.pre}_options`] = JSON.stringify(options);
        },

        updateUnlockPoints: ()=> {
            let lS = window.localStorage;
            let lV = vars.localStorage;
            
            lS[`${lV.pre}_UP`] = vars.game.unlockPoints;
        }
    },



    // GAME/APP
    AI: {
        current: null,

        new: (_data)=> {
            let aiV = vars.AI;
            aiV.current = new AI(_data.deck,_data.solution,_data.scoreData);

            if (!aiV.current.errors.length) {
                vars.DEBUG ? console.log(`New AI created. No errors found.\nStarting the AI...`) : null;
                aiV.current.getUIReady();
            } else {
                console.error(`Errors found!`);
                console.error(aiV.current.errors);
                return false;
            };

            return true;
        },

        disableInteractiveOnAllCards: ()=> {
            ['cardsDealt','cardsLeft','cardCurrent'].forEach((_containerName)=> {
                vars.containers.getByName(_containerName).getAll().forEach((_card)=> {
                    _card.disableInteractive();
                });
            });
        },

        requestNextMove: ()=> {
            vars.AI.current.playNextMove();
        },

        destroy: ()=> { // AI's come here to die. Its quick and easy, so theres that...
            // Plus. The AI did actually request this.
            vars.AI.current=null;
        }
    },

    anims: {
        allowCrossFade: true,

        init: function() {
            vars.DEBUG ? console.log(`%cFN: anims > init`, `${consts.console.defaults} ${consts.console.colours.functionCall}`) : null;
            
        },

        animate500: ()=> {
            let container = vars.containers.getByName('fiveHundred');
            let cC = consts.canvas;

            let duration = 333;
            vars.particles.fiveHundredShow(true);

            container.x=-cC.cX-400; // place the container off the screen
            scene.tweens.add({
                targets: container,
                x: 0-100, // animate to "centre"
                duration: duration,
                hold: 1000,
                ease: 'Quad.easeIn',
                onComplete: (_t,_o)=> {    // do something with the object// _o[0].destroy();
                    scene.add.tween({
                        targets: _o[0],
                        x: cC.cX+400, // push it off the right hand of the screen
                        duration: duration,
                        ease: 'Quad.easeOut',
                        onComplete: ()=> {
                            vars.particles.fiveHundredShow(false);
                        }
                    })
                }
            })
        },

        mainPageUPCount: (_init=true)=> {
            let unlockPoints = vars.game.unlockPoints;
            if (!unlockPoints) return false;

            let fromTo = [0,unlockPoints];
            if (!_init) { // we need the current count visible on main screen
                let currentUPCount = ~~(scene.containers.mainScreen.getByName(`playersUPCountMainScreen`).text.split(' ')[0]);
                fromTo = [currentUPCount,unlockPoints];
            };
            // player has UP coins, start the count up
            scene.tweens.addCounter({
                from: fromTo[0], to: fromTo[1],
                duration: 2500,
                ease: 'Expo',
                // update the UP count
                onUpdate: (_t,_v)=> {
                    let currentCount = ~~_v.value;
                    if (~~_v.value>100000) { currentCount = '>99999'; };
                    scene.containers.mainScreen.getByName(`playersUPCountMainScreen`).setText(`${currentCount} Unlock Points`);
                },
                onStart: vars.anims.gimme2KColourToGrey,
                onComplete: vars.anims.gimme2KGreyToColour
            });
        },

        startMainScreenUP: ()=> {
            let container = scene.containers.mainScreen;
            let objects = [];
            ['UIUPCoinMainScreen','playersUPCountMainScreen'].forEach((_oName)=> {
                objects.push(container.getByName(_oName));
            });

            objects.forEach((_o)=> {
                if (_o.name.includes('Coin')) {
                    // tween 1 - alpha the coin in
                    scene.tweens.add({ targets: _o, alpha: 1, duration: 500 });

                    // tween 2  - move to the correct X position
                    scene.tweens.add({
                        targets: _o, x: _o.x-300,
                        duration: 500, delay: 500 // fade in time
                    });
                } else if (_o.name.includes('Count')) {
                    // tween 1 - alpha the count in (delayed by 1 second - ie the time it takes for the coing to fade in and move)
                    scene.tweens.add({ targets: _o, alpha: 1, duration: 500, delay: 1000 });

                    // tween 2  - move to the correct X position
                    scene.tweens.add({
                        targets: _o, x: _o.x+120,
                        duration: 500, delay: 1500, // fade in and move time for the coin image
                        onComplete: (_t,_o)=> { vars.anims.mainPageUPCount(); }
                    });
                } else {
                    console.error(`Unknown object (${_o.name}) !`);
                }
            });
        },

        gimme2KGreyToColour: ()=> {
            if (!vars.localStorage.unlocked) return false;
            let p = vars.shaders.getGrayScalePipeLine();
            let c = vars.containers.getByName('mainScreen');
            let i = c.getByName('MST_boughtText');
            scene.tweens.addCounter({
                from: 1, to: 0,
                duration: 1000,
                onUpdate: (_t,_v)=> { p.get(i)[0].setIntensity(_v.value); },
                onComplete: ()=> { vars.input.enableBuyButton(true); }
            });
        },
        
        gimme2KColourToGrey: ()=> {
            if (!vars.localStorage.unlocked) return false;
            let p = vars.shaders.getGrayScalePipeLine();
            let c = vars.containers.getByName('mainScreen');
            let i = c.getByName('MST_boughtText');
            scene.tweens.addCounter({
                from: 0, to: 1,
                duration: 250,
                onUpdate: (_t,_v)=> { p.get(i)[0].setIntensity(_v.value); },
                onComplete: ()=> { vars.input.enableBuyButton(false); }
            });
        }
    },

    audio: {
        available: {},
        volume: 4,

        init: function() {
            vars.DEBUG ? console.log(`%cFN: audio > init`, `${consts.console.defaults} ${consts.console.colours.functionCall}`) : null;

            scene.sound.setVolume(vars.audio.volume/10);
        },

        playRandom: (_type)=> {
            let aV = vars.audio;
            if (!aV.available[_type]) return false;

            aV.playSound(getRandom(aV.available[_type]));
            return true;
        },

        playShuffle: ()=> {
            let _key = getRandom(vars.audio.available.shuffle);
            scene.sound.play(_key);
        },

        playSound: function(_key) {
            scene.sound.play(_key);
        },

        volumeChange: (_up=true)=> {
            if (vars.DEBUG) {
                let msg = _up ? ' ++ Increasing volume.' : ' -- Decreasing volume.';
                vars.DEBUG ? console.log(`${msg}`) : null;
            }

            let aV = vars.audio;
            if (_up && aV.volume<10) {
                aV.volume++;
            } else if (!_up && aV.volume>0) {
                aV.volume--;
            } else {
                vars.audio.playSound('deleteLetter');
                return false;
            };


            // volume change is valid
            vars.DEBUG ? console.log(`    New volume is ${aV.volume}`) : null;

            vars.audio.playSound('buttonClick');

            scene.sound.volume = aV.volume/10; // set the new volume

            // save the new volume
            vars.localStorage.saveVolume();

            // update the ui
            vars.UI.updateVolume();
        }
    },

    camera: {
        mainCam: null,

        init: function() {
            vars.DEBUG ? console.log(`%cFN: camera > init`, `${consts.console.defaults} ${consts.console.colours.functionCall}`) : null;

            vars.camera.mainCam = scene.cameras.main;
        },

        shake: function(_duration=1000) {
            vars.DEBUG ? console.log(`%cFN: camera > shake`, `${consts.console.defaults} ${consts.console.colours.functionCall}`) : null;

            if (!vars.checkType(_duration, 'int')) return false;

            vars.camera.mainCam.shake(_duration);
        }
    },

    game: {
        phaserGameObject: null,
        deal: null,
        deck: null,
        cardSet: null,
        penaliseErrors: false, // if this is enabled, the user will be penalised by 100 points and a streak reset for bad clicks
        playerStats: null,
        scoreCard: null,
        unlockables: null,

        // new stuff used by unlock coins
        div: 100,
        maxTime: 90,
        unlockPoints: 0,
        unlockPointData: {
            UPTotal: 0,
            scorePoints: 0,
            scoreCoins: [0,0],
            scoreCoinWait: 0,
            timePoints: 0,
            timeCoins: [0,0]
        },

        init: function() {
           vars.DEBUG ? console.log(`\n%cFN: game > init`, `${consts.console.defaults.replace('14', '16')} ${consts.console.colours.important}`) : null;

           // show the gamePlayingContainer
           scene.groups.gamePlayingUI.setVisible(true).setAlpha(1);
 
           // start music if enabled
            vars.music.getNextTrack();

            // enable game screen colour tweens
            vars.gameScreen.enabled=true;

            vars.containers.startIntroLoop(false); // stop the into loop if its running

            vars.containers.show('wellDone',false); 
            // hide the buttons on the game play ui
            vars.UI.showGameplayUI(false,0.1,'initGame');
            // play the shuffle sound
            vars.audio.playShuffle();

            // show pop up message
            vars.UI.newMessage('Shuffling Deck...', null, null, 750, 1500);

            vars.UI.showForegroundBarrier(false);

            // get a new deck and deal
            scene.tweens.addCounter({
                from: 0, to: 1,
                duration: 1000,
                onComplete: ()=> {
                    let gV = vars.game;
                    gV.deck = new Deck();
                    gV.deal = new Deal(gV.deck);
                    vars.game.waitForDeal();
                }
            });


            // reset player score on UI
            vars.UI.updateScore(0);

            // initialise the options container
            vars.UI.initNewDealScreen();
            vars.UI.initPlayerLose();

            vars.containers.looping=false;
        },

        getCoins: (_bp)=> {
            let silverCoinCount = ~~(_bp/10); //10's
            let bronzeCoinCount = _bp%10; // singles
            
            return [silverCoinCount,bronzeCoinCount];
        },

        getUnlockPoints: (_score=0,_time=0)=> {
            if (!vars.checkType(_score,'int') || !vars.checkType(_time, 'number')) { console.error(`Invalid score (${_score.toString()}) or time (${_time.toString})`); return false; }

            let gV = vars.game;
            let uPD = gV.unlockPointData;
            let currentUnlockPoints = gV.unlockPoints; // 132

            let playerScore = _score; // passed in
            let div = gV.div;

            let maxTime=gV.maxTime;
            let playerTime = _time; // passed in

            // bonus points for score
            let scorePoints = playerScore/div; // 114
            uPD.scorePoints = scorePoints; // store it
            uPD.scoreCoins = gV.getCoins(scorePoints);
            vars.DEBUG ? console.table({ scorePoints: scorePoints }) : null;
            
            // bonus points for time (only added for wins)
            let timePoints = 0;
            if (gV.deal.win) { // IF THE PLAYER WINS WE GIVE THEM A BONUS FOR TIME
                // time points are 90-[players time] eg 90-67.3 = 22(.7) = 22pts
                timePoints = playerTime<maxTime ? ~~(maxTime-playerTime) : 0;
                uPD.timePoints = timePoints;
                uPD.timeCoins = gV.getCoins(timePoints);
                vars.DEBUG ? console.table({ timePoints: uPD.timePoints }) : null;
            } else { // player didnt win. 0 out "time points" and coins "array"
                uPD.timePoints = 0;
                uPD.timeCoins=[0,0];
            };

            // total points
            uPD.UPTotal = uPD.scorePoints + uPD.timePoints; // 114 + 22 = 136

            // grab the Bonus Text and change the type (and total)
            let bonusTypeText = vars.containers.getByName('bonusPoints').getByName('bonusTypeText');
            bonusTypeText.setText(`BONUS POINTS FOR SCORE\n${uPD.scorePoints}`); // first unlock points will ALWAYS be for SCORE


            // get the new unlock points and set the gV & lS;
            let newUP = currentUnlockPoints + uPD.UPTotal; // 132 + (136) = 268
            gV.unlockPoints = newUP;
            vars.localStorage.updateUnlockPoints();
            if (gV.unlockPoints>=consts.unlockPoints.randomRoll) {
                gV.unlockables.showRandomRollButton();
            };

            // Start the score updater (updates the UP UI text)
            vars.UI.increaseUPCount();
        },

        newGameUIResets: ()=> {
            // reset the UI score and timer
            vars.UI.updateScore(0);
            vars.UI.updateMultiplier(0);
            vars.particles.multiplierHighlightStart(false);
            vars.UI.updateTimer(0);
        },

        resetUPData: ()=> {
            vars.game.unlockPointData = {
                UPTotal: 0,
                scorePoints: 0,    // unused after
                scoreCoins: [0,0], // this is generated
                scoreCoinWait: 0,  // set when the last bronze score coin is added to "unlock points" (no longer used as Im calling the tween function until no coins are left, which then will show the well done screen)
                timePoints: 0,     // unused after
                timeCoins: [0,0]   // this is generated
            };
        },

        restart: ()=> {
            // make sure looping is false
            vars.containers.looping=false;

            // show the gamePlayingContainer
            scene.groups.gamePlayingUI.setVisible(true).setAlpha(1);

            vars.containers.cardsDestroyAll();

            // hide the well done (probably not needed, but better safe than sorry)
            vars.containers.show('wellDone',false);

            vars.containers.startIntroLoop(false); // stop the into loop if its running

            // reset UI elements
            vars.game.newGameUIResets();

            // fade out the foreground barrier
            vars.UI.showForegroundBarrier(false);

            // play the shuffle sound
            vars.audio.playShuffle();

            // show pop up message
            vars.UI.newMessage('Shuffling Deck...', null, null, 750, 1500);

            // get a new deck and deal
            scene.tweens.addCounter({
                from: 0,
                to: 1,
                duration: 1250,
                onComplete: ()=> {
                    let gV = vars.game;
                    gV.deck = new Deck();
                    gV.deal = new Deal(gV.deck);
                    vars.game.waitForDeal();
                }
            });
        },

        scrollerDestroy: ()=> {
            vars.game.unlockables.scrollerDestroy();
        },

        scrollerHideNotWons: ()=> {
            vars.game.unlockables.scrollerHideNotWons();
        },

        scrollerShaderAdd: ()=> {
            vars.game.unlockables.scrollerShaderAdd();
        },

        scrollerZoomInOnWin: ()=> {
            vars.game.unlockables.scrollerZoomInOnWin();
        },

        scrollerShowWinMessage: ()=> {
            this.scene.tweens.addCounter({
                from: 0, to: 1,
                duration: 500,
                onComplete: ()=> { !vars.input.enabled ? vars.input.enableInput(true) : null; }
            })
            vars.game.unlockables.scrollerShowWinMessage();
        },

        setBGTint: (_tintAsString)=> {
            // find the tint
            vars.game.unlockables.available.tints.every((_t)=> {
                if (_t[0]===_tintAsString) { // this is the tint were looking for
                    // set the tint and save it
                    let container = vars.containers.getByName('gamePlayingUI');
                    container.getByName('game_bg').setTint(_t[3]); // tint the background
                    vars.localStorage.saveTint(_t[3]); // and save the tint

                    // show the new tint (hides the high score table, main screen and shows gamePlayingUI)
                    vars.game.showUnlockedTint();
                    return true;
                };
                return true;
            });
        },

        setCardSet: (_csName)=> {
            vars.DEBUG ? console.log(`Setting new card set ${_csName}`) : null;
            if (vars.game.cardSet===_csName) return false; // the clicked on card set is the current card set

            // the card set clicked on is NOT the current card set
            vars.game.cardSet = _csName;

            // hide the unlocked options pages
            vars.game.unlockables.hideAllContainers();

            vars.files.loadCardSet(_csName); // this load is followed up by the loader function

            //debugger;
        },

        showUnlockedTint: ()=> { // hides the options containers, fades out UI and shows the applied tint. also fades everything back in after a time
            let a = vars.containers.getByName('optionsScreen');
            let b = vars.game.unlockables.containers.unlocked;
            //vars.containers.getByName('gamePlayingUIButtons').propertyValueSet('alpha',0);
            vars.UI.showGameplayUI(false,0.1,'tintView'); // hide the gameplay ui (as we want to focus on the tint of the back ground)
            // show the gameplayui container
            vars.containers.getByName('gamePlayingUI').setAlpha(1).setVisible(true);
            // FADE OUT the containers, HOLD, FADE them back IN
            scene.tweens.add({
                targets: [a,b], alpha: 0,
                hold: 1500, duration: 250,
                yoyo: true,
                onComplete: ()=> {
                    vars.UI.showGameplayUI(true);
                    vars.containers.getByName('gamePlayingUI').setAlpha(0).setVisible(false);
                    vars.input.enableInput(true); // enable input again
                }
            });
        },

        waitForDeal: ()=> {
            if (!vars.game.deal.allCardsDealt) {
                scene.tweens.addCounter({
                    from: 0, to: 1,
                    duration: 500,
                    onComplete: ()=> { vars.game.waitForDeal(); }
                });
            } else { // deal has finished dealing
                vars.UI.showGameplayUI(true);
            }
        },
    },

    gameScreen: {
        update: ()=> { // no longer used. was created to tween the colour of the table outline. but its now a solid gold colour the doesnt change.
            
        }
    },

    input: {
        enabled: false,
        usingCursorKeys: false,
        pageButtons: {}, // each page on creation will add its buttons here. Used by KB to nav pages

        cursor: {
            // NOTE: the AI class creates the actual object as it was originally only used there
            timeout: null, // auto hides the cursor after 5 seconds (as this will also be available on phones)
            timeoutMax: null,
            lastX: 0, lastY: 0, // updated in this.updatePointer
            currentX: 0, currentY: 0, // updated in update fn
            offsets: { x: null, y: null },
            phaserObject: null, // create by the AI class

            cachedFaceUps: [],// holds the current face up cards
            previousObjectOver: null, // when player presses DOWN key to go to "cards left" then UP, cursor should be over the lasy highlighted card
            tween: null, // this holds fade out tweens, so when we move the mouse again it can remove it easily then set alpha of cursor back to 1
        
            clickOnCardsLeft: ()=> {
                let cardsLeft = scene.groups.cardsLeft.list
                // look at the last card (this should be the interactive card)
                let lookingFor = cardsLeft[cardsLeft.length-1].input && cardsLeft[cardsLeft.length-1].input.enabled ? cardsLeft[cardsLeft.length-1] : null;

                // if the last card wasnt interactive
                if (!lookingFor) { // the card that should be interactive is NOT, find it
                    vars.DEBUG ? console.warn(`The card that should be interactive is NOT\nLooking for the interactive card...`) : null;
                    cardsLeft.every((_a)=> {
                        if (_a.input && _a.input.enabled) {
                            vars.DEBUG ? console.log(`Found the next interactive card.\nApparently it was ${_a.name}!`) : null;
                            lookingFor = _a;
                            return true;
                        };

                        return true;
                    });
                };

                // ok, if there was no interactive card, then input is generally NOT enabled (ie the player may have just won)
                if (!lookingFor) { console.warn(`Unable to find an interactive card in cards left.\nYouve either completed the deck ot input is not enabled`); return false; }

                // if we get here looking for is an actual card object
                vars.DEBUG ? console.log(`Clicking on the next cards-left card (${lookingFor.name})`) : null;
                vars.game.deal.showNextRemainingCard(lookingFor);
            },

            escapeKeyPressed: ()=> {
                console.log(`%cEscaped pressed...`, 'color: #44b5cc');
                let onTop = vars.input.cursor.getCurrentlyOnTop();
                if (onTop==='highScoreTable') { // high score table visible, hide it
                    vars.DEBUG ? console.log(`  > Hiding high score table`) : null;
                    let gameObject = vars.containers.getByName(onTop).getByName('close_HSTB');
                    vars.input.highScoreTableButtonClick(gameObject);
                    return true;
                } else if (onTop==='gamePlayingUI') {
                    console.log(`  > Asking player if they want to go home (main screen)`);
                } else if (onTop.startsWith('scroller_')) {
                    console.log(`  > Hiding the scroller`);
                    // this should be a check! TODO
                    vars.scrollers.available.Rules.click(`SCRL_close`);
                    return true;
                } else if (onTop==='optionsScreen') {
                    let gO = { name: 'options_close'};
                    vars.input.optionsClick(gO);
                    return true;
                };

                return false;
            },

            findTheNearestCardToTheClickedOnOne: (_cName,_delay=false)=> { // KEYBOARD: used when clicking on a
                let cachedList = vars.input.cursor.cachedFaceUps;

                if (cachedList.length===1) {
                    if (!_delay) return "delay"; // normally I dont use double quotes, but this is a very special occassion
                };

                // if we get here we have more than 1 card visible
                let cardData;
                if (!_delay) {
                    let currentCard=_cName;
                    let left = null; let right = null;
                    cachedList.every((_cL,_i)=> {
                        if (_cL.name===currentCard) {
                            right = _i+1 > cachedList.length-1 ? 0 : _i+1;
                            left = _i-1 < 0 ? cachedList.length-1 : _i-1;
                            return true;
                        };
                    
                        return true;
                    });
                    
                    // set cardData to the closest card
                    cardData = !right ? cachedList[left] : cachedList[right];
                } else {
                    cardData = cachedList[0];
                };

                if (!vars.checkType(cardData.x,'number') || !vars.checkType(cardData.y,'number')) return false;

                // everything looks good. Move the cursor
                let cursorObject = vars.input.cursor.phaserObject;
                let group = scene.groups.cardsDealt;
                let cOff = consts.cursorOffsets;
                let cOffset = [group.x+cOff.x, group.y+cOff.y];
                cursorObject.setPosition(cardData.x+cOffset[0],cardData.y+cOffset[1]).setData({ over: cardData.name });

                return true;
            },

            getCurrentlyOnTop: ()=> { // returns the container's NAME
                let iV = vars.input;
                let c = iV.cursor;
                
                let ignore = ['mainScreen'];
                let topMostContainer = null;
                let depthMax = -Infinity;
                if (Object.keys(iV.pageButtons).length>1) {
                    for (let containerName in iV.pageButtons) {
                        if (containerName==='scrollers') {
                            let available = vars.scrollers.available;
                            for (let _a in available) {
                                if (available[_a].container.visible && available[_a].container.alpha===1 && available[_a].depth>depthMax ) { topMostContainer=available[_a].containerName; };  // scroller class has a depth var
                            };
                        } else {
                            let container = vars.containers.getByName(containerName);
                            if (!ignore.includes(containerName) && container.visible && container.depth>depthMax) {
                                topMostContainer=containerName;
                            };
                        };
                    };
                };

                if (!topMostContainer) { return 'mainScreen'; } // if no top most, just assume mainScreen

                return topMostContainer;
            },

            keyboardMove: (_dir=null)=> { // moves the cursor via CURSOR KEYS, called from v.input
                if (!_dir) return false;

                // if direction is NOT 'select' (basically the click function when using the keyboard), check if usingCursors has been set to true
                !vars.input.usingCursorKeys && ['up','down','left','right'].includes(_dir) ? vars.input.usingCursorKeys=true : null;
                
                let iV = vars.input;
                let c = iV.cursor;
                if (iV.usingCursorKeys && c.phaserObject.alpha!==1) {
                    if (c.tween) { c.tween.remove(); iV.cursor.tween=null; }; // kill any tweens
                    c.quickShow(true); // set alpha to 1
                };
                
                vars.DEBUG ? console.log(` >> Moving cursor ${_dir}`) : null;

                let cOff = consts.cursorOffsets;
                
                if (!vars.game.deal) { // This DISABLES access to buttons on gamePlayingUI as it deals with input itself
                    vars.input.cursor.moveToNextPageButton(_dir);
                    return true;
                };
                
                // the deal and deck exists
                let cursorObject = c.phaserObject;
                let cOffset = [scene.groups.cardsDealt.x+cOff.x,scene.groups.cardsDealt.y+cOff.y];
                switch (_dir) {
                    case 'down':
                        // move to cards left
                        if (cursorObject.y!==cursorObject.getData('cardsLeftXY')) {
                            // set the preObOver var
                            iV.cursor.previousObjectOver = cursorObject.getData('over');

                            // move cursor
                            let xy = cursorObject.getData('cardsLeftXY');
                            cursorObject.setPosition(xy.x,xy.y).setData({ over: 'cardsLeft'});
                            return true;
                        };
                        return false;
                    break;

                    case 'up':
                        // move on to the dealt cards
                        if (c.previousObjectOver==='cardsLeft') c.previousObjectOver = null;

                        if (c.previousObjectOver) { // we were previously over a card, move back there
                            let object = scene.groups.cardsDealt.getByName(c.previousObjectOver);
                            cursorObject.setPosition(object.x+cOffset[0],object.y+cOffset[1]).setData({ over: c.previousObjectOver });
                            iV.cursor.previousObjectOver=null;
                            return true;
                        };

                        // if we get here its the first time were moving to the dealt cards
                        let cardData = vars.game.deal.getAllFaceUpCards(false); // get the left most card

                        // move the cursor
                        cursorObject.setPosition(cardData.x+cOffset[0],cardData.y+cOffset[1]).setData({ over: cardData.name });

                        return true;
                    break;

                    case 'left': case 'right':
                        // move left or right across dealt
                        let lookingFor = cursorObject.getData('over');
                        if (!lookingFor) { // there is no current "over" on cursorObject, simply re-request this function for "up"
                            c.keyboardMove('up');
                            return true;
                        };

                        if (lookingFor==='cardsLeft') { // cursor is currently over cards left
                            lookingFor = c.previousObjectOver;
                            c.keyboardMove('up');
                            return true;
                        };
                        
                        let nextCardData = null;
                        let allCards = c.cachedFaceUps.length ? c.cachedFaceUps : c.getAllFaceUpCards(); // get all face up cards
                        allCards.every((_c,_i)=> {
                            if (_c.name===lookingFor) {
                                if (_dir==='left') {
                                    nextCardData = _i-1 < 0 ? allCards[allCards.length-1] : allCards[_i-1];
                                } else if (_dir==='right') {
                                    nextCardData = _i+1 > allCards.length-1 ? allCards[0] : allCards[_i+1];
                                };

                                return true;
                            };
                            return true;
                        });

                        if (!nextCardData) {
                            console.error(`Unable to find the next cards data!`); // this should never fire, but, just in case
                            return false;
                        };

                        // next card found, move cursor
                        cursorObject.setPosition(nextCardData.x+cOffset[0], nextCardData.y+cOffset[1]).setData({ over: nextCardData.name });
                    break;

                    case 'select':
                        let cName = cursorObject.getData('over');
                        if (!cName) return false;

                        // first click of the game ? Start the timer
                        if (!vars.game.deal.startTime) vars.game.deal.startTime = new Date();

                        vars.DEBUG ? console.log(`Clicking on card with name ${cName}`) : null;
                        if (cName==='cardsLeft') { // player clicked on one of the cards left
                            c.clickOnCardsLeft();
                            return true;
                        } else { // player clicked on a dealt card
                            let gameObject = scene.groups.cardsDealt.getByName(cName);
                            let valid = vars.game.deal.checkDealtCard(gameObject);
                            vars.DEBUG ? console.log(`%cObject is ${valid ? 'valid' : 'not valid'}`, 'color: black; background-color: white') : null;
                            // especially on game win (as I changed a true to false!)
                            if (!valid) return false;

                            // if we get here the card was valid
                            // MUST be done before updating the cachedFaceUps var
                            let rs = c.findTheNearestCardToTheClickedOnOne(cName); // returns true, false or "delay"
                            vars.DEBUG ?console.log(`%cResponse was ${ rs==='delay' ? 'delay' : !rs ? 'false' : 'true'}`, 'color: black; background-color: white') : null;
                            
                            // update the cached list

                            iV.cursor.cachedFaceUps = vars.game.deal.getAllFaceUpCards(); // update the face up cards list
                            vars.DEBUG ?console.log(`%cFace ups were re-cached`, 'color: black; background-color: white') : null;

                            if (rs==='delay') {
                                vars.DEBUG ?console.log(`%cRunning delayed findNearest`, 'color: #10ff10; background-color: black') : null;
                                c.findTheNearestCardToTheClickedOnOne(cName,true); // true is to tell this function that we delayed this call
                            };
                            return true;
                        };

                        return true;
                    break;
                }
            },

            moveToInitialPageButton: ()=> {
                let pointerOffsetXY = [25,40];
                let onTop = vars.input.cursor.getCurrentlyOnTop();
                // (needed when moving to a new button) let allButtons = vars.input.pageButtons[onTop];
                let c = vars.input.cursor;
                let phaserObject = c.phaserObject;
                if (!phaserObject.getData('over')) {
                    vars.DEBUG ? console.log(`Cursor isnt currently over any buttons\nFinding out what the default button is for this page`) : null;
                    let defaultButton = consts.pageButtons[onTop];
                
                    // ok, find that button
                    let container = vars.containers.getByName(onTop);
                    if (!container) return 'Cant find container';
            
                    vars.DEBUG ? console.log(`Looking for button with name: ${defaultButton}`) : null;
                    let button = container.getByName(defaultButton);
                    if (!button) return 'Cant find button';
                
                    // button was found
                    // get centre position of button
                    let xy = button.getCenter();
                    // position cursor
                    phaserObject.setPosition(xy.x+pointerOffsetXY[0], xy.y+pointerOffsetXY[1]);
                    phaserObject.setData({ over: defaultButton });

                    return true;
                };

                // if we get here theres already an OVER
                // first make sure the over is actually on this page
                let over = phaserObject.getData('over');
                if (!vars.input.pageButtons[onTop].includes(over)) { // button isnt on this screen, reset and re-request
                    phaserObject.setData({ over: null });
                    vars.input.cursor.moveToInitialPageButton();
                    return;
                };
            },

            moveToNextPageButton: (_dir)=> {
                let iV = vars.input;
                let c = iV.cursor;
                
                // get the phaser object
                let cursorObject = c.phaserObject;
                
                if (!cursorObject.visible || !cursorObject.alpha) return 'Ignoring function: Cursor isnt visible'; // ignore the function if the cursor isnt visible

                // get what the cursor is currently over
                let over = cursorObject.getData('over');

                // find the container on top
                let onTop = vars.input.cursor.getCurrentlyOnTop();
                let container = vars.containers.getByName(onTop);



                // OK. We should split this next piece of code out to a seperate function
                if (_dir==='left' || _dir==='right') {
                    if (_dir==='left') { // left and right do different things depending on the page thats onTop. MOVE TO ABOVE DIR===SELECT TEST ABOVE (as it should always move pages if possible)
                        if (onTop==='highScoreTable') {
                            let nextButton = container.getByName('nextPage_HSTB');
                            if (!nextButton.visible || !nextButton.alpha) return false;
                            vars.game.scoreCard.showHighScorePage(false);
                            return true;
                        } else if (onTop==='optionsScreen') {
                            // check which containers visible
                            let uL = vars.game.unlockables;
                            let ulContainers = uL.containers;
                            if (ulContainers.options.visible && ulContainers.options.alpha) {
                                uL.optionsShowPage(false);
                            } else {
                                uL.optionsShowPageULD(false);
                            };
                            return true;
                        };
                    };

                    if (_dir==='right') {
                        if (onTop==='highScoreTable') {
                            let nextButton = container.getByName('nextPage_HSTB');
                            if (!nextButton.visible || !nextButton.alpha) return false;
                            vars.game.scoreCard.showHighScorePage(true);
                            return true;
                        } else if (onTop==='optionsScreen') {
                            // check which containers visible
                            let uL = vars.game.unlockables;
                            let ulContainers = uL.containers;
                            if (ulContainers.options.visible && ulContainers.options.alpha) {
                                uL.optionsShowPage(true);
                            } else {
                                uL.optionsShowPageULD(true);
                            };
                            return true;
                        };
                    };

                    // NOTE THAT THERES NO DEFAULT RETURN STATEMENT HERE
                    // THATS BECAUSE, IF LEFT/RIGHT IS PRESSED ON A PAGE
                    // THAT DOESNT HAVE MULTIPLE PAGES, IT IS STILL USED
                    // ON SOME PAGES TO MOVE TO A SPECIFIC BUTTON!
                    // INCLUDING MOVEMENT ON THE GAME SCREEN
                };

                // IF THE USER PRESSES THE SPACE/ENTER KEYS
                if (_dir==='select' && over) {
                    // get the actual button its over
                    let gameObject = container.getByName(over);
                    // pass it to the v.i.click function
                    vars.input.dealWithClick(gameObject);
                    return true;
                } else if (_dir==='select' && !over) {
                    console.log(`%cCursor isnt currently over a button!`,'color: #550000')
                    return false;
                };

                // get the buttons for that page
                let pageButtons = iV.pageButtons[onTop];


                // check if the cursor is currently over a button
                if ((over && !pageButtons.includes(over)) || !over) { // the "over" is currently for a button NOT on this page
                    console.log(`The currently over (${over}) isnt on this page (${onTop}). Moving to default button`);
                    c.moveToInitialPageButton(); // request the top button for this page
                    return true;
                };

                // IF we get here the "over" is valid, find the next button
                let found=null;
                pageButtons.every((_pB,_i)=> { if (_pB===over && found===null) { found=_i; return true; }; return true; });

                if (!vars.checkType(found,'int')) { vars.input.cursor.moveToInitialPageButton(); return true; };

                let retVal;
                switch (_dir) {
                    case 'up':
                        retVal = found-1 < 0 ? pageButtons[pageButtons.length-1] : pageButtons[found-1];
                    break;

                    case 'down':
                        retVal = found+1 >= pageButtons.length ? pageButtons[0] : pageButtons[found+1];
                    break;

                    // THE NEXT TWO CASE WERE WHAT WAS MENTIONED ABOVE (RE L/R)
                    // by the time we get here weve already ruled out every other onTop, but its better to be precise!
                    case 'left':
                        if (onTop==='mainScreen') {
                            retVal = pageButtons[0];
                        } else {
                            console.log(`%cKB LEFT requested for an unknown onTop (${onTop})`,'color: #550000');
                            return false;
                        };
                    break;

                    case 'right':
                        if (onTop==='mainScreen') {
                            retVal = pageButtons[1];
                        } else {
                            console.log(`%cKB RIGHT requested for an unknown onTop (${onTop})`,'color: #550000');
                            return false;
                        };
                    break;
                };

                if (!vars.checkType(retVal,'string')) { console.warn(`Invalid retVal ${retVal}. It should be a button on this screen!`); return false; };

                console.log(`Looking for button with name ${retVal} in container ${onTop}`);
                let button = container.getByName(retVal).getCenter();
                let buttonXY = [button.x, button.y];

                let o = consts.cursorOffsets;
                cursorObject.setPosition(buttonXY[0]+o.x,buttonXY[1]+o.y).setData({ over: retVal });

            },
            
            quickShow: (_show=true)=> { // quickly switch between alpha 1 and 0 (and 0 to 1)
                let phaserObject = vars.input.cursor.phaserObject;
                let alpha = _show ? 1:0;
                if (phaserObject.visible===_show && phaserObject.alpha===alpha) return false; // its already whatever was requested
                phaserObject.setAlpha(alpha).setVisible(_show);
            },
            
            updatePointer: ()=> { // called from input.init
                // ignored until the main screen is shown
                let iV = vars.input;
                if (!iV.pageButtons.mainScreen) return false;

                let cursor = iV.cursor;
                if (cursor.lastX!==cursor.currentX || cursor.lastY!==cursor.currentY) { // CURSOR HAS MOVED
                    cursor.lastX = cursor.currentX; cursor.lastY = cursor.currentY; // update lastX and Y
                    cursor.timeout!==cursor.timeoutMax ? cursor.timeout=cursor.timeoutMax : null; // reset timeout
                    if (cursor.tween) { cursor.tween.remove(); iV.cursor.tween=null; }; //if a tween exists, remove it
                    if ((cursor.phaserObject.alpha!==1 || !cursor.phaserObject.visible) && iV.enabled) {
                        cursor.tween ? cursor.tween.remove() : null;
                        cursor.quickShow(true); // quickly set the alpha to 1 if !1
                    };
                    cursor.phaserObject.setData({ wasVisible: true });
                    return;
                };
                if (!cursor.phaserObject.visible || iV.usingCursorKeys) return false; // ignore the function if the alpha is NOT 1 OR usingCursorKeys


                // IF WE GET HERE THE CURSOR IS BEING CONTROLLED BY THE MOUSE (ie NOT cursor keys)
                // also, CURSOR HASNT MOVED
                if (cursor.timeout) { iV.cursor.timeout--; return false; } // reduce timeout until 0
        
                cursor.timeout = cursor.timeoutMax; // reset timeout
                // hide the cursor (tween can be interrupted, so we cache it)
                iV.cursor.tween = scene.tweens.add({
                    targets: vars.input.cursor.phaserObject,
                    alpha: 0,
                    duration: 2000,
                    onComplete: (_t,_o)=> { vars.input.cursor.tween=null; _o[0].setData({ wasVisible: false }); } // fade out has completed, nullify the tween var
                });
                return 'Hiding mouse pointer';
            }
        },

        init: ()=> {
            // NOTE: Cursor movement is fully disabled when isPhone=true
            vars.DEBUG ? console.log(`%cFN: input > init`, `${consts.console.defaults} ${consts.console.colours.functionCall}`) : null;

            let gV = vars.game;
            // hide the default cursor and replace it with the ai finger cursor
            let cC = consts.canvas;
            let xyOffsets = { x: 620, y: 880 }; // cards Dealt isnt created until the game starts, so we just set with constants
            vars.input.cursor.phaserObject = scene.add.image(cC.cX,cC.height*0.85, 'ui','aiFingerMoving').setScale(0.8).setName('playerCursor').setData({ over: null, cardsLeftXY: xyOffsets }).setDepth(consts.depths.debug+1).setVisible(false); // this cursor sits above everything
            
            // initialise the vars used to fade out the cursor after x seconds being stationary
            let seconds = 5;
            let fps = gV.phaserGameObject.config.fps.target || 60; // assume 60fps if it isnt set (default for phaser)
            vars.input.cursor.timeout = seconds * fps;
            vars.input.cursor.timeoutMax = seconds * fps;
            let cursorOffsets = consts.cursorOffsets;
            vars.input.cursor.offsets = { x: cursorOffsets.x, y: cursorOffsets.y };

            // hide the cursor. will be shown again when main screen has been created
            vars.input.cursor.quickShow(false);

            // deal with cursor movement
            !vars.isPhone && !scene.cursors ? scene.cursors = scene.input.keyboard.createCursorKeys() : null;
            if (scene.cursors) {
                scene.input.keyboard.on('keyup', (_key)=> {
                    // VOLUME keys
                    if (_key.key==='=' || _key.key==='-') {
                        switch (_key.key) {
                            case '=': vars.audio.volumeChange(true); break; // volume UP
                            case '-': vars.audio.volumeChange(false); break; // volume DOWN
                        };
                        _key.stopPropagation();
                        return true;
                    };

                    // MUSIC TRACK keys (1-6) - Enable or disable track
                    if (_key.keyCode>=49 && _key.keyCode<=54) {
                        let trackInt = ~~(_key.key);
                        vars.UI.swapMusicEnableButton(trackInt);
                        _key.stopPropagation();
                        return true;
                    };

                    // ARROW KEYS and SPACE/ENTER
                    // first: the only keys we are interested in beyond this point is arrows, space/enter & esc
                    let allowed = [' ','Enter','Escape'];
                    if (!_key.key.includes('Arrow') && !allowed.includes(_key.key)) return false;
                    
                    
                    // if we get here, we do indeed have an Arrow, Space/Enter or Esc "up event"
                    let key = _key.key;
                    if (key==='Escape') { // ESCAPE key is used to close several containers (HS,NG - both, gS)
                        vars.input.cursor.escapeKeyPressed();
                        _key.stopPropagation();
                        return true;
                    };

                    
                    // first time one of the cursor keys have been pressed? set usingCursorKeys
                    !vars.input.usingCursorKeys ? vars.input.usingCursorKeys=true : null;

                    // now deal with the key
                    let direction = key===' ' || key==='Enter' ? 'select' : key.replace('Arrow','').toLowerCase();
                    let msg = direction==='select' ? `Clicking on button` : `Moving cursor ${direction}`;
                    vars.DEBUG ? console.log(`%c🖮 ${msg}`, `color: black; background-color: #50FF50`) : null;
                    vars.input.cursor.keyboardMove(direction);
                });
            }
            
            // deal with mouse move within the game
            scene.input.on('pointermove', function (pointer) {
                let iV = vars.input;
                let c = iV.cursor;
                let cOff = consts.cursorOffsets;
                // get mouse pointer image and set its position
                c.phaserObject.setPosition(~~pointer.x+cOff.x, ~~pointer.y+cOff.y);

                if (iV.cursor.currentX!==~~pointer.x || iV.cursor.currentY!==~~pointer.y) {
                    iV.cursor.currentX = ~~pointer.x;
                    iV.cursor.currentY = ~~pointer.y;
                    c.updatePointer();
                };
                
                if (iV.usingCursorKeys) return false; // if the player is using cursor keys ignore the next function
                
                // update the faders vars
                //c.updatePointer();
            });

            scene.input.on('gameobjectup', function (pointer, gameObject) {
                if (!pointer.button) { // ALL CLICKS START HERE
                    let iV = vars.input;
                    iV.dealWithClick(gameObject);
                } else { // RIGHT CLICKING ON ANY CLICKABLE WILL SHOW ITS NAME, DATA AND PHASER OBJECT
                    vars.DEBUG ? console.log(gameObject.name,gameObject.data && gameObject.data.list? gameObject.data.list : 'No Data',gameObject) : null;
                    return true;
                } 
            });

            scene.input.on('gameobjectover', function (pointer, gameObject) {

            });

            scene.input.on('gameobjectout', function (pointer, gameObject) {

            });
        },

        dealWithClick: (_gameObject)=> { // deals with every clickable
            let iV = vars.input;
            if (!iV.enabled) return 'Input currently disabled';

            let gameObject = _gameObject;

            if (gameObject.name.startsWith('HSL_')) return false; // SCORECARD input is dealt with in its own class

            if (gameObject.name.includes('card_')) { // a face up CARD has been clicked
                iV.enableInput(false,200);
                vars.game.deal.clickOnCard(gameObject);
                return true;
            }

            if (gameObject.name.startsWith('NG_')) { // NEW GAME option buttons
                iV.newGameOptionClicked(gameObject);
                return true;
            }

            if (gameObject.name.endsWith('Button_ui')) { // GAMEPLAY UI button
                iV.enableInput(false,200);
                iV.dealWithUIButtonClick(gameObject);
                return true;
            }

            if (gameObject.name.startsWith('MS_') && !gameObject.name.endsWith('moreInfoButton')) { // MAIN SCREEN buttons
                let iV = vars.input;
                if (gameObject.name==='MS_newGame') { iV.enableInput(false); } else { iV.enableInput(false,200); }

                let cV = vars.containers;
                if (gameObject.name === 'MS_newGame') {
                    cV.ignoreLoop=true;
                    vars.audio.playSound('buttonClick');
                    cV.show('mainScreen', false);
                    vars.init('STARTAPP'); // start the app
                    return true;
                };

                if (gameObject.name === 'MS_hiScores') {
                    // disable the cycling if it isnt already
                    cV.pausedByUser=true;
                    vars.containers.startIntroLoop(false);
                    // show the hiscore table and buttons
                    cV.show('highScoreTable', true);
                    vars.game.scoreCard.animatePreviousNextButton();
                    vars.game.scoreCard.showHSTableButtons(true);
                    vars.game.scoreCard.showHSTableReplayButtons(true);
                    return true;
                };

                if (gameObject.name ==='MS_options') {
                    // disable looping (only required by the mS buttons)
                    cV.pausedByUser=true;
                    vars.containers.startIntroLoop(false);
                    cV.looping ? cV.show('mainScreen',false) : null;
                    
                    iV.optionButtonClicked(gameObject.name);
                    return true;
                };

                if (gameObject.name==='MS_buy') {
                    if (vars.localStorage.unlocked) { // game has been bought, give 2000UPs
                        vars.game.unlockPoints += 2000;
                        vars.localStorage.updateUnlockPoints();
                        vars.game.unlockables.showRandomRollButton();
                        vars.game.unlockables.updateUIUnlockPoints();
                    } else {
                        vars.DEBUG ? console.log(`BUY button doesnt currently do anything. Itll eventually allow you to buy the game for £1.99`) : null;
                    };
                    return true;
                };
            };

            if (gameObject.name==='WD_enterName') { // WELL DONE SCREEN button
                iV.enableInput(false,200);
                delete(iV.pageButtons.wellDone); // this button is destroyed, so remove it from the pageButtons
                vars.audio.playSound('buttonClick');
                vars.UI.wellDoneDestroy();
                vars.containers.show('wellDone', false);
                // move the shader image to the input container
                let sC = vars.game.scoreCard;
                sC.moveShaderToNewContainer('inputName');
                sC.enableNameEntry(true);
                sC.inputContainer.setVisible(true);
                return true;
            }

            if (gameObject.name.endsWith('_HSTB')) { // HIGH SCORE TABLE button
                iV.enableInput(false,100);
                iV.highScoreTableButtonClick(gameObject);
                return true;
            }

            if (gameObject.name.startsWith('hSSolutionID_')) { // REPLAY SOLUTION BUTTON ON HIGH SCORE TABLE
                iV.enableInput(false); // re-enabled when deal is done
                vars.localStorage.loadSolution(gameObject.name);
                return true;
            }

            if (gameObject.name==='game_fg') {
                vars.DEBUG ? console.warn(`This is the foreground for the game area. This should not be visible during gameplay!`) : null;
                return true;
            }

            if (gameObject.name==='highScoreTableBG' && !vars.containers.ignoreLoop) { // the main screens are looping and the player clicked on the high score bg
                iV.enableInput(false,200);
                let cV = vars.containers;
                cV.show('highScoreTable', false);
                cV.show('mainScreen', true);

                // reset the container vars
                cV.resetLoopVarsOnContainerQuickSwitch();
            }

            if (gameObject.name.startsWith('options_')) {
                iV.enableInput(false,200);
                iV.optionsClick(gameObject);
                return true;
            }

            if (gameObject.name.endsWith('moreInfoButton')) { // more info button is a special case as its held in a few different containers (currently only mainScreen)
                if (gameObject.name.startsWith('MS_')) { // main screen version of the button
                    iV.enableInput(false,200);
                    vars.containers.ignoreLoop=true;
                    let rules = vars.scrollers.available.Rules;
                    rules.clickFrom='mainScreen';
                    rules.fadeIn(true);
                };
                return true;
            };

            if (gameObject.name.startsWith('SCRL_')) { // buttons associated with the scroller class
                iV.enableInput(false,200);
                vars.scrollers.available.Rules.click(gameObject.name);
                return true;
            };

            // UNLOCKED AND UNLOCKABLES ON OPTIONS SCREEN
            if (gameObject.name==='unlockablesHeader' || gameObject.name==='lootboxemuBG') return false; // DEALT WITH IN UNLOCKABLES CLASS
            // UNLOCK SPECIFIC (CARDSET/TINT)
            if (gameObject.name.startsWith('unlock_cS_') || gameObject.name.startsWith('unlock_cSUI_')) {
                // request an unlock
                iV.enableInput(false,200);
                vars.game.unlockables.unlockSpecific(gameObject,'cardSet');
                return true;
            } else if (gameObject.name.startsWith('unlock_tint_') || gameObject.name.startsWith('unlock_tintUI_')) {
                iV.enableInput(false,200);
                vars.game.unlockables.unlockSpecific(gameObject,'tint');
                return true;
            };

            if (gameObject.name.startsWith('warn_')) {
                if (gameObject.name.includes('dontShowAgain')) { // we need to save the fact that the user doesnt want to see this message again
                    vars.localStorage.saveDontShowAgain();
                } else if (gameObject.name.includes('OK')) {

                } else {
                    console.warn(`Warning button (${gameObject.name}) clicked, but has no handler!`);
                    return false;
                };
                // hide the warning container and reset some alphas
                vars.UI.showDifficultyWarning(false);
                return true;
            };

            // UNLOCKED BUTTONS (dealt with in unlockables)
            if (gameObject.name.startsWith('UNL_') || gameObject.name.startsWith('UNLD_') || gameObject.name.startsWith('CSU_') || gameObject.name.startsWith('TU_')) return false;

            

            // KEYBOARD "BUTTONS"
            // SOME BUTTONS HAVE INLINE HANDLERS THAT CAN BE . THOSE ARE DEALT WITH HERE
            if (gameObject.name==='unlockablesHeader_button') {
                vars.input.switchVisibleUnlocksContainer();
                return true;
            };

            vars.DEBUG ? console.log(`The game object with name "${gameObject.name}" has no click handler.`) : null;
        },

        dealWithUIButtonClick: (_gameObject)=> {
            vars.audio.playSound('buttonClick');
            let cV = vars.containers;

            if (_gameObject.name.startsWith('newGame')) {
                console.clear();
                scene.containers.NGoptions.setVisible(true);
                cV.showNG(true);
                return true;
            }

            if (_gameObject.name.startsWith('home')) {
                // enable looping
                cV.ignoreLoop=false; cV.looping=true;
                // show the main screen
                vars.UI.showMainScreen();
                return true;
            }

            vars.DEBUG ? console.log(`The game object with name "${_gameObject.name}" has no click handler.`) : null;
        },

        enableBuyButton: (_enable=true)=> { // even though the button is called buy, its actually the give2k button as game has been purchased (only way to enter here)
            let buyButton = vars.containers.getByName('mainScreen').getByName('MS_buy');
            _enable ? buyButton.setInteractive() : buyButton.disableInteractive();
        },

        enableInput: (_enable=true,_timeout=null)=> {
            vars.input.enabled = _enable; // set the enabled var
            vars.DEBUG ? console.log(`%c[INPUT] Input has been ${_enable ? 'enabled': 'disabled'} ${_timeout ? `and will be re-enabled in ${_timeout}` : ''}`,`color: ${_enable ? '#10FF10': '#ff8000'}`) : null;
            
            if (!_timeout) { return true; } // this request to enable/disable is controlled by the app (timeout is falsey)

            scene.tweens.addCounter({ // if this was called to simply stop accidental double clicks then set a timeout to re-enable input
                from: 0, to: 1,
                duration: _timeout,
                onComplete: ()=> { vars.input.enabled = !vars.input.enabled; vars.DEBUG ? console.log(`Input has been ${vars.input.enabled ? 'enabled': 'disabled'}`) : null; } // re-enable input
            })
        },

        highScoreTableButtonClick: (_gameObject)=> {
            let scoreCard = vars.game.scoreCard;
            switch (_gameObject.name) {
                case 'times_HSTB': // sort high score table by time
                    vars.containers.ignoreLoop=true; // interrupt looping if applicable
                    vars.containers.waitingTimeOut=0;
                    scoreCard.buildHighScorePages('time'); // sort HS table, build ui
                    scoreCard.switchVisible(); // and show it
                    return true;
                break;

                case 'scores_HSTB': // sort high score table by scores
                    vars.containers.ignoreLoop=true; // interrupt looping if applicable
                    vars.containers.waitingTimeOut=0;
                    scoreCard.buildHighScorePages('score'); // sort HS table, build ui
                    scoreCard.switchVisible(); // and show it
                    return true;
                break;

                case 'close_HSTB': // close the high score table
                    vars.DEBUG ? console.log(` >>> Closing High Score Table`) : null;

                    // pull the buttons back in 
                    let duration = 1;
                    if (vars.game.scoreCard.totalPages>1) {
                        vars.game.scoreCard.animatePreviousNextButton(false);
                        duration = 500;
                    };
                    
                    scene.tweens.addCounter({
                        from: 0, to: 1,
                        duration: duration,
                        onComplete: ()=> {
                            let cV = vars.containers;
                            // we can here from:   looping                    game play screen
                            if (cV.looping) { cV.ignoreLoop=false; } else { cV.showNGOnFail(true); };
                            scoreCard.showHSTableButtons(false);
                            scoreCard.showHSTableReplayButtons(false);
                            cV.show('highScoreTable', false);
                            // if we paused to get here we need to 
                            if (cV.pausedByUser) { cV.show('mainScreen', true);  cV.pausedByUser=false};
                        }
                    });
                    return true;
                break;

                case 'nextPage_HSTB': case 'previousPage_HSTB':
                    let newPage = _gameObject.name.startsWith('next') ? true : false;
                    scoreCard.showHighScorePage(newPage);
                break;

                default:
                    vars.DEBUG ? console.log(`HIGH SCORE TABLE BUTTON\n  There's no handler for button with name ${_gameObject.name}`) : null;
                    return false;
                break;
            }
        },

        newGameOptionClicked: (_gameObject)=> { // ON WINNING UI SHOWN AFTER HIGH SCORE TABLE IS HIDDEN
            vars.audio.playSound('buttonClick');
            let iV = vars.input;
            let buttonName = _gameObject.name.replace('NG_','').replace('_Button_ui','');
            switch (buttonName) {
                case 'CANCEL':
                    iV.enableInput(false,200);
                    vars.containers.show('NGoptions',false);
                    vars.containers.showNGOnFail(false);
                    return;
                break;

                case 'NEWDEAL':
                    // new deal clicked
                    iV.enableInput(false);
                    vars.containers.showNG(false);
                    vars.containers.showNGOnFail(false);
                    // start a new game
                    vars.game.restart();
                    return true;
                break;

                case 'HIGHSCORES':
                    iV.enableInput(false,200);
                    vars.game.scoreCard.showHighScoreTable(true);
                    vars.containers.showNGOnFail(false);
                    return true;
                break;

                case 'HOME':
                    iV.enableInput(false,200);
                    vars.containers.showNGOnFail(false);
                    vars.containers.startIntroLoop(true);
                    vars.UI.showMainScreen();
                    return true;
                break;

                case 'EXIT':
                    iV.enableInput(false,200); // this should really disable all input indefinitely as the exit button will call an android function to close the window
                    // possible TODO but will not make any difference as the game is exiting completely
                    console.log('Exiting game!\nGoodbye.');
                    return false;
                break;
            }

            vars.DEBUG ? console.log(`Button "${_gameObject.name}" has no handler!`) : null;
        },

        optionButtonClicked: (_buttonName)=> { // the option button was clicked. Note this can be called from several places, mainly mS though
            // _buttonName is passed but currently unused. Will be needed when options buttons on other screens are enabled
            let cV = vars.containers
            let uL = vars.game.unlockables;
            cV.show('optionsScreen',true);

            // figure out which container we should be showing
            let c = cV.getByName('optionsScreen');
            let h = c.getByName('unlockablesHeader');
            let showContainer = h.frame.name === 'unlockablesHeader' ? 'options' : 'unlocked';
            uL.showContainer(showContainer);
            
        },

        optionsClick: (_gameObject)=> {
            let name = _gameObject.name;
            if (name.startsWith('options_track')) { // music track button (play, on or off)
                name = name.replace('options_track','');
                let trackAndOption = name.split('_');
                let track = trackAndOption[0];
                let option = trackAndOption[1];
                vars.DEBUG ? console.table(`Track: ${track}. Currently: ${option}`) : null;
                
                vars.input.optionsClickMusic(_gameObject, track, option);

                return true;
            };

            if (name.includes('volume')) { // VOLUME BUTTON
                let direction = name.replace(/options_volume/,'');
                direction==='Up' ? vars.audio.volumeChange(true) : vars.audio.volumeChange(false);
                return true;
            };

            if (name==='options_close') { // CLOSE OPTIONS SCREEN BUTTON
                let cV = vars.containers;
                cV.show('optionsScreen',false);

                cV.pausedByUser=false;
                vars.game.unlockables.hideAllContainers();
                vars.music.playableRebuild();
                if (cV.looping) { cV.ignoreLoop=false; cV.show('mainScreen',true); }
                return true;
            };

            vars.DEBUG ? console.log(`${name} has no click handler!`) : null;
        },

        optionsClickMusic: (_object,_track,_option)=> { // MUSIC OPTIONS BUTTONS
            let mV = vars.music;
            if (_track==='All') { // ENABLE/DISABLE ALL
                if (_option==='off') {
                    let trackList = vars.localStorage.options.music;
                    // cache the current music list settings
                    mV.cached = {...trackList};
                    // and set all tracks to OFF
                    vars.DEBUG ? console.log(`Setting all tracks to off...`) : null;
                    vars.music.disableAll();
                } else if (_option==='on') {
                    // for each of the tracks, re-enable all music that was enabled before disabling All
                    let container = vars.containers.getByName('optionsScreen');
                    for (let _t in mV.cached) {
                        let yes = container.getByName(`options_${_t}_on`);
                        let no = container.getByName(`options_${_t}_off`);
                        if (mV.cached[_t]) {
                            yes.setAlpha(0); no.setAlpha(1);
                        } else {
                            yes.setAlpha(1); no.setAlpha(0);
                        };
                    };
                    mV.cached=null;
                };
                return true;
            }

            if (_option==='play') { // PLAY OR STOP THE SELECTED TRACK
                // is this button actually the stop track button?
                if (_object.frame.name==='stopTrackIcon') {
                    vars.DEBUG ? console.log(`Stopping track ${_track}`) : null;
                    vars.music.stopTrack();
                    vars.UI.swapMusicPlayButton(_object);
                    vars.update.updateTrackBar(true); // reset the track bar
                    return true;
                }
                
                vars.DEBUG ? console.log(`Playing track ${_track}`) : null;
                // change all frames to "play", in case theres another track currently playing
                vars.containers.getByName('optionsScreen').getAll().forEach((_o)=> {
                    if (_o.name.endsWith('_play')) {
                        _o.setFrame('playTrackIcon');
                    };
                });

                // stop any "currently playing" music
                mV.stopTrack();

                // set the new track to loop
                mV.loop=true;
                // start playing the new track
                mV.playTrack(`track${_track}`);

                // and swap the button
                vars.UI.swapMusicPlayButton(_object);

                return true;
            };

            if (_option === 'on') { // if the button we're clicking on is "on", we are turning this track off!
                vars.DEBUG ? console.log(`Disabling track ${_track}`) : null;
                vars.UI.swapMusicEnableButton(_track);
                return true;
            };

            if (_option === 'off') { // if the button we're clicking on is "off", we are turning this track on!
                vars.DEBUG ? console.log(`Enabling track ${_track}`) : null;
                vars.UI.swapMusicEnableButton(_track);
                return true;
            }

            vars.DEBUG ? console.log(`${_object.name} has no click handler`) : null;
        },

        switchVisibleUnlocksContainer: ()=> { // shortcut to unlockables class function
            vars.game.unlockables.switchVisibleContainer();
        }

    },

    mainScreen: {
        width: 553,
        height: 533,

        cardSuitParticlesUpdate: ()=> {
            let pV = vars.particles;
            if (!pV.cardSuitsEnabled) return false;

            if (pV.mainScreenSuitTimeout) { pV.mainScreenSuitTimeout--; return; }

            // if we get here, its time to swap the particles

            // first, reset the timeout
            pV.mainScreenSuitTimeout = pV.mainScreenSuitTimeoutMax;

            let currentEmitterIndex = pV.mainScreenSuitInt;
            // stop the current emitter
            pV.suitShapeEnable(false,currentEmitterIndex);

            // increment the index, or reset it back to 0
            currentEmitterIndex+1>pV.mainScreenSuits.length-1 ? pV.mainScreenSuitInt=0 : pV.mainScreenSuitInt++;

            // enable the next emitter
            pV.suitShapeEnable(true, pV.mainScreenSuitInt);
        }
    },

    music: {
        available: [],
        cached: null,
        enabled: false,
        loop: false,
        playing: null,
        optionScreenCurrentlyPlaying: [],

        init: ()=> {
            shuffle(vars.music.available);
        },

        disableAll: ()=> {
            [1,2,3,4,5,6,'All'].forEach((_track)=> {
                vars.UI.swapMusicEnableButton(_track,true);
            });
        },

        getNextTrack: ()=> {
            let mV = vars.music;
            if (!mV.enabled) return false;
            mV.playing=null;

            let amV = mV.available;

            let track = amV.shift();
            amV.push(track);

            vars.DEBUG ? console.log(`Playing ${track}`) : null;

            mV.playTrack(track);
        },

        playTrack: (_trackName)=> {
            let mV = vars.music;
            if (!mV.enabled || mV.playing) return false;

            let config = { loop: mV.loop };
            mV.playing = scene.sound.add(_trackName, config);

            let trackInt = ~~_trackName.replace('track','');

            if (!mV.loop) { mV.playing.on('complete', ()=> { vars.music.getNextTrack(); }); }
            mV.playing.play();

            // move the playing bar on the options screen
            let playerBar = scene.containers.optionsScreen.getByName('playingTrackBar');
            let maxWHY = playerBar.getData('maxWH');
            playerBar.y = maxWHY[2] + ((trackInt-1)*maxWHY[3]);
        },

        playableRebuild: ()=> {
            let mV = vars.music;

            // check to see if the track thats playing is disabled and stop it if it is
            let trackPlaying = mV.playing ? true:false;
            let musicOptions = vars.localStorage.options.music;
            let getNewTrack = false;
            if (trackPlaying) { // the playing track has been DISABLED! Stop it from playing
                if (!musicOptions[mV.playing.key]) {
                    mV.playing.stop();
                    getNewTrack = true;
                };
            } else { // there was no track playing
                if (mV.available.length) { // but there are others available
                    getNewTrack=true;
                };
            };

            if (getNewTrack && mV.available.length) {
                shuffle(mV.available);
                mV.enabled=true;
                mV.getNextTrack();
            } else {
                mV.enabled=false;
            };

            return true;
        },

        stopTrack: ()=> {
            if (!vars.music.playing) return false;

            let mV = vars.music;
            mV.playing.stop();
            mV.playing=null;
        },

        updateAvailableTracks: (_trackID,_enable)=> {
            let mV = vars.music;
            if (_enable) {
                mV.available.push(_trackID);
                return true;
            }

            // the every loop is new to me and still slightly confusing
            // it works like forEach, but only loops while "return"ing "true"
            // once you find the var youre looking for you return true again to quit the loop
            // Not very weird, just different :)
            // This is my replacement to setting found=false
            // then changing it to the index when found and splicing the index from the array
            // The reason to use it would be when searching large arrays
            // Generally my arrays hold no more than around 256 in length and hence are fast to iterate over all the way
            // but its unnecessary and can take time, especially if we do something mad like have an array with 100's of objects updated at 60fps
            mV.available.every((_t,_i)=> {
                if (_trackID===_t) {
                    mV.available.splice(_i,1);
                    return true; // we found the var and removed it from the array, exit the loop
                };
                return true; // keep looping through "available" until the above return is fired
            });

            return true;
        }
    },

    phaserObject: {
        mainScreen: {
            getRandomPoint: function (vec) {
                let x; let y; let pixel;
                let xyOffset = [205, 245];
                do {
                    x = Phaser.Math.Between(0, vars.mainScreen.width-1);
                    y = Phaser.Math.Between(0, vars.mainScreen.height-1);
                    pixel = scene.textures.getPixel(x, y, 'mainScreenMask');
                } while (pixel.alpha < 255);
                return vec.setTo(x+xyOffset[0],y+xyOffset[1]);
            }
        },
    },

    particles: {
        available: {},
        cardSuitsEnabled: false,
        currentlyRunning: 'mainScreen',
        mainScreenSuitInt: null, // if currentlyRunning = mainScreen, the suit particles are visible. vars.mainScreen deals with these particles
        mainScreenSuitTimeout: 209,
        mainScreenSuitTimeoutMax: 209, // the visible suit particle is only shown for [x/60] seconds at a time
        mainScreenSuits: [],
        outlines: {
            heartShape: [],
            clubShape: []
        },

        /* ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
           ┃   █  █   █  █  █████  ▄▀▀▀▄  ┃
           ┃   █  ██  █  █    █    █      ┃
           ┃   █  █ █ █  █    █     ▀■▄   ┃
           ┃   █  █  ██  █    █        █  ┃
           ┃   █  █   █  █    █    ▀▄▄▄▀  ┃
           ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ */
        init: ()=> {
            let pV = vars.particles;

            pV.cardSuitsInit();

            // now the actual particles
            pV.fiveHundredInit();
            pV.sparklesInit();
            pV.multiplierHighlightInit();

            // this is built if we are running on mobile as shaders are too GPU (CPU?) intensive
            //vars.isPhone ? pV.fireworksInit() : null;
        },

        clubShape: {
            //x: (x - (16 * Math.sin(tr) * Math.sin(tr) * Math.sin(tr))),
            //y: (y - ((13 * Math.cos(tr)) - (5 * Math.cos(2 * tr)) - (2 * Math.cos(3 * tr)) - Math.cos(4 * tr)))
            getPoints: function () {
                let coordinates = vars.particles.outlines.clubShape;
                let TWO_PI = Math.PI*2;
                let scale = 24;
                for (let a=0; a<TWO_PI; a+=0.03) {
                    let x = 16 * Math.pow(Math.sin(a),3) * scale;
                    let y = (13 * Math.cos(a) - 5*Math.cos(2*a) - 2*Math.cos(3*a) - Math.cos(4*a)) * scale;
                    coordinates.push(new Phaser.Geom.Point(x,y-50));
                };
                return coordinates;
            }
        },

        heartShape: {
            //x: (x - (16 * Math.sin(tr) * Math.sin(tr) * Math.sin(tr))),
            //y: (y - ((13 * Math.cos(tr)) - (5 * Math.cos(2 * tr)) - (2 * Math.cos(3 * tr)) - Math.cos(4 * tr)))
            getPoints: function () {
                let coordinates = vars.particles.outlines.heartShape;
                let TWO_PI = Math.PI*2;
                let scale = 24;
                for (let a=0; a<TWO_PI; a+=0.03) {
                    let x = 16 * Math.pow(Math.sin(a),3) * scale;
                    let y = -(13 * Math.cos(a) - 5*Math.cos(2*a) - 2*Math.cos(3*a) - Math.cos(4*a)) * scale;
                    coordinates.push(new Phaser.Geom.Point(x,y-50));
                };
                return coordinates;
            }
        },


        splashScreenCirclesCreate: ()=> { // only used on phones as rotating big images and fading them in is really slow
            let cC = consts.canvas;
            var particles = scene.add.particles('flares');
            vars.particles.available.splashScreenCircles = particles;

            let soykils = [];
            let radii = [cC.height*0.45,cC.height*0.6,cC.height*0.75];
            radii.forEach((_rad)=> { soykils.push(new Phaser.Geom.Circle(0, 0, _rad)); });

            soykils.forEach((_soical,_i)=> {
                let soykil = soykils[_i];
                particles.createEmitter({
                    frame: 'white',
                    x: cC.cX, y: cC.cY,
                    alpha: 0.2*(_i+1), scale: { start: 0.3, end: 0.1 },
                    lifespan: 250*(_i+1), quantity: 1,
                    blendMode: 'ADD', emitZone: { type: 'edge', source: soykil, quantity: 32+((_i+1)*16) }
                });
            });
        },

        cardSuitsInit: ()=> {
            let pV = vars.particles;
            pV.available.heartShape = scene.add.particles('flares').setDepth(consts.depths.mainScreen);

            let emitter = pV.available.heartShape.createEmitter({
                frame: 'white',
                tint: 0xff3000,
                lifespan: 2000,
                x: 1920/4, y: 1080/2,
                quantity: 1,
                alpha: { start: 0.5, end: 0 },
                scale: { start: 1, end: 0 },
                blendMode: 1,
                emitZone: { type: 'edge', source: vars.particles.heartShape, quantity: 100 }
            });
            emitter.name='hearts'; // even though emitters can be called by name, phaser hasnt got a .setName for emitters, coz FUKN phaser
            pV.mainScreenSuits.push('hearts');

            emitter = pV.available.heartShape.createEmitter({
                frame: 'white',
                tint: 0x222222,
                lifespan: 2000,
                x: 1920/4, y: 1080/2+50,
                quantity: 1,
                alpha: { start: 0.5, end: 0 },
                scale: { start: 0.9, end: 0 },
                emitZone: { type: 'edge', source: vars.particles.clubShape, quantity: 100 }
            });
            emitter.name='clubs';
            pV.mainScreenSuits.push('clubs');

            pV.suitShapeDisableAll();

        },

        fireworksInit: ()=> {
            let cC = consts.canvas;
            let v2 = Phaser.Math.Vector2;
            let p0 = new v2(cC.width*0.25, cC.height*0.8);
            let p1 = new v2(cC.width*0.25, cC.height*0.3);
            let p2 = new v2(cC.width*0.75, cC.height*0.3);
            let p3 = new v2(cC.width*0.75, cC.height*0.8);

            let curve = new Phaser.Curves.CubicBezier(p0, p1, p2, p3);

            let mult = vars.isPhone ? 2 : 1; // lower end phones need a multiplier of 2. better phones mult can be 1
            let max = 28 * (1/mult);
            let pt = [];

            for (let c=0; c<=max; c++) { let t = curve.getUtoTmapping(c / max); pt.push([curve.getPoint(t),curve.getTangent(t)]) };

            
            let sparks = scene.add.particles('flares');
            let pV = vars.particles;
            pV.available.fireworks = sparks;

            // build the emitters
            let tempVec = new v2();
            for (let i = 0; i < pt.length; i++) {
                let p = pt[i][0];
                tempVec.copy(pt[i][1]).normalizeRightHand().scale(-32).add(p);
                let angle = Phaser.Math.RadToDeg(Phaser.Math.Angle.BetweenPoints(p, tempVec));
                let particles = sparks;
                particles.createEmitter({
                    frame: i%2 ? 'red':'blue',
                    x: tempVec.x, y: tempVec.y,
                    angle: angle, scale: { start: 0.4*mult, end: 0.1 },
                    speed: { min: -100, max: 500 }, gravityY: 200, lifespan: 800, blendMode: 'SCREEN'
                });
            };

            pV.fireworksEnable(false); // disable the particles until needed
        },

        fiveHundredInit: ()=> {
            let pV = vars.particles;
            let particles = pV.available.fiveHundred = scene.add.particles('flares');
            particles.setDepth(consts.depths.fiveHundred); // we need to cook the particles, so when we display them theyre already in the shape of the 500

            particles.createEmitter({
                frame: 'white', //{ frames: [ 'fire1', 'fire2', 'fire3' ] },
                scale: { start: 0.8, end: 0 },
                tint: [0xff00,0xffff00,0xffffff],
                blendMode: 'ADD',
                alpha: { start: 0.33, end: 0 },
                gravityY: -90,
                quantity: 64,
                lifespan: 333,
                emitZone: { source: vars.paths.available.fiveHundred }
            });

            scene.tweens.addCounter({
                from: 0,
                to: 1,
                duration: 2000,
                onComplete: ()=> {
                    vars.particles.available.fiveHundred.emitters.list[0].pause();
                }
            });

            let container = vars.containers.getByName('fiveHundred');
            container.add(particles); // to easily tween the 500's size we need to add it to a container and modify its size

            container.setAlpha(0).setVisible(0);
        },

        fireworksEnable: (_enable=true)=> {
            let particles = vars.particles.available.fireworks;
            if (_enable) {
                particles.resume();
            } else {
                particles.pause(); // pause emitter
                particles.emitters.list.forEach((_e)=> { _e.killAll() }); // kill all particles
            }
        },

        fiveHundredShow: (_show=true)=> {
            let particles = vars.particles.available.fiveHundred;
            let emitter = particles.emitters.list[0];
            let container = vars.containers.getByName('fiveHundred');
            if (_show) {
                container.setVisible(true).setAlpha(1);
                emitter.resume();
            } else {
                container.setVisible(false).setAlpha(0);
                emitter.pause();
            }
        },

        multiplierHighlightInit: ()=> {
            let cC = consts.canvas;
            let circle = new Phaser.Geom.Circle(cC.cX-180, cC.height-216, 52);
            let pV = vars.particles;
            pV.available.multiplierHighlight = scene.add.particles('flares');

            pV.available.multiplierHighlight.createEmitter({
                frame: 'white',
                tint: 0xffffff, // this will change based on the current multiplier
                lifespan: 1000,
                scale: { start: 0.4, end: 0 },
                emitZone: { type: 'edge', source: circle, quantity: 60 },
                blendMode: 'ADD',
                active: false
            });
        },

        sparklesInit: ()=> {
            let pV = vars.particles;
            pV.available.letterSparkle = scene.add.particles('flares');

            pV.available.letterSparkle.createEmitter({
                x: 0, y: 0,
                frame: 'white',
                //tint: 0xff0000,
                quantity: 15, lifespan: 1000, gravityY: -1,
                scale: { start: 0, end: 0.25 },
                alpha: { start: 0.6, end: 0 },
                blendMode: 1,
                emitZone: { type: 'random', source: vars.phaserObject.mainScreen }
            });
            pV.available.letterSparkle.pause();
            pV.available.letterSparkle.emitters.list[0].killAll();
        },



        /* ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
           ┃    █   █  ▄▀▀▀▄  █  █   █    ┃
           ┃    ██ ██  █   █  █  ██  █    ┃
           ┃    █ █ █  █▀▀▀█  █  █ █ █    ┃
           ┃    █   █  █   █  █  █  ██    ┃
           ┃    █   █  █   █  █  █   █    ┃
           ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ */
        multiplierHighlightChangeColour: ()=> {
            let streak = vars.game.deck.currentStreak;
            if (!streak) return false;

            let mpHLC = consts.colours.multiplierHighlights[streak-1];
            let multiplierHighlight = vars.particles.available.multiplierHighlight;
            multiplierHighlight.emitters.list[0].setTint(mpHLC);
        },

        multiplierHighlightStart: (_start=true)=> {
            let emitter = vars.particles.available.multiplierHighlight.emitters.list[0];
            emitter.setVisible(_start);
            emitter.active=_start; // even though the particle can be setActive, you cant actually setActive the emitter.. coz fukn phaser
        },

        suitShapeDisableAll: ()=> {
            let pV = vars.particles;
            pV.available.heartShape.emitters.list.forEach((_e)=> {
                _e.killAll();
                _e.stop();
            });

            // reset the approp vars
            pV.cardSuitsEnabled = false;
            pV.mainScreenSuitTimeout = 1;

        },

        suitShapeEnable: (_enable=true, _emitter=null)=> { // initialised in UI.initMainScreen
            if (!vars.checkType(_emitter,'int')) return false; // we must have an emitter ID as any emitter could currently be running

            let pV = vars.particles;
            let emitters = pV.available.heartShape.emitters.list;
            let emitter = emitters[_emitter];
            if (_enable) {
                emitter.start();
                pV.mainScreenSuitInt = _emitter;
            } else {
                emitter.stop();
                pV.mainScreenSuitInt = null;
            };
        }
    },

    paths: {
        available: {
            clubs: null,
            spades: null,
            fiveHundred: null,
        },

        init: ()=> {
            let cC = consts.canvas;
            // http://127.0.0.1/phaser354-examples-master/public/edit.html?src=src\paths\path%20line%20and%20bezier.js

            let pV = vars.paths;
            pV.available.clubs = new Phaser.Curves.Path(cC.cX-100, cC.cY+100);
            pV.available.clubs.cubicBezierTo( cC.cX-100, cC.cY-100, cC.cX-350, cC.cY+200, cC.cX-350, cC.cY-200 ); // left clover
            pV.available.clubs.cubicBezierTo(cC.cX+100, cC.cY-100, cC.cX-200, cC.cY-350, cC.cX+200, cC.cY-350); // top clover
            pV.available.clubs.cubicBezierTo( cC.cX+100, cC.cY+100, cC.cX+350, cC.cY-200, cC.cX+350, cC.cY+200); // right clover
            pV.available.clubs.cubicBezierTo( cC.cX+50, cC.cY+250, cC.cX, cC.cY+50, cC.cX, cC.cY+150 ); // bottom right curve
            pV.available.clubs.lineTo(cC.cX-50, cC.cY+250); // joining line
            pV.available.clubs.cubicBezierTo( cC.cX-100, cC.cY+100, cC.cX, cC.cY+150, cC.cX, cC.cY+50 ); // bottom left curve


            pV.available.spades = new Phaser.Curves.Path(cC.cX-100, cC.cY+100);
            pV.available.spades.cubicBezierTo( cC.cX, cC.height*0.1, cC.cX-250, cC.cY+200, cC.cX-250, cC.cY-100 ); // left side
            pV.available.spades.cubicBezierTo( cC.cX+100, cC.cY+100, cC.cX+250, cC.cY-100, cC.cX+250, cC.cY+200); // right side
            pV.available.spades.cubicBezierTo( cC.cX+50, cC.cY+250, cC.cX, cC.cY+50, cC.cX, cC.cY+150 ); // bottom right curve
            pV.available.spades.lineTo(cC.cX-50, cC.cY+250);
            pV.available.spades.cubicBezierTo( cC.cX-100, cC.cY+100, cC.cX, cC.cY+150, cC.cX, cC.cY+50 ); // bottom left curve


            let offsetX = 150;
            pV.available.fiveHundred = new Phaser.Curves.Path(cC.width*0.39+offsetX, cC.cY-100);
            pV.available.fiveHundred.lineTo(cC.width*0.4-125+offsetX, cC.cY-100); // horizontal
            pV.available.fiveHundred.lineTo(cC.width*0.4-125+offsetX, cC.cY-20); // vertical
            pV.available.fiveHundred.ellipseTo(70, 70, -135, 135, false, 0); // lower curve of 5
            
            pV.available.fiveHundred.moveTo(cC.cX+140, cC.cY);
            pV.available.fiveHundred.ellipseTo(70,100); // first 0

            pV.available.fiveHundred.moveTo(cC.width*0.75-offsetX, cC.cY);
            pV.available.fiveHundred.ellipseTo(70,100); // second 0

            vars.graphics.init(); // initialise the background for the 'fiveHundred' particles
        }
    },

    scrollers: {
        available: {},
        msgFixes: {
            uk: [['tableau', 'table'], ['cent','penny'], ['$','£']],
            us: [['favourite','favorite'],['MMXXII','202203']]
        },

        init: ()=> {
            let sV = vars.scrollers;

            let msg = [
            'Welcome to Try Peax, the Tri Peaks Solitaire game with NO micro-transactions.',
            'Implementation by offer0 (MMXXII)',
            '',
            'Type of game: Patience.',
            '',
            'Rules:',
            `  The game starts with eighteen cards dealt face-down on the tableau to form three face-down "pyramids" of six cards each, and a row of ten cards beneath.`,
            `  The twenty-four remaining cards make up the stock. The first card from the stock is put in the waste pile (sometimes known as the foundation/discard).`,
            `  For a card in the tableau to be moved to the waste pile, it must be a rank higher or lower regardless of suit.`,
            `  This card becomes the new top card and the process is repeated several times (e.g. 9-10-J-Q-K-A-2-3-2-A-K-Q, etc.) until the sequence stops.`,
            `  Note the above sequence. Jacks are one rank higher than Tens, then Queens etc.`,
            `  If you have a King, you can roll over to an Ace, then Two etc.`,
            `  Same with Aces which can roll back to King, then Queen etc.`,
            `  Longer streaks give you more points per turned over card.`,
            `  Along the way, any face-down cards that are no longer overlapping are turned up.`,
            '',
            `  If the sequence is stopped, i.e. no card on the tableau can be put over the top card of the waste pile, a card is placed on the waste pile from the stock to see if it can start a new sequence.`,
            `  Cards are moved from the stock to the waste pile one at a time as long as it does not begin a new sequence with the cards on the tableau.`,
            `  The game is won if all three peaks are cleared before or after the last card from the stock is discarded to the waste pile. However, the game is lost if there are still cards that cannot be placed on the waste pile after the stock has run out.`,
            ``,
            `Apart from winning, the aim is to simply enjoy the relaxing nature of the game found in most solitaire/patience type games.`,
            `To add to the relaxing nature, you have six music tracks to choose from. Each of which can be enabled or disabled. Or simply loop your favourite track.`,
            `(Those tracks can be found on the options screen)`,
            ``,
            `As you play through the game you will be rewarded with "Unlock Points".`,
            `These can be used to unlock card sets, background tints etc.`,
            `(Unlockables can also be found in the options screen)`,
            ``,
            `As mentioned earlier, this game has no micro transactions, so unlock points cannot be bought for real money.`,
            `You will accrue them as you play, whether you win or lose a hand.`,
            `Once you have enough Unlock Points you can either outright buy card sets (500UPs), background tints (100UPs) etc.`,
            `Or if you prefer, you can spin for a random unlock for 250UPs.`,
            `It's entirely up to you. Unlock your favourite card set for 500UPs then roll every 250UPs and get a random unlock.`,
            ``,
            `This game is also available to buy on the Google/Android Marketplace`,
            `For $1.99 you will get the full game (as you have now), but you will be given infinite unlock points.`,
            `With those, you can unlock everything, unlock one thing at a time or just keep rolling for a random unlock when you're feeling lucky :)`,
            `With the full purchase, anytime the game is updated with new unlockables they will automatically be available to you.`,
            `This version does has adverts. But I will keep these to a minimum (once every 5 games). Watching an advert will automatically increase`,
            `the amount of unlock points you have by 100 :). Buying the game will remove all adverts.`,
            ``,
            `My only request, being a solo developer, is that`,
            `  - if you do actually like this game`,
            `  - and do play it often`,
            `  - and you think the $1.99 is fair price`,
            `then please buy a copy :)`,
            `It's more of a thanks than a gatekeeping situation as you can unlock everything without paying a cent.`,
            `I would be extremely grateful knowing that my game is fun enough for you to part with your hard-earned money.`,
            ``,
            `Thanks and enjoy, offer0.`

            //`TriPeaks can also be played with a wild card. This variation makes it easier to clear all three peaks. It is also possible to make all cards in the peaks face-up, this makes the game more thoughtful and strategic. It is also possible that the waste pile is empty so that one of the exposed cards can be chosen to go to the waste pile for a "head-start".`
            ];

            let msgFixes = sV.msgFixes;

            let currentLanguage = 'uk';

            // modify the message depending on country
            let msgText = msg.join('\n');
            msgFixes[currentLanguage].forEach((_swap)=> {
                msgText = msgText.split(_swap[0]);
                msgText = msgText.join(_swap[1]);
            });

            msg = msgText.split('\n');

            // generate the scroller
            let htmlC = consts.htmlColours;
            let textColours = [htmlC.blueLight,htmlC.blueDark];
            let bgData = { textBG: true, textBGColour: 0x0, fullScreenBG: true, fullScreenColour: 0x010101 };
            sV.available['Rules'] = new Scroller(1600,consts.canvas.height,msg,textColours,60,0,consts.depths.scroller, bgData);
        },

        findScrollerByInt: (_int=null)=> {
            let found = false;
            if (!vars.checkType(_int,'int')) return found;

            for (let avail in vars.scrollers.available) {
                if (vars.scrollers.available[avail].scrollerInt===_int && !found) {
                    found = vars.scrollers.available[avail];
                }
            }

            return found;
        }
    },

    shaders: {
        available: [],
        greyScales: { // contains a list of buttons in the format spriteName: { object: phaserObject }

        },
        fireworksRes: 1/8, // this is the resolution of the shader. Low end phones should be 0.1 -> high end PCs at 1 (=1/4*1080p -> 1*1080p)

        init: ()=> {
            vars.DEBUG ? console.log(`%cFN: shaders > init`, `${consts.console.defaults} ${consts.console.colours.functionCall}`) : null;

            let sV = vars.shaders;
            sV.fireworksRes = vars.isPhone ? 1/10 : 1/3;
            let res = sV.fireworksRes;
            let c = consts.canvas;
            scene.shaders = {};
            let shaderName = 'fireworks';
            scene.shaders[shaderName] = scene.add.shader(shaderName, c.cX,c.cY, c.width*res,c.height*res).setName(shaderName).setRenderToTexture(shaderName);
            sV.available.push(shaderName);
        },

        generateTextureFromFireworksShader: ()=> {
            let cC = consts.canvas;
            let res = 1/vars.shaders.fireworksRes;
            let fireworks = scene.add.image(cC.cX,cC.cY,'fireworks').setScale(res);
            return fireworks;
        },

        getGrayScalePipeLine: ()=> {
            return scene.plugins.get('rexgrayscalepipelineplugin');
        }
    },

    UI: {
        tempUIObjects: [],

        init: ()=> {
            vars.DEBUG ? console.log(`%cFN: ui > init`, `${consts.console.defaults} ${consts.console.colours.functionCall}`) : null;

            let cC = consts.canvas;
            scene.add.text(cC.width-10,cC.height-10, `User ID: ${vars.localStorage.options.userID}`, {}).setColor('#300000').setDepth(666).setOrigin(1,1).setAlpha(0.33).setColor('#0')

        },

        initDifficultyWarning: ()=> {
            let cC = consts.canvas;
            let cT = consts.tints;

            let container = vars.containers.getByName('difficultyWarning');

            let bg = scene.add.image(cC.cX,cC.cY,'whitePixel').setTint(0x0).setScale(cC.width, cC.height).setAlpha(0.85);
            let msg = 'Using this card set will\ngive you a 10% increase\nin score and Unlock Points!';
            let warningMessage = scene.add.bitmapText(cC.cX, cC.cY-55,'defaultFont',msg,96,1).setTint(cT.orange).setOrigin(0.5,0).setName('warningMessage');

            let difficultyRating = 'Difficulty Rating: HARD';
            let difficultyMessage = scene.add.bitmapText(cC.cX, cC.height*0.75-15,'defaultFont',difficultyRating,96,1).setName(`difficultyMessage`).setTint(cT.oranger).setOrigin(0.5,0).setAlpha(0);
            container.add([bg,warningMessage,difficultyMessage]);

            // "dont show again" button
            let button = scene.add.image(cC.width*0.3, cC.height-10,'ui','textBoxBigBG').setScale(0.66,0.85).setOrigin(0.5,1).setName('warn_dontShowAgain').setInteractive().setAlpha(0);
            let text = scene.add.bitmapText(cC.width*0.3, cC.height-25, 'defaultFontSmall', 'DONT\nSHOW\nAGAIN', 32,1).setName('warnT_dontShowAgain').setOrigin(0.5,1).setLetterSpacing(10).setTint(cT.oranger).setAlpha(0);
            container.add([button,text]);
            // OK button
            button = scene.add.image(cC.width*0.7, cC.height-10,'ui','textBoxBigBG').setScale(0.66,0.8).setOrigin(0.5,1).setName('warn_OK').setInteractive().setAlpha(0);
            text = scene.add.bitmapText(cC.width*0.7, cC.height-50, 'defaultFont', 'OK', 64,1).setOrigin(0.5,1).setName('warnT_OK').setLetterSpacing(10).setTint(cT.blueLight).setAlpha(0);
            container.add([button,text]);


            container.setAlpha(0).setVisible(false);
        },

        initGameScreen() {
            // main screen keyboard input has already been implemented!
            let cC = consts.canvas;
            let uiFS = consts.fontSizes.gameScreen; // UI Font Size
            let screenName = 'gamePlayingUI';
            let container = scene.groups[screenName];
            let bonusPointsContainer = scene.containers.bonusPoints;
            let depth = consts.depths.gameScreen;

            vars.input.pageButtons[screenName] = ['homeButton_ui']; // only the home button is available on the gameScreen, however, its accessed by hitting escape

            let bg = scene.add.image(cC.cX, cC.cY, 'gameBG').setName('game_bg').setTint(vars.gameScreen.tint).setDepth(depth-1);

            let tableOutline = scene.add.image(cC.cX, cC.cY, 'ui', 'tableOutline').setName('tableOutline').setDepth(depth-1);
            let orange = consts.tints.orange;
            let tableText       = scene.add.bitmapText(cC.cX, cC.height*0.65, 'defaultFontSmall', 'TABLE', 32,1).setName('tableText').setTint(orange).setOrigin(0.5).setDepth(depth);
            let stockText       = scene.add.bitmapText(cC.width*0.225, cC.height*0.95, 'defaultFontSmall', 'STOCK', 32,1).setName('stockText').setTint(orange).setOrigin(0.5).setDepth(depth);
            let foundationText  = scene.add.bitmapText(cC.cX, cC.height*0.95, 'defaultFontSmall', 'FOUNDATION', 32,1).setName('foundationText').setTint(orange).setOrigin(0.5).setDepth(depth);
            container.add([bg,tableOutline,tableText,stockText,foundationText]);

            // the foreground blacks out the main game playing area while its not visible
            // the reason its easier to use an image to cover everything is that there are several containers this covers
            // so instead of hiding every container, we just show this
            // we dont really do anything with the variable but im keeping it in case I dont need to do something to it
            let foreGround = scene.add.image(cC.cX, cC.cY, 'whitePixel').setName('game_fg').setScale(cC.width, cC.height).setTint(0).setDepth(consts.depths.foreground).setInteractive();
            let bonusTypeText  = scene.add.bitmapText(cC.cX, cC.height*0.6, 'defaultFont', 'BONUS POINTS FOR SCORE\n0', 78,1).setDropShadow(8,8).setName('bonusTypeText').setTint(orange).setOrigin(0.5).setDepth(depth+2).setAlpha(0).setVisible(false);
            bonusPointsContainer.add(bonusTypeText);


            // non button stuff
            let scoreText = scene.add.bitmapText(cC.width-20, 0, 'defaultFont', '0 - SCORE', 48).setOrigin(1,0).setName('scoreText').setDepth(depth);
            let timerText = scene.add.bitmapText(cC.width-20, 60, 'defaultFont', '0.0s - TIME', 48).setOrigin(1,0).setName('timerText').setDepth(depth);

            let x = cC.cX-180; let y = cC.height-160;
            let multiplierBG = scene.add.image(x, y, 'ui', 'bonusCoinBG').setName('bonusBG').setOrigin(0.5,1).setDepth(depth);
            let multiplierFG = scene.add.image(x, y-8, 'ui', 'bonusCoinFG').setName('bonusFG').setOrigin(0.5,1).setDepth(depth);
            let bonusText = scene.add.bitmapText(x, y+30, 'defaultFontSmall', 'Bonus\nMultiplier', 18,1).setName('bMText').setOrigin(0.5).setDepth(depth);
            container.add([multiplierBG,multiplierFG,bonusText]);
            vars.UI.updateMultiplier();

            // UNLOCK POINTS
            let unlockPoints = vars.game.unlockPoints>99999 ? '>99999' : vars.game.unlockPoints;
            let upCount = scene.add.bitmapText(cC.width-110, 0+150, 'defaultFont', unlockPoints, 48).setOrigin(1,0.5).setName(`playersUPCount`).setTint(0xFFBC00);
            let coinImage = scene.add.image(cC.width-55, 0+150,'coins','gold').setName('UIUPCoin');
            container.add([upCount, coinImage]);




            // UI BUTTONS
            // top left
            x = 60; y = 30;
            let tPad = 90; let nlPad = 160;

            let homeButton = scene.add.image(x, y,'ui','homeIcon').setName('homeButton_ui').setOrigin(0.5, 0).setInteractive().setData({interactive: true});
            let homeText = scene.add.bitmapText(x, y+tPad, 'defaultFontSmall', 'HOME', uiFS).setName('homeText').setOrigin(0.5).setDepth(depth);

            y+=nlPad;
            let optionsButton = scene.add.image(x,y,'ui','optionsIcon').setName('optionsButton_ui').setOrigin(0.5, 0).setInteractive().setData({interactive: true});
            let optionsText = scene.add.bitmapText(x, y+tPad, 'defaultFontSmall', 'OPTIONS', uiFS).setName('optionsText').setOrigin(0.5).setDepth(depth);

            y+=nlPad;
            let newGameButton = scene.add.image(x,y,'ui','newGameIcon').setName('newGameButton_ui').setOrigin(0.5, 0).setInteractive().setData({interactive: true});
            let newGameText = scene.add.bitmapText(x, y+tPad, 'defaultFontSmall', 'NEW GAME', uiFS).setName('newGameText').setOrigin(0.5).setDepth(depth);


            // bottom right
            let xyPad = 40;
            let quitButton = scene.add.image(cC.width-xyPad,cC.height-xyPad,'ui','quitIcon').setName('quitButton_ui').setOrigin(1, 1).setInteractive().setData({interactive: true});
            let quitText = scene.add.bitmapText(cC.width-xyPad-33,cC.height-20, 'defaultFontSmall', 'QUIT', uiFS).setName('quitText').setOrigin(0.5).setDepth(depth);

            let shareButton = scene.add.image(cC.width-180,cC.height-xyPad,'ui','shareIcon').setName('shareButton_ui').setOrigin(1, 1).setInteractive().setData({interactive: true});
            let shareText = scene.add.bitmapText(cC.width-xyPad-33-141,cC.height-20, 'defaultFontSmall', 'SHARE', uiFS).setName('shareText').setOrigin(0.5).setDepth(depth);

            container.add([scoreText, timerText, homeButton, optionsButton, homeText, optionsText, quitButton, quitText, shareButton, shareText, newGameButton, newGameText]);

            let group = vars.containers.getByName('gamePlayingUIButtons');
            group.addMultiple([foreGround,tableOutline,tableText,stockText,foundationText,shareText,shareButton,quitText,quitButton,newGameText,newGameButton,optionsButton,optionsText,homeButton,homeText,upCount,coinImage,scoreText,timerText,multiplierBG,multiplierFG,bonusText]);
        },

        initMainScreen: ()=> {
            vars.particles.init();
            let cC = consts.canvas;
            let pV = vars.particles;
            let screenName = 'mainScreen';
            let container = scene.containers[screenName];

            let iV = vars.input;
            let pageButtons = iV.pageButtons;
            pageButtons[screenName] = [];

            let depth = consts.depths.mainScreen;
            let unlocked = vars.localStorage.unlocked;
            let bg = scene.add.image(cC.cX, cC.cY, 'mainScreen', 'background').setAlpha(1).setDepth(depth-3);
            container.add(bg);
            // start the card suit particles
            vars.particles.suitShapeEnable(true, 0);

            let suitsP = vars.particles.available.heartShape;
            container.add(suitsP);
            
            let welcomeText = scene.add.image(cC.width*0.25, cC.cY, 'mainScreen', 'welcomeText').setTint(0xFFCC00).setName('welcomeText').setAlpha(0).setDepth(depth).setData({moving:true}); // the data is used to enable the sparkles
            let welcomeTextTweenDuration = 1000;
            let welcomeTextFadeTweenDuration = 500;
            // fade in welcome image
            scene.tweens.add({
                targets: welcomeText,
                alpha: 1,
                duration: welcomeTextFadeTweenDuration,
                onComplete: (_t,_o)=> {
                    // fade everything else in and start the loop timer
                    vars.containers.ignoreLoop=false;
                    let objects = vars.UI.tempUIObjects;
                    vars.UI.tempUIObjects = null;
                    scene.tweens.add({ targets: objects, alpha: 1, duration: 500 });
                }
            });
            // move the welcome image up
            scene.tweens.add({
                targets: welcomeText,
                y: welcomeText.y -30,
                delay: welcomeTextFadeTweenDuration,
                duration: welcomeTextTweenDuration,
                onComplete: (_t,_o)=> {
                    !vars.isPhone ? pV.available.letterSparkle.resume() : null;
                    vars.anims.startMainScreenUP(); // start the unlock points animation
                }
            });
            let versionTxt = `VERSION: ${vars.version.toString()}${vars.version<0.8 ? String.fromCharCode(945) : vars.version<1 ? String.fromCharCode(946) : ''} ${vars.revision}`;
            let versionText = scene.add.text(cC.width*0.25, cC.height *0.8,versionTxt, {fontSize: '24px'}).setTint(0x0).setOrigin(0.5).setName('versionText').setAlpha(1).setDepth(depth);

            // the MORE INFO BUTTON is available on several pages
            let moreInfoIcon = scene.add.image(cC.width*0.25, cC.height*0.875, 'ui', 'moreInfoIcon').setName('MS_moreInfoButton').setAlpha(0).setDepth(depth).setInteractive();
            pageButtons[screenName].push('MS_moreInfoButton');
            container.add(moreInfoIcon);
            vars.UI.tempUIObjects.push(moreInfoIcon);

            // move the version text and more info icon down
            scene.tweens.add({
                targets: [versionText,moreInfoIcon],
                y: "+=50",
                duration: welcomeTextTweenDuration
            });

            

            let upCount = scene.add.bitmapText(650, cC.height*0.775, 'defaultFont', `0 Unlock Points`,48).setLetterSpacing(4).setOrigin(1,0.5).setName(`playersUPCountMainScreen`).setTint(0xFFBC00).setAlpha(0).setDropShadow(4,4);
            // upCount is increased to current points using a tween counter (called after anim.startMainScreenUp which animates the UP coin image and UP count text object)


            
            let rightSide = scene.add.image(cC.width*0.75, cC.cY, 'mainScreen', 'rightSide').setAlpha(0).setDepth(depth-2);
            vars.UI.tempUIObjects.push(rightSide);
            container.add([welcomeText, rightSide]);

            let y = cC.cY-50;
            let bot = vars.localStorage.unlocked;
            let buttons = ['newGame','hiScores','options', 'buy'];
            buttons.forEach((_key)=> {
                let buttonBG = scene.add.image(cC.width*0.75, y, 'mainScreen', 'buttonBG').setName(`MS_${_key}`).setAlpha(0).setDepth(depth-1);
                if (_key==='buy') {
                    if (!bot) {
                        buttonBG.setInteractive();
                    };
                } else {
                    buttonBG.setInteractive();
                };
                pageButtons[screenName].push(`MS_${_key}`);
                vars.UI.tempUIObjects.push(buttonBG);

                let buttonText;
                if (_key==='buy' && vars.localStorage.unlocked) {
                    buttonText = scene.add.image(cC.width*0.75, y, 'mainScreen', `boughtText`).setName(`MST_boughtText`).setAlpha(0).setDepth(depth);
                    vars.shaders.getGrayScalePipeLine().add(buttonText, { intensity: 1 });
                } else {
                    buttonText = scene.add.image(cC.width*0.75, y, 'mainScreen', `${_key}Text`).setName(`MST_${_key}Text`).setAlpha(0).setDepth(depth);
                };
                vars.UI.tempUIObjects.push(buttonText);
                
                container.add([buttonBG,buttonText]);
                y+=buttonBG.height+10;
            });
            
            let coinImage = scene.add.image(cC.width*0.25, cC.height*0.775,'coins','gold').setName('UIUPCoinMainScreen').setAlpha(0);

            pV.available.letterSparkle.setDepth(depth+1);
            container.add([versionText,pV.available.letterSparkle,upCount,coinImage]);


            vars.containers.current='mainScreen';

            if (vars.localStorage.dailyBonusGiven) { // the daily bonus for logging in was given, show a pop up
                let container = scene.add.container().setName(`dailyBonus`);
                container.setAlpha(0).setDepth(consts.depths.dailyBonus);
                let bg = scene.add.image(cC.cX,cC.cY,'whitepixel').setScale(cC.width,cC.height).setTint(0x0).setAlpha(0.9).setName('dailyBonusBG').setInteractive();
                let bonusImage = scene.add.image(cC.cX,cC.cY,'dailyBonusImage');
                let bonusText = scene.add.bitmapText(cC.cX,cC.cY,'defaultFont','250 UPs',128,1).setDropShadow(6,6).setName(`bonusTextBouncing`).setOrigin(0.5).setTint(consts.tints.orange);

                container.add([bg,bonusImage,bonusText]);

                vars.input.enableInput(false);

                // TWEENS
                scene.tweens.add({ targets: container, alpha: 1, duration: 500, onComplete: ()=> { vars.input.enableInput(true); } }); // fade container in
                scene.tweens.add({
                    targets: bonusText, scale: 1.5,
                    duration: 1500,
                    repeat: -1, yoyo: true,
                    ease: 'Bounce'
                });

                // INPUT (CLICK HANDLER FOR BG)
                bg.on('pointerup', ()=> {
                    let container = scene.children.getByName('dailyBonus');
                    // kill the dailyBonus tween
                    let bounceText = container.getByName(`bonusTextBouncing`);
                    scene.tweens.getTweensOf(bounceText)[0].stop();

                    container.destroy(); // destroy daily bonus container

                    // reset the vars and begin main screen loop
                    vars.localStorage.dailyBonusGiven = null;
                    vars.UI.beginMainScreenLoop();
                    return true;
                });
            } else {
                vars.UI.beginMainScreenLoop();
            };

            vars.input.cursor.quickShow(true); // quick show the cursor (itll time out after a few seconds if were on a phone. Note: I dont auto hide it as I currently test isPhone on a PC)
            
        },

        initNewDealScreen: ()=> {
            let cC = consts.canvas;
            let screenName = 'NGoptions';
            let container = scene.containers[screenName];
            let depth = consts.depths.newDealScreen;
            let bg = scene.add.image(cC.cX, cC.cY, 'whitePixel').setScale(cC.width, cC.height).setTint(0x0).setAlpha(0.9).setDepth(depth);
            container.add(bg);

            // set up page buttons
            let iV = vars.input;
            let pageButtons = iV.pageButtons;
            pageButtons[screenName] = [];

            let x = cC.cX;
            let yOff = 250;
            let y = cC.cY - yOff/2;
            let uiFS = 48;
            let tint = consts.tints.orange;
            ['NEW DEAL', 'CANCEL'].forEach( (_o)=> {
                let name = _o.replace(/ /, '');
                let textBG = scene.add.image(x,y, 'ui', 'textBoxBigBG').setName(`NG_${name}_Button_ui`).setDepth(depth).setInteractive();
                pageButtons[screenName].push(`NG_${name}_Button_ui`);
                let textText = scene.add.bitmapText(x,y, 'defaultFont', _o, uiFS).setName(`NG_${name}_Text`).setOrigin(0.5).setDepth(depth+1).setTint(tint);
                container.add([textBG, textText]);
                y+=yOff;
            });
        },

        initOptionsScreen: ()=> {
            // get the loaded options
            let mO = vars.localStorage.options.music;
            let screenName = 'optionsScreen';
            let container = scene.containers[screenName];

            // set up page buttons
            let iV = vars.input;
            let pageButtons = iV.pageButtons;
            pageButtons[screenName] = [];

            let cC = consts.canvas;
            let optionsBG = scene.add.image(cC.cX,cC.cY,'optionsBG').setName(screenName);

            container.add(optionsBG);

            // HEADERS
            let optionsHeader = scene.add.image(330,170,'ui','optionsHeader');
            let unlockablesHeader = scene.add.image(665,155,'ui','unlockablesHeader').setName('unlockablesHeader').setOrigin(0,0.5).setInteractive();
            unlockablesHeader.on('pointerup', vars.input.switchVisibleUnlocksContainer);

            let unlockPoints = vars.game.unlockPoints>99999 ? '>99999' : vars.game.unlockPoints;
            let upCount = scene.add.bitmapText(cC.width-315, 155, 'defaultFont', unlockPoints, 48).setOrigin(1,0.5).setName(`optionsScreenUPCount`).setTint(0xFFBC00);
            let coinImage = scene.add.image(cC.width-275, 155,'coins','gold').setName('UIOUPCoin').setScale(0.75);

            let musicHeader = scene.add.image(315,400,'ui','musicHeader');
            container.add([optionsHeader,unlockablesHeader,musicHeader,upCount,coinImage]);

            // MUSIC TRACKS SECTION
            let x = 530; let y = 510;
            let yInc = 90;
            let enabled = [];
            // create a new group to hold the on off buttons
            let group = scene.groups.musicTrackYesNos = scene.add.group().setName('musicTrackYesNos'); // DONT THINK I USE THIS ANY MORE TODO ?
            for (let t=0; t<6; t++) {
                let alphaYes = mO[`track${t+1}`] ? 1 : 0;
                let alphaNo = alphaYes ? 0 : 1;
                let pButtonName = `options_track${t+1}_play`;
                let play = scene.add.image(x-396, y + t*yInc, 'ui', 'playTrackIcon').setAlpha(1).setName(pButtonName).setInteractive();
                pageButtons[screenName].push(pButtonName);
                let trackText = scene.add.image(x-205, y + t*yInc, 'ui', `track${t+1}Header`).setName(`options_track${t+1}_header`);
                let off = scene.add.image(x, y + (t*yInc),'ui','noIcon').setAlpha(alphaNo).setName(`options_track${t+1}_off`).setInteractive();
                let on = scene.add.image(x, y + (t*yInc),'ui','yesIcon').setAlpha(alphaYes).setName(`options_track${t+1}_on`).setInteractive();
                // we only add one of these buttons
                pageButtons[screenName].push(`options_track${t+1}_on`);
                group.addMultiple([off,on]);
                container.add([play,off,on,trackText]);
                alphaYes ? enabled.push(t+1) : null;
            };

            /* let alphaYes=0; let alphaNo=1;
            if (!enabled.length) {
                alphaYes=0; alphaNo=1;
            };
            // These 2 buttons are for enabling and disabling all music
            let off = scene.add.image(x, y -105,'ui','noIcon').setAlpha(alphaNo).setName(`options_trackAll_off`).setInteractive();
            let on = scene.add.image(x, y-105,'ui','yesIcon').setAlpha(alphaYes).setName(`options_trackAll_on`).setInteractive();
            container.add([off,on]); */

            // VOLUME OPTIONS
            x=260; y=279;
            let bg = scene.add.image(x, y, 'ui', 'volumeBG').setOrigin(0,0.5);
            let fg = scene.add.image(x+14, y, 'ui', 'volumeFG').setName('volumeBar').setOrigin(0,0.5);
            let volUp = scene.add.image(x-50,y,'ui','volumeDownIcon').setName('options_volumeDown').setInteractive();
            let volDown = scene.add.image(x+270,y,'ui','volumeUpIcon').setName('options_volumeUp').setInteractive();
            container.add([bg,fg,volUp,volDown]);

            // PLAY BAR FOR CURRENT TRACK
            y=535;
            let playingBar = scene.add.image(225,y,'ui','volumeFG').setOrigin(0).setName('playingTrackBar').setScale(1,0.5);
            let wh = [playingBar.width,playingBar.height,y,yInc];
            playingBar.setData({ maxWH: wh }); // set max's before cropping
            playingBar.setCrop(0,0,0,wh[1]); // crop it back to 0 px wide
            container.add(playingBar);

            // FAR RIGHT OPTION BUTTONS
            let unlockSwapButton = scene.add.image(cC.width-10,125,'ui','optLockedButton').setOrigin(1,0).setName('unlockablesHeader_button').setInteractive(); // we add this button after the play/on/off buttons
            pageButtons[screenName].push('unlockablesHeader_button');
            unlockSwapButton.on('pointerup', vars.input.switchVisibleUnlocksContainer);
            let close = scene.add.image(cC.width-10, cC.height-55, 'ui', 'optExitButton').setOrigin(1,1).setName('options_close').setInteractive();
            pageButtons[screenName].push('options_close');
            container.add([close,unlockSwapButton]);

            // update this container to show current volume
            vars.UI.updateVolume();
        },

        initPlayerLose: ()=> { // this is shown when the player has ran out of playable cards
            let cC = consts.canvas;
            let screenName = 'playerLose';
            let container = scene.containers[screenName];
            let depth = consts.depths.playerLose;
            let bg = scene.add.image(cC.cX, cC.cY, 'whitePixel').setScale(cC.width, cC.height).setTint(0x0).setAlpha(0.9).setDepth(depth);
            container.add(bg);

            let iV = vars.input;
            let pageButtons = iV.pageButtons;
            pageButtons[screenName] = [];

            let options = ['HOME', 'NEW DEAL', 'HIGH SCORES', 'EXIT'];
            let x = cC.cX;
            let yOff = 1/options.length*cC.height;
            let y = yOff-140;
            let uiFS = 48;
            let tint = consts.tints.orange;
            options.forEach( (_o)=> {
                let name = _o.replace(/ /, '');
                let textBG = scene.add.image(x,y, 'ui', 'textBoxBigBG').setName(`NG_${name}_Button_ui`).setDepth(depth).setInteractive();
                pageButtons[screenName].push(`NG_${name}_Button_ui`);
                let textText = scene.add.bitmapText(x,y, 'defaultFont', _o, uiFS).setName(`NG_${name}_Text`).setOrigin(0.5).setDepth(depth+1).setTint(tint);
                container.add([textBG, textText]);
                y+=yOff;
            });
        },

        initWellDone: null, // well done is built every time. see buildWellDone, below



        // DIFFICULY WARNING FUNCTIONS
        showDifficultyWarning: (_show=true)=> { // initial function which adds cards and shows diff warning
            _show ? vars.input.enableInput(false) : vars.input.enableInput(false,200);
            let cV = vars.containers;
            cV.show('difficultyWarning',_show);
            cV.show('difficultyWarningCardSet',_show);

            _show ? vars.UI.addCardSetToDifficultyWarning() : vars.UI.removeCardsFromDifficultyWarning();
            // the animation to type the messages is called after the cards have been shown
        },
        addCardSetToDifficultyWarning: ()=> {
            let container = vars.containers.getByName('difficultyWarningCardSet');
            let x = 82; let xInc=132; let y = 20;

            let cardNumber = 0;
            ['C','D','S','H'].forEach((_suit)=> {
                ['A',2,3,4,5,6,7,8,9,10,'J','Q','K'].forEach((_value)=> {
                    let card = scene.add.image(x,y,'cards',`${_value}${_suit}`).setOrigin(0).setAlpha(1);
                    container.add(card);
                    x+=xInc; cardNumber++;
                });
                x=82; y+=70;
            });

            // this functions is called with the express function to pre populate the page before showing it.. ie show it
            vars.UI.typeWarningText();
        },
        removeCardsFromDifficultyWarning: ()=> { // when called we are destroying everything in the card set container as well as resetting some alphas
            let cV = vars.containers;
            let container = cV.getByName('difficultyWarningCardSet');
            container.getAll().forEach((_c)=> { _c.destroy(); });

            container = cV.getByName('difficultyWarning');
            ['difficultyMessage','warn_dontShowAgain','warnT_dontShowAgain','warn_OK','warnT_OK'].forEach((_o)=> { container.getByName(_o).setAlpha(0); });
        },
        typeWarningText: ()=> {
            let container = vars.containers.getByName('difficultyWarning');

            let wM = container.getByName('warningMessage'); // get the object
            let wMText = wM.text.split(''); // the text of the object
            wM.text=''; // empty out the message

            // and redraw each characters one by one
            let delay = 0; let delayPerCharacter=50; // 20 characters per second
            while (wMText.length) {
                let letter = wMText.shift();
                scene.tweens.addCounter({
                    from: 0, to: 1, delay: delay, duration: 50,
                    onComplete: ()=> { wM.setText(`${wM.text}${letter}`); letter!==' ' ? vars.audio.playSound('letterShow'):null; } // push the letter back into the text object
                });
                delay+=delayPerCharacter;
            };

            // after the text has been typed, fade in the difficulty text
            let difficultyMessage = container.getByName('difficultyMessage');
            let DSA = container.getByName('warn_dontShowAgain');
            let DSAT = container.getByName('warnT_dontShowAgain');
            let OK = container.getByName('warn_OK');
            let OKT = container.getByName('warnT_OK');
            scene.tweens.add({
                targets: [difficultyMessage, DSA, DSAT, OK, OKT],
                alpha: 1, delay: delay, duration: 1000,
                onComplete: ()=> { vars.input.enableInput(true); }
            })
        },
        // END OF DIFFICULTY WARNING FUNCTIONS



        beginMainScreenLoop: ()=> {
            // start looping & enable card suit particles
            vars.containers.looping=true;
            vars.particles.cardSuitsEnabled=true;
            
            vars.input.enableInput(true);
        },

        buildSplashScreen: ()=> {
            let container = scene.containers.splashScreen;
            vars.audio.playSound('logoSound');
            let depth = consts.depths.slashScreen;
            let cC = consts.canvas;
            let bg = scene.add.image(cC.cX, cC.cY, 'logoScreen', 'background').setDepth(depth-1);
            container.add(bg);

            if (vars.isPhone) { // this is a phone, use particles
                vars.particles.splashScreenCirclesCreate();
                container.add(vars.particles.available.splashScreenCircles);
            } else { // not a phone, use rotating images
                let circles = [];
                [100,90,80].forEach((_scale)=> {
                    let circle = scene.add.image(cC.cX, cC.cY, 'logoScreen', 'outerCircle').setDepth(depth).setScale(_scale/100);
                    container.add(circle);
                    circles.push(circle);
                });
                
                // 3 outer circles
                // initial angle of centre rotator
                let angle = getRandom(0,35)*10;
                let innerRotator = scene.add.image(cC.cX, cC.cY, 'logoScreen', 'rotatorCentre').setDepth(depth).setAngle(angle);
                container.add(innerRotator);
                // tween the fuck outta the circles n shiz
                scene.tweens.add({ targets: [circles[0], circles[2]], angle: '+=20', duration: 3900 });
                scene.tweens.add({ targets: [circles[1],innerRotator], angle: '-=20', duration: 3900 });
            };
            
            let logoInner = scene.add.image(cC.cX, cC.cY+60, 'logoScreen', 'ogsInner').setDepth(depth+2);
            let angle = getRandom(0,35)*10;
            let logoOuter = scene.add.image(cC.cX, cC.cY-6, 'logoScreen', 'ogsOuter').setDepth(depth+1).setAngle(angle);

            container.add([logoInner,logoOuter]);

            // outer part of the logo
            scene.tweens.add({ targets: logoOuter, angle: '-=20', duration: 3900 });

            // tween the container in, hold then fade out
            scene.tweens.add({
                targets: container,
                alpha: 1,
                duration: 1000, hold: 2000, yoyo: true,
                onComplete: (_t,_o)=> { _o[0].destroy(); vars.init('GAMESCREENS'); }
            });
        },

        buildWellDone: ()=> {
            let cC = consts.canvas;
            let container = scene.containers.wellDone;
            let depth = consts.depths.wellDone;
            let bg = scene.add.image(cC.cX, cC.cY, 'whitePixel').setScale(cC.width, cC.height).setTint(0x0).setAlpha(0.95).setDepth(depth-2);
            container.add(bg);

            let stars = scene.add.image(cC.cX, cC.height*0.1, 'ui', 'winStars').setName('stars').setDepth(depth);
            scene.tweens.add({
                targets: stars,
                y: cC.height*0.25,
                scale: 2,
                duration: 1000,
                repeat: -1,
                yoyo: true,
                ease: 'Bounce.easeOut'
            });

            let wellDoneText = scene.add.bitmapText(cC.cX, cC.cY, 'defaultFont', 'Well Done!', 64).setOrigin(0.5).setName('wellDoneText').setDropShadow(6,6).setDepth(depth).setAlpha(0).setLetterSpacing(20);
            scene.tweens.add({
                targets: wellDoneText,
                y: cC.height*0.4,
                scale: 1.5,
                duration: 2000,
                ease: 'Quad.easeInOut',
                onComplete: ()=> {
                    vars.UI.wellDoneShowScore();
                }
            });
            scene.tweens.add({
                targets: wellDoneText,
                alpha: 1,
                duration: 500,
                ease: 'Quad.easeInOut',
            });

            // the particles (below) have been replaced with a fireworks shader
            let res = 1/vars.shaders.fireworksRes;
            let fireworks = scene.add.image(cC.cX,cC.cY,'fireworks').setScale(res).setDepth(depth-1);
            container.add([fireworks,stars,wellDoneText]);

            // show the container
            vars.containers.show('wellDone',true);

            // NOTE: the BUTTON for this page is in wellDoneShowContinueButton

        },

        destroyAllCards() {
            ['cardCurrent', 'cardsDealt', 'cardsLeft'].forEach((_container)=> {
                vars.containers.empty(_container);
            });
            vars.game.deal = null;
            vars.game.deck = null;
        },

        displayUnlock(_t,_v,_pV) {
            console.log(`Displaying unlock ${_pV.name}`);
            vars.game.unlockables.displayUnlock(_pV);
        },

        hideGamePlayingUI: ()=> { // used when switching tints as well as AI
            let group = scene.groups.gamePlayingUIButtons;
        },

        increaseUPCount: ()=> { // first time entering here the _type is "score"
            let gV = vars.game;
            let uPD = gV.unlockPointData;
            let bonusContainer = vars.containers.getByName('bonusPoints');
            bonusContainer.setAlpha(1).setVisible(true); // show bonus container

            let _type;
            if (JSON.stringify(uPD.scoreCoins)!=='[0,0]') { // score coins still exist
                bonusContainer.getByName('bonusTypeText').setAlpha(1).setVisible(true);
                _type='score';
            } else if (JSON.stringify(uPD.timeCoins)!='[0,0]') { // time coins still exist
                _type='time';
            } else { // all score AND time coins counted. This is the EXIT function!
                // reset the UPData
                gV.resetUPData();
                bonusContainer.setAlpha(0).setVisible(false); // hide the bonus container
                bonusContainer.getByName('bonusTypeText').setAlpha(0).setVisible(false); // hide the  bonusTypeText
                // update the ui's UP count (it updates a couple of things so we just call the function that updates them all, even though one is currently corrent)
                vars.game.unlockables.updateUIUnlockPoints();

                if (gV.deal.win) { // player won the game, do windance
                    new winDance();
                } else { // player lost the game, show
                    vars.containers.showNGOnFail(true);
                };
                return true;
            };

            // if we get here there are coins to show
            // get the coins for this type (score/time)
            let coinType = `${_type}Coins`;
            let coins = uPD[coinType];
            vars.DEBUG ? console.log({ type: _type, coins: coins}) : null;

            // grab the UP UI text object and coin image
            let container = vars.containers.getByName('gamePlayingUI');
            let currentUP = container.getByName('playersUPCount');
            let uiCoin = container.getByName('UIUPCoin');

            if (_type!=='score') { // grab the Bonus Text and change the type
                bonusContainer.getByName('bonusTypeText').setText(`BONUS POINTS FOR TIME\n${uPD.timePoints}`);
            } else { // type is score, ie this is the first time in here
                let bTT = bonusContainer.getByName('bonusTypeText');
                bTT.setAlpha(1).setVisible(true);
            };


            let delay=250; let moveDelay=250; let bronzeDelay=0;
            let duration = 750;
            let coinWorth = [10,1];
            let startXY = [consts.canvas.cX, consts.canvas.cY];
            let endXY = [uiCoin.x, uiCoin.y];

            let bC = vars.containers.getByName('bonusPoints');
            coins.forEach((_cC,_cI)=> {
                for (let c=0; c<_cC; c++) {
                    // add the coin image to the screen
                    let coinFrame = !_cI ? 'silver' : 'bronze'; // with this, we can show the coin being added
                    let depth = consts.depths[`coins_${coinFrame}`];
                    let coinObject = scene.add.image(startXY[0],startXY[1],'coins',coinFrame).setAlpha(0).setDepth(depth);
                    bC.add(coinObject);
                    let coinPoints = coinWorth[_cI];
                    
                    let thisDelay = c*delay;
                    vars.DEBUG ? console.log(`${coinFrame} coin ${c+1} for ${_type} created. Delay: ${thisDelay}`) : null;

                    // fade the coin in
                    scene.tweens.add({
                        targets: coinObject,
                        alpha: 1,
                        delay: thisDelay+bronzeDelay,
                        duration: duration/3, // duration is 750/3 = 250ms
                        onStart: ()=> {
                            let bText = vars.containers.getByName('bonusPoints').getByName('bonusTypeText');
                            let txt = bText.text.split('\n'); // split the text line
                            let points = ~~txt[1]; // set points to array[1]
                            txt[1]=points-coinPoints; // update the array with the new UP count
                            bText.setText(txt.join('\n')); // join it back together again and update the object
                        }
                    });
                    // send coin to where the the other UI coin is in the (currently) top corner
                    scene.tweens.add({
                        targets: coinObject,
                        x: endXY[0],
                        y: endXY[1],
                        duration: duration,
                        delay: thisDelay+moveDelay+bronzeDelay, // bronze delay is 0 until we have a final GOLD coin
                        onComplete: (_t,_o)=> {
                            _o[0].destroy();
                            vars.audio.playSound('coin');
                            currentUP.setText(~~currentUP.text+coinPoints); // update the UIs user points
                            if (c+1===_cC && !_cI && !uPD[coinType][1])  { // last (c+1=_cC) silver(_cI=0) coin and no bronze (uPD[coinType][1]=0) coins
                                if  (_type==='time') { // there are no coins after this set of silvers (time limit bonus)!
                                    uPD[coinType] = [0,0];
                                    vars.UI.increaseUPCount(); // re-request this function, which tests if any coins are left to add
                                } else {
                                    uPD[coinType] = [0,0];
                                    vars.UI.increaseUPCount(); // re-request this function, which tests if any coins are left to add
                                };
                            };

                            if (c+1===_cC && _cI)  { // last bronze coin
                                // empty this set of coins
                                uPD[coinType] = [0,0];
                                vars.UI.increaseUPCount(); // re-request this function, which tests if any coins are left to add
                            }; 
                        }
                    });
                    if (c+1===_cC && !_cI) { bronzeDelay = thisDelay+duration; }; // last GOLD coin
                };
            });


        },

        mainScreenFadeIn: ()=> {

        },

        newMessage: (_msg=null, _x=-1, _y=-1, _delay=0, _duration=1000, _fontSize=64, _tint=0xffffff)=> {
            if (!_msg) return false;

            if (_x===-1 || !_x) _x = consts.canvas.cX;
            if (_y===-1 || !_y) _y = consts.canvas.cY;
            if (!_duration) _duration=1000;

            let font = !_fontSize || _fontSize<=32 ? 'defaultFontSmall' : 'defaultFont';

            let popup = scene.add.bitmapText(_x, _y, font, _msg, _fontSize).setOrigin(0.5).setLetterSpacing(10).setDropShadow(8,8).setTint(_tint).setDepth(255);
            scene.tweens.add({
                targets: popup,
                y: 0,
                alpha: 0,
                duration: _duration,
                delay: _delay,
                onComplete: (_t,_o)=> {
                    _o[0].destroy();
                }
            })
        },

        showCardSpread: ()=> { // this function runs after the card set has loaded. it also display the warning if card set isnt OS or SOS
            let angles = []; let yPush = [];
            for (let angle = -Math.PI/4; angle<=Math.PI/4; angle+=Math.PI/2/52) {
                angles.push(angle);
                yPush.push(Math.cos(angle));
            };

            
            let allCardArray = [];
            ['H','C','D','S'].forEach((_suit)=> {
                for (let i=1;i<14;i++) {
                    let num = i===1 ? 'A' : i===11 ? 'J' : i===12 ? 'Q' : i===13 ? 'K' : i;
                    allCardArray.push(`${num}${_suit}`);
                }
            });
            allCardArray.push('00'); // the back of the cards

            // DO THE CARD SPREAD... WEET WEEEOOO etc
            let cC = consts.canvas;
            let cardSpreadContainer = vars.containers.getByName('unlockedCardSpread');
            cardSpreadContainer.setAlpha(1).setVisible(true);
            let bg = scene.add.image(cC.cX, cC.cY, 'whitePixel').setTint(0x0).setAlpha(0.8).setScale(cC.width,cC.height);
            cardSpreadContainer.add(bg);

            let x = 450; let xInc=20;
            let y = 1040; let yMax=640;
            let delay = 0; let delayInc=50;
            allCardArray.forEach((_frame,_cardNumber)=> { // for every card in the card set
                let cardImage = scene.add.image(x,y-(yPush[_cardNumber]*yMax),'cards',_frame).setName(`spread_${_frame}`).setRotation(angles[_cardNumber]).setDepth(_cardNumber).setAlpha(0);
                scene.tweens.add({ // fade the _cardNumber-th card in
                    targets: cardImage,
                    alpha: 1,
                    delay: delay,
                    duration: delayInc,
                    hold: (52-_cardNumber)*delayInc,
                    onStart: ()=> { vars.audio.playSound('cardLeftTurn'); },
                    onComplete: (_t,_o)=> { // fade the card back out
                        scene.tweens.add({
                            targets: _o[0],
                            alpha: 0,
                            delay: (72-_o[0].depth)*50,
                            duration: 50,
                            onStart: ()=> { vars.audio.playSound('cardLeftTurn'); },
                            onComplete: (_t,_o)=> { // destroy each card once its faded out
                                _o[0].destroy();
                                if (_o[0].name==='spread_AH') { // if this is the last card
                                    vars.containers.getByName('unlockedCardSpread').setAlpha(0).setVisible(false); // hide the card spread container
                                    vars.game.unlockables.showContainer('unlocked'); // and fade the unlocked container back in

                                    // should we show the warning?
                                    if (!vars.game.cardSet.includes('OS') && !vars.game.cardSet.includes('default') && !vars.localStorage.WDSA) {
                                        vars.UI.showDifficultyWarning();
                                        return true;
                                    };

                                };
                            }
                        });
                    }
                });
                cardSpreadContainer.add(cardImage);
                x+=xInc;
                delay+=delayInc;
            });
        },

        showForegroundBarrier: (_show=true)=> {
            let alpha = _show ? 1: 0;
            // fade out the fg that hides the game screen
            let fg = scene.children.getByName('game_fg');
            scene.tweens.add({
                targets: fg,
                alpha: alpha,
                duration: 500
            });
        },

        showGameplayUI(_show=true, _minAlpha=0.1, _where=false) { // used to fade out (or in) the game play ui. requests for fade out can be by the AI or when clicking on an unlocked tint
            if (_show===false && _minAlpha>=0.5) { console.log(`Invalid minAlpha (${_minAlpha}) for fade out`); return false; }

            // anything in this list will be ignored when fading out
            let ignoreList = [];
            
            if (!_show && _where==='ai') { // fade out request was by the ai, so some stuff will remain alpha=1
                vars.DEBUG ? console.log(`AI requested fades`) : null;
                ignoreList.push('scoreText','timerText','bonusBG','bonusFG','bMText','tableOutline','tableText','stockText','foundationText');
            } else if (!_show && _where) { // fade out,ignore specifics based on "where"
                if (_where==='winLose') {
                    ignoreList.push('scoreText','timerText','playersUPCount','UIUPCoin');
                } else if (_where==='initGame') {
                    ignoreList.push('scoreText','timerText','playersUPCount','UIUPCoin','bonusBG','bonusFG','bMText','tableOutline','tableText','stockText','foundationText');
                } else if (_where==='tintView') {
                    ignoreList.push('scoreText','timerText','playersUPCount','UIUPCoin','tableOutline','tableText','stockText','foundationText');
                };
            };
            
            let alpha = _show ? 1 : _minAlpha;
            if (_show && vars.game.deal) { // FADING IN - we have to ignore the fg if game.deal exists
                ignoreList.push('game_fg');
                // and set the fg to alpha 0
                scene.children.getByName('game_fg').alpha=0;
            };
            scene.groups.gamePlayingUIButtons.getChildren().forEach((_c)=> {
                if (!ignoreList.includes(_c.name)) {
                    scene.tweens.add({
                        targets: _c,
                        alpha: alpha,
                        duration: 333,
                        onComplete: (_t,_o)=> {
                            if (_o[0].alpha<0.5) { // we faded OUT to get here
                                if (_o[0].getData('interactive')) {
                                    vars.DEBUG ? console.log(`%cDisabling ${_c.name} (interactivity)`,'color: red') : null;
                                    _o[0].disableInteractive();
                                };
                            } else { // faded IN to get here
                                if (_o[0].getData('interactive')) {
                                    vars.DEBUG ? console.log(`%cEnabling ${_c.name} (interactivity)`,'color: green') : null;
                                    _o[0].setInteractive();
                                };
                            };
                        }
                    });
                };
            });
        },

        showMainScreen: ()=> {
            // reset the multiplier
            vars.game.deck.resetStreak();
            // destroy the dealt cards (deck and deal vars)
            vars.UI.destroyAllCards();
            // show the main screen
            vars.containers.startIntroLoop(true);
            // set the game fg to black
            vars.UI.showForegroundBarrier(true);
            vars.containers.show('mainScreen', true);
            scene.groups.gamePlayingUI.setVisible(false).setAlpha(0);
        },

        showWellDone: ()=> {
            // show the well done container
            if (scene.containers.wellDone.visible) return false; // the well done screen is already visible

            let container = scene.containers.wellDone;
            container.setVisible(true);
            scene.tweens.add({
                targets: container,
                alpha: 1,
                duration: 500,
                onComplete: (_t)=> {
                    // do something with the object
                    // _o[0].destroy();
                }
            })
        },

        swapMusicEnableButton: (_trackInt,_allRequest=false)=> { // changes a track from ON to OFF and vice versa
            let container = vars.containers.getByName('optionsScreen');
            let off = container.getByName(`options_track${_trackInt}_off`);
            let on = container.getByName(`options_track${_trackInt}_on`);
            let enabled=true; // assume were enabling the track
            if (on.alpha) { // track currently showing ON button (ie track is enabled - disable it)
                off.setAlpha(1); on.setAlpha(0); // swap the buttons
                enabled = false;
            } else { // track currently showing OFF button (ie track is disabled - enable it)
                off.setAlpha(0); on.setAlpha(1); // swap the buttons
                enabled = true;
            };

            vars.music.updateAvailableTracks(`track${_trackInt}`,enabled);
            // update the lV var and save new setting to lS
            vars.localStorage.updateTrackList(`track${_trackInt}`,enabled);
        },

        swapMusicPlayButton: (_object)=> { // this simply swaps the frame (so much easier than messing about with seperate yes no buttons)
            let playButton = _object;
            playButton.frame.name === 'playTrackIcon' ? playButton.setFrame('stopTrackIcon') : playButton.setFrame('playTrackIcon');

            return;
        },

        updateMultiplier: (_multiplier)=> {
            let mM = 10;// max multiplier

            let group = scene.groups.gamePlayingUI;
            let bFG = group.getByName('bonusFG');
            let w = bFG.width;
            let h = bFG.height;
            let crop = (mM-_multiplier)/mM*h;
            bFG.setCrop(0,crop,w,h);
        },

        updateScore: (_score)=>{
            let scoreText = scene.groups.gamePlayingUI.getByName('scoreText');
            scoreText.text = `${_score} - SCORE`;
        },

        updateTimer: (_newTime)=> {
            let timerText = vars.containers.getByName('gamePlayingUI').getByName('timerText');
            timerText.setText(`${_newTime}s - TIME`);
        },

        updateVolume: ()=> {
            let maxWidth = 192; // this is the FULL width of the volume bar. Used to resize on volume change
            let cropPercent = vars.audio.volume/10;

            let container = vars.containers.getByName('optionsScreen');
            let volumeBar = container.getByName('volumeBar');
            volumeBar.setCrop(0,0,maxWidth*cropPercent,volumeBar.height);
        },

        wellDoneDestroy: ()=> {
            // empty the container
            vars.containers.empty('wellDone');
        },

        wellDoneShowContinueButton: ()=> { // called from wellDoneShowScore
            let cC = consts.canvas;
            let iV = vars.input;
            let depth = 18;
            let screenName = 'wellDone';
            let container = scene.containers[screenName];
            // we only have 1 BUTTON on this page (enter name) so nothing needs setting up

            
            let textButton = scene.add.image(cC.cX,cC.height*0.75,'ui','textBoxBigBG').setName('WD_enterName').setScale(1.4,1).setAlpha(0).setDepth(depth).setInteractive();
            iV.pageButtons[screenName] = [['WD_enterName']];

            let enterNameText = scene.add.bitmapText(cC.cX, cC.height*0.75, 'defaultFont', `ENTER NAME`, 64).setOrigin(0.5).setName('enterNameText').setDepth(depth+1).setAlpha(0).setLetterSpacing(10).setTint(consts.tints.orange);

            container.add([textButton, enterNameText]);

            // fade in the button and text
            scene.tweens.add({ targets: [textButton, enterNameText], alpha: 1, duration: 1000 });
        },

        wellDoneShowScore: ()=> { // called from buildWellDone
            let cC = consts.canvas;
            let container = scene.containers.wellDone;
            let depth = 15;

            let score = vars.game.deck.playerScore;
            // push the score to the score card
            vars.game.scoreCard.score = score;
            let scoreText = scene.add.bitmapText(cC.cX, cC.cY, 'defaultFont', `Your score is ${score}`, 64).setOrigin(0.5).setName('wellDoneText').setDepth(depth).setAlpha(0).setLetterSpacing(20).setDropShadow(6,6);
            container.add(scoreText);
            scene.tweens.add({
                targets: scoreText,
                alpha: 1,
                duration: 1000
            });

            scene.tweens.add({
                targets: scoreText,
                scale: 1.5,
                duration: 2000,
                onComplete: ()=> {
                    vars.UI.wellDoneShowContinueButton();
                }
            });

        }
    }
}