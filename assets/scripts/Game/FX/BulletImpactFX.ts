import { _decorator, Color, Component, Node, ParticleSystem2D } from 'cc';
import { ParticleFXPoolItem } from './ParticleFXPoolItem';
const { ccclass, property } = _decorator;

@ccclass('BulletImpactFX')
export class BulletImpactFX extends ParticleFXPoolItem {
    public setColor(color: Color) {
        this.particleSystem.startColor = color;
    }
}
