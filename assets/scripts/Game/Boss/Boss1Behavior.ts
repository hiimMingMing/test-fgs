import { _decorator, Component, Node } from 'cc';
import { CharacterInput } from '../Character/CharacterInput';
import { ConeGun } from '../Weapon/ConeGun';
import { Character } from '../Character/Character';
import Timer from '../../core/Timer';
const { ccclass, property, requireComponent } = _decorator;

enum BossPhase {
    HIGH_HP,
    MEDIUM_HP,
    LOW_HP,
}

enum MovePattern {
    NORMAL,
    DASH,
}

enum ShootPattern {
    NORMAL,
    CRAZY,
}

@ccclass('Boss1Behavior')
@requireComponent(CharacterInput)
@requireComponent(Character)
export class Boss1Behavior extends Component {
    @property(ConeGun) coneGun6: ConeGun;
    @property(ConeGun) coneGun18: ConeGun;

    @property private highHpThreshold: number = 0.66;
    @property private lowHpThreshold: number = 0.33;
    @property private shootInterval: number = 1.0;
    @property private patternSwitchInterval: number = 3.0;
    @property private normalMoveInterval: number = 3.0;

    private character: Character;
    private characterInput: CharacterInput;
    private currentPhase: BossPhase = BossPhase.HIGH_HP;
    private shootTimer: Timer = new Timer();
    private patternSwitchTimer: Timer = new Timer();
    private normalMoveTimer: Timer = new Timer();

    private currentMovePattern: MovePattern = MovePattern.NORMAL;
    private currentShootPattern: ShootPattern = ShootPattern.NORMAL;
    private isMoving: boolean = true;

    protected onLoad(): void {
        this.character = this.getComponent(Character);
        this.characterInput = this.getComponent(CharacterInput);

        this.shootTimer.SetDuration(this.shootInterval);
        this.patternSwitchTimer.SetDuration(this.patternSwitchInterval);
        this.normalMoveTimer.SetDuration(this.normalMoveInterval);
    }

    protected update(dt: number): void {
        this.updatePhase();
        this.shootTimer.Update(dt);
        this.patternSwitchTimer.Update(dt);
        this.normalMoveTimer.Update(dt);

        this.updateBehavior(dt);
        this.updateMovement();
        this.updateShooting();
    }

    private updateMovement(): void {
        if (this.currentMovePattern === MovePattern.NORMAL) {
            if (this.normalMoveTimer.JustFinished()) {
                this.isMoving = !this.isMoving;
                this.normalMoveTimer.SetDuration(this.normalMoveInterval);
            }

            this.characterInput.CanMove = this.isMoving;
        } else if (this.currentMovePattern === MovePattern.DASH) {
            this.characterInput.CanMove = false;
            this.isMoving = this.characterInput.IsDashing;
        }
    }

    private updateShooting(): void {
        const canShoot =
            (this.currentMovePattern === MovePattern.NORMAL &&
                !this.isMoving) ||
            (this.currentMovePattern === MovePattern.DASH &&
                !this.characterInput.IsDashing);

        if (canShoot && this.shootTimer.JustFinished()) {
            this.shoot();
            this.shootTimer.SetDuration(this.shootInterval);
        }
    }

    private updatePhase(): void {
        const maxHp = this.character.Stats.maxHP;
        const currentHpRatio = this.character.Stats.hp / maxHp;

        if (currentHpRatio > this.highHpThreshold) {
            this.currentPhase = BossPhase.HIGH_HP;
        } else if (currentHpRatio > this.lowHpThreshold) {
            this.currentPhase = BossPhase.MEDIUM_HP;
        } else {
            this.currentPhase = BossPhase.LOW_HP;
        }
    }

    private updateBehavior(dt: number): void {
        switch (this.currentPhase) {
            case BossPhase.HIGH_HP:
                this.currentMovePattern = MovePattern.NORMAL;
                this.currentShootPattern = ShootPattern.NORMAL;
                break;

            case BossPhase.MEDIUM_HP:
                if (this.patternSwitchTimer.JustFinished()) {
                    this.currentMovePattern =
                        Math.random() < 0.5
                            ? MovePattern.NORMAL
                            : MovePattern.DASH;
                    this.currentShootPattern =
                        Math.random() < 0.5
                            ? ShootPattern.NORMAL
                            : ShootPattern.CRAZY;
                    this.patternSwitchTimer.SetDuration(
                        this.patternSwitchInterval
                    );
                }
                break;

            case BossPhase.LOW_HP:
                this.currentMovePattern = MovePattern.DASH;
                this.currentShootPattern = ShootPattern.CRAZY;
                break;
        }

        if (
            this.currentMovePattern === MovePattern.DASH &&
            this.characterInput
        ) {
            this.characterInput.dash();
        }
    }

    private shoot(): void {
        if (this.currentShootPattern === ShootPattern.NORMAL) {
            if (this.coneGun6) {
                this.coneGun6.shoot();
            }
        } else {
            if (this.coneGun18) {
                this.coneGun18.shoot();
            }
        }
    }
}
