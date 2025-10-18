import {
    _decorator,
    BoxCollider2D,
    CCInteger,
    Collider2D,
    Component,
    Contact2DType,
    IPhysics2DContact,
    Sprite,
} from 'cc';
import { CharacterStats } from './CharacterStats';
import { CharacterMovement } from './CharacterMovement';
import Timer from '../../core/Timer';
import { GameObserver } from '../Observer/GameObserver';
import { CharacterState, CharacterType } from '../Config/GameDefine';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('Character')
@requireComponent(CharacterStats)
@requireComponent(CharacterMovement)
export class Character extends Component {
    @property({
        type: CharacterType,
    })
    public characterType: CharacterType = CharacterType.PLAYER;

    @property(Sprite)
    charImage: Sprite;

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
        GameObserver.Instance.addtargetableObjects(this);
        this.charStats = this.getComponent(CharacterStats);

        if (this.Type == CharacterType.PLAYER) return;
        const collider = this.getComponent(Collider2D);
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
        if (!selfCollider.isValid || !otherCollider.isValid) return;

        const char = otherCollider.getComponent(Character);
        if (char && char.Type !== this.Type) {
            char.hit(this.Stats.bodySlamDmg);
        }
    }

    protected onDestroy(): void {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.STAY_CONTACT, this.onContact, this);
        }
    }
}
