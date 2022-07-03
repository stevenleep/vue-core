import { ReactiveEffect } from "./effect";

class ComputedImpl {
    private _getter: Function;
    private _value: any;
    private _dirty: boolean = true;

    public _effect: ReactiveEffect;
    constructor(getter: Function) {
        this._getter = getter;
        this._effect = new ReactiveEffect(this._getter, () => {
            this._dirty = true;
        });
    }

    get value() {
        if (this._dirty) {
            this._dirty = false;
            this._value = this._effect.run()
        }
        return this._value;
    }
}

export function computed(getter: Function) {
    return new ComputedImpl(getter);
}
