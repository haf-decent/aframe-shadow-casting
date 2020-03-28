# aframe-shadow-casting
AFRAME components for real-time shadow casting on a transparent ground plane using custom lighting components and THREE.js ShadowMaterial

## Inspiration
I was working on a project using AFRAME and 8th Wall to create a mobile webAR experience, and wanted to add real-time shadows to my scene. [AFRAME documentation](https://aframe.io/docs/0.9.0/components/light.html#adding-real-time-shadows) includes a section on real-time shadows, but that method only works if the receiving plane is opaque, which isn't ideal for AR applications. So I wrote this.

It includes two components - shadow-light and shadow-plane - and a small function that configures the renderer to enable shadows for use in your AFRAME projects. 

## Installation
Working on it - for now, just copy and paste.

## How to Use
Once installed in your project, you can add the components to regular a-entity elements in your html files:

    ...
    
    <a-entity
      id="directional-light"
      shadow-light="type: directional; intensity: 0.8; helper: true">
    </a-entity>
    
    <a-entity
      id="shadow-plane"
      shadow-plane="opacity: 0.4">
    </a-entity>
    
    ...
    
The shadow-light component creates a directional or spot light in the scene that casts shadows with a configurable shadow camera. The shadow-plane component creates a ground plane that receives shadows. 

I left these as components as opposed to custom elements to allow you to set position, rotation, scale, etc in the a-entity tag rather than adding those properties to each component.

## Configuration

### shadow-light

| Property  | type    | default                      | constraints                                                        | description                                                                                                              |
|-----------|---------|------------------------------|--------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| type      | string  | directional                  | "directional" or "spot"                                            | Determines the type of THREE.js light that is added to the scene                                                         |
| intensity | float   | 0.5                          | > 0                                                                | Intensity of light                                                                                                       |
| color     | color   | 'white'                      | [a valid THREE Color](https://threejs.org/docs/#api/en/math/Color) | Color of light                                                                                                           |
| angle     | float   | -Math.PI/5                   |                                                                    | Angle of light (0 is straight down)                                                                                      |
| near      | float   | 1                            | > 0                                                                | 'near' property of shadow camera                                                                                         |
| far       | float   | 5                            | > near                                                             | 'far' property of shadow camera                                                                                          |
| tlrb      | vec4    | { x: 5, y: -5, z: 5, w: -5 } |                                                                    | 'top', 'left', 'right', 'bottom' properties of shadow camera                                                             |
| mapSize   | vec2    | { x: 1024, y: 1024 }         | powers of 2                                                        | determines resolution of shadow (width, height) - higher resolution means smoother shadows at the cost of computing time |
| bias      | float   | 0                            |                                                                    | see [THREE documentation](https://threejs.org/docs/#api/en/lights/shadows/LightShadow.bias)                              |
| helper    | boolean | false                        |                                                                    | adds a visualizer to help debug / configure the shadow camera                                                       |

### shadow-plane
| Property   | type    | default                      | constraints                                                        | description                                                                                                              |
|------------|---------|------------------------------|--------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| dimensions | vec2  | { x: 100, y: 100 }             | > 0                                            | Defines dimensions (width, height) of ground plane                    |
| opacity    | float   | 0.2                          | 0-1                                                                | Opacity of shadow                                                                                                       |





## Enjoy
