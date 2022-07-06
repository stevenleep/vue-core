import { isArray } from "../shared/type";

export function initSlots(instance, instanceChildren) {
    instance.slots = isArray(instanceChildren) ? instanceChildren : [instanceChildren];
};