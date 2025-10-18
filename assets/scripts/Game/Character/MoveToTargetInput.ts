import { _decorator, Component, Node, Vec3 } from 'cc';
import { CharacterInput } from '../Character/CharacterInput';
import { GameObserver } from '../Observer/GameObserver';
const { ccclass, property } = _decorator;

@ccclass('MoveToTargetInput')
export class MoveToTargetInput extends CharacterInput {
    private target: Node;
    get Target() {
        return this.target;
    }
    set Target(v) {
        this.target = v;
    }

    start(): void {
        this.Target = GameObserver.Instance.getPlayer().node;
    }
    onDestroy(): void {}

    update(deltaTime: number): void {
        if (this.Target === null) return;

        this.moveDirection = Vec3.subtract(
            this.moveDirection,
            this.Target.worldPosition,
            this.node.worldPosition
        ).normalize();
    }
}
