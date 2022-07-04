export * from "./type";

export function extend(original, extendObject) {
    return Object.assign(original, extendObject);
}

export function hasChanged(value, newValue) {
    return !Object.is(value, newValue);
}