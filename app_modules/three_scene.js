"use strict";
// Imports
import { OrbitControls } from '../external_modules/OrbitControls.js'
import { EllipticalTrajectory } from './scene_objects/elliptical_trajectory.js'
import { Axes } from './scene_objects/axes.js'
import { initialValues } from '../lib/config.js'
// Scene vars
import * as THREE from '../external_modules/three.module.js';
var scene, camera, controls, renderer;

// Scene objects
var axes, labelAxisX, labelAxisY, labelAxisZ, referencePlane, lightAmbient, ellipticalTrajectory;

// Traj object vars
var initSourceRad = 3,
    initSatteliteRad = 1;

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
    var planeCaptureMaterial = new THREE.MeshBasicMaterial({color: 0x808080, map: texture, side: THREE.DoubleSide, alphaMap: alphaMap, transparent: true, opacity: 0.9, depthWrite: false})
    referencePlane = new THREE.Mesh(planeGeom, planeCaptureMaterial);
    scene.add(referencePlane);

    // Coordinate system helper
    axes = new Axes(initialValues.axisLength);
    scene.add(axes.object);

    var loader = new THREE.FontLoader().load( 'external_modules/fonts/helvetiker_regular.typeface.json', function ( font ) {
        var xGeometry = new THREE.TextGeometry( 'x', {
            font: font,
            size: 2,
            height: .1,
            curveSegments: 12,
            bevelEnabled: false
        });
        var yGeometry = new THREE.TextGeometry( 'y', {
            font: font,
            size: 2,
            height: .1,
            curveSegments: 12,
            bevelEnabled: false

        });
        var zGeometry = new THREE.TextGeometry( 'z', {
            font: font,
            size: 2,
            height: .1,
            curveSegments: 12,
            bevelEnabled: false
        });

        var xMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
        labelAxisX = new THREE.Mesh(xGeometry, xMaterial);
        labelAxisX.position.set(initialValues.axisLength + 3, 0, 1);

        var yMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
        labelAxisY = new THREE.Mesh(yGeometry, yMaterial);
        labelAxisY.position.set(0, initialValues.axisLength + 3, 1);

        var zMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff});
        labelAxisZ = new THREE.Mesh(zGeometry, zMaterial);
        labelAxisZ.position.set(0, 0, initialValues.axisLength + 3);

        scene.add(labelAxisX);
        scene.add(labelAxisY);
        scene.add(labelAxisZ);
    });

    // Lights
    lightAmbient = new THREE.AmbientLight(0xE7E7E7);
    lightAmbient.intensity = 0.92;
    scene.add(lightAmbient);

    // Elliptical Trajectory
    ellipticalTrajectory = new EllipticalTrajectory(0, 0, initSourceRad, initSatteliteRad, initialValues.semimajorAxis,
                                                    initialValues.eccentricity, initialValues.argumentofPeriapsis, initialValues.inclination,
                                                    initialValues.longitudeOfAscendingNode, initialValues.trueAnomaly, initialValues.showOrbitalPlane,
                                                    initialValues.showSatelliteDirection, initialValues.showOrbitalPosition);
    scene.add(ellipticalTrajectory.threeObject);
    scene.add(ellipticalTrajectory.ascendingNodeVector.object);
}


function renderScene(){
    renderer.render(scene, camera);
    controls.update();
    updateAxisLabels();
}

function updateAxisLabels(){
    if (labelAxisX){
        labelAxisX.lookAt(camera.position);
    }
    if (labelAxisY){
        labelAxisY.lookAt(camera.position);
    }
    if (labelAxisZ){
        labelAxisZ.lookAt(camera.position);
    }
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
