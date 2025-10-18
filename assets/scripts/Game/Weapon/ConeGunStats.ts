import { _decorator, Component, Node, RigidBody2D, Vec3 } from 'cc';
import { GunStats } from './GunStats';
const { ccclass, property } = _decorator;

@ccclass('ConeGunStats')
export class ConeGunStats extends GunStats {
    @property public bulletNumber: number = 8;
    @property public threadAngle: number = 90;
}
