"use strict";

import { THREE } from '../three_scene.js'
import { Arrow } from './geometric_objects.js'

class Axes {
    constructor(length){

        this.object = new THREE.Group();
        this.xAxis = new Arrow(0, 0, 0, length, 2, .75, 0.1, 0xFF0000);
        // this.xAxis.object.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI/2); // rotate the OBJECT

        this.yAxis = new Arrow(0, 0, 0, length, 2, .75, 0.1, 0x00FF00);
        this.yAxis.object.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI/2); // rotate the OBJECT

        this.zAxis = new Arrow(0, 0, 0, length, 2, .75, 0.1, 0x0000FF);
        this.zAxis.object.rotateOnAxis(new THREE.Vector3(0, 1, 0), -Math.PI/2); // rotate the OBJECT

        this.xLabel = null;
        this.yLabel = null;
        this.zLabel = null;

        this.object.add(this.xAxis.object);
        this.object.add(this.yAxis.object);
        this.object.add(this.zAxis.object);

    }

    update(){

    }
}


export { Axes }
