import { Controller } from '../Controller/Controller';
import { StateMachine } from './StateMachine';

export abstract class State {
    protected stateMachine: StateMachine;

    constructor (stateMachine: StateMachine) {
        this.stateMachine = stateMachine;
    }

    abstract enter (): void;
    abstract exit (): void;
    abstract tick (dt: number, controller: Controller): void;
}
