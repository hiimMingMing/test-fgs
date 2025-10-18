import { _decorator, Component, Node, RigidBody2D, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BulletStats')
export class BulletStats extends Component {
    @property public moveSpeed: number = 30;
    @property public damage: number = 1;

    public loadFromConfig(config: any) {
        if (config.moveSpeed !== undefined) this.moveSpeed = config.moveSpeed;
        if (config.damage !== undefined) this.damage = config.damage;
    }
}
