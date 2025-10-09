import {
    _decorator,
    Component,
    instantiate,
    Layout,
    Node,
    Prefab,
    Sprite,
    tween,
    UIOpacity,
    UITransform,
    v3,
    Vec3,
    view,
    Widget,
    Button,
} from 'cc';
import EventManager from '../core/EventManager';
import { EventType } from '../Defines';
import { SoundMgr } from '../core/SoundMgr';

const { ccclass, property } = _decorator;

@ccclass('PageManager')
export class PageManager extends Component {
    @property(Node)
    pageContainer: Node;
    @property([Prefab])
    prefabPages: Prefab[] = [];
    @property(Node)
    bottomNavigation: Node;

    private _previousPage: Node;
    private _currentPage: Node;
    private _currentPageIndex: number;
    private _UITransform: UITransform;
    private isAnimating: boolean = false;
    private pagePool: Node[] = []; // Pool to store instantiated pages
    private hiddenPageContainer: Node; // Container to store hidden pages

    protected onEnable(): void {
        this.initPage();
        this.updateUIBottomNavigation();
        this.InitEvents();
    }


    private InitEvents() {
    }

    updateUIBottomNavigation() {
        this.bottomNavigation.children.forEach((btn, i) => {
            try {
                btn.getChildByName('active').active =
                    i == this._currentPageIndex;
                btn.getChildByName('deactive').active =
                    i != this._currentPageIndex;

                // Add button click event listener
                const buttonComponent = btn.getComponent(Button);
                if (buttonComponent) {
                    buttonComponent.node.off('click');
                    buttonComponent.node.on('click', () => {
                        this.onPageChange(null, i.toString());
                    });
                }
            } catch (error) {
                console.log(error);
            }
        });
    }

    initPage() {
        this._currentPageIndex = 0;
        this._UITransform = this.node.getComponent(UITransform);
        this.pageContainer.getComponent(Widget).updateAlignment();

        // Create hidden page container if it doesn't exist
        if (!this.hiddenPageContainer) {
            this.hiddenPageContainer = new Node('HiddenPageContainer');
            this.hiddenPageContainer.parent = this.node;
            this.hiddenPageContainer.active = false;
        }

        this.pageContainer.removeAllChildren();

        // Get or create the first page
        const page = this.getOrCreatePage(this._currentPageIndex);
        this.showPage(page);

        this._previousPage = null;
        this._currentPage = page;
    }

    addNewPage(pageIndex: number, from: number) {
        // Get or create the page from pool
        const page = this.getOrCreatePage(pageIndex);

        // Show the page and set initial position for animation
        this.showPage(page);
        page.setPosition(v3(-this._UITransform.width * from));
        page.getComponent(UIOpacity).opacity = 1;

        this._previousPage = this._currentPage;
        this._currentPage = page;
    }

    updatePageOpacity() {
        const prePage = this._previousPage?.getComponent(UIOpacity);
        const currPage = this._currentPage?.getComponent(UIOpacity);
        tween(prePage.getComponent(UIOpacity))
            .to(0.5, { opacity: 1 }, { easing: 'smooth' })
            .start();
        tween(currPage.getComponent(UIOpacity))
            .to(0.5, { opacity: 255 }, { easing: 'smooth' })
            .start();
    }

    updatePageActivation() {
        this.pageContainer.children.forEach((page) => {
            if (page.uuid !== this._currentPage.uuid) {
                this.hidePage(page);
            }
        });
    }

    public onPageChange(event: any, pageIndex: string) {
        // Prevent interaction during animation
        if (this.isAnimating) return;

        const index = Number(pageIndex);
        if (this._currentPageIndex == index) return;

        SoundMgr.playSfx(SoundMgr.Instance.SFX_BUTTON);
        const direction = Math.sign(this._currentPageIndex - index);
        this._currentPageIndex = index;
        this.addNewPage(index, direction);
        this.onSlide(direction);
    }

    onSlide(to: number) {
        // Set animation flag to prevent user interaction
        this.isAnimating = true;
        this.updateUIBottomNavigation();

        const prePage = this._previousPage;
        const currPage = this._currentPage;
        const newPosition = this.pageContainer.position
            .clone()
            .add(v3(this._UITransform.width * to));
        tween(prePage)
            .to(0.5, { position: newPosition }, { easing: 'backOut' })
            .call(() => {
                this.updatePageActivation();
                // Reset animation flag when animation completes
                this.isAnimating = false;
            })
            .start();
        tween(currPage)
            .to(0.5, { position: Vec3.ZERO }, { easing: 'backOut' })
            .start();
        this.updatePageOpacity();
    }

    /**
     * Get an existing page from pool or create a new one
     */
    private getOrCreatePage(pageIndex: number): Node {
        // Try to find existing page in pool
        let page = this.pagePool[pageIndex];

        if (!page) {
            // Create new page if not exists
            page = instantiate(this.prefabPages[pageIndex]);
            page.name = `Page_${pageIndex}`;
            this.pagePool[pageIndex] = page;
            console.log(`[PageManager] Created new page for index ${pageIndex}`);
        } else {
            console.log(`[PageManager] Reusing existing page for index ${pageIndex}`);
        }

        return page;
    }

    /**
     * Show a page by moving it to the page container
     */
    private showPage(page: Node): void {
        if (page.parent !== this.pageContainer) {
            page.parent = this.pageContainer;
        }
        page.active = true;
        page.setPosition(Vec3.ZERO);
    }

    /**
     * Hide a page by moving it to the hidden container
     */
    private hidePage(page: Node): void {
        if (page.parent !== this.hiddenPageContainer) {
            page.parent = this.hiddenPageContainer;
        }
        page.active = false;
    }

    /**
     * Clean up all pages in the pool (call this when component is destroyed)
     */
    private destroyAllPages(): void {
        this.pagePool.forEach(page => {
            if (page && page.isValid) {
                page.destroy();
            }
        });
        this.pagePool = [];

        if (this.hiddenPageContainer && this.hiddenPageContainer.isValid) {
            this.hiddenPageContainer.destroy();
        }
    }

    protected onDestroy(): void {
        this.destroyAllPages();
    }
}
