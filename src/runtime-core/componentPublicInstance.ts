import { hasOwnProperty } from "../shared/index";

export const PublicPropertiesMaps = {
    "$el": (instance) => instance.vnode.el,
};
export const ComponentPublicInstanceHandlers = {
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
