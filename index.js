AFRAME.registerComponent('shadow-light', {
    schema: {
        type: { type: 'string', default: 'directional', oneOf: [ 'directional', 'spot' ] },
        intensity: { type: 'float', default: 0.5, min: 0 },
        color: { type: 'color', default: 'white' },
        angle: { type: 'float', default: -Math.PI/5 },
        near: { type: 'float', default: 1 },
        far: { type: 'float', default: 5 },
        tlrb: { type: 'vec4', default: { x: 5, y: -5, z: 5, w: -5 } },
        mapSize: { type: 'vec2', default: { x: 1024, y: 1024 } },
        bias: { type: 'float', default: 0 },
        helper: { type: 'boolean', default: false }
    },
    init() {
        const { el, data: { type, color, intensity, angle, bias, mapSize, near, far, tlrb, helper } } = this;
        const { object3D: scene } = el.sceneEl;

        const light = type == 'directional' ? 
            new THREE.DirectionalLight(color, intensity):
            new THREE.SpotLight(color, intensity);
        light.angle = angle;
        
        light.shadow.bias = bias;
        light.shadow.mapSize.width = mapSize.x;
        light.shadow.mapSize.height = mapSize.y;

        light.shadow.camera.near = near;
        light.shadow.camera.far = far;
        const [ top, left, right, bottom ] = Object.values(tlrb).map(function(a) { return parseFloat(a) });
        light.shadow.camera.top = top;
        light.shadow.camera.left = left;
        light.shadow.camera.right = right;
        light.shadow.camera.bottom = bottom;

        light.castShadow = true;
        el.setObject3D('light', light);

        if (helper) {
            this.helper = new THREE.CameraHelper(light.shadow.camera);
            scene.add(this.helper);
        }
        this.light = light;

        // el.sceneEl.renderer.shadowMap.enabled = true;
    }
});

AFRAME.registerComponent('shadow-plane', {
    schema: {
        dimensions: { type: 'vec2', default: { x: 100, y: 100 } },
        opacity: { type: 'float', default: 0.2, min: 0, max: 1 }
    },
    init() {
        const { el, data: { dimensions, opacity } } = this;
        const planeGeometry = new THREE.PlaneBufferGeometry(dimensions.x, dimensions.y);
        planeGeometry.rotateX(-Math.PI/2);
        const planeMaterial = new THREE.ShadowMaterial({ opacity });

        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.y = 0;
        plane.receiveShadow = true;
        el.setObject3D('mesh', plane);

        // el.sceneEl.renderer.shadowMap.enabled = true;
    }
});

window.addEventListener('load', function() {
    const onxrloaded = function() {
        const [ SCENE ] = AFRAME.scenes;
        if (!SCENE) return setTimeout(onxrloaded, 100);
        SCENE.renderer.shadowMap.enabled = true;
    }
    if (window.XR8) onxrloaded();
    else window.addEventListener('xrloaded', onxrloaded);
});