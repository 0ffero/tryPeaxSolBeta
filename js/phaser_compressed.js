"use strict";vars.DEBUG?console.log("Initialising..."):null;var game,scene,nav=window.navigator.userAgent.toUpperCase(),fps=nav.includes("WIN64")||nav.includes("WIN32")||nav.includes("MAC OS")||nav.includes("LINUX")?{target:60,forceSetTimeOut:!0}:{target:30,forceSetTimeOut:!0},config={title:"TryPeax Sol",type:Phaser.WEBGL,backgroundColor:"#000000",disableContextMenu:!0,height:consts.canvas.height,width:consts.canvas.width,fps:fps,physics:{default:"arcade",arcade:{gravity:{y:700},debug:!1}},scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:consts.canvas.width,height:consts.canvas.height},scene:{preload:preload,create:create,update:vars.update.tick,pack:{files:[{type:"image",key:"loadingImage",url:"assets/images/loadingscreen.jpg"},{type:"atlas",key:"loadingBar",textureURL:"assets/Loader/loader.png",atlasURL:"assets/Loader/loader.json"}]}},banner:!1,version:vars.version.toString(),url:window.location.href,loader:{enableParallel:!0,crossOrigin:"anonymous"}};fetch("./assets/fileList.json").then(a=>a.json()).then(a=>{vars.loader=new LoadingBar(a),vars.game.phaserGameObject=new Phaser.Game(config)});function preload(){scene=this,scene.physics.pause(),scene.add.image(consts.canvas.cX,consts.canvas.cY,"loadingImage").setName("loadingImage"),scene.load.on("load",a=>{vars.loader.updateBar(a)}),vars.init("PRELOAD")}function create(){vars.init("CREATE");let a=scene.children.getByName("loadingImage");scene.tweens.add({targets:a,alpha:0,duration:1e3,onComplete:(a,b)=>{b[0].destroy(),vars.UI.buildSplashScreen()}})}