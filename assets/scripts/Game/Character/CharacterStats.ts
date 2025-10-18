import { _decorator, CCInteger, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CharacterStats')
export class CharacterStats extends Component {
    @property public maxHP: number = 50;
    @property public hp: number = 50;
    @property public moveSpeed: number = 20;
    @property public dashDuration: number = 0.2;
    @property public dashCooldown: number = 3;
    @property public dashSpeedMultiplier: number = 5;
    @property public bodySlamDmg: number = 0;
    @property public iframeDuration: number = 1;

    public loadFromConfig(config: any) {
        if (config.maxHP !== undefined) this.maxHP = config.maxHP;
        if (config.hp !== undefined) this.hp = config.hp;
        if (config.moveSpeed !== undefined) this.moveSpeed = config.moveSpeed;
        if (config.dashDuration !== undefined) this.dashDuration = config.dashDuration;
        if (config.dashCooldown !== undefined) this.dashCooldown = config.dashCooldown;
        if (config.dashSpeedMultiplier !== undefined) this.dashSpeedMultiplier = config.dashSpeedMultiplier;
        if (config.bodySlamDmg !== undefined) this.bodySlamDmg = config.bodySlamDmg;
        if (config.iframeDuration !== undefined) this.iframeDuration = config.iframeDuration;
    }
}
