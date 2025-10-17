import {
    _decorator,
    CCInteger,
    Component,
    EventKeyboard,
    input,
    Input,
    KeyCode,
    Node,
    Vec3,
} from 'cc';
import { Keys } from '../../Config/GameConfig';
import Timer from '../../../core/Timer';
const { ccclass, property } = _decorator;

@ccclass('PlayerInput')
export class PlayerInput extends Component {
    @property(CCInteger) dashDuration: number = 0.2;
    @property(CCInteger) dashCooldownDuration: number = 3;

    private dashCooldown: Timer = new Timer();
    private dashTimer: Timer = new Timer();
    private isDashing: boolean = false;
    private moveDirection: Vec3 = new Vec3();

    private keyStates: Map<KeyCode, boolean> = new Map();

    public get MoveDirection() {
        return this.moveDirection;
    }

    public get IsDashing() {
        return this.isDashing;
    }

    start() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(event: EventKeyboard) {
        this.keyStates.set(event.keyCode, true);
    }

    onKeyUp(event: EventKeyboard) {
        this.keyStates.set(event.keyCode, false);
    }

    update(deltaTime: number) {
        this.updateDashTimer(deltaTime);
        this.wasdHandle();
        this.dashHandle();
    }

    updateDashTimer(deltaTime: number) {
        this.dashCooldown.Update(deltaTime);
        this.dashTimer.Update(deltaTime);
        if (this.dashTimer.JustFinished()) {
            this.isDashing = false;
        }
    }

    wasdHandle() {
        if (this.isDashing) return;

        this.moveDirection.set(0, 0, 0);

        if (this.keyStates.get(Keys.MOVE_UP)) {
            this.moveDirection.y += 1; // Forward
        }
        if (this.keyStates.get(Keys.MOVE_DOWN)) {
            this.moveDirection.y -= 1; // Backward
        }
        if (this.keyStates.get(Keys.MOVE_LEFT)) {
            this.moveDirection.x -= 1; // Left
        }
        if (this.keyStates.get(Keys.MOVE_RIGHT)) {
            this.moveDirection.x += 1; // Right
        }
        if (this.keyStates.get(Keys.MOVE_RIGHT)) {
            this.moveDirection.x += 1; // Right
        }
    }

    dashHandle() {
        if (this.canDash() === false) return;

        if (
            this.dashTimer.IsDone() == true &&
            (this.keyStates.get(Keys.DASH1) || this.keyStates.get(Keys.DASH1))
        ) {
            this.dashCooldown.SetDuration(this.dashCooldownDuration);
            this.dashTimer.SetDuration(this.dashDuration);
            this.isDashing = true; // Dash
        }
    }

    canDash() {
        return this.dashCooldown.IsDone();
    }
}
