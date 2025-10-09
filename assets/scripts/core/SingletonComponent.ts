import { Component } from 'cc';

export default function SingletonComponent<T>() {
    class Singleton extends Component {
        private static instance: T;

        static get Instance(): T {
            return this.instance;
        }

        onLoad() {
            if (!Singleton.instance) {
                Singleton.instance = this as unknown as T;
            } else {
                // Destroy old instance and set new one
                const oldInstance = Singleton.instance as unknown as Component;
                if (oldInstance && oldInstance.node) {
                    oldInstance.destroy();
                }
                Singleton.instance = this as unknown as T;
            }
        }
    }

    return Singleton;
}
