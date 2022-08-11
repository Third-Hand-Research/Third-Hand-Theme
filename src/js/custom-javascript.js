import {
    WebGLRenderer,
    PerspectiveCamera,
    Scene,
    Mesh,
    PlaneBufferGeometry,
    ShadowMaterial,
    DirectionalLight,
    PCFSoftShadowMap,
    sRGBEncoding,
    Color,
    AmbientLight,
    Box3,
    LoadingManager,
    MathUtils,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import URDFLoader from './vendor/urdf-loader/src/URDFLoader.js';
import URDFManipulator from './vendor/urdf-loader/src/urdf-manipulator-element.js';


let scene, camera, renderer, robot, controls;


init();
render();

function init() {

    scene = new Scene();
    scene.background = new Color(0xaf8888);

    camera = new PerspectiveCamera();
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);

    renderer = new WebGLRenderer({ antialias: true });
    renderer.outputEncoding = sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    const directionalLight = new DirectionalLight(0xffffff, 1.0);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.setScalar(1024);
    directionalLight.position.set(5, 30, 5);
    scene.add(directionalLight);

    const ambientLight = new AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const ground = new Mesh(new PlaneBufferGeometry(), new ShadowMaterial({ opacity: 0.25 }));
    ground.rotation.x = -Math.PI / 2;
    ground.scale.setScalar(30);
    ground.receiveShadow = true;
    scene.add(ground);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 2;
    controls.target.y = 1;
    controls.update();

    // Load robot
    const manager = new LoadingManager();
    const loader = new URDFLoader(manager);
    loader.packages = {
      packageName : '/wp-content/themes/third-hand/src/urdf/'            // The equivalent of a (list of) ROS package(s):// directory
    };
    loader.load('/wp-content/themes/third-hand/src/urdf/ur10/ur10.urdf', result => {
        robot = result;

    });

    // wait until all the geometry has loaded to add the model to the scene
    manager.onLoad = () => {

        robot.rotation.x = Math.PI / 2;
        robot.traverse(c => {
            c.castShadow = true;
        });

        robot.joints[`elbow_joint`].setJointValue(MathUtils.degToRad(30));
        robot.joints[`shoulder_lift_joint`].setJointValue(MathUtils.degToRad(120));
        robot.joints[`shoulder_pan_joint`].setJointValue(MathUtils.degToRad(-60));
        robot.joints[`wrist_1_joint`].setJointValue(MathUtils.degToRad(30));
        robot.joints[`wrist_2_joint`].setJointValue(MathUtils.degToRad(120));
        robot.joints[`wrist_3_joint`].setJointValue(MathUtils.degToRad(-60));

        robot.updateMatrixWorld(true);

        const bb = new Box3();
        bb.setFromObject(robot);

        robot.position.y -= bb.min.y;
        scene.add(robot);

    };

    onResize();
    window.addEventListener('resize', onResize);

}

function onResize() {

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

}

function render() {

    requestAnimationFrame(render);
    renderer.render(scene, camera);

}
