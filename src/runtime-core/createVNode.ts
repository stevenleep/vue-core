import { ShapeFlags } from "../shared/ShapeFlags";
import { isArray, isString } from "../shared/type";

export function createVNode(type, props?, children?) {
    const vnode = {
        type,
        props,
        children,
        shapeFlag: getShapeFlag(type),
        el: null,
    };

    childrenShapeFlag(vnode);

    return vnode;
}

function getShapeFlag(type) {
    return isString(type)
        ? ShapeFlags.ELEMENT
        : ShapeFlags.STATEFUL_COMPONENT;
}

function childrenShapeFlag(vNode) {
    if (isString(vNode.children)) {
        vNode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
    }
    if (isArray(vNode.children)) {
        vNode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
    }
}