import { assetManager, ImageAsset, Sprite, SpriteFrame, Texture2D } from 'cc';

/**
 * Random a float number
 * @param min
 * @param max
 * @returns number
 */
export function Rand(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

/**
 * Random a integer number min max inclusive
 * @param min
 * @param max
 * @returns number
 */
export function RandInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Get SpriteFrame from URL
 * @param url
 * @returns SpriteFrame
 */
export function GetSpriteFrameFromUrl(url: string): Promise<SpriteFrame> {
    return new Promise<SpriteFrame>((resolve, reject) => {
        assetManager.loadRemote<ImageAsset>(
            url,
            { xhrMimeType: 'image/png' },
            (error, imageAsset) => {
                if (!error) {
                    const spriteFrame = new SpriteFrame();
                    const texture = new Texture2D();
                    texture.image = imageAsset;
                    spriteFrame.texture = texture;

                    resolve(spriteFrame);
                } else {
                    reject(null);
                }
            }
        );
    });
}

/**
 * Hide init loading icon
 */
export function HideLoadingIcon() {
    let splash = document.getElementById('splash');
    if (splash) {
        splash.style.display = 'none';
    }
}

/**
 * Send tracking and exit the game
 * @param customTrackingData
 */
export function SendTrackingAndExit(customTrackingData: string = 'N/A') {
    const ExitGame = () => {};

    setTimeout(ExitGame, 0);
}

/**
 * Dispatch event
 * @param eventName
 */
export function DispatchEvent(eventName: string) {
    let evt;
    try {
        evt = new Event(eventName);
    } catch (e) {
        evt = document.createEvent('Event');
        evt.initEvent(eventName, true, true);
    }
    document.dispatchEvent(evt);
}

/**
 * Add debug log to screen
 * @param value
 */
export function AddLogText(value: string) {
    let mainWindow = <any>window;
    if (mainWindow.mMainDivLogText == undefined) {
        let logStyle = document.createElement('style');
        logStyle.innerText = `
            .main_div_log_text{width: 100%; height: 100%; position: fixed; top: 0; left: 0; z-index: 99999; pointer-events: none; text-align: left; overflow: hidden; margin: 0; padding: 0;}
            .main_div_log_text div{width: 100%; height: 100%; padding: 0; margin: 0; text-align: left; overflow-x: hidden; overflow-y: auto; pointer-events: none;}
            .main_div_log_text div p{display: inline; margin: 0; padding: 0; font-family: 'Arial'; color: #00ff00; background-color: rgba(0, 0, 0, 0.3); font-size: 2vmax;}
        `;

        mainWindow.mMainDivLogText = document.createElement('div');
        mainWindow.mMainDivLogText.classList.add('main_div_log_text');
        mainWindow.mDivLogText = document.createElement('div');
        document.head.appendChild(logStyle);
        document.body.appendChild(mainWindow.mMainDivLogText);
        mainWindow.mMainDivLogText.appendChild(mainWindow.mDivLogText);
    }

    let newP = document.createElement('p');
    newP.innerText = '' + value;
    newP.appendChild(document.createElement('br'));

    mainWindow.mDivLogText.appendChild(newP);
    mainWindow.mDivLogText.scrollTop = mainWindow.mDivLogText.scrollHeight;

    while (
        mainWindow.mDivLogText.childNodes.length > 2 &&
        mainWindow.mDivLogText.lastChild.offsetTop >=
            0.95 * mainWindow.mDivLogText.getBoundingClientRect().height
    ) {
        mainWindow.mDivLogText.removeChild(mainWindow.mDivLogText.firstChild);
    }
}

export const getQueryString = (key: string) => {
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    const params: { [key: string]: string } = {};
    vars.forEach((q) => {
        const pair = q.split('=');
        params[pair[0]] = decodeURIComponent(pair[1] || '');
    });

    return params[key] || '';
};

export const removeParamFromCurrentUrl = (param: string) => {
    const url = new URL(window.location);
    url.searchParams.delete(param);

    // Using history.replaceState() to change the URL without causing a page reload
    window.history.replaceState({}, '', url);
};

export const getRemanningTime = (endDate: Date) => {
    var date = new Date();
    var seconds: number = (endDate.getTime() - date.getTime()) / 1000;

    if (seconds <= 0) {
        return {
            day: 0,
            hour: 0,
            minute: 0,
            second: 0,
        };
    }

    return {
        day: Math.floor(seconds / 86400),
        hour: Math.floor((seconds % 86400) / 3600),
        minute: Math.floor((seconds % 3600) / 60),
        second: Math.floor(seconds % 60),
    };
};

export const timeoutPromise = (time: number, promise: any) => {
    const timeout = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject({
                code: 408,
                message: 'Đã có sự cố xảy ra.\nVui lòng thử lại sau ít phút.',
            });
        }, time * 1000);
    });

    return Promise.race([promise, timeout]);
};

export const getCDN = (url: string): string => {
    if (url.match(/elo-games.s3-ap-southeast-1.amazonaws.com/i)) {
        url = url.replace(
            'elo-games.s3-ap-southeast-1.amazonaws.com',
            'elo-games.elofun.com'
        );
    } else if (url.match(/elo-assets.s3-ap-southeast-1.amazonaws.com/i)) {
        url = url.replace(
            'elo-assets.s3-ap-southeast-1.amazonaws.com',
            'elo-games.elofun.com'
        );
    } else if (
        url.match(
            /e8d31c1b-5385-4052-abaf-3dc0fabb24c3.s3-ap-southeast-1.amazonaws.com/i
        )
    ) {
        url = url.replace(
            'e8d31c1b-5385-4052-abaf-3dc0fabb24c3.s3-ap-southeast-1.amazonaws.com',
            'elo-games.elofun.com'
        );
    }
    return url;
};

export const vietnameseOrder: string =
    'aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ';

export const compareVietnameseChars = (a: string, b: string): number => {
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
        if (a[i] !== b[i]) {
            return (
                (vietnameseOrder.indexOf(a[i]) || 0) -
                (vietnameseOrder.indexOf(b[i]) || 0)
            );
        }
    }
    return a.length - b.length;
};

export const vietnameseSort = (array: string[]): string[] => {
    return array.sort(compareVietnameseChars);
};

export const numberFormat = (value: number) => {
    var formatter = new Intl.NumberFormat('en-US');
    return formatter.format(value);
};

export const getTotalTurns = (userData: Record<any, any>) => {
    let totalTurns = 0;

    // Find both TURN_FREE and TURN_PAID items from user data
    if (userData.wallet && typeof userData.wallet === 'object') {
        const turnFreeWallet = userData.wallet.TURN_FREE;
        const turnPaidWallet = userData.wallet.TURN_PAID;

        const freeTurns = turnFreeWallet ? turnFreeWallet.balance || 0 : 0;
        const paidTurns = turnPaidWallet ? turnPaidWallet.balance || 0 : 0;

        totalTurns = freeTurns + paidTurns;

        console.log(
            '[Header] Free turns:',
            freeTurns,
            'Paid turns:',
            paidTurns,
            'Total:',
            totalTurns
        );
    }

    return totalTurns;
};
