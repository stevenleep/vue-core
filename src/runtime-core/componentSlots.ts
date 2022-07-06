import { isArray, isStructObject } from "../shared/type";

export function initSlots(instance, instanceChildren) {
    instance.slots = normalizeObjectSlots(instanceChildren);
};

export function normalizeObjectSlots(instanceChildren) {
    let slots = {};
    if (isStructObject(instanceChildren)) {
        for (const key in instanceChildren) {
            slots[key] = normalizeSlot(instanceChildren[key]);
        }
    };
    return slots;
}

export function normalizeSlot(value) {
    return isArray(value) ? value : [value];
}