import { isStructObject } from "../shared/type";

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

    const context = {};
    instance.proxy = new Proxy(context, {
        get(target, key) {
            if (key in instance.setupState) {
                return instance.setupState[key];
            }
        }
    });

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