export abstract class Action {
    public name: string;

    constructor (name: string) {
        this.name = name;
    }

    public abstract started (): void;
    public abstract canceled (): void;
}

export class ButtonAction extends Action {
    public bindings: Array<String>;
    public value: boolean;

    constructor (name: string, bindings: Array<String>) {
        super(name);

        this.bindings = bindings;
        this.value = false;
    }

    public started (): void {}
    public canceled (): void {}
}

export class AxisAction extends Action {
    public negativeBindings: Array<String>;
    public positiveBindings: Array<String>;
    public value: number;

    constructor (name: string, negativeBindings: Array<String>, positiveBindings: Array<String>) {
        super(name);

        this.negativeBindings = negativeBindings;
        this.positiveBindings = positiveBindings;
        this.value = 0;
    }

    public started (): void {}
    public canceled (): void {}
}
