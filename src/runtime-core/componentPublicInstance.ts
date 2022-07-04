export const PublicPropertiesMaps = {
    "$el": (instance) => instance.vnode.el,
};

export const ComponentPublicInstanceHandlers = {
    get({ _instance }, key) {
        if (key in _instance.setupState) {
            return _instance.setupState[key];
        };

        if (key in PublicPropertiesMaps) {
            return PublicPropertiesMaps[key](_instance);
        }
    }
};
