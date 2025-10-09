import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
import { Popup } from '../popup/Popup';
const { ccclass, property } = _decorator;

@ccclass('PopupMgr')
export class PopupMgr extends Component {
    @property(Prefab)
    public popups: Prefab[] = [];

    push(name: string) {
        const prefab = this.popups.find((obj: any) => obj.data._name === name);
        if (!prefab) console.error(`Popup ${name} is not exist`);
        const newPopup = instantiate(prefab);
        this.node.addChild(newPopup);
        return newPopup;
    }

    pop(callback: any = () => {}) {
        if (this.node.children.length) {
            this.node.children[this.node.children.length - 1]
                .getComponent(Popup)
                .Hide(() => {
                    callback();
                });
        }
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
