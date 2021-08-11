import { GUI } from '../external_modules/dat.gui.module.js'
import { initialValues } from '../lib/config.js'
import * as callbacks from './callbacks_scene.js'

var params;
function initializeGui(){
    var gui = new GUI();
    params = {
        semimajorAxis: initialValues.semimajorAxis,
        eccentricity: initialValues.eccentricity,
        argumentofPeriapsis: initialValues.argumentofPeriapsis,
        inclination: initialValues.inclination,
        longitudeOfAscendingNode: initialValues.longitudeOfAscendingNode,
        trueAnomaly: initialValues.trueAnomaly,
        toggleOrbitalPlane: initialValues.showOrbitalPlane
    }
    gui.add(params, 'semimajorAxis', 1, 200).onChange(() => {callbacks.semimajorAxisChanged(params.semimajorAxis)});
    gui.add(params, 'eccentricity', 0.01, 0.99).onChange(() => {callbacks.eccentricityChanged(params.eccentricity)});
    gui.add(params, 'argumentofPeriapsis', 0, 2 * Math.PI).onChange(() => {callbacks.argumentofPeriapsisChanged(params.argumentofPeriapsis)});
    gui.add(params, 'inclination', 0, 2 * Math.PI).onChange(() => {callbacks.inclinationChanged(params.inclination)});
    gui.add(params, 'longitudeOfAscendingNode', 0, 2 * Math.PI).onChange(() => {callbacks.longitudeOfAscendingNodeChanged(params.longitudeOfAscendingNode)});
    gui.add(params, 'trueAnomaly', 0, 2 * Math.PI).onChange(() => {callbacks.trueAnomalyChanged(params.trueAnomaly)});
    gui.add(params, 'toggleOrbitalPlane').onChange(() => {callbacks.orbitalPlaneToggled(params.toggleOrbitalPlane)});
    return gui;
}

export { initializeGui }
