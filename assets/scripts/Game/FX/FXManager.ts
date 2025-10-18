import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import SingletonComponent from '../../core/SingletonComponent';
const { ccclass, property } = _decorator;

export enum FXType {
    IMPACT,
}

@ccclass('FXManager')
export class FXManager extends SingletonComponent<FXManager>() {
    @property(Prefab)
    impactParticlePrefab: Prefab = null;

    private fxPools: Map<FXType, Node[]> = new Map();

    private getPrefabForType(type: FXType): Prefab {
        switch (type) {
            case FXType.IMPACT:
                return this.impactParticlePrefab;
            default:
                return null;
        }
    }

    public play(
        type: FXType,
        position: Vec3,
        rotationDegree: number = 0
    ): Node {
        if (!this.fxPools.has(type)) {
            this.fxPools.set(type, []);
        }

        const pool = this.fxPools.get(type);
        const inactiveParticle = pool.find((particle) => !particle.active);

        let particle: Node;
        if (inactiveParticle) {
            particle = inactiveParticle;
            particle.active = true;
        } else {
            const prefab = this.getPrefabForType(type);
            if (!prefab) return null;

            particle = instantiate(prefab);
            particle.setParent(this.node);
            pool.push(particle);
        }

        particle.setWorldPosition(position);
        particle.setRotationFromEuler(0, 0, rotationDegree);

        this.scheduleOnce(() => {
            particle.active = false;
        }, 1.0);

        return particle;
    }
}
