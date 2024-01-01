// se nao me engano o robo precisa ser controlavel pelo teclado

const alpha = 'http://virtual.lab.inf.uva.es:23062/three-js-basics/img/aideus.jpg';

const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

// backgrounds
//renderer.setClearColor(0xFFFFFF)

const textureLoader = new THREE.TextureLoader();
//scene.background = textureLoader.load(dinner);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    alpha,
    alpha,
    alpha,
    alpha,
    alpha,
    alpha
]);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.z = 5;
camera.position.y = 2;
orbit.update();

// add axes helper
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// add box
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00FF00, map: textureLoader.load(alpha) });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);
box.receiveShadow = true;

// add plane 
const planeGeometry = new THREE.PlaneGeometry(7, 7);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

// add grid helper
const gridHelper = new THREE.GridHelper(7);
scene.add(gridHelper);
gridHelper.rotation.x = -0.5 * Math.PI;

// sphere 
const sphereGeometry = new THREE.SphereGeometry(1);
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xffea00 
    //wireframe: true
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.x = -2;
sphere.castShadow = true;

// lights
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

/* directional ligth
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
scene.add(directionalLight);
directionalLight.position.set(-30, 50, 0);
directionalLight.castShadow = true;
//directionalLight.shadow.camera.bottom = -15;

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
scene.add(directionalLightHelper);

const dLigthShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(dLigthShadowHelper);

*/

// spot light
const spotLight = new THREE.SpotLight(0xffffff);
scene.add(spotLight);
spotLight.position.set(1, 1, 0);
spotLight.castShadow = true;

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01);

// shadows

const gui = new dat.GUI();

const options = {
    sphereColor: "#ffea00",
    wireframe: false,
    speed: 0.01,
    angle: 0.2,
    penumbra: 0, 
    intensity: 1
};

gui.addColor(options, "sphereColor").onChange(function (e) {
    sphere.material.color.set(e);
});

gui.add(options, "wireframe").onChange(function (e) {
    sphere.material.wireframe = e;
    box.material.wireframe = e;
})

gui.add(options, "speed", 0, 0.1);

gui.add(options, "angle", 0, 1);
gui.add(options, "penumbra", 0, 1);
gui.add(options, "intensity", 0, 1);

let step = 0;

function animate(time) {
    // animation to rotate box
    box.rotation.x = time / 1000;
    box.rotation.y = time / 1000;

    // animation to make the sphere go up and down
    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step));

    // spotlight changes
    spotLight.angle = options.angle;
    spotLight.penumbra = options.penumbra;
    spotLight.intensity = options.intensity;

    spotLightHelper.update();

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate)


window.addEventListener("resize", function () {
    camera.aspect = this.window.innerWidth / this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(this.window.innerWidth, this.window.innerHeight);
})
