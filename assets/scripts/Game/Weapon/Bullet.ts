import {
    _decorator,
    Collider2D,
    Component,
    Contact2DType,
    IPhysics2DContact,
    Node,
    RigidBody2D,
    Vec2,
    Vec3,
} from 'cc';
import { BulletStats } from './BulletStats';
import { CharacterStats } from '../Character/CharacterStats';
import { Character } from '../Character/Character';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('Bullet')
@requireComponent(BulletStats)
export class Bullet extends Component {
    protected rb: RigidBody2D;
    protected stats: BulletStats;

    get Stats() {
        return this.stats;
    }

    public init(dir: Vec3) {
        this.rb = this.getComponent(RigidBody2D);
        this.stats = this.getComponent(BulletStats);

        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.STAY_CONTACT, this.onBeginContact, this);
        }

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
        this.node.destroy();
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
