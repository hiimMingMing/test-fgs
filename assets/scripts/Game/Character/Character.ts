import {
    _decorator,
    BoxCollider2D,
    ccenum,
    CCInteger,
    Collider2D,
    Component,
    Contact2DType,
    IPhysics2DContact,
} from 'cc';
import { CharacterStats } from './CharacterStats';
import { CharacterMovement } from './CharacterMovement';
import Timer from '../../core/Timer';
const { ccclass, property, requireComponent } = _decorator;

export enum CharacterState {
    ALIVE,
    DEAD,
}

export enum CharacterType {
    PLAYER,
    ENEMY,
}

ccenum(CharacterType);

@ccclass('Character')
@requireComponent(CharacterStats)
@requireComponent(CharacterMovement)
export class Character extends Component {
    @property({
        type: CharacterType,
    })
    public characterType: CharacterType = CharacterType.PLAYER;

    private charStats: CharacterStats;
    private state: CharacterState = CharacterState.ALIVE;
    private iframeTimer: Timer = new Timer();

    get Stats() {
        return this.charStats;
    }

    get State() {
        return this.state;
    }

    get Type() {
        return this.characterType;
    }

    protected onLoad(): void {
        this.charStats = this.getComponent(CharacterStats);

        if (this.Type == CharacterType.PLAYER) return;
        const collider = this.getComponent(BoxCollider2D);
        if (collider) {
            collider.on(Contact2DType.STAY_CONTACT, this.onContact, this);
        }
    }

    protected update(dt: number): void {
        this.iframeTimer.Update(dt);
    }

    public hit(dmg: number) {
        if (this.isIframing()) return;
        if (this.state === CharacterState.DEAD) return;

        console.log('Hit ', dmg);

        this.iframeTimer.SetDuration(this.Stats.iframeDuration);

        this.charStats.hp -= dmg;
        if (this.charStats.hp <= 0) {
            this.die();
        }
    }

    public isIframing() {
        return !this.iframeTimer.IsDone();
    }

    private die() {
        this.state = CharacterState.DEAD;
        this.node.destroy();
    }

    protected onContact(
        selfCollider: Collider2D,
        otherCollider: Collider2D,
        contact: IPhysics2DContact
    ) {
        const char = otherCollider.getComponent(Character);
        if (char && char.Type !== this.Type) {
            char.hit(this.Stats.bodySlamDmg);
        }
    }
}
