import { _decorator, Component, Node, Scene } from 'cc';
import { CurrentScene, popups, Scenes } from '../Defines';
import { PageManager } from '../Pages/PageManager';
import { SceneManager } from '../core/SceneManager';
import SingletonScene from '../core/SingletonScene';
import { SoundMgr } from '../core/SoundMgr';
const { ccclass, property } = _decorator;

@ccclass('SceneHome')
export class SceneHome extends SingletonScene<SceneHome>() {
    onLoad(): void {
        super.onLoad();
        SoundMgr.playMusic(SoundMgr.Instance.BGM);
    }

    public reload() {
        this.LoadSceneManager.loadScene(Scenes.SceneHome);
    }
}
