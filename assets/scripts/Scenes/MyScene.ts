import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
import { PopupMgr } from '../core/PopupMgr';
import { Fade } from '../core/Fade';
import { LoadSceneManager } from '../core/LoadSceneManager';
const { ccclass, property } = _decorator;

@ccclass('MyScene')
export class MyScene extends Component {
    @property(Prefab)
    public loadingPrefab: Prefab = null;
    @property(Prefab)
    public fadePrefab: Prefab = null;
    @property(Prefab)
    public popupMgrPrefab: Prefab = null;

    private static loading: Node = null;
    private static popupMgr: Node = null;
    private static fade: Node = null;

    onLoad() {
        const newLoading = instantiate(this.loadingPrefab);
        MyScene.loading = newLoading;
        this.node.parent.getChildByName('Canvas').addChild(newLoading);
        const newFade = instantiate(this.fadePrefab);
        MyScene.fade = newFade;
        this.node.parent.getChildByName('Canvas').addChild(newFade);
        this.LoadSceneManager.Fade = this.Fade;
        const newPopupMgr = instantiate(this.popupMgrPrefab);
        MyScene.popupMgr = newPopupMgr;
        this.node.parent.getChildByName('Canvas').addChild(newPopupMgr);
    }

    get PopupManager() {
        return MyScene.popupMgr.getComponent(PopupMgr);
    }

    get LoadSceneManager() {
        return MyScene.loading.getComponent(LoadSceneManager);
    }

    get Fade() {
        return MyScene.fade.getComponent(Fade);
    }

    fadeOut(cb: Function = () => {}) {
        this.Fade.out(cb);
    }

    fadeIn(cb: Function = () => {}) {
        this.Fade.in(cb);
    }

    onEnable() {
        this.fadeOut();
    }
}
