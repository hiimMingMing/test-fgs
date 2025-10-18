import {
    _decorator,
    Component,
    Node,
    AudioClip,
    AudioSource,
    game,
    assert,
    randomRange,
} from 'cc';
import * as howler from 'howler'; // Em xin lỗi vì đã dùng package nhưng mà không có nhiều pitch thì âm thanh sẽ khó chịu lắm T_T
import SingletonComponent from './SingletonComponent';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('SoundMgr')
@requireComponent(AudioSource)
export class SoundMgr extends SingletonComponent<SoundMgr>() {
    @property(AudioClip) BGM: AudioClip = null;
    @property(AudioClip) SFX_BUTTON: AudioClip = null;
    @property(AudioClip) SFX_IMPACT: AudioClip = null;
    @property(AudioClip) SFX_PLAYER_HIT: AudioClip = null;

    public audioSource: AudioSource = null;
    public audioSourceBGM: AudioSource = null;
    public playingSFXs: AudioClip[] = [];

    onLoad() {
        super.onLoad();
        this.audioSource = this.getComponent(AudioSource);
        this.audioSourceBGM = this.node
            .getChildByName('BGM')
            .getComponent(AudioSource);
        game.addPersistRootNode(this.node);
    }

    static get IsMusicPlaying() {
        const instance = SoundMgr.Instance;
        return instance.audioSource.playing;
    }

    static playMusic(clip: AudioClip, loop: boolean = true) {
        if (this.IsMusicPlaying && clip === SoundMgr.Instance.audioSource.clip)
            return;
        SoundMgr.stopMusic();
        const instance = SoundMgr.Instance;

        instance.audioSource.clip = clip;
        instance.audioSource.loop = loop;
        instance.audioSource.volume = 1;
        instance.audioSource.play();
    }

    static playBGMusic(clip: AudioClip, loop: boolean = true) {
        if (
            this.IsMusicPlaying &&
            clip === SoundMgr.Instance.audioSourceBGM.clip
        )
            return;
        SoundMgr.stopMusic();
        const instance = SoundMgr.Instance;

        instance.audioSourceBGM.clip = clip;
        instance.audioSourceBGM.loop = loop;
        instance.audioSourceBGM.volume = 1;
        instance.audioSourceBGM.play();
    }

    static playSfx(clip: AudioClip) {
        const instance = SoundMgr.Instance;
        let timeout = 0;
        if (clip === instance.SFX_IMPACT) {
            timeout = 50;
        }
        let index = instance.playingSFXs.indexOf(clip);
        if (index !== -1) return;

        instance.playingSFXs.push(clip);
        if (timeout) {
            setTimeout(() => {
                try {
                    const index = instance.playingSFXs.indexOf(clip);
                    instance.playingSFXs.splice(index, 1);
                } catch (e) {
                    console.log(e);
                }
            }, timeout);
        }

        const sfx = new howler.default.Howl({
            src: [clip.nativeUrl], // Load the audio
            loop: false, // Enable looping
            volume: 1, // Normal volume
            rate: randomRange(0.95, 1.05), // Change this for pitch control
        });
        sfx.once('end', () => {
            sfx.unload(); // Frees memory
            if (!timeout) {
                try {
                    const index = instance.playingSFXs.indexOf(clip);
                    instance.playingSFXs.splice(index, 1);
                } catch (e) {
                    console.log(e);
                }
            }
        });
        sfx.play();
    }

    static async playSfxWithDelay(clip: AudioClip, delay: number) {
        const instance = SoundMgr.Instance;
        let timeout = 0;
        if (clip === instance.SFX_IMPACT) {
            timeout = 50;
        }
        let index = instance.playingSFXs.indexOf(clip);
        if (index !== -1) return;

        instance.playingSFXs.push(clip);
        if (timeout) {
            setTimeout(() => {
                try {
                    const index = instance.playingSFXs.indexOf(clip);
                    instance.playingSFXs.splice(index, 1);
                } catch (e) {
                    console.log(e);
                }
            }, timeout);
        }

        await new Promise((res) => this.Instance.scheduleOnce(res, delay));

        const sfx = new howler.default.Howl({
            src: [clip.nativeUrl], // Load the audio
            loop: false, // Enable looping
            volume: 1, // Normal volume
            rate: randomRange(0.95, 1.05), // Change this for pitch control
        });
        sfx.once('end', () => {
            sfx.unload(); // Frees memory
            if (!timeout) {
                try {
                    const index = instance.playingSFXs.indexOf(clip);
                    instance.playingSFXs.splice(index, 1);
                } catch (e) {
                    console.log(e);
                }
            }
        });
        sfx.play();
    }

    static pauseMusic() {
        const instance = SoundMgr.Instance;
        instance.audioSource.pause();
    }

    static stopMusic() {
        const instance = SoundMgr.Instance;
        instance.audioSource.stop();
    }

    static stopBGMusic() {
        const instance = SoundMgr.Instance;
        instance.audioSourceBGM.stop();
    }

    static resumeMusic() {
        const instance = SoundMgr.Instance;
        instance.audioSource.play();
    }
}
