import { _decorator, Component, Node, Vec3 } from 'cc';
import SingletonComponent from './SingletonComponent';
const { ccclass, property } = _decorator;

@ccclass('CameraShake')
export class CameraShake extends SingletonComponent<CameraShake>() {
    private originalPosition: Vec3 = new Vec3();
    private shakeIntensity: number = 0;
    private shakeDuration: number = 0;
    private shakeTimer: number = 0;
    private isShaking: boolean = false;

    onLoad(): void {
        super.onLoad();
        this.originalPosition.set(this.node.position);
    }

    protected update(dt: number): void {
        if (!this.isShaking) return;

        this.shakeTimer -= dt;

        if (this.shakeTimer <= 0) {
            this.stopShake();
            return;
        }

        const progress = this.shakeTimer / this.shakeDuration;
        const currentIntensity = this.shakeIntensity * progress;

        const offsetX = (Math.random() - 0.5) * 2 * currentIntensity;
        const offsetY = (Math.random() - 0.5) * 2 * currentIntensity;

        this.node.setPosition(
            this.originalPosition.x + offsetX,
            this.originalPosition.y + offsetY,
            this.originalPosition.z
        );
    }

    public shake(intensity: number, duration: number): void {
        this.shakeIntensity = intensity;
        this.shakeDuration = duration;
        this.shakeTimer = duration;
        this.isShaking = true;
    }

    private stopShake(): void {
        this.isShaking = false;
        this.node.setPosition(this.originalPosition);
    }
}
