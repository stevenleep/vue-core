'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function isObject(value) {
    return value !== null && typeof value === "object";
}
function isStructObject(value) {
    return Object.prototype.toString.call(value) === "[object Object]";
}
function isFunction(value) {
    return Object.prototype.toString.call(value) === "[object Function]";
}
function isArray(value) {
    return Object.prototype.toString.call(value) === "[object Array]";
}
function isString(value) {
    return Object.prototype.toString.call(value) === "[object String]";
}

const SymbolFor = Symbol.for;
const Fragment = SymbolFor('Fragment');
const Text = SymbolFor('Text');

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
    // slots children
    if (vNode.shapeFlag & 2 /* ShapeFlags.STATEFUL_COMPONENT */ && isStructObject(vNode.children)) {
        vNode.shapeFlag |= 16 /* ShapeFlags.SLOT_CHILDREN */;
    }
}
function createTextVNode(text) {
    return createVNode(Text, {}, text);
}

function extend(original, extendObject) {
    return Object.assign(original, extendObject);
}
function hasChanged(value, newValue) {
    return !Object.is(value, newValue);
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

let activeEffect = null;
let shouldTrack;
class ReactiveEffect {
    constructor(_fn, scheduler) {
        this._fn = _fn;
        this.scheduler = scheduler;
        this.deps = [];
        this.active = true;
    }
    run() {
        // 标识是否需要收集依赖
        if (!this.active) {
            return this._fn();
        }
        shouldTrack = true;
        activeEffect = this;
        const result = this._fn();
        shouldTrack = false;
        return result;
    }
    stop() {
        if (this.active) {
            cleanupEffect(this);
            if (this.onStop) {
                this.onStop();
            }
            this.active = false;
        }
    }
}
function cleanupEffect(effect) {
    effect.deps.forEach((dep) => {
        dep.delete(effect);
    });
    effect.deps.length = 0;
}
const targetMap = new Map;
function track(target, property) {
    if (!isTracking()) {
        return;
    }
    // 通过target找到property, 在通过property找到对应的deps
    // target -> property -> deps -> call dep fn;
    if (!targetMap.has(target)) {
        targetMap.set(target, new Map);
    }
    const propertyDepsMap = targetMap.get(target);
    if (!propertyDepsMap.has(property)) {
        propertyDepsMap.set(property, new Set);
    }
    trackEffects(propertyDepsMap.get(property));
}
function trackEffects(propertyDeps) {
    if (propertyDeps.has(activeEffect)) {
        return;
    }
    propertyDeps.add(activeEffect);
    // 反向收集, 用于在activeEffect中使用deps
    activeEffect === null || activeEffect === void 0 ? void 0 : activeEffect.deps.push(propertyDeps);
}
function isTracking() {
    // activeEffect 只有在effect中的时候才会存在,当只是单纯的响应式对象取值的时候并不存在
    return shouldTrack && activeEffect !== null;
}
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
function effect(fn, effectOptions) {
    const _effect = new ReactiveEffect(fn, effectOptions === null || effectOptions === void 0 ? void 0 : effectOptions.scheduler);
    extend(_effect, effectOptions);
    _effect.run();
    const runner = _effect.run.bind(_effect);
    // Note: 挂在runner上的effect方法是为了让effect能够被stop
    runner.effect = _effect;
    return runner;
}
function stop(runner) {
    // 调用ReactiveEffect的stop方法
    runner.effect.stop();
}

class ComputedImpl {
    constructor(getter) {
        this._dirty = true;
        this._getter = getter;
        this._effect = new ReactiveEffect(this._getter, () => {
            this._dirty = true;
        });
    }
    get value() {
        if (this._dirty) {
            this._dirty = false;
            this._value = this._effect.run();
        }
        return this._value;
    }
}
function computed(getter) {
    return new ComputedImpl(getter);
}

const mutableGet = createGetter();
const readonlyGet = createGetter(true);
const mutableSet = createSetter();
const shallowReadonlyGet = createGetter(true, true);
const shallowReactiveGet = createGetter(false, true);
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
const shallowReactiveHandlers = {
    get: shallowReactiveGet,
    set: mutableSet,
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
        // normal logical get
        if (!isReadonly) {
            track(target, property);
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
function shallowReactive(value) {
    return createReactiveObject(value, shallowReactiveHandlers);
}
function isReactive(value) {
    return !!value["_v_isReactive" /* ReactiveFlags.IS_REACTIVE */];
}
function isReadonly(value) {
    return !!value["_v_isReadonly" /* ReactiveFlags.IS_READONLY */];
}
function isProxy(value) {
    return isReadonly(value) || isReactive(value);
}
function isShallowReadonly(value) {
    return !!value["_v_isShallowReadonly" /* ReactiveFlags.IS_SHALLOW_READONLY */];
}
function isShallowReactive(value) {
    return !!value["_v_isShallowReactive" /* ReactiveFlags.IS_SHALLOW_REACTIVE */];
}

class RefImpl {
    constructor(initValue, options = {}) {
        this._v_isRef = true;
        // 扩展参数: shallow, readonly, rewrite
        this._options = {};
        this.deps = new Set();
        this._options = options;
        this._rawValue = initValue;
        this._value = safeRef(initValue, options);
    }
    get value() {
        trackRef(this);
        return this._value;
    }
    set value(newValue) {
        // TODO: 扩展使得ref支持自定义扩展set返回或readonly
        // 相同的值不需要重新触发更新
        if (hasChanged(this._rawValue, newValue)) {
            this._value = safeRef(newValue, this._options);
            this._rawValue = newValue;
            triggerEffects(this.deps);
        }
    }
}
// TODO: 扩展使得Ref支持shallow and readonly
function safeRef(value, options = {}) {
    return isObject(value) ? reactive(value) : value;
}
function trackRef(ref) {
    if (isTracking()) {
        trackEffects(ref.deps);
    }
}
function ref(value) {
    return new RefImpl(value);
}
function isRef(ref) {
    return !!ref._v_isRef;
}
// XXX: 思考? unRef后是否会丢失reactive功能
function unRef(ref) {
    return isRef(ref) ? ref.value : ref;
}
function proxyRefs(objectWithRef) {
    return new Proxy(objectWithRef, {
        get(target, property, receiver) {
            return unRef(Reflect.get(target, property));
        },
        set(target, property, value) {
            const oldValueReference = Reflect.get(target, property);
            if (isRef(oldValueReference) && !isRef(value)) {
                return Reflect.set(oldValueReference, "value", value);
            }
            else {
                return Reflect.set(target, property, value);
            }
        },
    });
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
    if (instance.vnode.shapeFlag & 16 /* ShapeFlags.SLOT_CHILDREN */) {
        instance.slots = normalizeObjectSlots(instanceChildren);
    }
}
function normalizeObjectSlots(instanceChildren) {
    let slots = {};
    if (isStructObject(instanceChildren)) {
        for (const key in instanceChildren) {
            // NOTE: 这是自己增加到扩展，我需要支持slot无参数的情况
            if (isStructObject(instanceChildren[key])) {
                slots[key] = (props) => normalizeSlot(instanceChildren[key]);
            }
            if (isFunction(instanceChildren[key])) {
                slots[key] = (props) => normalizeSlot(instanceChildren[key](props));
            }
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

let currentInstance = null;
function createComponentInstance(vnode, parent) {
    // instance
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        parent,
        isMounted: false,
        provides: parent ? parent.provides : {},
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
        // NOTE: getCurrentInstance() API 只能在 setup() 中调用
        // 并且针对于每个组件都会拥有自己的组件实例
        setCurrentInstance(instance);
        // props is readonly because it's a Reflect instance
        const readonlyProps = shallowReadonly(instance.props);
        // TODO: context
        const setupResult = Component.setup(readonlyProps, Object.assign({ emit: instance.emit }, instanceRuntimeExtendApis));
        clearCurrentInstance();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    if (isStructObject(setupResult)) {
        instance.setupState = proxyRefs(setupResult);
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const Component = instance.type;
    // if (Component.render) {
    instance.render = Component.render;
    // }
}
function getCurrentInstance() {
    return currentInstance;
}
function setCurrentInstance(instance) {
    currentInstance = instance;
}
function clearCurrentInstance() {
    currentInstance = null;
}

function createAppAPI(render) {
    return function createApp(rootComponent) {
        return {
            mount(rootContainer) {
                // 转vNode, 基于vNode工作
                const vnode = createVNode(rootComponent);
                render(vnode, rootContainer, undefined);
            }
        };
    };
}

const DEFAULT_EMPTY_OBJ = {};
function createRenderer(customRenderOptions) {
    const { createElement: hostCreateElement, patchProp: hostPatchProp, insert: hostInsert, remove: hostRemove, setElementText: hostSetElementText } = customRenderOptions;
    function render(vnode, container, parentComponent) {
        patch(null, vnode, container, parentComponent);
    }
    // n1 --> oldSubtree
    // n2 --> newSubtree
    function patch(n1, n2, container, parentComponent) {
        switch (n2 === null || n2 === void 0 ? void 0 : n2.type) {
            case Fragment:
                processFragment(n1, n2, container, parentComponent);
                break;
            case Text:
                processText(n1, n2, container);
                break;
            default:
                if (n2.shapeFlag & 1 /* ShapeFlags.ELEMENT */) {
                    processElement(n1, n2, container, parentComponent);
                }
                if (n2.shapeFlag & 2 /* ShapeFlags.STATEFUL_COMPONENT */) {
                    processComponent(n1, n2, container, parentComponent);
                }
                break;
        }
    }
    function processElement(n1, n2, container, parentComponent) {
        if (!n1) { // n1 不存在->初始化
            mountElement(n2, container, parentComponent);
        }
        else {
            patchElement(n1, n2, container);
        }
    }
    // TODO: 实现Element的更新
    function patchElement(n1, n2, container) {
        const oldProps = n1.props || DEFAULT_EMPTY_OBJ;
        const newProps = n2.props || DEFAULT_EMPTY_OBJ;
        const el = (n2.el = n1.el);
        patchChildren(n1, n2, container);
        patchProps(el, oldProps, newProps);
    }
    // TODO（lishiwen）: 更新Children更好的做法
    function patchChildren(n1, n2, container) {
        const oldShapeFlag = n1.shapeFlag;
        const newShapeFlag = n2.shapeFlag;
        // 由ArrayChildren -> TextChildren
        // 由TextChildren -> ArrayChildren
        // 由ArrayChildren -> ArrayChildren
        // 由TextChildren -> TextChildren
        if (newShapeFlag & 4 /* ShapeFlags.TEXT_CHILDREN */) {
            if (oldShapeFlag & 8 /* ShapeFlags.ARRAY_CHILDREN */) {
                unmountChildren(n1.children);
                hostSetElementText(container, n2.children);
            }
            else if ((oldShapeFlag & 4 /* ShapeFlags.TEXT_CHILDREN */) && n1.children !== n2.children) {
                // 由TextChildren -> TextChildren, 在两次结果不相同时候更新
                hostSetElementText(container, n2.children);
            }
        }
    }
    function unmountChildren(children) {
        for (let index = 0; index < children.length; index++) {
            const child = children[index];
            hostRemove(child.el, child);
        }
    }
    function patchProps(el, oldProps, newProps) {
        if (oldProps !== newProps) {
            // 以前存在，现在也存在，但是值变化了
            for (const key in newProps) {
                const prevProp = oldProps[key];
                const nextProp = newProps[key];
                if (prevProp !== nextProp) {
                    hostPatchProp(el, key, prevProp, nextProp);
                }
            }
            // 原来存在，现在不存在
            if (oldProps !== DEFAULT_EMPTY_OBJ) {
                for (const key in oldProps) {
                    if (!(key in newProps)) {
                        hostPatchProp(el, key, oldProps[key], null);
                    }
                }
            }
        }
    }
    function processComponent(n1, n2, container, parentComponent) {
        mountComponent(n2, container, parentComponent);
    }
    function processFragment(n1, n2, container, parentComponent) {
        mountChildren(n2 === null || n2 === void 0 ? void 0 : n2.children, container, parentComponent);
    }
    function mountComponent(initialVNode, container, parentComponent) {
        const instance = createComponentInstance(initialVNode, parentComponent);
        setupComponent(instance);
        setupRenderEffect(instance, container, initialVNode);
    }
    function mountElement(vnode, container, parentComponent) {
        const el = (vnode.el = hostCreateElement(vnode.type));
        if (vnode.shapeFlag & 4 /* ShapeFlags.TEXT_CHILDREN */) {
            el.textContent = vnode.children;
        }
        else if (vnode.shapeFlag & 8 /* ShapeFlags.ARRAY_CHILDREN */) {
            mountChildren(vnode.children, el, parentComponent);
        }
        addAttrs(vnode, el);
        hostInsert(el, container);
    }
    function mountChildren(children = [], container, parentComponent) {
        children.forEach(child => {
            patch(null, child, container, parentComponent);
        });
    }
    function addAttrs(vnode, container) {
        const props = vnode.props || {};
        for (const key in props) {
            if (Object.prototype.hasOwnProperty.call(props, key)) {
                const value = props[key];
                hostPatchProp(container, key, null, value);
            }
        }
    }
    function processText(n1, n2, container) {
        const el = (n2.el = document.createTextNode(n2.children));
        container.append(el);
    }
    function setupRenderEffect(instance, container, initialVNode) {
        effect(() => {
            // initial
            if (!instance.isMounted) {
                // 当处于更新逻辑时， instance.subTree则为旧的数据（旧的VNode）
                const subTree = (instance.subTree = instance === null || instance === void 0 ? void 0 : instance.render.call(instance.proxy));
                patch(null, subTree, container, instance);
                initialVNode.el = subTree.el;
                instance.isMounted = true;
            }
            else {
                // update
                // 在更新时候可以认为是新的VNod, 和初始化时候的VNode进行对比
                const subTree = instance === null || instance === void 0 ? void 0 : instance.render.call(instance.proxy);
                const prevSubTree = instance.subTree;
                // 设置为下一次对比的VNode
                instance.subTree = subTree;
                patch(prevSubTree, subTree, container, instance);
            }
        });
    }
    return {
        createApp: createAppAPI(render),
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

function renderSlots(slots, renderName, props = {}) {
    var _a;
    if (hasOwnProperty(slots, renderName)) {
        if (isFunction(slots[renderName])) {
            const realSlot = (_a = slots[renderName]) === null || _a === void 0 ? void 0 : _a.call(slots, props);
            return createVNode(Fragment, null, realSlot);
        }
        // NOTE: 这是自己增加到扩展，我需要支持slot无参数的情况
        if (isStructObject(slots[renderName])) {
            return createVNode(Fragment, null, slots[renderName]);
        }
    }
}

/**
 * Notes:
 * 1. instance只能在setup中调用, 故使得provide工/inject作的作用域仅为setup
 */
function provide(key, value) {
    const currentInstance = getCurrentInstance();
    if (currentInstance) {
        let { provides } = currentInstance;
        const parentProvides = currentInstance.parent.provides;
        // init
        if (provides === parentProvides) {
            provides = currentInstance.provides = Object.create(parentProvides);
        }
        provides[key] = value;
    }
}
function inject(key, defaultValue) {
    const currentInstance = getCurrentInstance();
    if (currentInstance) {
        const parentProvides = currentInstance.parent.provides;
        if (key in parentProvides) {
            return parentProvides[key];
        }
        else if (defaultValue) {
            return defaultValue;
        }
    }
}
// 扩展的
function useInject(keys = [], defaultValues = {}) {
    const currentInstance = getCurrentInstance();
    if (currentInstance) {
        const parentProvides = currentInstance.parent.provides;
        return composeInjectValues(parentProvides, keys, defaultValues);
    }
    return {};
}
function composeInjectValues(provides = {}, keys = [], defaultValues = {}) {
    return keys.reduce((result, currentKey) => {
        if (currentKey in provides) {
            result[currentKey] = provides[currentKey];
        }
        else if (defaultValues[currentKey]) {
            result[currentKey] = defaultValues[currentKey];
        }
        return result;
    }, {});
}

function isOnEvent(propertyName) {
    return /^on[A-Z]/.test(propertyName);
}
isOnEvent.getEventName = function onEventName(propertyName) {
    return propertyName.slice(2).toLowerCase();
};
function createElement(type) {
    return document.createElement(type);
}
function patchProp(el, key, prevValue, value) {
    if (isOnEvent(key)) {
        el.addEventListener(isOnEvent.getEventName(key), value, false);
    }
    else if (value === undefined || value === null) {
        el.removeAttribute(key);
    }
    else {
        el.setAttribute(key, value);
    }
}
function insert(el, parentContainer) {
    parentContainer.append(el);
}
function remove(child) {
    const parentNode = child.parentNode;
    if (parentNode) {
        parentNode.removeChild(child);
    }
}
function setElementText(el, text) {
    if (!el) {
        return;
    }
    if (text === undefined || text === null) {
        el.innerText = "";
    }
    el.textContent = text;
}
const renderer = createRenderer({
    createElement,
    patchProp,
    insert,
    remove,
    setElementText,
});
function createApp(...args) {
    return renderer.createApp(...args);
}

exports.ReactiveEffect = ReactiveEffect;
exports.clearCurrentInstance = clearCurrentInstance;
exports.computed = computed;
exports.createApp = createApp;
exports.createComponentInstance = createComponentInstance;
exports.createRenderer = createRenderer;
exports.createTextVNode = createTextVNode;
exports.createVNode = createVNode;
exports.effect = effect;
exports.getCurrentInstance = getCurrentInstance;
exports.h = h;
exports.inject = inject;
exports.isProxy = isProxy;
exports.isReactive = isReactive;
exports.isReadonly = isReadonly;
exports.isRef = isRef;
exports.isShallowReactive = isShallowReactive;
exports.isShallowReadonly = isShallowReadonly;
exports.isTracking = isTracking;
exports.mutableHandlers = mutableHandlers;
exports.provide = provide;
exports.proxyRefs = proxyRefs;
exports.reactive = reactive;
exports.readonly = readonly;
exports.readonlyHandlers = readonlyHandlers;
exports.ref = ref;
exports.renderSlots = renderSlots;
exports.setCurrentInstance = setCurrentInstance;
exports.setupComponent = setupComponent;
exports.shallowReactive = shallowReactive;
exports.shallowReactiveHandlers = shallowReactiveHandlers;
exports.shallowReadonly = shallowReadonly;
exports.shallowReadonlyHandlers = shallowReadonlyHandlers;
exports.stop = stop;
exports.track = track;
exports.trackEffects = trackEffects;
exports.trigger = trigger;
exports.triggerEffects = triggerEffects;
exports.unRef = unRef;
exports.useInject = useInject;
