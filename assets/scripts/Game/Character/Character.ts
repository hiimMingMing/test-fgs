import {
    _decorator,
    BoxCollider2D,
    CCInteger,
    Collider2D,
    Color,
    Component,
    Contact2DType,
    IPhysics2DContact,
    Sprite,
    tween,
} from 'cc';
import { CharacterStats } from './CharacterStats';
import { CharacterMovement } from './CharacterMovement';
import Timer from '../../core/Timer';
import { GameObserver } from '../Observer/GameObserver';
import { CharacterState, CharacterType } from '../Config/GameDefine';
import { CameraShake } from '../../core/CameraShake';
import { GameManager } from '../GameManager';
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
    private onDieCallbacks: Function[] = [];

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

        this.updateHPVisual();

        if (this.characterType === CharacterType.PLAYER) {
            CameraShake.Instance.shake(10, 0.2);
        }
    }

    updateHPVisual() {
        this.charImage.fillRange = this.Stats.hp / this.Stats.maxHP;
    }

    public isIframing() {
        return !this.iframeTimer.IsDone();
    }

    public addOnDieCallback(cb: Function) {
        this.onDieCallbacks.push(cb);
    }

    private die() {
        this.state = CharacterState.DEAD;

        this.onDieCallbacks.forEach((cb) => cb());

        if (this.characterType === CharacterType.PLAYER)
            GameManager.Instance.end();

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

    public changeColor(c: Color) {
        tween(this.charImage)
            .to(0.3, {
                color: c,
            })
            .start();
        tween(this.getComponent(Sprite))
            .to(0.3, {
                color: c,
            })
            .start();
    }
}
