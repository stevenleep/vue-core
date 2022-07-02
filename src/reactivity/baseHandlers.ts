import { track, trigger } from "./effect";

const mutableGet = createGetter();
const readonlyGet = createGetter(true);
const mutableSet = createSetter();

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

function createGetter(isReadonly: boolean = false) {
    return function get(target, property) {
        if (!isReadonly) {
            track(target, property);
        }
        return Reflect.get(target, property)
    }
}
function createSetter() {
    return function set(target, property, value) {
        const nextValue = Reflect.set(target, property, value)
        // 触发依赖更新
        trigger(target, property);
        return nextValue
    }
}
