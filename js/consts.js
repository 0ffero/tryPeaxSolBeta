"use strict";
const consts = {
    canvas: {
        width: 1920, height: 1080,
        cX: 1920/2, cY: 1080/2
    },

    colours: {
        multiplierHighlights: [ 0xff0000, 0xFF3800, 0xFF7100, 0xFFAB00, 0xFFE400, 0xE1FB00, 0xA9F200, 0x71EA00, 0x39E100, 0x00D900 ],
    },

    console: {
        colours: {
            functionCall: '#4DA6FF',
            important: '#FFFF00',
            bad: '#FF0000', warn: '#FF0000',
            good: '#63e763'
        },

        defaults: 'font-weight: bold; font-size: 14px; font: \'consolas\'; color:'
    },

    depths: {
        gameScreen:             1,
        foreground:             5,
        aiPopUp:                7,
        playerLose:             10,
        newDealScreen:          10,
        wellDone:               15,
        multiplierHighlight:    75,
        aiFinger:               80,
        fiveHundred:            90,
        bonusPointsContainier:  100,
        coins_bronze:           110,
        coins_silver:           120,
        mainScreen:             130,
        inputPlayerName:        135,
        highScoreTable:         140,
        options:                150,
        unlockedCardSpread:     170,
        scroller:               180,
        splashScreen:           200,
        dailyBonus:             300,
        debug:                  999
    },

    fontSizes: {
        gameScreen: 14
    },

    layout: {
        card: {
            width: 150,
            height: 230
        },

        gameArea: {
            width: 1800,
            height: 900,
            lowestSetY: 1080*0.8,
            padding: { x: (1920-1800)/2, y: 200 },
            peak: [
                1800*0.25-15,
                1800*0.5,
                1800*0.75+15,
            ]
        }
    },

    htmlColours: {
        orange: '#FFBC00',
        blue: '#0080EA',
        blueDark: '#0163B4',
        blueLight: '#7DC5FF',
    },

    timeRadix: 32,

    tints: {
        blue: 0x0080EA,
        blueDark: 0x0163B4,
        blueLight: 0x7DC5FF,
        highScores: 0x0F78D1,
        orange: 0xFFBC00
    },

    unlockPoints: {
        loginBonusUPs: 250,
        randomRoll: 250,
        tint: 100,
        cardSet: 500,
        special: 750, // some cards are "specials" gold, silver and there will probably be more eventually
        exotic: 1000, // new card backs etc
    }
}