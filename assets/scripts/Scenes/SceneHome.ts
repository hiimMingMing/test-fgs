import { _decorator, Component, Node } from 'cc';
import { CurrentScene, popups, Scenes } from '../Defines';
import { PageManager } from '../Pages/PageManager';
import { SceneManager } from '../core/SceneManager';
import SingletonScene from '../core/SingletonScene';
const { ccclass, property } = _decorator;

@ccclass('SceneHome')
export class SceneHome extends SingletonScene<SceneHome>() {
   
}
