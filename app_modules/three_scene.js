"use strict";
// Imports
import { OrbitControls } from '../external_modules/OrbitControls.js'
import { EllipticalTrajectory } from './scene_objects/elliptical_trajectory.js'
import { initialValues } from '../lib/config.js'
// Scene vars
import * as THREE from '../external_modules/three.module.js';
var scene, camera, controls, renderer;

// Scene objects
var axesHelper, referencePlane, lightAmbient, ellipticalTrajectory;

// Traj object vars
var initSourceRad = 5,
    initSatteliteRad = 2;

// Controls init
var controlsSpeed = 0.65,
    controlsZoomSpeed = 0.3;

function initializeScene(){
    console.log(THREE);
    // setup scene
    scene = new THREE.Scene();
    var loader = new THREE.CubeTextureLoader();
    var cubeMap = loader.load([
        'assets/textures/sky_posx.png',
        'assets/textures/sky_negx.png',
        'assets/textures/sky_posz.png',
        'assets/textures/sky_negz.png',
        'assets/textures/sky_posy.png',
        'assets/textures/sky_negy.png',
    ]);
    scene.background = cubeMap;

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.set(60, -60, 50);
    camera.lookAt(scene.position); // origin

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild( renderer.domElement);

    controls = initializeControls();

    // Reference plane
    var planeGeom = new THREE.PlaneGeometry(250, 250);
    var alphaMap = new THREE.TextureLoader().load('assets/textures/plane_alpha.png' );
    // alphaMap.wrapS = THREE.RepeatWrapping;
    // alphaMap.wrapT = THREE.RepeatWrapping;
    // alphaMap.repeat.set(2, 2);
    var texture = new THREE.TextureLoader().load('assets/textures/checkerboard-pattern.jpg');
    // texture.wrapS = THREE.RepeatWrapping;
    // texture.wrapT = THREE.RepeatWrapping;
    // texture.repeat.set(2, 2);
    var planeCaptureMaterial = new THREE.MeshBasicMaterial({color: 0x808080, map: texture, side: THREE.DoubleSide, alphaMap: alphaMap, transparent: true, opacity: 0.75, depthWrite: false})
    referencePlane = new THREE.Mesh(planeGeom, planeCaptureMaterial);
    scene.add(referencePlane);

    // Coordinate system helper
    axesHelper = new THREE.AxesHelper(5);
    axesHelper.scale.set(5, 5, 5);
    scene.add(axesHelper);

    // Lights
    lightAmbient = new THREE.AmbientLight(0xE7E7E7);
    lightAmbient.intensity = 0.92;
    scene.add(lightAmbient);

    // Elliptical Trajectory
    ellipticalTrajectory = new EllipticalTrajectory(0, 0, initSourceRad, initSatteliteRad, initialValues.semimajorAxis,
                                                    initialValues.eccentricity, initialValues.argumentofPeriapsis, initialValues.inclination,
                                                    initialValues.longitudeOfAscendingNode, initialValues.trueAnomaly, initialValues.showOrbitalPlane);
    scene.add(ellipticalTrajectory.threeObject);
    scene.add(ellipticalTrajectory.ascendingNodeVector);
}


function renderScene(){
    renderer.render(scene, camera);
    controls.update();
}


function initializeControls(){
    var controls = new OrbitControls(camera, renderer.domElement);
    controls.panSpeed = controlsSpeed;
    controls.rotateSpeed = controlsSpeed;
    controls.zoomSpeed = controlsZoomSpeed;
    return controls;
}


export {
    camera,
    ellipticalTrajectory,
    initializeScene,
    renderer,
    renderScene,
    THREE
}
