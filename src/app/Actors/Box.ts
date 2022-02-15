import * as THREE from 'three';
import * as CANNON from 'cannon-es';

import { Actor } from '../Core/Actor/Actor';

export class Box extends Actor {
    private mesh: THREE.Mesh;
    private world: CANNON.World;
    private body: CANNON.Body;

    constructor (world: CANNON.World, size: THREE.Vector3, position: THREE.Vector3) {
        super();

        this.world = world;

        const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
        const material = new THREE.MeshStandardMaterial({ color: 0xfbff00 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.add(this.mesh);

        this.body = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2))
        });
        this.body.position.x = position.x;
        this.body.position.y = position.y;
        this.body.position.z = position.z;
        this.world.addBody(this.body);
    }

    public tick (_dt: number): void {
        this.position.set(this.body.position.x, this.body.position.y, this.body.position.z);
        this.quaternion.set(this.body.quaternion.x, this.body.quaternion.y, this.body.quaternion.z, this.body.quaternion.w);
    }
}
