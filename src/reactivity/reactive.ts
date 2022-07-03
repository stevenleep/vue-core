import { mutableHandlers, readonlyHandlers, shallowReactiveHandlers, shallowReadonlyHandlers } from "./baseHandlers";

export const enum ReactiveFlags {
    IS_REACTIVE = "_v_isReactive",
    IS_READONLY = "_v_isReadonly",
    IS_SHALLOW_READONLY = "_v_isShallowReadonly",
    IS_SHALLOW_REACTIVE = "_v_isShallowReactive"
}

function createReactiveObject(raw, baseHandlers) {
    return new Proxy(raw, baseHandlers);
}
export function reactive(raw) {
    return createReactiveObject(raw, mutableHandlers);
}
export function readonly(raw) {
    return createReactiveObject(raw, readonlyHandlers);
};
export function shallowReadonly(value: Object) {
    return createReactiveObject(value, shallowReadonlyHandlers);
};
export function shallowReactive(value: Object) {
    return createReactiveObject(value, shallowReactiveHandlers);
}

export function isReactive(value: Object): boolean {
    return !!value[ReactiveFlags.IS_REACTIVE];
}
export function isReadonly(value: Object): boolean {
    return !!value[ReactiveFlags.IS_READONLY];
}

export function isShallowReadonly(value: Object): boolean {
    return !!value[ReactiveFlags.IS_SHALLOW_READONLY];
}

export function isShallowReactive(value: Object): boolean {
    return !!value[ReactiveFlags.IS_SHALLOW_REACTIVE];
}