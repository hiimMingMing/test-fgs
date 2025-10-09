import {
    _decorator,
    Component,
    Node,
    AudioClip,
    AudioSource,
    game,
    assert,
} from 'cc';
import SingletonComponent from './SingletonComponent';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('SoundMgr')
@requireComponent(AudioSource)
export class SoundMgr extends SingletonComponent<SoundMgr>() {
    @property(AudioClip) BGM: AudioClip = null;
    @property(AudioClip) SFX_BUTTON: AudioClip = null;
    @property(AudioClip) SFX_DROP: AudioClip = null;
    @property(AudioClip) SFX_GAMEOVER: AudioClip = null;
    @property(AudioClip) SFX_MERGE: AudioClip = null;
    @property(AudioClip) SFX_BUY_PACK_SUCCESS: AudioClip = null;
    @property(AudioClip) SFX_ENDSCREEN: AudioClip = null;

    public audioSource: AudioSource = null;
    private static _isMuted: boolean = true;

    onLoad() {
        super.onLoad();
        this.audioSource = this.getComponent(AudioSource);
        game.addPersistRootNode(this.node);
        this.loadMuteState();
        this.startMusicCheck();
    }

    private startMusicCheck() {
        this.schedule(this.checkMusicPlaying, 1);
    }

    private checkMusicPlaying() {
        const instance = SoundMgr.Instance;
        if (
            !SoundMgr._isMuted &&
            instance.audioSource.clip &&
            !instance.audioSource.playing
        ) {
            instance.audioSource.play();
        }
    }

    private loadMuteState() {
        this.audioSource.volume = SoundMgr._isMuted ? 0 : 1;
    }

    static get IsMusicPlaying() {
        const instance = SoundMgr.Instance;
        return instance.audioSource.playing;
    }

    static playMusic(clip: AudioClip, loop: boolean = true) {
        if (this.IsMusicPlaying) return;
        const instance = SoundMgr.Instance;
        instance.audioSource.clip = clip;
        instance.audioSource.loop = loop;
        instance.audioSource.play();
    }

    static playSfx(clip: AudioClip) {
        const instance = SoundMgr.Instance;
        instance.audioSource.playOneShot(clip, this._isMuted ? 0 : 1);
    }

    static pauseMusic() {
        const instance = SoundMgr.Instance;
        instance.audioSource.pause();
    }

    static get IsMuted() {
        return SoundMgr._isMuted;
    }

    static mute() {
        SoundMgr._isMuted = true;
        const instance = SoundMgr.Instance;
        instance.audioSource.volume = 0;
    }

    static unmute() {
        SoundMgr._isMuted = false;
        localStorage.setItem('sound_muted', 'false');
        const instance = SoundMgr.Instance;
        instance.audioSource.volume = 1;
    }
}
