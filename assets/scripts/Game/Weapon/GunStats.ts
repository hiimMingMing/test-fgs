import { _decorator, Component, Node, RigidBody2D, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GunStats')
export class GunStats extends Component {
    @property public range: number = 300;
    @property public fireRate: number = 1;

    public loadFromConfig(config: any) {
        if (config.range !== undefined) this.range = config.range;
        if (config.fireRate !== undefined) this.fireRate = config.fireRate;
    }
}
