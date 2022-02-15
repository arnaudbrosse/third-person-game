import * as THREE from 'three';
import * as CANNON from 'cannon-es';

import { Actor } from '../Core/Actor/Actor';

export class Ball extends Actor {
    private mesh: THREE.Mesh;
    private world: CANNON.World;
    private body: CANNON.Body;
    public mat: CANNON.Material;

    constructor (world: CANNON.World) {
        super();

        this.world = world;

        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshStandardMaterial({ color: 0xfbff00 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.add(this.mesh);

        this.mat = new CANNON.Material('ball');
        this.body = new CANNON.Body({
            mass: 1,
            shape: new CANNON.Sphere(0.5),
            material: this.mat
        });
        this.body.position.x = 0;
        this.body.position.y = 5;
        this.body.position.z = 5;
        this.world.addBody(this.body);
    }

    public tick (_dt: number): void {
        this.position.set(this.body.position.x, this.body.position.y, this.body.position.z);
        this.quaternion.set(this.body.quaternion.x, this.body.quaternion.y, this.body.quaternion.z, this.body.quaternion.w);
    }
}
