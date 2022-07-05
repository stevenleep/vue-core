import { shallowReadonly } from "../reactivity/reactive";
import { isStructObject } from "../shared/type";
import { emit, extendRuntimeInstance } from "./componentEmit";
import { initProps } from "./componentProps";
import { ComponentPublicInstanceHandlers } from "./componentPublicInstance";

// TODO: runtime instance extend
// NOTE: 这是自己扩展的
import * as instanceRuntimeExtendApis from "./instanceRuntimeExtends";

export function createComponentInstance(vnode) {
    // instance
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
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
    // initSlots();
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
        const setupResult = Component.setup(readonlyProps, {
            emit: instance.emit,

            // TODO: runtime instance extend
            // 这是自己扩展的API
            ...instanceRuntimeExtendApis
        });

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