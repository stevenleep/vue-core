export function extend(original, extendObject) {
    return Object.assign(original, extendObject);
}

export function isObject(value) {
    return value !== null && typeof value === "object";
}


export function hasChanged(value, newValue) {
    return !Object.is(value, newValue);
}