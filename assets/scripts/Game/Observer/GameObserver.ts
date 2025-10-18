import { _decorator, Component, Node } from 'cc';
import SingletonComponent from '../../core/SingletonComponent';
import { Character } from '../Character/Character';
const { ccclass, property } = _decorator;

@ccclass('GameObserver')
export class GameObserver extends SingletonComponent<GameObserver>() {
    @property(Character) private player: Character;

    private targetableObjects: Character[] = [];

    public getPlayer() {
        return this.player;
    }

    public addtargetableObjects(obj: Character) {
        this.targetableObjects.push(obj);
    }

    public getTargetableObjects() {
        this.targetableObjects = this.targetableObjects.filter(
            (obj) => obj.isValid
        );
        return this.targetableObjects;
    }
}
