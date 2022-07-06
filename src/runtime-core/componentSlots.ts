import { ShapeFlags } from "../shared/ShapeFlags";
import { isArray, isFunction, isStructObject } from "../shared/type";

export function initSlots(instance, instanceChildren) {
    if (instance.vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
        instance.slots = normalizeObjectSlots(instanceChildren);
    }
};

export function normalizeObjectSlots(instanceChildren) {
    let slots = {};
    if (isStructObject(instanceChildren)) {
        for (const key in instanceChildren) {
            // NOTE: 这是自己增加到扩展，我需要支持slot无参数的情况
            if (isStructObject(instanceChildren[key])) {
                slots[key] = (props) => normalizeSlot(instanceChildren[key]);
            }

            if (isFunction(instanceChildren[key])) {
                slots[key] = (props) => normalizeSlot(instanceChildren[key](props));
            }
        }
    };
    return slots;
}

export function normalizeSlot(value) {
    return isArray(value) ? value : [value];
}