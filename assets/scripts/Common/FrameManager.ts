import { _decorator, Component, Node, SpriteFrame } from 'cc';
import SingletonComponent from '../core/SingletonComponent';
const { ccclass, property } = _decorator;

@ccclass('FrameManager')
export class FrameManager extends SingletonComponent<FrameManager>() {
    @property({ type: [SpriteFrame], displayOrder: 1 }) BALLS: SpriteFrame[] =
        [];
    @property({ type: [SpriteFrame], displayOrder: 2 })
    REWARD_ICONS: SpriteFrame[] = [];
    @property({ type: [SpriteFrame], displayOrder: 3 })
    SOUND_ICONS: SpriteFrame[] = [];
}
