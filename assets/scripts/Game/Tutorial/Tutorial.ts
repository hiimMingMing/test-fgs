import { _decorator, Component, Label, Node, tween, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Tutorial')
export class Tutorial extends Component {
    @property(UIOpacity) descriptionOpacity: UIOpacity;

    start() {
        this.scheduleOnce(this.hide, 10);
    }

    hide() {
        tween(this.descriptionOpacity)
            .to(3, {
                opacity: 0,
            })
            .start();
    }
}
