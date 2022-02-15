import * as THREE from 'three';
import * as CANNON from 'cannon-es';

import { Resources } from './Resources';
import { Renderer } from './Renderer';
import { Camera } from './Camera';
import { PostProcessing } from './PostProcessing';
import { Physic } from './Physic';
import { InputManager } from './Core/InputSystem/InputManager';
import { LoadingScreen } from './LoadingScreen';
import { Actor } from './Core/Actor/Actor';
import { Character } from './Actors/Character/Character';
import { Floor } from './Actors/Floor';
import { Box } from './Actors/Box';
import { Ball } from './Actors/Ball';

export default class App {
    private resources: Resources;
    private scene: THREE.Scene;
    private renderer: Renderer;
    private camera: Camera;
    private postProcessing: PostProcessing;
    private physic: Physic;
    private inputManager: InputManager;
    private lights: Array<THREE.Light>;
    private actors: Array<Actor>;
    private clock: THREE.Clock;
    private loadingScreen: LoadingScreen;

    constructor () {
        this.scene = new THREE.Scene();
        this.renderer = new Renderer();
        this.resources = new Resources(this.renderer.get());
        this.camera = new Camera(this.renderer.get());
        this.postProcessing = new PostProcessing(this.renderer.get(), this.scene, this.camera.get());
        this.physic = new Physic();
        this.inputManager = new InputManager();
        this.lights = new Array<THREE.Light>();
        this.actors = new Array<Actor>();
        this.clock = new THREE.Clock();

        this.loadingScreen = new LoadingScreen();

        this.tick();

        this.resize = this.resize.bind(this);
        window.addEventListener('resize', this.resize);

        this.resources.on('ready', () => {
            this.setLights();
            this.setActors();
            this.loadingScreen.onLoaded();
        });
    }

    private setLights (): void {
        const directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(10, 10, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera = new THREE.OrthographicCamera(-25, 25, 25, -25, 0.5, 500);
        this.lights.push(directionalLight);
        // this.scene.add(new THREE.CameraHelper(directionalLight.shadow.camera));

        const ambientLight = new THREE.AmbientLight(0xcfcfcf);
        this.lights.push(ambientLight);

        this.lights.forEach(light => this.scene.add(light));
    }

    private setActors (): void {
        const char = new Character(this.resources, this.physic.get(), this.inputManager);
        const floor = new Floor(this.resources, this.physic.get());
        const ball = new Ball(this.physic.get());
        const box = new Box(this.physic.get(), new THREE.Vector3(2, 2, 2), new THREE.Vector3(4, 1, 4));
        this.actors.push(char, floor, ball, box);

        this.camera.setTarget(char);

        this.actors.forEach(actor => this.scene.add(actor));

        // Contact Material
        const floorBall = new CANNON.ContactMaterial(floor.mat, ball.mat, { friction: 0.0, restitution: 0.4 });
        this.physic.get().addContactMaterial(floorBall);
    }

    private tick (): void {
        let dt = this.clock.getDelta();
        dt = Math.min(dt, 1 / 20);

        this.camera.tick(dt);
        this.postProcessing.tick(dt);
        this.physic.tick(dt);

        this.actors.forEach(actor => actor.tick(dt));

        requestAnimationFrame(() => {
            this.tick();
        });
    }

    private resize (): void {
        this.renderer.resize();
        this.camera.resize();
        this.postProcessing.resize();
    }
}
