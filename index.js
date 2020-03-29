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
        const { data, el } = this;
        const { object3D: scene } = el.sceneEl;

        const light = data.type == 'directional' ? 
            new THREE.DirectionalLight(data.color, data.intensity):
            new THREE.SpotLight(data.color, data.intensity);
        light.angle = data.angle;
        
        light.shadow.bias = data.bias;
        light.shadow.mapSize.width = data.mapSize.x;
        light.shadow.mapSize.height = data.mapSize.y;

        light.shadow.camera.near = data.near;
        light.shadow.camera.far = data.far;
        const tlrb = Object.values(data.tlrb)
            .map(function(a) { return parseFloat(a) });
        light.shadow.camera.top = tlrb[0];
        light.shadow.camera.left = tlrb[1];
        light.shadow.camera.right = tlrb[2];
        light.shadow.camera.bottom = tlrb[3];

        light.castShadow = true;
        el.setObject3D('light', light);

        if (data.helper) {
            this.helper = new THREE.CameraHelper(light.shadow.camera);
            scene.add(this.helper);
        }
        this.light = light;
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
})