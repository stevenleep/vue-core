import { getCurrentInstance } from "./component";

/**
 * Notes: 
 * 1. instance只能在setup中调用, 故使得provide工/inject作的作用域仅为setup
 */
export function provide(key, value) {
    const currentInstance: any = getCurrentInstance();
    if (currentInstance) {
        mountProvide(currentInstance?.provides, key, value)
    }
}
function mountProvide(target, key, value) {
    target[key] = value;
}

export function inject(key) {
    const currentInstance: any = getCurrentInstance();
    if (currentInstance) {
        const parentProvides = currentInstance.parent.provides;
        return parentProvides[key];
    }
}
