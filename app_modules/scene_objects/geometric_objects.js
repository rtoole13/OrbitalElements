"use strict";
import { THREE } from '../three_scene.js'


class Ellipse extends THREE.Curve {
    constructor(semimajorAxis, semiminorAxis){
        super();
        this.semimajorAxis = semimajorAxis;
        this.semiminorAxis = semiminorAxis;
    }

    getPoint(t, optionalTarget = new THREE.Vector3()) {

        const point = optionalTarget;
        var radians = 2 * Math.PI * t;

        return new THREE.Vector3( this.semimajorAxis * Math.cos( radians ), this.semiminorAxis * Math.sin( radians ), 0);
    }
}


class Arrow {
    constructor(x, y, z, length, arrowHeadLength, arrowHeadWidth, thickness, color){
        this.length = length;
        this.thickness = thickness;
        this.color = color;
        this.arrowHeadLength = arrowHeadLength;
        this.arrowHeadWidth = arrowHeadWidth;
        this.material = new THREE.MeshBasicMaterial({ color : this.color });
        this.mainVector = this.createVector(new THREE.Vector3(0, 0, 0), new THREE.Vector3(length, 0, 0));


        this.object = new THREE.Group();
        this.object.add(this.mainVector);
        this.object.position.set(x, y, z);
        if (arrowHeadWidth == 0 || arrowHeadLength == 0){
            return;
        }
        this.arrowHeadA = this.createVector(new THREE.Vector3(length - arrowHeadLength, arrowHeadWidth/2, 0), new THREE.Vector3(length, 0, 0));
        this.arrowHeadB = this.createVector(new THREE.Vector3(length - arrowHeadLength, -arrowHeadWidth/2, 0), new THREE.Vector3(length, 0, 0));
        this.object.add(this.arrowHeadA);
        this.object.add(this.arrowHeadB);
    }

    createVector(start, end){
        var curve = new THREE.LineCurve3(start, end);
        // params
        var pathSegments = 2;
        var radiusSegments = 16;
        var geometry = new THREE.TubeBufferGeometry(curve, pathSegments, this.thickness, radiusSegments, false);
        var vector = new THREE.Mesh( geometry, this.material );
        return vector;
    }
    
    updateEndPoints(start, end){
        this.object.remove(this.mainVector);
        this.mainVector = this.createVector(start, end);
        this.object.add(this.mainVector);
    }

    updateLength(newLength){
        this.length = newLength;
        this.object.remove(this.mainVector);
        this.mainVector = this.createVector(new THREE.Vector3(0, 0, 0), new THREE.Vector3(this.length, 0, 0));
        this.object.add(this.mainVector);
    }
}

export { Ellipse, Arrow }
