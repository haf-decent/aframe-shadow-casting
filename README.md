# aframe-shadow-casting
AFRAME components & primitives for real-time shadow casting on a transparent ground plane using custom lighting components and THREE.js ShadowMaterial

## Inspiration
I was working on a project using AFRAME and 8th Wall to create a mobile webAR experience, and wanted to add real-time shadows to my scene. [AFRAME documentation](https://aframe.io/docs/0.9.0/components/light.html#adding-real-time-shadows) includes a section on real-time shadows, but that method only works if the receiving plane is opaque, which isn't ideal for AR applications. So I wrote this.

It includes two components - shadow-light and shadow-plane - and two primitives - `<a-shadow-light>` and `<a-shadow-plane>` - for use in your AFRAME and/or 8th Wall projects. 

## Installation
`npm i aframe-shadow-casting`

## How to Use
Once installed in your project, you can either add the custom element tags directly or use the components on other AFRAME entities:

```html
<a-shadow-light
    id="spot-light-primitive"
    type="spot"
    mapsize="2048 2048"
    far="20">
</a-shadow-light>
<a-entity
  id="directional-light-entity"
  shadow-light="type: directional; intensity: 0.8; helper: true">
</a-entity>
    
<a-shadow-plane
    id="shadow-plane-primitive
    dimensions="20 20">
</a-shadow-plane>
<a-entity
  id="shadow-plane-entity"
  shadow-plane="opacity: 0.4">
</a-entity>
```
    
The shadow-light component creates a directional or spot light in the scene that casts shadows with a configurable shadow camera. The shadow-plane component creates a ground plane that receives shadows. Make sure you add the `shadow` component to any objects in your scene that you want to cast shadows:

```html
<a-entity gltf-model="#myModel" shadow="receive: false"></a-entity>
```


## Configuration

### shadow-light

| Property  | type    | default                      | constraints                                                        | description                                                                                                              |
|-----------|---------|------------------------------|--------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| type      | string  | directional                  | "directional" or "spot"                                            | Determines the type of THREE.js light that is added to the scene                                                         |
| intensity | float   | 0.5                          | > 0                                                                | Intensity of light                                                                                                       |
| color     | color   | 'white'                      | [a valid THREE Color](https://threejs.org/docs/#api/en/math/Color) | Color of light                                                                                                           |
| target     | vec3   | { x: 0, y: 0, z: 0}          |                                                                    | Light will rotate to face target point                                                                                      |
| near      | float   | 1                            | > 0                                                                | 'near' property of shadow camera                                                                                         |
| far       | float   | 5                            | > near                                                             | 'far' property of shadow camera                                                                                          |
| tlrb      | vec4    | { x: 5, y: -5, z: 5, w: -5 } |                                                                    | 'top', 'left', 'right', 'bottom' properties of shadow camera                                                             |
| mapSize   | vec2    | { x: 1024, y: 1024 }         | powers of 2                                                        | determines resolution of shadow (width, height) - higher resolution means smoother shadows at the cost of computing time |
| bias      | float   | -0.000222                    |                                                                    | see [THREE documentation](https://threejs.org/docs/#api/en/lights/shadows/LightShadow.bias)                              |
| helper    | boolean | false                        |                                                                    | adds/removes a visualizer to help debug / configure the shadow camera                                                       |

You also have the ability to access the light directly through its element using the `shadowLight` property. This can be helpful for setting other attributes of the light that aren't included in the component - like the angle of a spotlight

```javascript
var spotlight = document.querySelector('a-shadow-light');
spotlight.shadowLight.angle = Math.PI/2;
```
You can find all properties of [Directional](https://threejs.org/docs/#api/en/lights/DirectionalLight) and [Spot](https://threejs.org/docs/#api/en/lights/SpotLight) Lights in the THREEjs documentation.


### shadow-plane
| Property   | type    | default                      | constraints                                                        | description                                                                                                              |
|------------|---------|------------------------------|--------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| dimensions | vec2  | { x: 10, y: 10 }               | > 0                                            | Defines dimensions (width, height) of ground plane                    |
| opacity    | float   | 0.2                          | 0-1                                                                | Opacity of shadow                                                                                                       |

## Example
In this repo, you'll find an example webpage (creatively named 'example.html') that you can reference. It creates a simple scene with a levitating ball casting a shadow on the ground. 

![example gif](https://i.imgur.com/L6TthjW.gif)

It's not all that impressive considering you can't tell if the shadow-plane is actually transparent or not, so if you'd like to see an AR application, you can check out a video of an 8th Wall WebAR experience I created [here](https://www.instagram.com/p/CAxExG9naGB/?igshid=1oowqiukewn05)


## Enjoy
