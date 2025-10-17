import { _decorator, Component, Node, RigidBody2D, Vec2, Vec3 } from 'cc';
import { CharacterInput } from '../Input/CharacterInput';
const { ccclass, property } = _decorator;

@ccclass('PlayerMovement')
export class PlayerMovement extends Component {
    @property
    moveSpeed: number = 5;

    @property(CharacterInput)
    characterInput: CharacterInput;

    private moveDirection: Vec3;
    private rb: RigidBody2D;

    protected onLoad(): void {
        this.moveDirection = this.characterInput.MoveDirection;
        this.rb = this.getComponent(RigidBody2D);
    }

    update(deltaTime: number) {
        if (this.characterInput.IsDashing) {
            if (this.moveDirection.length() > 0) {
                this.moveDirection.normalize();
                const movement = this.moveDirection.multiplyScalar(
                    this.moveSpeed * 5
                );
                this.rb.linearVelocity = new Vec2(movement.x, movement.y);
            }
        } else {
            this.moveDirection.normalize();
            const movement = this.moveDirection.multiplyScalar(this.moveSpeed);
            this.rb.linearVelocity = new Vec2(movement.x, movement.y);
        }
    }
}
