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

export function inject(key, defaultValue) {
    const currentInstance: any = getCurrentInstance();
    if (currentInstance) {
        const parentProvides = currentInstance.parent.provides;
        if (key in parentProvides) {
            return parentProvides[key];
        } else if (defaultValue) {
            return defaultValue
        }
    }
}

// 扩展的
export function useInject(keys = [], defaultValues = {}) {
    const currentInstance: any = getCurrentInstance();
    if (currentInstance) {
        const parentProvides = currentInstance.parent.provides;
        return composeInjectValues(parentProvides, keys, defaultValues);
    }
    return {}
}

function composeInjectValues(provides = {}, keys = [], defaultValues = {}) {
    return keys.reduce((result, currentKey) => {
        if (currentKey in provides) {
            result[currentKey] = provides[currentKey];
        } else if (defaultValues[currentKey]) {
            result[currentKey] = defaultValues[currentKey]
        }
        return result;
    }, {})
}
