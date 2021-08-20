"use strict";
import { THREE } from '../three_scene.js'
import { Ellipse, Arrow } from './geometric_objects.js'

class EllipticalTrajectory {
    constructor(x, y, sourceRadius, satelliteRadius, semimajorAxis, eccentricity, argumentofPeriapsis, inclination, longitudeOfAscendingNode, trueAnomaly, showOrbitalPlane, showSatelliteDirection, showOrbitalPosition){
        this.x = x;
        this.y = y;
        this.semimajorAxis = semimajorAxis;
        this.eccentricity = eccentricity;
        this.argumentofPeriapsis = argumentofPeriapsis;
        this.inclination = inclination;
        this.longitudeOfAscendingNode = longitudeOfAscendingNode;
        this.trueAnomaly = trueAnomaly;
        this.showOrbitalPlane = showOrbitalPlane;
        this.showSatelliteDirection = showSatelliteDirection;
        this.showOrbitalPosition = showOrbitalPosition;
        this.gravitySource = this.createGravitySource(sourceRadius);
        this.satellite = this.createSatellite(satelliteRadius);
        this.orbitalPlane = this.createOrbitalPlane();
        this.orbitalPositionVector = new Arrow(0, 0, 0, 9, 0, 0, 0.1, 0xffff00);
        this.trajectory = null;
        this.arrowPeriapsis = null;
        this.arrowApoapsis = null;
        this.arrowQuarterA = null;
        this.arrowQuarterB = null;
        this.initializeTrajectory();
        this.threeObject = new THREE.Group();
        this.trajectory.add(this.gravitySource);
        this.trajectory.add(this.satellite);
        this.threeObject.add(this.trajectory);
        this.setOrbitalPlaneVisibility(this.showOrbitalPlane);
        this.setOrbitalPositionVisibility(this.showOrbitalPosition);
        // NOT part of group, not on the orbital plane
        this.ascendingNodeVector = new Arrow(0, 0, 0, 9, 2, .75, 0.2, 0xff00ff);

        // Initialize arg of periapse
        this.updateArgumentofPeriapsis(this.argumentofPeriapsis);

        // Initialize inclination and arg of longitude
        // this.updateInclination(this.inclination);
        this.updateLongitudeOfAscendingNode(this.longitudeOfAscendingNode);
        this.setSatellitePosition(this.trueAnomaly);
    }

    get semiminorAxis(){
        return this.semimajorAxis * Math.sqrt(1 - Math.pow(this.eccentricity, 2));
    }

    get semiLatusRectum(){
        return this.semimajorAxis * (1 - Math.pow(this.eccentricity, 2));
    }

    get orbitalDistance(){
        return this.semiLatusRectum / (1 + this.eccentricity * Math.cos(this.trueAnomaly));
    }

    get periapsis(){
        return (1-this.eccentricity) * this.semimajorAxis;
    }

    get apoapsis(){
        return (1+this.eccentricity) * this.semimajorAxis;
    }

    updateSemimajorAxis(semimajorAxis){
        this.semimajorAxis = semimajorAxis;
        this.threeObject.remove(this.trajectory);
        this.initializeTrajectory()
        this.threeObject.add(this.trajectory);

        this.updateArgumentofPeriapsis(this.argumentofPeriapsis);
        // this.updateInclination(this.inclination);

        this.setSourcePosition();
        this.setSatellitePosition(this.trueAnomaly);
        this.trajectory.add(this.gravitySource);
        this.trajectory.add(this.satellite);
    }

    updateEccentricity(eccentricity){
        this.eccentricity = eccentricity;
        this.threeObject.remove(this.trajectory);
        this.initializeTrajectory()
        this.threeObject.add(this.trajectory);

        this.updateArgumentofPeriapsis(this.argumentofPeriapsis);
        // this.updateInclination(this.inclination);

        this.setSourcePosition();
        this.setSatellitePosition(this.trueAnomaly);
        this.trajectory.add(this.gravitySource);
        this.trajectory.add(this.satellite);
    }

