import { _decorator, Component, Node, ParticleSystem2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ParticleFXPoolItem')
export class ParticleFXPoolItem extends Component {
    protected particleSystem: ParticleSystem2D;

    protected onLoad(): void {
        this.particleSystem = this.getComponent(ParticleSystem2D);
    }

    protected onEnable(): void {
        this.particleSystem.resetSystem();
    }
}
