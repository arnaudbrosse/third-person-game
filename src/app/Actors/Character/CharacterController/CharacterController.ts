import * as CANNON from 'cannon-es';

import { Controller } from '../../../Core/Controller/Controller';
import { InputManager } from '../../../Core/InputSystem/InputManager';
import { Utils } from '../../../Utils';

export class CharacterController extends Controller {
    public movementDirection: CANNON.Vec3;
    public isJumping: boolean;
    private jumpVelocity: number;
    private walkSpeed: number;
    private jumpSpeed: number;

    constructor (body: CANNON.Body, inputManager: InputManager) {
        super(body, inputManager);

        this.movementDirection = new CANNON.Vec3();
        this.jumpVelocity = 0.0;
        this.isJumping = false;

        this.walkSpeed = 4.0;
        this.jumpSpeed = 4.0;

        this.inputManager.on('Horizontal', (value: number) => {
            this.onHorizontal(value);
        });
        this.inputManager.on('Vertical', (value: number) => {
            this.onVertical(value);
        });
        this.inputManager.on('Jump', (value: boolean) => {
            this.onJump(value);
        });
    }

    private onHorizontal (value: number): void {
        this.movementDirection.x = value;
    }

    private onVertical (value: number): void {
        this.movementDirection.z = value;
    }

    private onJump (value: boolean): void {
        if (value && this.isGrounded()) {
            this.jumpVelocity = this.jumpSpeed;
            this.isJumping = true;
        }
    }

    private isGrounded (): boolean {
        const raycastResult = new CANNON.RaycastResult();
        const rayCastOptions = {
            skipBackfaces: true
        };
        this.body.world?.raycastClosest(
            new CANNON.Vec3(this.body.position.x, 1, this.body.position.z),
            new CANNON.Vec3(this.body.position.x, -1, this.body.position.z),
            rayCastOptions, raycastResult
        );
        // console.log(raycastResult.distance);
        return raycastResult.distance < 1;
    }

    public update (dt: number): void {
        const direction = new CANNON.Vec3().copy(this.movementDirection);
        direction.normalize();
        this.body.velocity = new CANNON.Vec3(direction.x * this.walkSpeed, this.body.velocity.y + this.jumpVelocity, direction.z * this.walkSpeed);

        if (!direction.isZero()) {
            const q = Utils.lookRotation(direction, CANNON.Vec3.UNIT_Y);
            const t = 1.0 - Math.pow(0.001, dt);
            this.body.quaternion = this.body.quaternion.slerp(q, t);
        }
        this.jumpVelocity = 0.0;
    }
}
