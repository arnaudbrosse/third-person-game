import { InputManager } from './InputManager';

export class DeviceTracker {
    protected inputManager: InputManager;

    constructor (inputManager : InputManager) {
        this.inputManager = inputManager;
    }
}
