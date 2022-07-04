export function isObject(value) {
    return value !== null && typeof value === "object";
}

export function isStructObject(value) {
    return Object.prototype.toString.call(value) === "[object Object]";
}

export function isFunction(value) {
    return Object.prototype.toString.call(value) === "[object Function]";
}

export function isArray(value) {
    return Object.prototype.toString.call(value) === "[object Array]";
}

export function isString(value) {
    return Object.prototype.toString.call(value) === "[object String]";
}

export function isNumber(value) {
    return Object.prototype.toString.call(value) === "[object Number]";
}

export function isBoolean(value) {
    return Object.prototype.toString.call(value) === "[object Boolean]";
}

export function isNull(value) {
    return Object.prototype.toString.call(value) === "[object Null]";
}