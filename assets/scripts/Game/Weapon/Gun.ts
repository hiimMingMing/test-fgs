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
import { CharacterType } from '../Config/GameDefine';
import { GunStats } from './GunStats';
import Timer from '../../core/Timer';
import { Bullet } from './Bullet';
import { GameObserver } from '../Observer/GameObserver';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('Gun')
@requireComponent(GunStats)
export class Gun extends Component {
    @property(Prefab) protected bulletPrefab: Prefab;
    @property({
        type: CharacterType,
    })
    public ownerType: CharacterType = CharacterType.PLAYER;

    protected rb: RigidBody2D;
    protected stats: GunStats;

    protected target: Character;
    protected targetsInRange: Character[] = [];
    protected fireTimer: Timer = new Timer();

    get Stats() {
        return this.stats;
    }

    protected onLoad(): void {
        this.rb = this.getComponent(RigidBody2D);
        this.stats = this.getComponent(GunStats);

        this.resetFireTimer();
        this.schedule(() => {
            this.scanTargets();
            this.findTarget();
        }, 0.1);
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

    scanTargets() {
        const targets = GameObserver.Instance.getTargetableObjects();

        targets.forEach((target) => {
            if (target.Type === this.ownerType) return;
            if (
                Vec3.distance(
                    target.node.worldPosition,
                    this.node.worldPosition
                ) <= this.Stats.range
            ) {
                this.addTargetInRange(target);
            } else {
                this.removeTargetInRang(target);
            }
        });
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

    protected addTargetInRange(starget: Character) {
        if (!starget.isValid) return;

        if (
            starget &&
            this.targetsInRange.findIndex((c) => c === starget) === -1
        ) {
            this.targetsInRange.push(starget);
        }
    }

    protected removeTargetInRang(starget: Character) {
        if (!starget.isValid) return;

        if (starget) {
            const index = this.targetsInRange.findIndex((c) => c === starget);
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
                this.addTargetInRange,
                this
            );
            collider.off(
                Contact2DType.END_CONTACT,
                this.addTargetInRange,
                this
            );
        }
    }
}
