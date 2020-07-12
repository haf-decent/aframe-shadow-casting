'use strict';

AFRAME.registerComponent('shadow-light', {
    schema: {
        type: { type: 'string', default: 'directional', oneOf: [ 'directional', 'spot' ] },
        intensity: { type: 'float', default: 0.5, min: 0 },
        color: { type: 'color', default: 'white' },
        target: { type: 'vec3', default: { x: 0, y: 0, z: 0 } },
        near: { type: 'float', default: 1 },
        far: { type: 'float', default: 5 },
        tlrb: { type: 'vec4', default: { x: 5, y: -5, z: 5, w: -5 } },
        mapsize: { type: 'vec2', default: { x: 1024, y: 1024 } },
        bias: { type: 'float', default: -0.000222 },
        helper: { type: 'boolean', default: false }
    },
    init() {
        this.el.sceneEl.renderer.shadowMap.enabled = true;
        this.el.shadowLight = null;
    },
    update(oldData) {
        const diff = AFRAME.utils.diff(oldData, this.data);
        
        if (diff.hasOwnProperty('type')) {
            this.remove();
            this._createLight();
            return;
        }
        
        for (var key of Object.keys(diff)) {
            switch(key) {
                case 'intensity':
                case 'color':
                    this.light[key] = this.data[key];
                    break;
                case 'target':
                    const { x, y, z } = this.data.target;
                    this.light.target.position.set(x, y, z);
                    break;
                case 'near':
                case 'far':
                    this.light.shadow.camera[key] = this.data[key];
                    break;
                case 'tlrb':
                    const [ t, l, r, b ] = Object.values(this.data.tlrb).map(parseFloat);
                    this.light.shadow.camera.top = t;
                    this.light.shadow.camera.left = l;
                    this.light.shadow.camera.right = r;
                    this.light.shadow.camera.bottom = b;
                    break;
                case 'mapsize':
                    const { x: w, y: h } = this.data.mapsize;
                    this.light.shadow.mapSize.width = w;
                    this.light.shadow.mapSize.height = h;
                    break;
                case 'bias':
                    this.light.shadow.bias = this.data.bias;
                    break;
                case 'helper':
                    const { object3D: scene } = this.el.sceneEl;
                    if (this.data.helper && !this.helper) {
                        this.helper = new THREE.CameraHelper(this.light.shadow.camera);
                        scene.add(this.helper);
                    }
                    else if (!this.data.helper && this.helper) {
                        scene.remove(this.helper);
                        this.helper = null;
                    }
            }
        }
    },
    remove() {
        const { object3D: scene } = this.el.sceneEl;
        if (this.light) {
            scene.remove(this.light.target);
            this.el.removeObject3D('light');
        }
        if (this.helper) {
            scene.remove(this.helper);
            this.helper = null;
        }
        this.light = null;
    },
    _createLight() {
        const { type, color, intensity, target, bias, mapsize, near, far, tlrb, helper } = this.data;
        const { object3D: scene } = this.el.sceneEl;
        
        const light = type == 'directional' ? 
            new THREE.DirectionalLight(color, intensity):
            new THREE.SpotLight(color, intensity);
        
        scene.add(light.target);
        light.target.position.set(target.x, target.y, target.z);
        
        light.shadow.bias = bias;
        light.shadow.mapSize.width = mapsize.x;
        light.shadow.mapSize.height = mapsize.y;

        light.shadow.camera.near = near;
        light.shadow.camera.far = far;
        const [ t, l, r, b ] = Object.values(tlrb).map(parseFloat);
        light.shadow.camera.top = t;
        light.shadow.camera.left = l;
        light.shadow.camera.right = r;
        light.shadow.camera.bottom = b;

        light.castShadow = true;
        this.el.setObject3D('light', light);

        if (helper) {
            this.helper = new THREE.CameraHelper(light.shadow.camera);
            scene.add(this.helper);
        }
        this.light = light;
        this.el.shadowLight = light;
    }
});

AFRAME.registerComponent('shadow-plane', {
    schema: {
        dimensions: { type: 'vec2', default: { x: 10, y: 10 } },
        opacity: { type: 'float', default: 0.2, min: 0, max: 1 }
    },
    init() {
        this.el.sceneEl.renderer.shadowMap.enabled = true;

        const { opacity } = this.data;
        this.material = new THREE.ShadowMaterial({ opacity });
    },
    update(oldData) {
        const diff = AFRAME.utils.diff(oldData, this.data);
        if (diff.dimensions) {
            this.remove();
            this._createPlane();
        }
        this.material.opacity = this.data.opacity;
    },
    remove() {
        if (!this.plane) return;
        this.el.removeObject3D('mesh');
        this.plane = null;
    },
    _createPlane() {
        const { dimensions: { x: w, y: h } } = this.data;
        
        const geo = new THREE.PlaneBufferGeometry(w, h);
        geo.rotateX(-Math.PI/2);
        
        this.plane = new THREE.Mesh(geo, this.material);
        this.plane.receiveShadow = true;
        this.el.setObject3D('mesh', this.plane);
    }
});

AFRAME.registerPrimitive('a-shadow-light', {
    defaultComponents: {
        'shadow-light': {}
    },
    mappings: {
        type: 'shadow-light.type',
        intensity: 'shadow-light.intensity',
        color: 'shadow-light.color',
        target: 'shadow-light.target',
        near: 'shadow-light.near',
        far: 'shadow-light.far',
        tlrb: 'shadow-light.tlrb',
        mapsize: 'shadow-light.mapsize',
        bias: 'shadow-light.bias',
        helper: 'shadow-light.helper'
    }
});

AFRAME.registerPrimitive('a-shadow-plane', {
    defaultComponents: {
        'shadow-plane': {}
    },
    mappings: {
        dimensions: 'shadow-plane.dimensions',
        opacity: 'shadow-plane.opacity'
    }
});