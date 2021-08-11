"use strict";
// Imports
import { initializeScene, renderScene } from './app_modules/three_scene.js'
import { initializeGui } from './app_modules/gui.js'
import { onWindowResize } from './app_modules/callbacks_scene.js'
// Vars
var currentFrame, lastFrame = 0, dt, dtThreshold = 2, dtMax = 1/15;

// Initialize application
init();

function init(){
    // Set up three.js scene
    initializeScene();

    // init gui
    var gui = initializeGui();
    // Add event listeners
    window.addEventListener('resize', onWindowResize, false);

    // Loop main scene
    loopScene();
}


function loopScene(){
    // Time calculations
    currentFrame = new Date();
    dt = (currentFrame - lastFrame)/1000.0;
    dt = (dt < dtMax)? dt : dtMax; //cap dt in the event of tabbing away
    lastFrame = currentFrame;

    // Updates

    // Render
    requestAnimationFrame(loopScene);
    renderScene();
}
