import { isStructObject } from "../shared";

export function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
    }
    return component;
}


export function setupComponent(instance) {
    // initProps();
    // initSlots();
    setupStatefulComponent(instance);
}

// props
function initProps() {
    throw new Error("Function not implemented.");
}

function setupStatefulComponent(instance) {
    const Component = instance.type;
    if (Component.setup) {
        const setupResult = Component.setup();
        handleSetupResult(instance, setupResult);
    }
}

function handleSetupResult(instance, setupResult: any) {
    // TODO: function or object
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