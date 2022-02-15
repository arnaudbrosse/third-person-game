import { CharacterController } from '../CharacterController/CharacterController';
import { State } from '../../../Core/State/State';
import { StateMachine } from '../../../Core/State/StateMachine';

export class JumpState extends State {
    constructor (stateMachine: StateMachine) {
        super(stateMachine);
    }

    public enter (): void {
        this.stateMachine.getCharacter().setAnimation('jump');
    }

    public exit (): void {}

    public tick (_dt: number, controller: CharacterController): void {
        if (controller.isJumping) {
            this.stateMachine.setState('jump');
        }
        if (!controller.isJumping) {
            this.stateMachine.setState('idle');
        }
    }
}
