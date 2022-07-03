import { effect, stop } from "../effect";
import { reactive } from "../reactive";

describe("effect", () => {
    it("should work with basic effect", () => {
        // reactive user object
        const user = reactive({ age: 19 });
        let nextAge;
        effect(() => {
            nextAge = user.age + 1;
        });
        expect(nextAge).toBe(20);

        // update user age
        user.age++;
        expect(nextAge).toBe(21);
    });

    it("effect should return a runner function, call allow get return value", () => {
        let foo = 10;
        const runner = effect(() => {
            foo += 1;
            return "bar";
        });
        expect(foo).toBe(11);

        const result = runner();
        expect(foo).toBe(12);
        expect(result).toBe("bar");
    });

});

describe("effect scheduler", () => {
    it("scheduler", () => {
        let dummy;
        let run;

        const obj = reactive({ foo: 1 });
        const scheduler = jest.fn(() => {
            run = runner;
        });

        const runner = effect(() => {
            dummy = obj.foo;
        }, { scheduler });

        expect(scheduler).not.toHaveBeenCalled();
        expect(dummy).toBe(1);

        // update
        // should be called on first trigger
        obj.foo++;
        expect(scheduler).toHaveBeenCalledTimes(1);

        // should not run yet
        expect(dummy).toBe(1);
        // manually run
        run();
        expect(dummy).toBe(2);
    })
})

describe("effect stop", () => {
    it("stop", () => {
        let dummy;
        const obj = reactive({ foo: 1 });
        const runner = effect(() => {
            dummy = obj.foo;
        });

        obj.foo = 2;
        expect(dummy).toBe(2);

        // stop 暂停1次
        stop(runner);
        // obj.foo = 3; // 只会涉及到set
        obj.foo++;  // -->obj.foo = obj.foo + 1; // 会涉及到get和set两个操作（涉及到get又会被重新收集）
        expect(dummy).toBe(2);

        // 继续调用runner还是会再次执行
        runner();
        expect(dummy).toBe(3);
    })
})

describe("effect unstop", () => {
    it("unstop", () => {
        let dummy;
        const obj = reactive({ foo: 1 });

        const onStop = jest.fn();
        const runner = effect(() => {
            dummy = obj.foo;
        }, {
            onStop,
        });

        stop(runner);
        expect(onStop).toHaveBeenCalledTimes(1);
    })
});