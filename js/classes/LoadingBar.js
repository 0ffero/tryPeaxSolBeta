"use strict";
let LoadingBar = class {
    constructor(_fileObject) {
        /* incoming _fileObject looks like
            {
                "files":
                    {
                        "rdFont.png": 37640,
                        "rdFont.xml": 11753,
                        "rdFontSmall.png": 26255,
                        "rdFontSmall.xml": 11697
                    },
                "details":
                    { "totalSize": 8419459 }
            }
        */

        if (typeof _fileObject !== 'object') return false;

        this.fileList = _fileObject;
        this.bytesLoaded = 0;
        this.initialised = false;
        this.percentOfTotal = 0; // normalise

        this.destroyed=false;

        this.ignoreFiles = ['assets/scoreCard/','Loader/'];

        this.generateTotals();
    }

    initUI() {
        let cC = consts.canvas;
        this.loadingBarBG = scene.add.image(cC.cX, cC.height *0.77, 'loadingBar','loadingBarBG');
        this.loadingBar = scene.add.image(cC.cX, cC.height *0.77, 'loadingBar','loadingBarFG').setName('loadingBar');

        this.initialised=true;

        this.cropBar(); // misnomer - actually sets scale now
    }

    cropBar() {
        this.loadingBar.setScale(this.percentOfTotal, 1);

        if (this.percentOfTotal===1) {
            console.log(`Loaded all files successfully. Destroying loading bar. Remember to null vars.loader`);
            this.destroy();
        }
    }

    destroy() {
        if (this.destroyed) return false; // false denotes already destroyed

        scene.tweens.add({
            targets: [this.loadingBar, this.loadingBarBG], alpha: 0,
            duration: 500, delay: 100,
            onComplete: ()=> {
                this.loadingBar.destroy();
                this.loadingBarBG.destroy();
            }
        });

        this.destroyed=true; // generally the class will destroy itself, but it the loader failed to get to 100, create will destroy it
        // if the loader fails its because weve added new files and theyve not been added by running
        // tryPeax/current/assets/assetsFileList.php

        return true; // denotes was destroyed successfully
    }

    generateTotals() {
        this.totals = { fileCount: 0, bytes: 0 };

        this.filesLoaded = {};

        let fileObject = this.fileList;
        this.totalSize = fileObject.details.totalSize;
        for (let fileData in fileObject.files) {
            let bytes = fileObject.files[fileData];
            this.filesLoaded[fileData] = { loaded: false, bytes: bytes };
        };
    }

    updateBar(_fileData) {
        !this.initialised ? this.initUI() : null; // build the UI

        let url = _fileData.url.split('/');
        let fileName = url[url.length-1];
        if (this.ignoreFiles.includes(fileName)) return false;

        let fData = this.filesLoaded[fileName];
        if (!fData) { // specifically ignore the unlockables coz theres loads of them
            vars.DEBUG ? console.log(`%cLoaded ${fileName} isnt in JSON file. Its probably part of a classes requirements`, 'color: orange; font-weight: bold') : null;
            return false;
        };
        this.bytesLoaded += fData.bytes;
        fData.loaded=true;

        this.percentOfTotal = this.bytesLoaded/this.totalSize;

        // update ui
        this.cropBar();
    }
}