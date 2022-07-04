function isStructObject(value) {
    return Object.prototype.toString.call(value) === "[object Object]";
}
function isArray(value) {
    return Object.prototype.toString.call(value) === "[object Array]";
}
function isString(value) {
    return Object.prototype.toString.call(value) === "[object String]";
}

function createVNode(type, props, children) {
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
        ? 1 /* ShapeFlags.ELEMENT */
        : 2 /* ShapeFlags.STATEFUL_COMPONENT */;
}
function childrenShapeFlag(vNode) {
    if (isString(vNode.children)) {
        vNode.shapeFlag |= 4 /* ShapeFlags.TEXT_CHILDREN */;
    }
    if (isArray(vNode.children)) {
        vNode.shapeFlag |= 8 /* ShapeFlags.ARRAY_CHILDREN */;
    }
}

const PublicPropertiesMaps = {
    "$el": (instance) => instance.vnode.el,
};
const ComponentPublicInstanceHandlers = {
    get({ _instance }, key) {
        if (key in _instance.setupState) {
            return _instance.setupState[key];
        }
        if (key in PublicPropertiesMaps) {
            return PublicPropertiesMaps[key](_instance);
        }
    }
};

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {}
    };
    return component;
}
function setupComponent(instance) {
    initProps(instance);
    // initSlots();
    setupStatefulComponent(instance);
}
// props
function initProps(instance) {
    console.log(instance);
}
function setupStatefulComponent(instance) {
    const Component = instance.type;
    const context = { _instance: instance, _component: Component };
    instance.proxy = new Proxy(context, ComponentPublicInstanceHandlers);
    if (Component.setup) {
        const setupResult = Component.setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
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
    if (vnode.shapeFlag & 1 /* ShapeFlags.ELEMENT */) {
        processElement(vnode, container);
    }
    if (vnode.shapeFlag & 2 /* ShapeFlags.STATEFUL_COMPONENT */) {
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
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
function mountElement(vnode, container) {
    // vnode type -> div/span
    // vnode.el -> element.el
    const el = (vnode.el = document.createElement(vnode.type));
    // children
    if (vnode.shapeFlag & 4 /* ShapeFlags.TEXT_CHILDREN */) {
        el.textContent = vnode.children;
    }
    else if (vnode.shapeFlag & 8 /* ShapeFlags.ARRAY_CHILDREN */) {
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
function isOnEvent(propertyName) {
    return /^on[A-Z]/.test(propertyName);
}
isOnEvent.getEventName = function onEventName(propertyName) {
    return propertyName.slice(2).toLowerCase();
};
function addAttrs(vnode, container) {
    const props = vnode.props || {};
    for (const key in props) {
        if (Object.prototype.hasOwnProperty.call(props, key)) {
            const value = props[key];
            if (isOnEvent(key)) {
                container.addEventListener(isOnEvent.getEventName(key), value, false);
            }
            else {
                container.setAttribute(key, value);
            }
        }
    }
}
function setupRenderEffect(instance, container, initialVNode) {
    const subTree = instance.render.call(instance.proxy);
    patch(subTree, container);
    initialVNode.el = subTree.el;
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

export { createApp, createComponentInstance, createVNode, h, patch, render, setupComponent };
