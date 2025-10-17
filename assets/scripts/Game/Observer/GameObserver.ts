import { _decorator, Component, Node } from 'cc';
import SingletonComponent from '../../core/SingletonComponent';
import { Player } from '../Player/Player';
const { ccclass, property } = _decorator;

@ccclass('GameObserver')
export class GameObserver extends SingletonComponent<GameObserver>() {
    @property(Player) private player: Player;

    public getPlayer() {
        return this.player;
    }
}
