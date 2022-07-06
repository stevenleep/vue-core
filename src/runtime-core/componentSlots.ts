import { isArray, isStructObject } from "../shared/type";

export function initSlots(instance, instanceChildren) {
    let slots = {};
    if (isStructObject(instanceChildren)) {
        for (const key in instanceChildren) {
            const slot = instanceChildren[key];
            slots[key] = isArray(slot) ? slot : [slot];
        }
    };
    instance.slots = slots;
};