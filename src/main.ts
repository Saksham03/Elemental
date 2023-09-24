import {vec3, vec4, mat4, glMatrix, quat} from 'gl-matrix';
const Stats = require('stats-js');
import * as DAT from 'dat.gui';
import Icosphere from './geometry/Icosphere';
import Square from './geometry/Square';
import Cube from './geometry/Cube';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  tesselations: 5,
  'Load Scene': loadScene, // A function pointer, essentially
  geomColor: [183,140,17]
};

let icosphere: Icosphere;
let outerFlame: Icosphere;
let leftBrow: Icosphere;
let rightBrow: Icosphere;
let eyeBasic: Icosphere;
let eyelash: Icosphere;
let eyeball: Icosphere;
let square: Square;
let cube: Cube;
let prevTesselations: number = 5;
let time: number = 0;
let camPos: vec3 = vec3.fromValues(0, 0, 5);
let lefBrowPos: vec3 = vec3.fromValues(-0.6, -0.7, 2.9);
let leftEyePos: vec3 = vec3.fromValues(-0.55,-0.4, 0.9);
let leftEyeballPos: vec3 = vec3.fromValues(-0.45,-0.363, 0.9);
let radius: number = 1;
let browRadius: number = radius * 0.25;
let lashRadius: number = radius * 0.32;
let eyeballRadius: number = radius * 0.133;
let outerFlameRadiusScale: number = 1.06;

function loadScene() {  
  icosphere = new Icosphere(vec3.fromValues(0, 0, 0), radius, controls.tesselations);
  icosphere.create();
  outerFlame = new Icosphere(vec3.fromValues(0, 0, 0), radius, controls.tesselations);
  outerFlame.create();
  leftBrow = new Icosphere(lefBrowPos, browRadius, controls.tesselations);
  leftBrow.create();
  rightBrow = new Icosphere(vec3.fromValues(-lefBrowPos[0],lefBrowPos[1], lefBrowPos[2]), browRadius, controls.tesselations);
  rightBrow.create();
  eyeBasic = new Icosphere(vec3.fromValues(0, 0, 0), browRadius, controls.tesselations);
  eyeBasic.create();
  eyelash = new Icosphere(vec3.fromValues(0, 0, 0), lashRadius, controls.tesselations);
  eyelash.create();
  eyeball = new Icosphere(vec3.fromValues(0, 0, 0), eyeballRadius, controls.tesselations);
  eyeball.create();
  square = new Square(vec3.fromValues(5, 5, 5));
  square.create();
  cube = new Cube(vec3.fromValues(5, 5, 5));
  cube.create();
}

