import { _decorator, Component, JsonAsset, resources } from 'cc';
import { CharacterStats } from './CharacterStats';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('CharacterConfigLoader')
@requireComponent(CharacterStats)
export class CharacterConfigLoader extends Component {
    protected onLoad(): void {
        const nodeName = this.node.name;
        const configPath = `config/${nodeName}`;

        resources.load(configPath, JsonAsset, (err, asset) => {
            if (err) {
                console.warn(`No config found for ${nodeName}`);
                return;
            }

            const config = asset.json;
            const stats = this.getComponent(CharacterStats);
            if (stats) {
                stats.loadFromConfig(config);
            }
        });
    }
}
