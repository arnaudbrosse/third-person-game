import { Character } from '../../Actors/Character/Character';
import { CharacterController } from '../../Actors/Character/CharacterController/CharacterController';
import { State } from './State';

export class StateMachine {
    private states: Map<string, State>;
    private currentState: State | undefined;
    private chatacter: Character;

    constructor (character: Character) {
        this.states = new Map<string, State>();
        this.chatacter = character;
    }

    public getCharacter (): Character {
        return this.chatacter;
    }

    public addState (name: string, state: State): void {
        this.states.set(name, state);
    }

    public setState (name: string): void {
        if (this.states.has(name)) {
            this.currentState?.exit();
            this.currentState = this.states.get(name);
            this.currentState?.enter();
        }
    }

    public tick (dt: number, controller: CharacterController): void {
        if (this.currentState) {
            this.currentState.tick(dt, controller);
        }
    }
}
