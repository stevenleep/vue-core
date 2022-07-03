import { hasChanged, isObject } from "../shared";
import { isTracking, ReactiveEffect, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
    private _value;
    public deps;
    private _rawValue;

    constructor(initValue) {
        this.deps = new Set<ReactiveEffect>();
        this._rawValue = initValue;
        this._value = safeRef(initValue);
    }

    get value() {
        trackRef(this);
        return this._value;
    }

    set value(newValue) {
        // 相同的值不需要重新触发更新
        if (hasChanged(this._rawValue, newValue)) {
            this._value = safeRef(newValue);
            this._rawValue = newValue;
            triggerEffects(this.deps);
        }
    }
}

function safeRef(value) {
    return isObject(value) ? reactive(value) : value;
}
function trackRef(ref) {
    if (isTracking()) { trackEffects(ref.deps); }
}

export function ref(value) {
    return new RefImpl(value);
}


