let activeEffect: ReactiveEffect | null = null
class ReactiveEffect {
    constructor(private _fn: Function, public scheduler?) { }
    run() {
        activeEffect = this;
        return this._fn();
    }
}

const targetMap = new Map;

// 依赖收集
export function track(target, property) {
    // 通过target找到property, 在通过property找到对应的deps
    // target -> property -> deps -> call dep fn;
    if (!targetMap.has(target)) {
        targetMap.set(target, new Map);
    }
    const propertyDepsMap = targetMap.get(target);

    if (!propertyDepsMap.has(property)) {
        propertyDepsMap.set(property, new Set);
    }
    const propertyDeps = propertyDepsMap.get(property);
    propertyDeps.add(activeEffect);
}

// 触发依赖
export function trigger(target, property) {
    const deps = targetMap.get(target).get(property);
    if (deps) {
        for (const effect of deps) {
            runReactiveEffect(effect);
        }
    }
}

function runReactiveEffect(effect: ReactiveEffect) {
    if (effect.scheduler) {
        effect.scheduler()
    } else {
        effect.run();
    }

}



interface EffectOptions {
    scheduler?: () => void;
}

export function effect(fn, effectOptions?: EffectOptions) {
    const _effect = new ReactiveEffect(fn, effectOptions?.scheduler);
    _effect.run();
    return _effect.run.bind(_effect);
}
