import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
    patch(vnode, container);
}

export function patch(vnode, container) {
    // TODO: 判断是element
    processComponent(vnode, container);
}

function processComponent(vnode, container) {
    mountComponent(vnode, container);
}

function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, container);
}

// TODO: render subTree
function setupRenderEffect(instance, container) {
    const subTree = instance.render();
    // vnode -> patch
    patch(subTree, container)
}