import { Component } from 'cc';
import { MyScene } from '../Scenes/MyScene';

export default function SingletonScene<T>() {
    class Singleton extends MyScene {
        private static instance: T;

        static get Instance(): T {
            return this.instance;
        }

        onLoad() {
            super.onLoad();
            if (!Singleton.instance) {
                Singleton.instance = this as unknown as T;
            } else {
                // destroy old instance then Singleton.instance = this
                const oldInstance = Singleton.instance as unknown as Component;
                if (oldInstance) {
                    oldInstance.destroy();
                }
                Singleton.instance = this as unknown as T;
            }
        }
    }

    return Singleton;
}
