import { EventEmitter } from 'events';

import { Action, AxisAction, ButtonAction } from './Action';
import { KeyboardTracker } from './KeyboardTracker';
import { TouchTracker } from './TouchTracker';

export class InputManager extends EventEmitter {
    private actions: Array<Action>;

    constructor () {
        super();

        new KeyboardTracker(this);
        new TouchTracker(this);
        this.actions = new Array<Action>();

        this.actions.push(new AxisAction('Vertical', ['s', 'ArrowDown'], ['z', 'ArrowUp']));
        this.actions.push(new AxisAction('Horizontal', ['d', 'ArrowRight'], ['q', 'ArrowLeft']));
        this.actions.push(new ButtonAction('Jump', [' ']));
    }

    public onActionChange (name: string, value: number | boolean): void {
        this.emit(name, value);
    }

    public getActions (): Array<Action> {
        return this.actions;
    }
}
