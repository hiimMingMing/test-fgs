import { _decorator, Component, Node, Vec3, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CenterGrid')
export class CenterGrid extends Component {
    @property({
        displayName: 'Columns',
        tooltip: 'Number of columns in the grid',
    })
    columns: number = 3;

    @property({ displayName: 'Cell Width', tooltip: 'Width of each cell' })
    cellWidth: number = 100;

    @property({ displayName: 'Cell Height', tooltip: 'Height of each cell' })
    cellHeight: number = 100;

    @property({
        displayName: 'Spacing X',
        tooltip: 'Horizontal spacing between cells',
    })
    spacingX: number = 10;

    @property({
        displayName: 'Spacing Y',
        tooltip: 'Vertical spacing between cells',
    })
    spacingY: number = 10;

    @property({
        displayName: 'Auto Layout',
        tooltip: 'Automatically layout children when added',
    })
    autoLayout: boolean = true;

    private isLayouting: boolean = false;
    private lastChildCount: number = 0;
    private checkInterval: number = 0.1; // Check every 0.1 seconds

    onLoad() {
        this.lastChildCount = 0;
        if (this.autoLayout) {
            this.schedule(this.checkForChanges, this.checkInterval);
        }
    }

    onDestroy() {
        this.unschedule(this.checkForChanges);
    }

    private checkForChanges() {
        const currentChildCount = this.node.children.length;

        if (currentChildCount !== this.lastChildCount) {
            this.lastChildCount = currentChildCount;
            this.updateLayout();
        }
    }

    public updateLayout() {
        if (this.isLayouting) return;
        this.isLayouting = true;

        const children = this.node.children.filter((child) => child.active);
        const childCount = children.length;

        if (childCount === 0) {
            this.isLayouting = false;
            // Set size to 0 when no children
            this.updateNodeSize(0, 0);
            return;
        }

        const rows = Math.ceil(childCount / this.columns);

        // For the last row, calculate how many items are actually there
        const lastRowItemCount = childCount % this.columns || this.columns;

        children.forEach((child, index) => {
            const row = Math.floor(index / this.columns);
            const col = index % this.columns;

            // Determine if this is the last row and needs centering
            const isLastRow = row === rows - 1;
            const itemsInThisRow = isLastRow ? lastRowItemCount : this.columns;

            // Calculate row width for centering
            const rowWidth =
                itemsInThisRow * this.cellWidth +
                (itemsInThisRow - 1) * this.spacingX;

            // Center each row individually
            const rowStartX = -rowWidth / 2 + this.cellWidth / 2;
            const x = rowStartX + col * (this.cellWidth + this.spacingX);

            // Calculate Y position from top
            const totalHeight =
                rows * this.cellHeight + (rows - 1) * this.spacingY;
            const y =
                totalHeight / 2 -
                this.cellHeight / 2 -
                row * (this.cellHeight + this.spacingY);

            child.setPosition(new Vec3(x, y, 0));
        });

        // Update the container size to fit all children
        const maxRowWidth =
            this.columns * this.cellWidth + (this.columns - 1) * this.spacingX;
        const totalHeight = rows * this.cellHeight + (rows - 1) * this.spacingY;
        this.updateNodeSize(maxRowWidth, totalHeight);

        this.isLayouting = false;
    }

    private updateNodeSize(width: number, height: number) {
        const uiTransform = this.node.getComponent(UITransform);
        if (uiTransform) {
            uiTransform.setContentSize(width, height);
        }
    }

    public setColumns(columns: number) {
        this.columns = Math.max(1, columns);
        if (this.autoLayout) {
            this.updateLayout();
        }
    }

    public setCellSize(width: number, height: number) {
        this.cellWidth = width;
        this.cellHeight = height;
        if (this.autoLayout) {
            this.updateLayout();
        }
    }

    public setSpacing(spacingX: number, spacingY: number) {
        this.spacingX = spacingX;
        this.spacingY = spacingY;
        if (this.autoLayout) {
            this.updateLayout();
        }
    }

    public getGridSize(): { width: number; height: number; rows: number } {
        const childCount = this.node.children.filter(
            (child) => child.active
        ).length;
        const rows = Math.ceil(childCount / this.columns);

        const width =
            this.columns * this.cellWidth + (this.columns - 1) * this.spacingX;
        const height = rows * this.cellHeight + (rows - 1) * this.spacingY;

        return { width, height, rows };
    }
}
