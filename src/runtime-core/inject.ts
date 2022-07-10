import { getCurrentInstance } from "./component";

/**
 * Notes: 
 * 1. instance只能在setup中调用, 故使得provide工/inject作的作用域仅为setup
 */
export function provide(key, value) {
    const currentInstance: any = getCurrentInstance();
    if (currentInstance) {
        let { provides } = currentInstance;
        const parentProvides = currentInstance.parent.provides;

        // init
        if (provides === parentProvides) {
            provides = currentInstance.provides = Object.create(parentProvides);
        }

        provides[key] = value;
    }
}

export function inject(key) {
    const currentInstance: any = getCurrentInstance();
    if (currentInstance) {
        const parentProvides = currentInstance.parent.provides;
        console.log(key, parentProvides)
        return parentProvides[key];
    }
}
