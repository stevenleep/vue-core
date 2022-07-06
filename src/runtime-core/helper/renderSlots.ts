import { hasOwnProperty } from "../../shared/index";
import { createVNode } from "../createVNode";

export function renderSlots(slots, renderName) {
    if (hasOwnProperty(slots, renderName)) {
        return createVNode('span', null, slots[renderName]);
    }
}