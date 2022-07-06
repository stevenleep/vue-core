import { capitalize, hasOwnProperty, underlineIn2hump } from "../shared/index";

function toHandlerKeys(prefix: string = "on", eventProperty: string): string {
    return prefix + eventProperty;
}

export function emit(instance, eventProperty, ...args) {
    const handlerKey = toHandlerKeys("on", capitalize(underlineIn2hump(eventProperty)));
    if (hasOwnProperty(instance.props, handlerKey) && typeof instance.props[handlerKey] === "function") {
        // call the event handler
        instance.props[handlerKey](...args);
    }
}

// TODO: 运行时扩展实例
export function extendRuntimeInstance(instance, extendApis = {}) {
    // XXX: 临时解决方案
    // TODO: 待完善扩展实例
    Object.keys(extendApis).forEach(key => {
        instance[key] = extendApis[key];
    });
}