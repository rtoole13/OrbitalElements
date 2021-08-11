import { camera, renderer, ellipticalTrajectory } from './three_scene.js'

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function semimajorAxisChanged(semimajorAxis){
    ellipticalTrajectory.updateSemimajorAxis(semimajorAxis);
}

function eccentricityChanged(eccentricity){
    ellipticalTrajectory.updateEccentricity(eccentricity);
}

function argumentofPeriapsisChanged(argumentofPeriapsis){
    ellipticalTrajectory.updateArgumentofPeriapsis(argumentofPeriapsis);
}

function inclinationChanged(inclination){
    ellipticalTrajectory.updateInclination(inclination);
}

function longitudeOfAscendingNodeChanged(longitudeOfAscendingNode){
    ellipticalTrajectory.updateLongitudeOfAscendingNode(longitudeOfAscendingNode);
}

function trueAnomalyChanged(trueAnomaly){
    ellipticalTrajectory.updateTrueAnomaly(trueAnomaly);
}

function orbitalPlaneToggled(showPlane){
    ellipticalTrajectory.setOrbitalPlaneVisibility(showPlane);
}

export {
    onWindowResize,
    semimajorAxisChanged,
    eccentricityChanged,
    argumentofPeriapsisChanged,
    inclinationChanged,
    longitudeOfAscendingNodeChanged,
    trueAnomalyChanged,
    orbitalPlaneToggled
}
