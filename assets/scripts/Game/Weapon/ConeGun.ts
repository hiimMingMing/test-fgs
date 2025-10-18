import { _decorator, CCInteger, instantiate, Quat, Vec3 } from 'cc';
import { Gun } from './Gun';
import { Bullet } from './Bullet';
import { ConeGunStats } from './ConeGunStats';

const { ccclass, property, requireComponent } = _decorator;

@ccclass('ConeGun')
@requireComponent(ConeGunStats)
export class ConeGun extends Gun {
    protected update(dt: number): void {}

    public shoot() {
        if (!this.target) return;
        if (!this.target.isValid) return;

        const threadAngleDeg = (this.Stats as ConeGunStats).threadAngle;
        const bulletCount = (this.Stats as ConeGunStats).bulletNumber;

        const startAngleDeg = -threadAngleDeg / 2;
        const stepAngleDeg = threadAngleDeg / (bulletCount - 1);

        for (let i = 0; i < (this.Stats as ConeGunStats).bulletNumber; i++) {
            const newBullet = this.spawnBullet();
            newBullet.setParent(this.node);
            newBullet.setWorldPosition(this.node.worldPosition);

            const baseDirection = Vec3.subtract(
                new Vec3(),
                this.target.node.worldPosition,
                this.node.worldPosition
            ).normalize();

            const angleDeg = startAngleDeg + stepAngleDeg * i;
            const angleRad = angleDeg * (Math.PI / 180);
            const rotation = Quat.fromAxisAngle(
                new Quat(),
                Vec3.UNIT_Z,
                angleRad
            );
            const rotatedDirection = Vec3.transformQuat(
                new Vec3(),
                baseDirection,
                rotation
            );

            newBullet.getComponent(Bullet).init(rotatedDirection);
        }
    }
}
