export * from "./type";

export function extend(original, extendObject) {
    return Object.assign(original, extendObject);
}

export function hasChanged(value, newValue) {
    return !Object.is(value, newValue);
}

export function hasOwnProperty(originObject, property) {
    return Reflect.has(originObject, property);
}

export function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export function underlineIn2hump(string: string): string {
    return string.replace(/-(\w)/g, (all, letter) => letter.toUpperCase());
}