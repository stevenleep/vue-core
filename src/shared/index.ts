export function extend(original, extendObject) {
    return Object.assign(original, extendObject);
}

export function isObject(value) {
    return value !== null && typeof value === "object";
}

export function isStructObject(value) {
    return Object.prototype.toString.call(value) === "[object Object]";
}

export function isFunction(value) {
    return Object.prototype.toString.call(value) === "[object Function]";
}

export function hasChanged(value, newValue) {
    return !Object.is(value, newValue);
}