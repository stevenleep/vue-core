'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function isObject(value) {
    return value !== null && typeof value === "object";
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

function hasOwnProperty(originObject, property) {
    return Reflect.has(originObject, property);
}
function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}
function underlineIn2hump(string) {
    return string.replace(/-(\w)/g, (all, letter) => letter.toUpperCase());
}

const targetMap = new Map;
// 触发依赖
function trigger(target, property) {
    const deps = targetMap.get(target).get(property);
    if (deps) {
        triggerEffects(deps);
    }
}
function triggerEffects(deps) {
    for (const effect of deps) {
        if (effect.scheduler) {
            effect.scheduler();
        }
        else {
            effect.run();
        }
    }
}

const mutableGet = createGetter();
const readonlyGet = createGetter(true);
const mutableSet = createSetter();
const shallowReadonlyGet = createGetter(true, true);
const mutableHandlers = {
    get: mutableGet,
    set: mutableSet
};
const readonlyHandlers = {
    get: readonlyGet,
    set(target, property, value) {
        console.warn(`Cannot set readonly property "${property}"!`);
        return true;
    }
};
const shallowReadonlyHandlers = {
    get: shallowReadonlyGet,
    set(target, property, value) {
        console.warn(`Cannot set readonly property "${property}"!`);
        return true;
    }
};
function createGetter(isReadonly = false, isShallow = false) {
    return function get(target, property) {
        // TODO: 优化这里的if逻辑
        // isReactive
        if (property === "_v_isReactive" /* ReactiveFlags.IS_REACTIVE */) {
            return !isReadonly;
        }
        // isReadonly
        if (property === "_v_isReadonly" /* ReactiveFlags.IS_READONLY */) {
            return isReadonly;
        }
        // isShallowReadonly
        if (property === "_v_isShallowReadonly" /* ReactiveFlags.IS_SHALLOW_READONLY */) {
            return isShallow && isReadonly;
        }
        // isShallowReactive
        if (property === "_v_isShallowReactive" /* ReactiveFlags.IS_SHALLOW_REACTIVE */) {
            return !isReadonly && isShallow;
        }
        // 只要出现shallow证明是浅层的处理，可以同时处理shallowReactive 和 shallowReadonly
        const value = Reflect.get(target, property);
        if (isShallow) {
            return value;
        }
        if (isObject(value)) {
            return isReadonly
                ? readonly(value)
                : reactive(value);
        }
        return value;
    };
}
function createSetter() {
    return function set(target, property, value) {
        const nextValue = Reflect.set(target, property, value);
        trigger(target, property);
        return nextValue;
    };
}

function createReactiveObject(raw, baseHandlers) {
    if (!isStructObject(raw)) {
        console.warn("the value to be proxies is not an object: " + raw);
        return;
    }
    return new Proxy(raw, baseHandlers);
}
function reactive(raw) {
    return createReactiveObject(raw, mutableHandlers);
}
function readonly(raw) {
    return createReactiveObject(raw, readonlyHandlers);
}
function shallowReadonly(value) {
    return createReactiveObject(value, shallowReadonlyHandlers);
}

function toHandlerKeys(prefix = "on", eventProperty) {
    return prefix + eventProperty;
}
function emit(instance, eventProperty, ...args) {
    const handlerKey = toHandlerKeys("on", capitalize(underlineIn2hump(eventProperty)));
    if (hasOwnProperty(instance.props, handlerKey) && typeof instance.props[handlerKey] === "function") {
        // call the event handler
        instance.props[handlerKey](...args);
    }
}
// TODO: 运行时扩展实例
function extendRuntimeInstance(instance, extendApis = {}) {
    // XXX: 临时解决方案
    // TODO: 待完善扩展实例
    Object.keys(extendApis).forEach(key => {
        instance[key] = extendApis[key];
    });
}

function initProps(instance, rawProps = {}) {
    instance.props = rawProps;
}

const PublicPropertiesMaps = {
    $el: (instance) => instance.vnode.el,
    $slots: (instance) => instance.slots,
};
const ComponentPublicInstanceHandlers = {
    get({ _instance }, key) {
        // XXX: 是否会因为优先级导致props不可用
        if (hasOwnProperty(_instance.setupState, key)) {
            return _instance.setupState[key];
        }
        if (hasOwnProperty(_instance.props, key)) {
            return _instance.props[key];
        }
        if (key in PublicPropertiesMaps) {
            return PublicPropertiesMaps[key](_instance);
        }
    }
};

function initSlots(instance, instanceChildren) {
    instance.slots = normalizeObjectSlots(instanceChildren);
}
function normalizeObjectSlots(instanceChildren) {
    let slots = {};
    if (isStructObject(instanceChildren)) {
        for (const key in instanceChildren) {
            slots[key] = normalizeSlot(instanceChildren[key]);
        }
    }
    return slots;
}
function normalizeSlot(value) {
    return isArray(value) ? value : [value];
}

function promiseEmit() { }

var instanceRuntimeExtendApis = /*#__PURE__*/Object.freeze({
    __proto__: null,
    promiseEmit: promiseEmit
});

function createComponentInstance(vnode) {
    // instance
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        emit: (instance, event) => { },
    };
    // 官方Emit
    component.emit = emit.bind(null, component);
    // TODO: runtime instance extend
    // NOTE: 这是自己扩展的
    extendRuntimeInstance(component, instanceRuntimeExtendApis);
    return component;
}
function setupComponent(instance) {
    initProps(instance, instance.vnode.props);
    initSlots(instance, instance.vnode.children);
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const Component = instance.type;
    const context = { _instance: instance, _component: Component };
    instance.proxy = new Proxy(context, ComponentPublicInstanceHandlers);
    if (Component.setup) {
        // props is readonly because it's a Reflect instance
        const readonlyProps = shallowReadonly(instance.props);
        // TODO: context
        const setupResult = Component.setup(readonlyProps, Object.assign({ emit: instance.emit }, instanceRuntimeExtendApis));
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
    const subTree = instance === null || instance === void 0 ? void 0 : instance.render.call(instance.proxy);
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

function renderSlots(slots, renderName) {
    if (hasOwnProperty(slots, renderName)) {
        return createVNode('span', null, slots[renderName]);
    }
}

exports.createApp = createApp;
exports.createComponentInstance = createComponentInstance;
exports.createVNode = createVNode;
exports.h = h;
exports.patch = patch;
exports.render = render;
exports.renderSlots = renderSlots;
exports.setupComponent = setupComponent;
