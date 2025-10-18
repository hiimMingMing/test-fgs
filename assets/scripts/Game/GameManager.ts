import { _decorator, Component, Game, Node } from 'cc';
import SingletonComponent from '../core/SingletonComponent';
const { ccclass, property } = _decorator;

export enum GameState {
    PLAYING,
    END,
}

@ccclass('GameManager')
export class GameManager extends SingletonComponent<GameManager>() {
    @property(Node) ui_End: Node;

    private state: GameState = GameState.PLAYING;
    public get State() {
        return this.state;
    }
    public set State(v) {
        this.state = v;
        this.onStateChange();
    }

    onStateChange() {
        console.log(this.State);
        switch (this.State) {
            case GameState.PLAYING:
                break;
            case GameState.END:
                this.ui_End.active = true;
                break;
            default:
                break;
        }
    }

    end() {
        this.State = GameState.END;
    }
}
