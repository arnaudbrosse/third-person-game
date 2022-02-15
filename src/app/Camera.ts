import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class Camera {
    private camera: THREE.PerspectiveCamera;
    private orbitControls: OrbitControls;
    private currentPosition: THREE.Vector3;
    private currentLookat: THREE.Vector3;
    private target: THREE.Object3D;

    constructor (renderer: THREE.Renderer) {
        this.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.camera.position.set(0, 10, -20);

        this.orbitControls = new OrbitControls(this.camera, renderer.domElement);
        // this.orbitControls.enablePan = false;
        // this.orbitControls.enableZoom = false;
        this.orbitControls.target.set(0, 0, 0);

        this.currentPosition = new THREE.Vector3();
        this.currentLookat = new THREE.Vector3();
    }

    public get (): THREE.Camera {
        return this.camera;
    }

    public setTarget (target: THREE.Object3D): void {
        this.orbitControls.enabled = false;
        this.target = target;
    }

    private calculateIdealOffset (): THREE.Vector3 {
        const idealOffset = new THREE.Vector3(0, 10, -20);
        idealOffset.add(this.target.position);
        return idealOffset;
    }

    private calculateIdealLookat (): THREE.Vector3 {
        const idealLookat = new THREE.Vector3(0, 0, 0);
        idealLookat.add(this.target.position);
        return idealLookat;
    }

    public tick (dt: number): void {
        this.orbitControls.update();

        if (this.target) {
            const idealOffset = this.calculateIdealOffset();
            const idealLookat = this.calculateIdealLookat();

            const t = 1.0 - Math.pow(0.001, dt);

            this.currentPosition.lerp(idealOffset, t);
            this.currentLookat.lerp(idealLookat, t);

            this.camera.position.copy(this.currentPosition);
            this.camera.lookAt(this.currentLookat);
        }
    }

    public resize (): void {
        if (this.camera) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        }
    }
}
