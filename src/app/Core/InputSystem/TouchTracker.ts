import { DeviceTracker } from './DeviceTracker';
import { InputManager } from './InputManager';

class Joystick {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D | null;
    private x: number;
    private y: number;
    private centerX: number;
    private centerY: number;

    constructor () {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.canvas.style.position = 'fixed';
        this.canvas.style.bottom = '0';
        this.canvas.style.left = '0';
        this.canvas.width = innerWidth;
        this.canvas.height = innerHeight;
        document.body.appendChild(this.canvas);

        this.x = 0;
        this.y = 0;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }

    private draw (): void {
        if (this.context) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            // Draw internal
            this.context.beginPath();
            this.context.arc(this.x, this.y, 30, 0, 2 * Math.PI, false);
            this.context.fillStyle = 'rgba(255, 255, 255, 0.5)';
            this.context.fill();
            // Draw external
            this.context.beginPath();
            this.context.arc(this.centerX, this.centerY, 75, 0, 2 * Math.PI, false);
            this.context.lineWidth = 2;
            this.context.fillStyle = 'rgba(255, 255, 255, 0.25)';
            this.context.fill();
            this.context.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            this.context.stroke();
        }
    }

    public clear (): void {
        if (this.context) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    public setPosition (x: number, y: number): void {
        this.x = x;
        this.y = y;
        this.draw();
    }

    public setCenter (x: number, y: number): void {
        this.centerX = x;
        this.centerY = y;
        this.draw();
    }

    public getX (): number {
        return this.centerX - this.x;
    }

    public getY (): number {
        return this.centerY - this.y;
    }
}

export class TouchTracker extends DeviceTracker {
    private joystick: Joystick;

    constructor (inputManager : InputManager) {
        super(inputManager);

        this.joystick = new Joystick();

        this.touchDown = this.touchDown.bind(this);
        document.addEventListener('touchstart', this.touchDown);

        this.touchMove = this.touchMove.bind(this);
        document.addEventListener('touchmove', this.touchMove);

        this.touchEnd = this.touchEnd.bind(this);
        document.addEventListener('touchend', this.touchEnd);
    }

    private touchDown (event: TouchEvent): void {
        const downX = event.targetTouches[0].pageX;
        const downY = event.targetTouches[0].pageY;
        this.joystick.setCenter(downX, downY);
    }

    private touchMove (event: TouchEvent): void {
        const movedX = event.targetTouches[0].pageX;
        const movedY = event.targetTouches[0].pageY;
        this.joystick.setPosition(movedX, movedY);
        this.inputManager.onActionChange('Horizontal', this.joystick.getX());
        this.inputManager.onActionChange('Vertical', this.joystick.getY());
    }

    private touchEnd (): void {
        this.inputManager.onActionChange('Horizontal', 0);
        this.inputManager.onActionChange('Vertical', 0);
        this.joystick.clear();
    }
}
