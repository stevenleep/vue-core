import { shallowReadonly } from "../reactivity/reactive";
import { isStructObject } from "../shared/type";
import { emit, extendRuntimeInstance } from "./componentEmit";
import { initProps } from "./componentProps";
import { ComponentPublicInstanceHandlers } from "./componentPublicInstance";
import { initSlots } from "./componentSlots";

let currentInstance = null;

// TODO: runtime instance extend
// NOTE: 这是自己扩展的
import * as instanceRuntimeExtendApis from "./instanceRuntimeExtends";

export function createComponentInstance(vnode, parent) {
    // instance
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        parent,
        provides: {},
        emit: (instance, event) => { },
    };

    // 官方Emit
    component.emit = emit.bind(null, component);

    // TODO: runtime instance extend
    // NOTE: 这是自己扩展的
    extendRuntimeInstance(component, instanceRuntimeExtendApis);

    return component;
}

export function setupComponent(instance) {
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
        const setupResult = Component.setup(readonlyProps, {
            emit: instance.emit,

            // TODO: runtime instance extend
            // 这是自己扩展的API
            ...instanceRuntimeExtendApis
        });
        clearCurrentInstance();
        handleSetupResult(instance, setupResult);
    }
}

function handleSetupResult(instance, setupResult: any) {
    if (isStructObject(setupResult)) {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}

function finishComponentSetup(instance) {
    const Component = instance.type;
    // if (Component.render) {
    instance.render = Component.render
    // }
}


export function getCurrentInstance() {
    return currentInstance;
}

export function setCurrentInstance(instance) {
    currentInstance = instance;
}

export function clearCurrentInstance() {
    currentInstance = null
}