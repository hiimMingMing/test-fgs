import { _decorator, Component, director, game, Node } from 'cc';
import EventManager from './EventManager';
import SingletonNonReNewComponent from './SingletonNonReNewComponent';
import { EventType } from '../Defines';
import { SoundMgr } from './SoundMgr';
const { ccclass, property } = _decorator;

@ccclass('SceneManager')
export class SceneManager extends SingletonNonReNewComponent<SceneManager>() {
    private currentScene: any = null;
    onLoad() {
        super.onLoad();
        game.addPersistRootNode(this.node);

        EventManager.GetInstance().on(EventType.CHANGE_SCENE, (scene) => {
            console.log(scene);
            this.currentScene = scene;
            SoundMgr.playSfx(SoundMgr.Instance.SFX_BUTTON);
        });
    }

    protected onDisable(): void {
        EventManager.GetInstance().off(EventType.CHANGE_SCENE, (scene) => {
            console.log(scene);
            this.currentScene = scene;
        });
    }

    getScene() {
        return this.currentScene;
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
