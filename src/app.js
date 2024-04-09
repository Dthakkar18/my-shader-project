import * as THREE from 'three'
import { addPass, useCamera, useGui, useRenderSize, useScene, useTick } from './render/init.js'
// import postprocessing passes
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'


const startApp = () => {
  const scene = useScene()
  const camera = useCamera()
  const gui = useGui()
  const { width, height } = useRenderSize()

  // lighting
  const dirLight = new THREE.DirectionalLight('#526cff', 0.6)
  dirLight.position.set(2, 2, 2)

  const ambientLight = new THREE.AmbientLight('#4255ff', 0.5)
  scene.add(dirLight, ambientLight)

  
  
  // a RawShaderMaterial would enable us to have more control/freedom without the defaults
  const material = new THREE.ShaderMaterial({ 
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  })
  //console.log(material)

  
  // all the uniforms
  material.uniforms.uTime = {value: 0};
  material.uniforms.coloring = {value: new THREE.Vector3(0.0,0.0,0.0)}
  material.uniforms.glowing = {value: new THREE.Vector3(0.0,0.4,0.0)}
  material.uniforms.waveNum = {value: 3.0}
  material.uniforms.wantPerlinNoise = {value: true}
  material.uniforms.wantSimplexNoise = {value: false}
  material.uniforms.pushVertices = {value : true}
  material.uniforms.useSphere = {value: true}
  //console.log(camera.position)


  // the obj
  let geometry = new THREE.IcosahedronGeometry(1, 200)

  const ico = new THREE.Mesh(geometry, material)
  scene.add(ico)


  // the params used in the gui
  let coloringParams = {
    rgbColor: { r: 0, g: 0.2, b: 0.4 },
  };

  let glowingParams = {
    items: { strength: 0.0, radius: 0.4, threshold: 0.0 },
  };

  let distortionParams = {
    items: { waves: 3.0, push_vertices: true }
  }

  let noiseParams = {
    items: { perlin_noise: true, simplex_noise: false }
  }


  // the gui
  const cameraFolder = gui.addFolder('Camera')
  cameraFolder.add(camera.position, 'x', 0, 10)
  cameraFolder.add(camera.position, 'y', 0, 10)
  cameraFolder.add(camera.position, 'z', 0, 10)
  cameraFolder.open()

  const coloringFolder = gui.addFolder("Obj Color")
  coloringFolder.add( coloringParams.rgbColor, 'r', 0, 1 )
  coloringFolder.add( coloringParams.rgbColor, 'g', 0, 1 )
  coloringFolder.add( coloringParams.rgbColor, 'b', 0, 1 )
  coloringFolder.open()

  const glowingFolder = gui.addFolder("Glow")
  glowingFolder.add(glowingParams.items, 'strength', 0, 1)
  glowingFolder.add(glowingParams.items, 'radius', 0, 1)
  glowingFolder.add(glowingParams.items, 'threshold', 0, 0.2)
  glowingFolder.open()

  // add distortion folder
  const distortionFolder = gui.addFolder("Distortion")
  distortionFolder.add(distortionParams.items, "waves", 1, 10)
  distortionFolder.add(distortionParams.items, "push_vertices")
  distortionFolder.open()

  const noiseFolder = gui.addFolder("Noise")
  noiseFolder.add(noiseParams.items, "perlin_noise")
  noiseFolder.add(noiseParams.items, "simplex_noise")
  noiseFolder.open()

  // postprocessing
  const renderTargetParameters = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    stencilBuffer: false,
  }


  // postprocessing
  // below is adding a glow affect
  let bloom = new UnrealBloomPass(new THREE.Vector2(width, height), 0.7, 0.4, 0.4)
  addPass(bloom)

  useTick(({ timestamp, timeDiff }) => {
    const time = timestamp / 5000
    material.uniforms.uTime.value = time

    // pass rgb to uniform that is used in fragment shader
    material.uniforms.coloring.value.x = coloringParams.rgbColor.r
    material.uniforms.coloring.value.y = coloringParams.rgbColor.g
    material.uniforms.coloring.value.z = coloringParams.rgbColor.b
    
    // pass glowing params to the bloom 
    bloom.strength = glowingParams.items.strength
    bloom.radius = glowingParams.items.radius
    bloom.threshold = glowingParams.items.threshold

    // pass the distortion to the uniform that is used in the fragment shader
    material.uniforms.waveNum.value = distortionParams.items.waves
    material.uniforms.wantPerlinNoise.value = noiseParams.items.perlin_noise
    material.uniforms.wantSimplexNoise.value = noiseParams.items.simplex_noise
    material.uniforms.pushVertices.value = distortionParams.items.push_vertices

    
  })
}

export default startApp
