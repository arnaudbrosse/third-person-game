import * as THREE from 'three';
import * as CANNON from 'cannon-es';

import { Resources } from '../Resources';
import { Actor } from '../Core/Actor/Actor';

export class Floor extends Actor {
    private resources: Resources;
    private mesh: THREE.Mesh;
    private world: CANNON.World;
    private body: CANNON.Body;
    public mat: CANNON.Material;

    constructor (resources: Resources, world: CANNON.World) {
        super();

        this.resources = resources;
        this.world = world;

        const texture = this.resources.get('floor');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(10, 10);
        texture.anisotropy = 16;
        texture.magFilter = THREE.NearestFilter;

        const geometry = new THREE.PlaneGeometry(30, 30, 10, 10);
        const material = new THREE.MeshStandardMaterial({ map: texture });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotateX(-Math.PI / 2);
        // this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.add(this.mesh);

        this.mat = new CANNON.Material('floor');
        this.body = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Box(new CANNON.Vec3(15, 1, 15)),
            material: this.mat
        });
        this.body.position.x = 0;
        this.body.position.y = -1;
        this.body.position.z = 0;
        this.world.addBody(this.body);
    }

    public tick (_dt: number): void {}
}
