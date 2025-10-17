import {
    _decorator,
    Component,
    EventKeyboard,
    input,
    Input,
    KeyCode,
    Node,
    Vec3,
} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerInput')
export class PlayerInput extends Component {
    @property
    moveSpeed: number = 5;

    private moveDirection: Vec3 = new Vec3();
    private keyStates: Map<KeyCode, boolean> = new Map();

    start() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(event: EventKeyboard) {
        this.keyStates.set(event.keyCode, true);
    }

    onKeyUp(event: EventKeyboard) {
        this.keyStates.set(event.keyCode, false);
    }

    update(deltaTime: number) {
        this.moveDirection.set(0, 0, 0);

        if (this.keyStates.get(KeyCode.KEY_W)) {
            this.moveDirection.y += 1; // Forward
        }
        if (this.keyStates.get(KeyCode.KEY_S)) {
            this.moveDirection.y -= 1; // Backward
        }
        if (this.keyStates.get(KeyCode.KEY_A)) {
            this.moveDirection.x -= 1; // Left
        }
        if (this.keyStates.get(KeyCode.KEY_D)) {
            this.moveDirection.x += 1; // Right
        }

        if (this.moveDirection.length() > 0) {
            this.moveDirection.normalize();

            const movement = this.moveDirection.multiplyScalar(
                this.moveSpeed * deltaTime
            );
            this.node.setPosition(this.node.position.add(movement));
        }
    }
}
