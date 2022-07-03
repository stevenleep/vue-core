import { isObject } from "../shared";
import { track, trigger } from "./effect";
import { reactive, ReactiveFlags, readonly } from "./reactive";

const mutableGet = createGetter();
const readonlyGet = createGetter(true);
const mutableSet = createSetter();
const shallowReadonlyGet = createGetter(true, true);
const shallowReactiveGet = createGetter(false, true);

export const mutableHandlers = {
    get: mutableGet,
    set: mutableSet
}
export const readonlyHandlers = {
    get: readonlyGet,
    set(target, property, value) {
        console.warn(`Cannot set readonly property "${property}"!`);
        return true;
    }
}
export const shallowReadonlyHandlers = {
    get: shallowReadonlyGet,
    set(target, property, value) {
        console.warn(`Cannot set readonly property "${property}"!`);
        return true;
    }
};
export const shallowReactiveHandlers = {
    get: shallowReactiveGet,
    set: mutableSet,
}

function createGetter(isReadonly: boolean = false, isShallow: boolean = false) {
    return function get(target, property) {
        // TODO: 优化这里的if逻辑

        // isReactive
        if (property === ReactiveFlags.IS_REACTIVE) { return !isReadonly; };
        // isReadonly
        if (property === ReactiveFlags.IS_READONLY) { return isReadonly; };
        // isShallowReadonly
        if (property === ReactiveFlags.IS_SHALLOW_READONLY) { return isShallow && isReadonly; };
        // isShallowReactive
        if (property === ReactiveFlags.IS_SHALLOW_REACTIVE) { return !isReadonly && isShallow; };

        // 只要出现shallow证明是浅层的处理，可以同时处理shallowReactive 和 shallowReadonly
        const value = Reflect.get(target, property);
        if (isShallow) { return value; }

        if (isObject(value)) {
            return isReadonly
                ? readonly(value)
                : reactive(value)
        }
        // normal logical get
        if (!isReadonly) { track(target, property); }
        return value;
    }
}

function createSetter() {
    return function set(target, property, value) {
        const nextValue = Reflect.set(target, property, value);
        trigger(target, property);
        return nextValue
    }
}
