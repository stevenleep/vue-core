import { hasChanged, isObject } from "../shared";
import { isTracking, ReactiveEffect, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

export interface RefConstructorOptions {
    shallow?: boolean;
    readonly?: boolean;
    rewrite?: () => any;
}

class RefImpl {
    private _value;
    public deps;
    private _rawValue;

    // 扩展参数: shallow, readonly, rewrite
    private _options: RefConstructorOptions = {};
    constructor(initValue, options: RefConstructorOptions = {}) {
        this.deps = new Set<ReactiveEffect>();
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
function safeRef(value, options: RefConstructorOptions = {}) {
    return isObject(value) ? reactive(value) : value;
}

function trackRef(ref) {
    if (isTracking()) { trackEffects(ref.deps); }
}

export function ref(value) {
    return new RefImpl(value);
}


