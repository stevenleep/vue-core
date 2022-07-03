import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
    patch(vnode, container);
}

export function patch(vnode, container) {
    // TODO(branlice): 判断是element 还是component
    // processElement(vnode, container);

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
function setupRenderEffect(instance, container) {
    const subTree = instance.render();
    // vnode -> patch
    patch(subTree, container)
}

// function processElement(vnode: any, container: any) {
    
// }