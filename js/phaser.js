"use strict";
vars.DEBUG ? console.log('Initialising...') : null;
var nav = window.navigator.userAgent.toUpperCase();
// win64, win 32, mac os and linux all use 60fps
// everything else: 30 (basically to save battery power on phones and unkowns)
var fps = nav.includes('WIN64') || nav.includes('WIN32') || nav.includes('MAC OS') || nav.includes('LINUX') ? { target: 60, forceSetTimeOut: true } : { target: 30, forceSetTimeOut: true };
var config = {
    title: "TryPeax Sol",
    type: Phaser.WEBGL,

    backgroundColor: '#000000',
    disableContextMenu: true,

    height: consts.canvas.height,
    width: consts.canvas.width,

    fps: fps,

    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 700 }, debug: false }
    },

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: consts.canvas.width,
        height: consts.canvas.height,
    },

    scene: {
        preload: preload,
        create: create,
        update: vars.update.tick,
        pack: {
            files: [
                { type: 'image', key: 'loadingImage', url: 'assets/images/loadingscreen.jpg' },
                { type: 'atlas', key: 'loadingBar', textureURL: 'assets/Loader/loader.png', atlasURL: 'assets/Loader/loader.json' },
            ]
        }
    },

    banner: false, version: vars.version.toString(), url: window.location.href,

    loader:{ enableParallel: true, crossOrigin: 'anonymous' }
};

var game,scene;
fetch("./assets/fileList.json").then(response => {
    return response.json(); 
}).then( (data)=> { 
    vars.loader = new LoadingBar(data); // remember to destroy this var after everything has loaded
    vars.game.phaserGameObject = new Phaser.Game(config);
});


/*
█████ ████  █████ █      ███  █████ ████  
█   █ █   █ █     █     █   █ █   █ █   █ 
█████ ████  ████  █     █   █ █████ █   █ 
█     █   █ █     █     █   █ █   █ █   █ 
█     █   █ █████ █████  ███  █   █ ████  
*/
function preload() {
    scene = this;
    scene.physics.pause();

    scene.add.image(consts.canvas.cX, consts.canvas.cY, 'loadingImage').setName('loadingImage');

    scene.load.on('load', (_fileData)=> { vars.loader?vars.loader.updateBar(_fileData):null; });
    vars.init('PRELOAD');
}



/*
█████ ████  █████ █████ █████ █████ 
█     █   █ █     █   █   █   █     
█     ████  ████  █████   █   ████  
█     █   █ █     █   █   █   █     
█████ █   █ █████ █   █   █   █████ 
*/
function create() {
    vars.init('CREATE'); // build the phaser objects, scenes etc
    let loadingScreen = scene.children.getByName('loadingImage');
    scene.tweens.add({
        targets: loadingScreen,
        alpha: 0,
        duration: 1000,
        onComplete: (_t,_o)=> {
            _o[0].destroy();
            vars.UI.buildSplashScreen();
        }
    });
}