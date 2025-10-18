import {
    _decorator,
    Collider2D,
    Component,
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

    protected onLoad(): void {
        this.rb = this.getComponent(RigidBody2D);
        this.stats = this.getComponent(BulletStats);

        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on('onBeginContact', this.onBeginContact, this);
        }
    }

    public init(dir: Vec3) {
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
        const char = otherCollider.getComponent(Character);
        if (char) {
            char.hit(this.Stats.damage);
        }
        this.hit();
    }

    protected hit(): void {
        this.node.destroy();
    }
}
