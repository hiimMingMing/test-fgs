import { _decorator, Component, Sprite, SpriteFrame } from 'cc';
import { i18n, i18n_LANGUAGES } from './i18n';

const { ccclass, property } = _decorator;

@ccclass
export default class LocalizedFrame extends Component {
    @property(SpriteFrame) private EN: SpriteFrame = null;
    @property(SpriteFrame) private MM: SpriteFrame = null;

    private mSprite: Sprite;
    private mDefaultFrame: SpriteFrame;

    onLoad() {
        this.localize = this.localize.bind(this);

        i18n.onLanguageChanged(this.localize, this);
        this.mSprite = this.node.getComponent(Sprite);
        this.mDefaultFrame = this.mSprite.spriteFrame;
    }

    onDestroy() {
        //runtime only
        try {
            i18n.offLanguageChanged(this.localize, this);
        } catch (e) {}
    }

    onEnable() {
        this.localize();
    }

    private localize() {
        this.mSprite.spriteFrame =
            this[i18n_LANGUAGES[i18n.language]] || this.mDefaultFrame;
    }
}
