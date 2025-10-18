import {
    _decorator,
    CircleCollider2D,
    Collider2D,
    Component,
    Contact2DType,
    instantiate,
    IPhysics2DContact,
    Node,
    Prefab,
    RigidBody2D,
    Vec2,
    Vec3,
} from 'cc';
import { Character } from '../Character/Character';
import { GunStats } from './GunStats';
import Timer from '../../core/Timer';
import { Bullet } from './Bullet';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('Gun')
@requireComponent(GunStats)
export class Gun extends Component {
    @property(Prefab) bulletPrefab: Prefab;

    protected rb: RigidBody2D;
    protected stats: GunStats;

    private target: Character;
    private targetsInRange: Character[] = [];
    private fireTimer: Timer = new Timer();

    get Stats() {
        return this.stats;
    }

    protected onLoad(): void {
        this.rb = this.getComponent(RigidBody2D);
        this.stats = this.getComponent(GunStats);

        const collider = this.getComponent(CircleCollider2D);
        if (collider) {
            collider.on(Contact2DType.STAY_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }

        collider.radius = this.Stats.range;
        collider.apply();

        this.resetFireTimer();
        this.schedule(this.findTarget, 0.1);
    }

    protected update(dt: number): void {
        this.fireTimer.Update(dt);
        if (this.fireTimer.JustFinished()) {
            this.resetFireTimer();
            this.autoShoot();
        }
    }

    resetFireTimer() {
        this.fireTimer.SetDuration(60 / this.Stats.fireRate); // shots per min
    }

    autoShoot() {
        if (!this.target) return;
        if (!this.target.isValid) return;

        const newBullet = instantiate(this.bulletPrefab);
        newBullet.setParent(this.node);
        newBullet.setWorldPosition(this.node.worldPosition);
        newBullet
            .getComponent(Bullet)
            .init(
                Vec3.subtract(
                    new Vec3(),
                    this.target.node.worldPosition,
                    this.node.worldPosition
                ).normalize()
            );
    }

    findTarget() {
        if (this.targetsInRange.length === 0) {
            this.target = null;
            return;
        }

        this.targetsInRange = this.targetsInRange.filter(
            (char) => char.isValid
        );

        let closestChar: Character = null;
        let minDistance = Infinity;

        for (const char of this.targetsInRange) {
            const distance = Vec3.distance(
                this.node.position,
                char.node.position
            );
            if (distance < minDistance) {
                minDistance = distance;
                closestChar = char;
            }
        }

        this.target = closestChar;
    }

    protected onBeginContact(
        selfCollider: Collider2D,
        otherCollider: Collider2D,
        contact: IPhysics2DContact
    ) {
        if (!selfCollider.isValid || !otherCollider.isValid) return;

        const char = otherCollider.getComponent(Character);
        if (char && this.targetsInRange.findIndex((c) => c === char) === -1) {
            this.targetsInRange.push(char);
        }
    }

    protected onEndContact(
        selfCollider: Collider2D,
        otherCollider: Collider2D,
        contact: IPhysics2DContact
    ) {
        if (!selfCollider.isValid || !otherCollider.isValid) return;

        const char = otherCollider.getComponent(Character);
        if (char) {
            const index = this.targetsInRange.findIndex((c) => c === char);
            if (index !== -1) {
                this.targetsInRange.splice(index, 1);
            }
        }
    }

    protected onDestroy(): void {
        const collider = this.getComponent(CircleCollider2D);
        if (collider) {
            collider.off(
                Contact2DType.BEGIN_CONTACT,
                this.onBeginContact,
                this
            );
            collider.off(Contact2DType.END_CONTACT, this.onBeginContact, this);
        }
    }
}
