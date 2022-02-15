import * as THREE from 'three';
import * as CANNON from 'cannon-es';

import { Resources } from '../../Resources';
import { Actor } from '../../Core/Actor/Actor';

import { InputManager } from '../../Core/InputSystem/InputManager';
import { Controller } from '../../Core/Controller/Controller';
import { CharacterController } from './CharacterController/CharacterController';

import { StateMachine } from '../../Core/State/StateMachine';
import { IdleState } from './CharacterStates/IdleState';
import { WalkState } from './CharacterStates/WalkState';
import { JumpState } from './CharacterStates/JumpState';

export class Character extends Actor {
    private resources: Resources;
    private world: CANNON.World;
    private modelContainer: THREE.Group;
    private body: CANNON.Body;
    private materials: Array<THREE.Material>;
    private mixer: THREE.AnimationMixer;
    private controller: Controller;
    private stateMachine: StateMachine;

    constructor (resources: Resources, world: CANNON.World, inputManager: InputManager) {
        super();

        this.resources = resources;
        this.world = world;
        this.modelContainer = new THREE.Group();
        this.materials = new Array<THREE.Material>();

        this.readCharacterData();

        this.body = new CANNON.Body({
            mass: 140,
            allowSleep: false
        });
        this.body.addShape(new CANNON.Sphere(0.5), new CANNON.Vec3(0, -0.5, 0));
        this.body.addShape(new CANNON.Sphere(0.5), new CANNON.Vec3(0, 0.5, 0));
        this.body.fixedRotation = true;
        this.body.updateMassProperties();
        this.body.position.y = 10;
        this.world.addBody(this.body);

        // Controller
        this.controller = new CharacterController(this.body, inputManager);

        // State machine
        this.stateMachine = new StateMachine(this);
        this.stateMachine.addState('idle', new IdleState(this.stateMachine));
        this.stateMachine.addState('walk', new WalkState(this.stateMachine));
        this.stateMachine.addState('jump', new JumpState(this.stateMachine));
        this.stateMachine.setState('idle');

        this.add(this.modelContainer);
    }

    private readCharacterData (): void {
        const model = this.resources.get('character');
        const map: THREE.Texture = this.resources.get('character-map');
        const aoMap: THREE.Texture = this.resources.get('character-ao');
        const normalMap: THREE.Texture = this.resources.get('character-normal');
        map.flipY = false;
        aoMap.flipY = false;
        normalMap.flipY = false;

        model.scene.traverse((child: { castShadow: boolean; receiveShadow: boolean; }) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;

                if (child.name === 'head_eyes_low') {
                    const mat = new THREE.MeshStandardMaterial({ color: 0xffffff });
                    child.material = mat;
                    this.materials.push(child.material);
                    child.material = mat;
                } else {
                    const mat = new THREE.MeshPhongMaterial();
                    mat.name = child.material.name;
                    mat.shininess = 0;
                    mat.map = map;
                    mat.normalMap = normalMap;
                    mat.aoMap = aoMap;

                    child.material = mat;
                }
                this.materials.push(child.material);
            }
        });

        this.modelContainer = model.scene;
        this.modelContainer.position.y = -1;
        this.mixer = new THREE.AnimationMixer(model.scene);
        this.animations = model.animations;
    }

    public setAnimation (name: string): void {
        if (this.mixer) {
            const clip = THREE.AnimationClip.findByName(this.animations, name);

            const action = this.mixer.clipAction(clip);
            if (action === null) {
                console.error('Animation ' + name + ' not found!');
                return;
            }

            this.mixer.stopAllAction();
            action.fadeIn(0.1);
            action.play();
        }
    }

    public tick (dt: number): void {
        this.position.set(this.body.position.x, this.body.position.y, this.body.position.z);
        this.quaternion.set(this.body.quaternion.x, this.body.quaternion.y, this.body.quaternion.z, this.body.quaternion.w);

        if (this.mixer) {
            this.mixer.update(dt);
        }

        if (this.controller) {
            this.controller.update(dt);
        }

        if (this.stateMachine && this.controller instanceof CharacterController) {
            this.stateMachine.tick(dt, this.controller);
        }
    }
}
