/*
Rose 3D

https://codepen.io/wakana-k/pen/LYgREZb
*/

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";

let container;
let camera, scene, renderer, controls;
let manager;
let object;
let material = new THREE.MeshStandardMaterial({
  metalness: 0,
  roughness: 0.8,
  //map: texture
  side: THREE.DoubleSide
});

/*
// texture
const textureLoader = new THREE.TextureLoader(manager);
const texture = textureLoader.load(
  "https://happy358.github.io/Images/HDR/leadenhall_market_1k_s.jpg"
);
material.envMap = texture;
*/

init();
animate();

function init() {
  container = document.createElement("div");
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(
    33, //45
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  camera.position.y = 150;
  camera.position.z = 250;

  // scene
  scene = new THREE.Scene();
  //scene.background = 0x000000;

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 0.5);
  pointLight.castShadow = true;
  camera.add(pointLight);
  scene.add(camera);

  // manager
  function loadModel() {
    object.traverse(function (child) {
      if (child.isMesh) {
        //child.material.color.set(0xff0000);
        if (child.name == "rose") {
          material = material.clone();
          material.color.set("crimson"); 
        } else if (child.name == "calyx") {
          material = material.clone();
          material.color.set("#001a14");
        } else if (child.name == "leaf1" || child.name == "leaf2") {
          material = material.clone();
          material.color.set("#00331b");
        }
        child.material = material;
      }
    });
    object.rotation.set(0, Math.PI / 1.7, 0);
    object.receiveShadow = true;
    object.castShadow = true;
    scene.add(object);
  }

  manager = new THREE.LoadingManager(loadModel);

  // model
  function onProgress(xhr) {
    if (xhr.lengthComputable) {
      const percentComplete = (xhr.loaded / xhr.total) * 100;
      //console.log("model " + Math.round(percentComplete, 2) + "% downloaded");
    }
  }
  function onError() {}

  const loader = new OBJLoader(manager);
  loader.load(
    "https://happy358.github.io/Images/Model/red_rose3.obj",
    function (obj) {
      object = obj;
    },
    onProgress,
    onError
  );

  //
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  //
  controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true; //true
  controls.autoRotateSpeed = 2;
  controls.enableDamping = true;
  controls.enablePan = false;
  //controls.minDistance = 2;
  //controls.maxDistance = 14;
  controls.minPolarAngle = 0;
  controls.maxPolarAngle = Math.PI / 2;
  controls.target.set(0, 0, 0);
  controls.update();

  //
  window.addEventListener("resize", onWindowResize);
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
//
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();
}
function render() {
  renderer.render(scene, camera);
}