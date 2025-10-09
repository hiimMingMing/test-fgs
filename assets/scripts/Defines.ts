import { Enum } from 'cc';
import { SceneHome } from './Scenes/SceneHome';

export class Defines {
    public static readonly MAX_LEVEL = 8;
}

export class Config {
    static DEBUG_MODE = false;
}

export enum EventType {
    INGAME = 'ingame',
    RESULT = 'result',
    SYSTEM = 'system',
    CHANGE_SCENE = 'CHANGE_SCENE'
}

export enum ActionSystem {
    PAUSE,
    RESUME,
    BACK,
}

export enum Scenes {
    SceneHome = 'SceneHome',
}

export const CurrentScene = {
    name: SceneHome,
};

export const popups = {
    PopupError: 'PopupError',
};