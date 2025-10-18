import { _decorator, Component, Node, RigidBody2D, Vec2, Vec3 } from 'cc';
import { CharacterInput } from './CharacterInput';
import { CharacterStats } from './CharacterStats';

const { ccclass, property, requireComponent } = _decorator;

@ccclass('CharacterMovement')
@requireComponent(CharacterStats)
export class CharacterMovement extends Component {
    @property(CharacterInput)
    characterInput: CharacterInput;

    private moveDirection: Vec3;
    private rb: RigidBody2D;
    private stats: CharacterStats;

    get Stats() {
        return this.stats;
    }

    protected onLoad(): void {
        this.stats = this.getComponent(CharacterStats);
        this.moveDirection = this.characterInput.MoveDirection;
        this.rb = this.getComponent(RigidBody2D);
    }

    update(deltaTime: number) {
        if (this.characterInput.IsDashing) {
            if (this.moveDirection.length() > 0) {
                this.moveDirection.normalize();
                const movement = this.moveDirection.multiplyScalar(
                    this.Stats.moveSpeed * this.Stats.dashSpeedMultiplier
                );
                this.rb.linearVelocity = new Vec2(movement.x, movement.y);
            }
        } else {
            if (!this.characterInput.CanMove) {
                this.rb.linearVelocity = new Vec2(0, 0);
                return;
            }
            this.moveDirection.normalize();
            const movement = this.moveDirection.multiplyScalar(
                this.Stats.moveSpeed
            );
            this.rb.linearVelocity = new Vec2(movement.x, movement.y);
        }
    }
}
