import { isArray, isString, isStructObject } from "../shared/index";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
    patch(vnode, container);
}

export function patch(vnode, container) {
    // TODO(branlice): 判断是element 还是component
    if (typeof vnode.type === "string") {
        processElement(vnode, container);
    }
    if (isStructObject(vnode.type)) {
        processComponent(vnode, container);
    }
}

function processElement(vnode: any, container: any) {
    mountElement(vnode, container);
}

function processComponent(vnode, container) {
    mountComponent(vnode, container);
}

function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, container, vnode);
}

function mountElement(vnode: any, container: any) {
    // vnode type -> div/span
    // vnode.el -> element.el
    const el = (vnode.el = document.createElement(vnode.type));

    // children
    if (isString(vnode.children)) {
        el.textContent = vnode.children;
    } else if (isArray(vnode.children)) {
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

function setupRenderEffect(instance, container, vnode) {
    const subTree = instance.render.call(instance.proxy);
    patch(subTree, container);

    vnode.el = subTree.el;
}