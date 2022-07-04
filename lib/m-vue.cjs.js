'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
    };
    return vnode;
}

function isStructObject(value) {
    return Object.prototype.toString.call(value) === "[object Object]";
}
function isArray(value) {
    return Object.prototype.toString.call(value) === "[object Array]";
}
function isString(value) {
    return Object.prototype.toString.call(value) === "[object String]";
}

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
    };
    return component;
}
function setupComponent(instance) {
    // initProps();
    // initSlots();
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const Component = instance.type;
    if (Component.setup) {
        const setupResult = Component.setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // TODO: function or object
    if (isStructObject(setupResult)) {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const Component = instance.type;
    // if (Component.render) {
    instance.render = Component.render;
    // }
}

function render(vnode, container) {
    patch(vnode, container);
}
function patch(vnode, container) {
    // TODO(branlice): 判断是element 还是component
    if (typeof vnode.type === "string") {
        processElement(vnode, container);
    }
    if (isStructObject(vnode.type)) {
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, container);
}
function mountElement(vnode, container) {
    // vnode type -> div/span
    const el = document.createElement(vnode.type);
    // children
    if (isString(vnode.children)) {
        el.textContent = vnode.children;
    }
    else if (isArray(vnode.children)) {
        mountChildren(vnode.children, el);
    }
    // props
    addAttrs(vnode, el);
    // append to container
    container.appendChild(el);
}
function mountChildren(children = [], container) {
    children.forEach(child => { patch(child, container); });
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
function setupRenderEffect(instance, container) {
    const subTree = instance.render();
    patch(subTree, container);
}

function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            // 转vNode, 基于vNode工作
            const vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        }
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

exports.createApp = createApp;
exports.createComponentInstance = createComponentInstance;
exports.createVNode = createVNode;
exports.h = h;
exports.patch = patch;
exports.render = render;
exports.setupComponent = setupComponent;
