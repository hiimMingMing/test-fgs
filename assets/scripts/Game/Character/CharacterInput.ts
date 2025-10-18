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
import { Keys } from '../Config/GameConfig';
import Timer from '../../core/Timer';
import { CharacterStats } from './CharacterStats';

const { ccclass, property, requireComponent } = _decorator;

@ccclass('CharacterInput')
@requireComponent(CharacterStats)
export class CharacterInput extends Component {
    protected dashTimer: Timer = new Timer();
    protected dashCooldownTimer: Timer = new Timer();

    protected isDashing: boolean = false;
    public get IsDashing() {
        return this.isDashing;
    }

    protected moveDirection: Vec3 = new Vec3();
    public get MoveDirection() {
        return this.moveDirection;
    }

    protected stats: CharacterStats;
    get Stats() {
        return this.stats;
    }

    protected keyStates: Map<KeyCode, boolean> = new Map();

    protected onLoad(): void {
        this.stats = this.getComponent(CharacterStats);
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
        this.moveHandle();
        this.dashHandle();
    }

    updateDashTimer(deltaTime: number) {
        this.dashCooldownTimer.Update(deltaTime);
        this.dashTimer.Update(deltaTime);
        if (this.dashTimer.JustFinished()) {
            this.isDashing = false;
        }
    }

    moveHandle() {
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
            this.dashCooldownTimer.SetDuration(this.Stats.dashCooldown);
            this.dashTimer.SetDuration(this.Stats.dashDuration);
            this.isDashing = true; // Dash
        }
    }

    canDash() {
        return this.dashCooldownTimer.IsDone();
    }
}