    updateArgumentofPeriapsis(argumentofPeriapsis){
        this.argumentofPeriapsis = argumentofPeriapsis;
        this.setTrajectoryAngleInOrbitalPlane(this.argumentofPeriapsis);
    }

    updateInclination(inclination){
        this.inclination = inclination;

        var axis = new THREE.Vector3(0, 0, 1);
        this.threeObject.setRotationFromAxisAngle(axis, this.longitudeOfAscendingNode);

        this.setAscendingNodeAngle();
        var axis = new THREE.Vector3(1, 0, 0);
        this.threeObject.rotateOnAxis(axis, this.inclination);
    }

    updateLongitudeOfAscendingNode(longitudeOfAscendingNode){
        this.longitudeOfAscendingNode = longitudeOfAscendingNode;

        var axis = new THREE.Vector3(0, 0, 1);
        this.threeObject.setRotationFromAxisAngle(axis, this.longitudeOfAscendingNode);

        this.setAscendingNodeAngle();
        this.updateInclination(this.inclination);
    }

    updateTrueAnomaly(trueAnomaly){
        this.trueAnomaly = trueAnomaly;
        this.setSatellitePosition(this.trueAnomaly);
    }

    // general utilities
    setTrajectoryAngleInOrbitalPlane(targetAngle){
        var axis = new THREE.Vector3(0,0,1);
        var rotationAngle = targetAngle  - this.trajectory.rotation.z;
        this.trajectory.position.applyAxisAngle(axis, rotationAngle); // rotate the POSITION
        this.trajectory.rotateOnAxis(axis, rotationAngle); // rotate the OBJECT
    }

    setAscendingNodeAngle(){
        var axis = new THREE.Vector3(0, 0, 1);
        this.ascendingNodeVector.object.setRotationFromAxisAngle(axis, this.longitudeOfAscendingNode);
    }

    setSourcePosition(){
        var centerX = this.semimajorAxis * this.eccentricity;
        this.gravitySource.position.set(centerX, 0, 0);
    }

    setSatellitePosition(angle){
        this.setOrbitalPositionInPlane(this.orbitalDistance, angle);

    }

    setOrbitalPositionInPlane(distance, trueAnomaly){
        var axis = new THREE.Vector3(0,0,1);
        var positionVector = new THREE.Vector3(distance, 0, 0);
        positionVector.applyAxisAngle(axis, trueAnomaly);
        this.satellite.position.set(this.semimajorAxis * this.eccentricity + positionVector.x, positionVector.y, 0);
        this.orbitalPositionVector.updateEndPoints(new THREE.Vector3(this.semimajorAxis * this.eccentricity, 0, 0), this.satellite.position);
    }

    setOrbitalPlaneVisibility(showOrbitalPlane){
        this.showOrbitalPlane = showOrbitalPlane;
        if (this.showOrbitalPlane){
            this.threeObject.add(this.orbitalPlane);
        }
        else{
            if (this.threeObject.children.includes(this.orbitalPlane)){
                this.threeObject.remove(this.orbitalPlane);
            }
        }
    }

    setOrbitalDirectionVisibility(showSatelliteDirection){
        this.showSatelliteDirection = showSatelliteDirection;
        this.possiblyShowDirectionVectors();
    }

    setOrbitalPositionVisibility(showOrbitalPosition){
        this.showOrbitalPosition = showOrbitalPosition;
        if (this.showOrbitalPosition){
            this.trajectory.add(this.orbitalPositionVector.object);
        }
        else{
            if (this.trajectory.children.includes(this.orbitalPositionVector.object)){
                this.trajectory.remove(this.orbitalPositionVector.object);
            }
        }
    }

