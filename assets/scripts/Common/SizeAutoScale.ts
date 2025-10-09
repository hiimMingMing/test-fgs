import { _decorator, Component, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SizeAutoScale')
export class SizeAutoScale extends Component {
    @property({
        displayName: 'Limit Width',
        tooltip: 'Enable width-based scaling',
    })
    limitWidth: boolean = false;

    @property({
        displayName: 'Limit Height',
        tooltip: 'Enable height-based scaling',
    })
    limitHeight: boolean = false;

    @property({
        displayName: 'Target Width',
        tooltip: 'Target width to scale to',
    })
    targetWidth: number = 100;

    @property({
        displayName: 'Target Height',
        tooltip: 'Target height to scale to',
    })
    targetHeight: number = 100;

    private uiTransform: UITransform = null;
    private lastContentSize: { x: number; y: number } = { x: 0, y: 0 };

    onLoad() {
        this.uiTransform = this.getComponent(UITransform);
        if (!this.uiTransform) {
            console.warn('[SizeAutoScale] UITransform component not found');
            return;
        }
    }

    start() {
        if (this.uiTransform) {
            this.lastContentSize.x = this.uiTransform.contentSize.x;
            this.lastContentSize.y = this.uiTransform.contentSize.y;
            this.applyAutoScale();
        }
    }

    update() {
        if (!this.uiTransform) return;

        const currentSize = this.uiTransform.contentSize;

        // Check if content size has changed
        if (
            currentSize.x !== this.lastContentSize.x ||
            currentSize.y !== this.lastContentSize.y
        ) {
            this.lastContentSize.x = currentSize.x;
            this.lastContentSize.y = currentSize.y;
            this.applyAutoScale();
        }
    }

    public applyAutoScale() {
        if (!this.uiTransform) return;

        const currentSize = this.uiTransform.contentSize;
        let scale = 1;

        if (this.limitWidth && currentSize.x > 0) {
            // Calculate scale to match: UITransform.size.x * scale === targetWidth
            // Apply same scale to both X and Y to maintain aspect ratio
            scale = this.targetWidth / currentSize.x;
        } else if (this.limitHeight && currentSize.y > 0) {
            // Calculate scale to match: UITransform.size.y * scale === targetHeight
            // Apply same scale to both X and Y to maintain aspect ratio
            scale = this.targetHeight / currentSize.y;
        }

        // Apply the same scale to both axes to maintain aspect ratio
        const finalScaleX = scale;
        const finalScaleY = scale;

        this.node.setScale(finalScaleX, finalScaleY, finalScaleX);
    }

    public setTargetWidth(width: number) {
        this.targetWidth = width;
        if (this.limitWidth) {
            this.applyAutoScale();
        }
    }

    public setTargetHeight(height: number) {
        this.targetHeight = height;
        if (this.limitHeight) {
            this.applyAutoScale();
        }
    }

    public setLimitWidth(enabled: boolean) {
        this.limitWidth = enabled;
        this.applyAutoScale();
    }

    public setLimitHeight(enabled: boolean) {
        this.limitHeight = enabled;
        this.applyAutoScale();
    }

    public resetScale() {
        this.node.setScale(new Vec3(1, 1, 1));
    }
}
