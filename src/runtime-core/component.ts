import { isStructObject } from "../shared/type";
import { ComponentPublicInstanceHandlers } from "./componentPublicInstance";


export function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {}
    }
    return component;
}

export function setupComponent(instance) {
    initProps(instance);
    // initSlots();
    setupStatefulComponent(instance);
}

// props
function initProps(instance) {
    console.log(instance)
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