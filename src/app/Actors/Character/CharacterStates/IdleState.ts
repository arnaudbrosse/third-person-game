import { CharacterController } from '../CharacterController/CharacterController';
import { State } from '../../../Core/State/State';
import { StateMachine } from '../../../Core/State/StateMachine';

export class IdleState extends State {
    constructor (stateMachine: StateMachine) {
        super(stateMachine);
    }

    public enter (): void {
        this.stateMachine.getCharacter().setAnimation('idle');
    }

    public exit (): void {}

    public tick (_dt: number, controller: CharacterController): void {
        if (!controller.movementDirection.isZero()) {
            this.stateMachine.setState('walk');
        }
    }
}