function main() {
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();
  gui.add(controls, 'tesselations', 0, 8).step(1);
  gui.add(controls, 'Load Scene');
  gui.addColor(controls, 'geomColor');

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();

  const camera = new Camera(camPos, vec3.fromValues(0, 0, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.2, 0.2, 0.2, 1);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
 
  const baseEmber = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/fireball-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/iridescent-flame-frag.glsl')),
  ]);

  const flame = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/fireball-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/fireball-frag.glsl')),
  ]);

  const browShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/eyebrow-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/iridescent-flame-frag.glsl')),
  ]);

  const eyeShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/eye-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/flat-frag.glsl')),
  ]);

  const eyeLashShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/eyelash-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/flat-frag.glsl')),
  ]);

  const eyeballShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/lambert-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/eyeball-frag.glsl')),
  ]);

  // This function will be called every frame
  function tick() {
    camera.update();
    stats.begin();
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();
    time++;
    
    if(controls.tesselations != prevTesselations)
    {
      prevTesselations = controls.tesselations;
      icosphere = new Icosphere(vec3.fromValues(0, 0, 0), radius, prevTesselations);
      icosphere.create();
      outerFlame = new Icosphere(vec3.fromValues(0, 0, 0), radius, prevTesselations);
      outerFlame.create();
      leftBrow = new Icosphere(lefBrowPos, browRadius, prevTesselations);
      leftBrow.create();
      rightBrow = new Icosphere(vec3.fromValues(-lefBrowPos[0],lefBrowPos[1], lefBrowPos[2]), browRadius, prevTesselations);
      rightBrow.create();
      eyeBasic = new Icosphere(vec3.fromValues(0, 0, 0), browRadius, prevTesselations);
      eyeBasic.create();
      eyelash = new Icosphere(vec3.fromValues(0, 0, 0), lashRadius, prevTesselations);
      eyelash.create();
      eyeball = new Icosphere(vec3.fromValues(0, 0, 0), eyeballRadius, prevTesselations);
      eyeball.create();
    }

    let identityModel = mat4.create();
    mat4.identity(identityModel);
  
    baseEmber.setGeometryColor(vec4.fromValues(controls.geomColor[0]/255, controls.geomColor[1]/255, controls.geomColor[2]/255, 1));
    baseEmber.setTime(time);
    baseEmber.setScale(1);
    baseEmber.setModelMatrix(identityModel);
    baseEmber.setCamPos(vec3.fromValues(camera.controls.eye[0], camera.controls.eye[1], camera.controls.eye[2]));
    renderer.render(camera, baseEmber, [
      icosphere,
    ]);

    browShader.setGeometryColor(vec4.fromValues(controls.geomColor[0]/255, controls.geomColor[1]/255, controls.geomColor[2]/255, 1));
    browShader.setTime(time);
    browShader.setScale(1);
    browShader.setModelMatrix(identityModel);
    browShader.setCamPos(vec3.fromValues(camera.controls.eye[0], camera.controls.eye[1], camera.controls.eye[2]));
    renderer.render(camera, browShader, [
      leftBrow,
      rightBrow
    ]);

    //rendering the two eyes

    //left eye
    let eye_zrot: number = -15;
    let eye_yrot: number = -10;
    eyeShader.setGeometryColor(vec4.fromValues(1, 1, 1, 1));
    let eyeModelMatrix: mat4 = mat4.create();
    let rot: quat = quat.create();
    quat.rotateZ(rot, rot, glMatrix.toRadian(eye_zrot));
    quat.rotateY(rot, rot, glMatrix.toRadian(eye_yrot));
    mat4.fromRotationTranslation(eyeModelMatrix, rot, leftEyePos);
    eyeShader.setModelMatrix(eyeModelMatrix);
    eyeShader.setRadius(browRadius);
    renderer.render(camera, eyeShader, [
      eyeBasic,
    ]);
    

    //right eye
    quat.identity(rot);
    mat4.identity(eyeModelMatrix);
    quat.rotateZ(rot, rot, glMatrix.toRadian(-eye_zrot));
    quat.rotateY(rot, rot, glMatrix.toRadian(-eye_yrot)); 
    mat4.fromRotationTranslationScale(eyeModelMatrix, rot, vec3.fromValues(-leftEyePos[0], leftEyePos[1], leftEyePos[2]), vec3.fromValues(-1,1,1));   
    eyeShader.setModelMatrix(eyeModelMatrix);
    eyeShader.setRadius(browRadius);
    renderer.render(camera, eyeShader, [
      eyeBasic,
    ]);

    //rendering the two eyeslashes

    //left eyelash
    let additional_lash_rot: number = -3.2;
    eyeLashShader.setGeometryColor(vec4.fromValues(0.8, 0.2, 0.2, 1));
    quat.identity(rot);
    mat4.identity(eyeModelMatrix);
    quat.rotateZ(rot, rot, glMatrix.toRadian(eye_zrot));
    quat.rotateY(rot, rot, glMatrix.toRadian(eye_yrot));
    mat4.fromRotationTranslation(eyeModelMatrix, rot, leftEyePos);
    mat4.translate(eyeModelMatrix, eyeModelMatrix, vec3.fromValues(browRadius - lashRadius + 0.03, 0, -0.01));
    let rot_after_trans: mat4 = mat4.create();
    mat4.rotateZ(rot_after_trans, rot_after_trans, glMatrix.toRadian(additional_lash_rot));
    mat4.multiply(eyeModelMatrix, rot_after_trans, eyeModelMatrix);
    eyeLashShader.setModelMatrix(eyeModelMatrix);
    eyeLashShader.setRadius(lashRadius);
    renderer.render(camera, eyeLashShader, [
      eyelash,
    ]);

    //right eyelash
    quat.identity(rot);
    mat4.identity(eyeModelMatrix);
    quat.rotateZ(rot, rot, glMatrix.toRadian(-eye_zrot));
    quat.rotateY(rot, rot, glMatrix.toRadian(-eye_yrot));
    mat4.fromRotationTranslationScale(eyeModelMatrix, rot, vec3.fromValues(-leftEyePos[0], leftEyePos[1], leftEyePos[2]), vec3.fromValues(-1,1,1));
    mat4.translate(eyeModelMatrix, eyeModelMatrix, vec3.fromValues(browRadius - lashRadius + 0.03, 0, -0.01));
    mat4.identity(rot_after_trans);
    mat4.rotateZ(rot_after_trans, rot_after_trans, glMatrix.toRadian(-additional_lash_rot));
    mat4.multiply(eyeModelMatrix, rot_after_trans, eyeModelMatrix);
    eyeLashShader.setModelMatrix(eyeModelMatrix);
    renderer.render(camera, eyeLashShader, [
      eyelash,
    ]);

    //render the eyeballs

    //left eyeball
    mat4.identity(eyeModelMatrix);
    mat4.fromTranslation(eyeModelMatrix, leftEyeballPos);
    eyeballShader.setGeometryColor(vec4.fromValues(0.8, 0.2, 0.2, 1));
    eyeballShader.setModelMatrix(eyeModelMatrix);
    eyeballShader.setTime(time);
    eyeballShader.setRadius(eyeballRadius);
    renderer.render(camera, eyeballShader, [
      eyeball
    ]);

    //right eyeball
    mat4.identity(eyeModelMatrix);
    mat4.fromTranslation(eyeModelMatrix, vec3.fromValues(-leftEyeballPos[0], leftEyeballPos[1], leftEyeballPos[2]));
    eyeballShader.setModelMatrix(eyeModelMatrix);
    eyeballShader.setTime(time);
    eyeballShader.setRadius(eyeballRadius);
    renderer.render(camera, eyeballShader, [
      eyeball
    ]);

    flame.setTime(time);
    flame.setScale(outerFlameRadiusScale);
    flame.setModelMatrix(identityModel);
    renderer.render(camera, flame, [
      // outerFlame,
    ]);

    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();

  // Start the render loop
  tick();
}

main();
