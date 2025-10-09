
import { _decorator, Component, Node, AudioClip, AudioSource, game, assert } from 'cc';
import SingletonComponent from './SingletonComponent';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('SoundMgrWithoutSingleton')
@requireComponent(AudioSource)
export class SoundMgrWithoutSingleton extends Component {
    @property(AudioClip) SFX_UI_CONFIRM: AudioClip = null;

    public audioSource: AudioSource = null;

    onLoad() {
        this.audioSource = this.getComponent(AudioSource);
    }

    get IsMusicPlaying() {
        return this.audioSource.playing;
    }

    playMusic(clip: AudioClip, loop: boolean = true) {
        if (this.IsMusicPlaying) return;
        this.audioSource.clip = clip;
        this.audioSource.loop = loop;
        this.audioSource.play()
    }

    playSfx(clip: AudioClip) {
        this.audioSource.playOneShot(clip);
    }

    pauseMusic() {
        this.audioSource.pause();
    }
}
