import {
    _decorator,
    Collider2D,
    Component,
    Contact2DType,
    IPhysics2DContact,
    misc,
    Node,
    RigidBody2D,
    Sprite,
    Vec2,
    Vec3,
} from 'cc';
import { BulletStats } from './BulletStats';
import { CharacterStats } from '../Character/CharacterStats';
import { Character } from '../Character/Character';
import { FXManager, FXType } from '../FX/FXManager';
import { BulletImpactFX } from '../FX/BulletImpactFX';
import { SoundMgr } from '../../core/SoundMgr';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('Bullet')
@requireComponent(BulletStats)
export class Bullet extends Component {
    protected rb: RigidBody2D;
    protected stats: BulletStats;
    protected image: Sprite;

    get Stats() {
        return this.stats;
    }

    protected onLoad(): void {
        this.image = this.getComponent(Sprite);
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    public init(dir: Vec3) {
        this.rb = this.getComponent(RigidBody2D);
        this.stats = this.getComponent(BulletStats);

        this.rb.enabled = true;
        if (this.rb.isAwake() == false) console.log('aslkghalskghaslkgh');

        this.rb.linearVelocity = new Vec2(
            dir.x * this.Stats.moveSpeed,
            dir.y * this.Stats.moveSpeed
        );
    }

    protected onBeginContact(
        selfCollider: Collider2D,
        otherCollider: Collider2D,
        contact: IPhysics2DContact
    ) {
        if (!selfCollider.isValid || !otherCollider.isValid) return;

        const char = otherCollider.getComponent(Character);
        if (char) {
            char.hit(this.Stats.damage);
        }
        this.hit();
    }

    protected hit(): void {
        SoundMgr.playSfx(SoundMgr.Instance.SFX_IMPACT);

        const angle = misc.radiansToDegrees(
            Math.atan2(this.rb.linearVelocity.y, this.rb.linearVelocity.x)
        );
        const fx = FXManager.Instance.play(
            FXType.IMPACT,
            this.node.worldPosition,
            angle
        );
        fx.getComponent(BulletImpactFX).setColor(this.image.color);

        this.rb.enabled = false;
        this.scheduleOnce(() => {
            this.node.active = false;
        }, 0.01);
    }

    protected onDestroy(): void {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.off(
                Contact2DType.BEGIN_CONTACT,
                this.onBeginContact,
                this
            );
        }
    }
}
