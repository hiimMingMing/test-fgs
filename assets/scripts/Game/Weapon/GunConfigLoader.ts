import { _decorator, Component, JsonAsset, resources } from 'cc';
import { GunStats } from './GunStats';
import { ConeGunStats } from './ConeGunStats';
const { ccclass, property } = _decorator;

@ccclass('GunConfigLoader')
export class GunConfigLoader extends Component {
    protected onLoad(): void {
        const nodeName = this.node.name;
        const configPath = `config/${nodeName}`;

        resources.load(configPath, JsonAsset, (err, asset) => {
            if (err) {
                console.warn(`No config found for ${nodeName}`);
                return;
            }

            const config = asset.json;

            const coneGunStats = this.getComponent(ConeGunStats);
            if (coneGunStats) {
                coneGunStats.loadFromConfig(config);
                return;
            }

            const gunStats = this.getComponent(GunStats);
            if (gunStats) {
                gunStats.loadFromConfig(config);
            }
        });
    }
}
