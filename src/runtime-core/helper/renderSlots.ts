import { createVNode } from "../createVNode";

export function renderSlots(slots) {
    return createVNode('span', null, slots);
}