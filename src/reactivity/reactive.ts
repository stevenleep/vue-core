import { track, trigger } from "./effect";

export function reactive(raw) {
    return new Proxy(raw, {
        get(target, property, receiver) {
            // TODO: 依赖收集
            track(target, property);
            return Reflect.get(target, property)
        },

        set(target, property, value) {
            const nextValue = Reflect.set(target, property, value)
            // 触发依赖更新
            trigger(target, property);
            return nextValue
        }
    });
}