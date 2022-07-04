import { isArray, isString, isStructObject } from "../shared/index";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
    patch(vnode, container);
}

export function patch(vnode, container) {
    if (vnode.shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, container);
    }
    if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container);
    }
}

function processElement(vnode: any, container: any) {
    mountElement(vnode, container);
}

function processComponent(vnode, container) {
    mountComponent(vnode, container);
}

function mountComponent(initialVNode, container) {
    const instance = createComponentInstance(initialVNode);
    setupComponent(instance);
    setupRenderEffect(instance, container, initialVNode);
}

function mountElement(vnode: any, container: any) {
    // vnode type -> div/span
    // vnode.el -> element.el
    const el = (vnode.el = document.createElement(vnode.type));
    // children
    if (vnode.shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        el.textContent = vnode.children;
    } else if (vnode.shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        mountChildren(vnode.children, el);
    }
    // props
    addAttrs(vnode, el);

    // append to container
    container.appendChild(el);
}

function mountChildren(children = [], container) {
    children.forEach(child => { patch(child, container) })
}

function addAttrs(vnode, container) {
    const props = vnode.props || {};
    for (const key in props) {
        if (Object.prototype.hasOwnProperty.call(props, key)) {
            const value = props[key];
            container.setAttribute(key, value);
        }
    }
}

function setupRenderEffect(instance, container, initialVNode) {
    const subTree = instance.render.call(instance.proxy);
    patch(subTree, container);

    initialVNode.el = subTree.el;
}