    // INITIALIZATION
    createGravitySource(radius){
        var geometry = new THREE.SphereGeometry(radius, 32, 16);
        var material = new THREE.MeshBasicMaterial({color: 0xffff00, transparent: true, opacity: 1});
        var sphere = new THREE.Mesh(geometry, material);
        var centerX = this.semimajorAxis * this.eccentricity;
        sphere.position.set(centerX, 0, 0);
        return sphere;
    }

    createSatellite(radius){
        var geometry = new THREE.SphereGeometry(radius, 32, 16);
        var material = new THREE.MeshBasicMaterial({color: 0x14d4ff, transparent: false, opacity: 1});
        var sphere = new THREE.Mesh(geometry, material);

        var centerX = this.semimajorAxis * this.eccentricity;
        sphere.position.set(centerX + this.orbitalDistance, 0, 0);
        // sphere.rotateOnAxis(new THREE.Vector3(0, 0, 1), this.trueAnomaly); // rotate the OBJECT
        return sphere;
    }

    createOrbitalPlane(){
        var planeGeom = new THREE.PlaneGeometry(250, 250);
        var alphaMap = new THREE.TextureLoader().load('assets/textures/plane_alpha.png');
        // var textureMap = new THREE.TextureLoader().load('assets/textures/checkerboard-pattern.jpg');
        var planeCaptureMaterial = new THREE.MeshBasicMaterial({color: 0x808080, side: THREE.DoubleSide, alphaMap: alphaMap, transparent: true, opacity: 1})
        var referencePlane = new THREE.Mesh(planeGeom, planeCaptureMaterial);
        var centerX = this.semimajorAxis * this.eccentricity;
        referencePlane.position.set(centerX, 0, 0);
        return referencePlane;
    }

    initializeTrajectory(){
        var curve = new Ellipse(this.semimajorAxis, this.semiminorAxis);

        // params
        var pathSegments = 64;
        var tubeRadius = 0.25;
        var radiusSegments = 16;
        var geometry = new THREE.TubeBufferGeometry(curve, pathSegments, tubeRadius, radiusSegments, true);
        var material = new THREE.MeshBasicMaterial({ color : 0x14d4ff, transparent: true, opacity: 0.8 });
        this.trajectory = new THREE.Mesh( geometry, material );

        // center of ellipse at focus, appropriately shift

        var centerX = -1 * this.semimajorAxis * this.eccentricity;
        this.trajectory.position.set(centerX, 0, 0);

        this.arrowPeriapsis = new Arrow(this.periapsis - centerX, 0, 0, 7, 2, .75, 0.1, 0xffffff);
        this.arrowPeriapsis.object.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI/2); // rotate the OBJECT
        this.arrowApoapsis = new Arrow(-this.apoapsis - centerX, 0, 0, 7, 2, .75, 0.1, 0xffffff);
        this.arrowApoapsis.object.rotateOnAxis(new THREE.Vector3(0, 0, 1), -Math.PI/2); // rotate the OBJECT
        this.arrowQuarterA = new Arrow(0, this.semiminorAxis, 0, 7, 2, .75, 0.1, 0xffffff);
        this.arrowQuarterA.object.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI); // rotate the OBJECT
        this.arrowQuarterB = new Arrow(0, -this.semiminorAxis, 0, 7, 2, .75, 0.1, 0xffffff);

        this.possiblyShowDirectionVectors();
    }

    possiblyShowDirectionVectors(){
        if (this.showSatelliteDirection){
            this.trajectory.add(this.arrowPeriapsis.object);
            this.trajectory.add(this.arrowApoapsis.object);
            this.trajectory.add(this.arrowQuarterA.object);
            this.trajectory.add(this.arrowQuarterB.object);
        }
        else{
            this.trajectory.remove(this.arrowPeriapsis.object);
            this.trajectory.remove(this.arrowApoapsis.object);
            this.trajectory.remove(this.arrowQuarterA.object);
            this.trajectory.remove(this.arrowQuarterB.object);
        }
    }
}

export { EllipticalTrajectory }
