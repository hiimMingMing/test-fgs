import { _decorator, Component, JsonAsset, resources } from 'cc';
import { BulletStats } from './BulletStats';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('BulletConfigLoader')
@requireComponent(BulletStats)
export class BulletConfigLoader extends Component {
    protected onLoad(): void {
        const nodeName = this.node.name;
        const configPath = `config/${nodeName}`;

        resources.load(configPath, JsonAsset, (err, asset) => {
            if (err) {
                console.warn(`No config found for ${nodeName}`);
                return;
            }

            const config = asset.json;
            const stats = this.getComponent(BulletStats);
            if (stats) {
                stats.loadFromConfig(config);
            }
        });
    }
}
