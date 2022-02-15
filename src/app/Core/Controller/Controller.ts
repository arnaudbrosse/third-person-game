import * as CANNON from 'cannon-es';
import { InputManager } from '../InputSystem/InputManager';

export abstract class Controller {
    protected body: CANNON.Body;
    protected inputManager: InputManager;

    constructor (body: CANNON.Body, inputManager: InputManager) {
        this.body = body;
        this.inputManager = inputManager;
    }

    public abstract update (dt: number): void;
}
