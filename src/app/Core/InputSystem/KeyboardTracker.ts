import { AxisAction, ButtonAction } from './Action';
import { DeviceTracker } from './DeviceTracker';
import { InputManager } from './InputManager';

export class KeyboardTracker extends DeviceTracker {
    constructor (inputManager : InputManager) {
        super(inputManager);

        this.keyDown = this.keyDown.bind(this);
        document.addEventListener('keydown', this.keyDown);

        this.keyUp = this.keyUp.bind(this);
        document.addEventListener('keyup', this.keyUp);
    }

    private keyDown (event: KeyboardEvent): void {
        this.inputManager.getActions().forEach(action => {
            if (action instanceof AxisAction) {
                if (action.negativeBindings.includes(event.key)) {
                    if (action.value !== -1) {
                        action.value = -1;
                        this.inputManager.onActionChange(action.name, action.value);
                    }
                }
                if (action.positiveBindings.includes(event.key)) {
                    if (action.value !== 1) {
                        action.value = 1;
                        this.inputManager.onActionChange(action.name, action.value);
                    }
                }
            }
            if (action instanceof ButtonAction) {
                if (action.bindings.includes(event.key)) {
                    if (action.value !== true) {
                        action.value = true;
                        this.inputManager.onActionChange(action.name, action.value);
                    }
                }
            }
        });
    }

    private keyUp (event: KeyboardEvent): void {
        this.inputManager.getActions().forEach(action => {
            if (action instanceof AxisAction) {
                if (action.negativeBindings.includes(event.key)) {
                    if (action.value !== 0) {
                        action.value = 0;
                        this.inputManager.onActionChange(action.name, action.value);
                    }
                }
                if (action.positiveBindings.includes(event.key)) {
                    if (action.value !== 0) {
                        action.value = 0;
                        this.inputManager.onActionChange(action.name, action.value);
                    }
                }
            }
            if (action instanceof ButtonAction) {
                if (action.bindings.includes(event.key)) {
                    if (action.value !== false) {
                        action.value = false;
                        this.inputManager.onActionChange(action.name, action.value);
                    }
                }
            }
        });
    }
}
