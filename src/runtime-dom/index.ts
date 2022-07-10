export * from "../runtime-core"
import { createRenderer } from "../runtime-core";
function isOnEvent(propertyName) {
    return /^on[A-Z]/.test(propertyName)
}
isOnEvent.getEventName = function onEventName(propertyName) {
    return propertyName.slice(2).toLowerCase()
}

function createElement(type) {
    return document.createElement(type);
}
function patchProp(el, key, prevValue, value) {
    if (isOnEvent(key)) {
        el.addEventListener(isOnEvent.getEventName(key), value, false);
    } else if (value === undefined || value === null) {
        el.removeAttribute(key);
    } else {
        el.setAttribute(key, value);
    }
}

function insert(el, parentContainer) {
    parentContainer.append(el);
}

const renderer: any = createRenderer({
    createElement,
    patchProp,
    insert
})

export function createApp(...args) {
    return renderer.createApp(...args)
}