import {
    _decorator,
    Component,
    Node,
    director,
    assetManager,
    SceneAsset,
    AssetManager,
    game,
} from 'cc';
import { SendTrackingAndExit } from '../core/Utils';
import EventManager from '../core/EventManager';
import { EventType, ActionSystem } from '../Defines';
import { Fade } from './Fade';
const { ccclass, property } = _decorator;

@ccclass('LoadSceneManager')
export class LoadSceneManager extends Component {
    @property(Node)
    container: Node;

    @property(Node)
    loadingInfo: Node;

    @property(Node)
    lostConnection: Node;

    @property(Node)
    buttonClose: Node;

    fadeScreen: Fade;

    isLoadFailed: boolean = false;
    loadedScene: SceneAsset;
    timeoutHandle: number;

    sceneName: string = '';

    retryTimes = 3;

    show(isShow: boolean = true) {
        this.node.active = isShow;
    }

    set SceneName(name: string) {
        this.sceneName = name;
    }

    set Fade(fadeScreen: Fade) {
        this.fadeScreen = fadeScreen;
    }

    loadScene(sceneName: string) {
        this.fadeScreen.in(() => {
            this.fadeScreen.out(() => {
                // this.loadingInfo.active = true;
                this.lostConnection.active = false;
                this.buttonClose.active = false;

                this.SceneName = sceneName;
                EventManager.GetInstance().on(
                    EventType.SYSTEM,
                    this.OnInterruptEvent,
                    this
                );
                assetManager.main.loadScene(
                    sceneName,
                    this.OnProgressing.bind(this),
                    this.OnSceneLaunched.bind(this)
                );

                this.StartTimeout();

                if ((<any>window).gLoadingTimeSpent == 0) {
                    (<any>window).gLoadingTimeSpent = (<any>(
                        window
                    )).gTotalTimeSpent;
                }
            });
            this.container.active = true;
        });
    }

    update(deltaTime: number) {
        if (!this.lostConnection.active && this.container.active) {
            (<any>window).gLoadingTimeSpent += deltaTime;
        }
    }

    OnSceneLaunched(error: Error, scene: SceneAsset) {
        // AddLogText('Loading error: ' + JSON.stringify(error));
        if (!error && !this.isLoadFailed) {
            clearTimeout(this.timeoutHandle);
            if (this.lostConnection.active) {
                this.loadedScene = scene;
            } else {
                this.Switch2Scene(scene);
            }
        } else {
            if (this.retryTimes > 0) {
                this.retryTimes -= 1;
                clearTimeout(this.timeoutHandle);
                setTimeout(() => {
                    // AddLogText("Retry: " + (4 - this.retryTimes));
                    this.OnRetry();
                }, 1000);
            } else {
                clearTimeout(this.timeoutHandle);
                this.OnFail();
            }
        }
    }

    OnProgressing(
        finished: number,
        total: number,
        item: AssetManager.RequestItem
    ) {}

    OnRetry() {
        // this.buttonSFX.volume = 1;
        // this.buttonSFX.play();
        this.loadingInfo.active = true;
        this.lostConnection.active = false;

        if (this.loadedScene) {
            setTimeout(() => this.Switch2Scene(this.loadedScene), 1000);
            return;
        }

        if (this.isLoadFailed) {
            this.isLoadFailed = false;
            assetManager.downloader._queue = [];
            assetManager.downloader._downloading.clear();
            assetManager._files.clear();

            assetManager.main.loadScene(
                'Ingame',
                this.OnProgressing.bind(this),
                this.OnSceneLaunched.bind(this)
            );
        }

        this.StartTimeout();
    }

    OnExit() {
        SendTrackingAndExit();
    }

    OnFail() {
        this.loadingInfo.active = false;
        this.lostConnection.active = true;
    }

    StartTimeout() {
        this.timeoutHandle = setTimeout(() => {
            this.OnFail();
        }, 30000);
    }

    Switch2Scene(scene: SceneAsset) {
        this.fadeScreen.in(() => {
            director.runSceneImmediate(scene);
        });
    }

    OnInterruptEvent(parameters: any) {
        if (!this.node.active) {
            return;
        }

        switch (parameters.action) {
            case ActionSystem.PAUSE:
                break;

            case ActionSystem.RESUME:
                if (this.loadedScene) {
                    setTimeout(() => this.Switch2Scene(this.loadedScene), 1000);
                }
                break;

            case ActionSystem.BACK:
                this.OnExit();
                break;
        }
    }
}
