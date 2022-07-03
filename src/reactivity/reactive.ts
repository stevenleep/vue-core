import { mutableHandlers, readonlyHandlers } from "./baseHandlers";

export const enum ReactiveFlags {
    IS_REACTIVE = "_v_isReactive",
    IS_READONLY = "_v_isReadonly",
}

export function reactive(raw) {
    return createReactiveObject(raw, mutableHandlers);
}

export function readonly(raw) {
    return createReactiveObject(raw, readonlyHandlers);
};

function createReactiveObject(raw, baseHandlers) {
    return new Proxy(raw, baseHandlers);
}

export function isReactive(value: Object): boolean {
    return !!value[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(value: Object): boolean {
    return !!value[ReactiveFlags.IS_READONLY];
}