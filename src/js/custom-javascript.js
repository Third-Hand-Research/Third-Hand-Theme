import {
    WebGLRenderer,
    PerspectiveCamera,
    Scene,
    Mesh,
    PlaneBufferGeometry,
    GridHelper,
    AxesHelper,
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
import { GUI } from 'dat.gui';

let container, scene, camera, renderer, robot, robotTwo, controls;
let robotLoaded = false

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 1 / DEG2RAD;

const gui = new GUI()
const roboFolder = gui.addFolder('Robot 1')
const roboTwoFolder = gui.addFolder('Robot 2')

init();
render();


function init() {

    container = document.getElementById('keyvisual');

    scene = new Scene();
    //scene.background = new Color(0x5533ff);

    camera = new PerspectiveCamera();
    camera.position.set(1, 1, 1);
    camera.lookAt(0, 0, 0);

    renderer = new WebGLRenderer({ antialias: true , alpha: true});
    renderer.setClearColor( 0x000000, 0 ); // the default
    renderer.outputEncoding = sRGBEncoding;
    renderer.shadowMap.enabled = false;
    renderer.shadowMap.type = PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const directionalLight = new DirectionalLight(0xffffff, 1.0);
    directionalLight.castShadow = false;
    directionalLight.shadow.mapSize.setScalar(1024);
    directionalLight.position.set(5, 30, 5);
    scene.add(directionalLight);

    const ambientLight = new AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    //const grid = new GridHelper( 20, 20, 0xffffff, 0xffffff );
	//scene.add( grid );

    // const ground = new Mesh(new PlaneBufferGeometry(), new ShadowMaterial({ opacity: 0.25 }));
    // ground.rotation.x = -Math.PI / 2;
    // ground.scale.setScalar(30);
    // ground.receiveShadow = false;
    // scene.add(ground);

    //const axesHelper = new AxesHelper( 5 );
    //scene.add( axesHelper );

    controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 0.4;
    controls.target.y = 1; 
    controls.enableZoom = false;
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

        robot.rotation.x = 0;
        robot.traverse(c => {
            c.castShadow = true;
        });

        robot.joints['elbow_joint'].setJointValue(MathUtils.degToRad(20));
        robot.joints['shoulder_lift_joint'].setJointValue(MathUtils.degToRad(60));
        robot.joints['shoulder_pan_joint'].setJointValue(MathUtils.degToRad(120));
        robot.joints['wrist_1_joint'].setJointValue(MathUtils.degToRad(30));
        robot.joints['wrist_2_joint'].setJointValue(MathUtils.degToRad(60));
        robot.joints['wrist_3_joint'].setJointValue(MathUtils.degToRad(60));

        robot.updateMatrixWorld(true);

        const bb = new Box3();
        bb.setFromObject(robot);

        robot.position.y -= bb.min.y;

        scene.add(robot);

        robotTwo = robot.clone();
        robotTwo.rotation.y = Math.PI / 2;
        
        robot.position.y += 1;
        
        scene.add(robotTwo);


        roboFolder.add(robot.rotation, 'x', 0, Math.PI * 2)
        roboFolder.add(robot.rotation, 'y', 0, Math.PI * 2)
        roboFolder.add(robot.rotation, 'z', 0, Math.PI * 2)
        roboFolder.add(robot.position, 'x', -10, 10)
        roboFolder.add(robot.position, 'y', -10, 10)
        roboFolder.add(robot.position, 'z', -10, 10)
        roboFolder.open()
        roboTwoFolder.add(robotTwo.rotation, 'x', 0, Math.PI * 2)
        roboTwoFolder.add(robotTwo.rotation, 'y', 0, Math.PI * 2)
        roboTwoFolder.add(robotTwo.rotation, 'z', 0, Math.PI * 2)
        roboTwoFolder.add(robotTwo.position, 'x', -10, 10)
        roboTwoFolder.add(robotTwo.position, 'y', -10, 10)
        roboTwoFolder.add(robotTwo.position, 'z', -10, 10)
        roboTwoFolder.open()

        robotLoaded = true
    };

    onResize();
    window.addEventListener('resize', onResize);

}

// init animation
function updateAngles() {

    // animate the arm
    var time = Date.now() / 3e2 * 0.1; 

    const offset =  Math.PI / 3;
    const ratio = Math.sin(time + offset);
  
    //container.setJointValue(`elbow_joint`, MathUtils.lerp(30, 0, ratio) * DEG2RAD);
    //console.log(robot.joints);
    console.log(robot.joints);
    robot.joints['elbow_joint'].setJointValue(MathUtils.lerp(-80, 80, ratio) * DEG2RAD);
    robot.joints['shoulder_lift_joint'].setJointValue(MathUtils.lerp(90, 150, ratio) * DEG2RAD);
    robot.joints['shoulder_pan_joint'].setJointValue(MathUtils.lerp(-80, 60, ratio) * DEG2RAD);
    robot.joints['wrist_1_joint'].setJointValue(MathUtils.lerp(-30, 80, ratio) * DEG2RAD);
    robot.joints['wrist_2_joint'].setJointValue(MathUtils.lerp(-30, 100, ratio) * DEG2RAD);
    robot.joints['wrist_3_joint'].setJointValue(MathUtils.lerp(30, 120, ratio) * DEG2RAD);

    robotTwo.joints['elbow_joint'].setJointValue(MathUtils.lerp(-20, 60, ratio) * DEG2RAD);
    robotTwo.joints['shoulder_lift_joint'].setJointValue(MathUtils.lerp(160, 120, ratio) * DEG2RAD);
    robotTwo.joints['shoulder_pan_joint'].setJointValue(MathUtils.lerp(-80, 60, ratio) * DEG2RAD);
    robotTwo.joints['wrist_1_joint'].setJointValue(MathUtils.lerp(-10, 80, ratio) * DEG2RAD);
    robotTwo.joints['wrist_2_joint'].setJointValue(MathUtils.lerp(-120, 100, ratio) * DEG2RAD);
    robotTwo.joints['wrist_3_joint'].setJointValue(MathUtils.lerp(-30, 120, ratio) * DEG2RAD);


};

function generateRandomIntegerInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function onResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}


function render() {

    console.log("hello");
    if (robotLoaded) updateAngles();

    requestAnimationFrame(render);
    renderer.render(scene, camera);

}
