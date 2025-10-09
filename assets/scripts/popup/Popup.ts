import {
    _decorator,
    Component,
    Vec3,
    tween,
    UITransform,
    view,
    Node,
} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Popup')
export class Popup extends Component {
    @property(Node)
    container: Node;

    onEnable() {
        this.container.setScale(new Vec3(0, 0, 1));
        tween(this.container)
            .to(0.5, { scale: new Vec3(1, 1, 1) }, { easing: 'elasticOut' })
            .start();

        this.node.getComponent(UITransform).contentSize = view.getVisibleSize();
    }

    start() {}

    Show() {
        this.node.active = true;
    }

    IsShowing(): boolean {
        return this.node.active;
    }

    Hide(callback: any = () => {}) {
        tween(this.container)
            .to(0.5, { scale: new Vec3(0, 0, 1) }, { easing: 'elasticIn' })
            .call(() => {
                if (typeof callback == 'function') callback();
                this.node.destroy();
            })
            .start();
    }
}
