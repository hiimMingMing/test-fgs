import { _decorator, CCInteger, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CharacterStats')
export class CharacterStats extends Component {
    @property public hp: number = 50;
    @property public moveSpeed: number = 20;
    @property public dashDuration: number = 0.2;
    @property public dashCooldown: number = 3;
    @property public dashSpeedMultiplier: number = 5;
    @property public bodySlamDmg: number = 0;
    @property public iframeDuration: number = 1;
}
