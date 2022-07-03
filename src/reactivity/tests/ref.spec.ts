import { effect } from "../effect";
import { reactive } from "../reactive";
import { ref, isRef, unRef, proxyRefs } from "../ref";

describe("basic ref", () => {
    it("the value obtained should be the same", () => {
        const count = ref(0);
        expect(count.value).toBe(0);
    })

    it("should be reactive", () => {
        const count = ref(0);
        expect(count.value).toBe(0);
        // update value
        count.value++;
        expect(count.value).toBe(1);
    })

    it("should be track as a dependency", () => {
        const count = ref(1);
        let dummy;
        let calls = 0;

        effect(() => {
            calls++;
            dummy = count.value;
        });

        expect(calls).toBe(1);
        expect(dummy).toBe(1);

        // update value 
        // should trigger dependencies update
        count.value = 2;
        expect(calls).toBe(2);
        expect(dummy).toBe(2);
    })

    it("some value not should trigger dependencies", () => {
        const count = ref(1);
        let dummy;
        let calls = 0;

        effect(() => {
            calls++;
            dummy = count.value;
        });
        expect(calls).toBe(1);
        expect(dummy).toBe(1);
        // update value 
        // should trigger dependencies update
        count.value = 2;
        expect(calls).toBe(2);
        expect(dummy).toBe(2);

        // some value not should trigger dependencies
        count.value = 2;
        expect(calls).toBe(2);
        expect(dummy).toBe(2);
    })
})

describe("nested ref", () => {
    it("should make nested properties reactive", () => {
        const counter = ref({ count: 0 });
        let dummy;
        effect(() => {
            dummy = counter.value.count;
        })
        expect(counter.value.count).toBe(0);

        // update
        counter.value.count = 2;
        expect(dummy).toBe(2);
    });
});

describe("isRef", () => {
    it("isRef basic example", () => {
        const counter = ref(0);
        expect(isRef(counter)).toBe(true);
        expect(isRef(1)).toBe(false);
    });

    it("reactive isn't ref", () => {
        const counter2 = reactive({ counter: 0 });
        expect(isRef(counter2)).toBe(false);
    })
});

describe("unRef", () => {
    it("unref basic example", () => {
        const counter = ref(0);
        expect(unRef(counter)).toBe(0);
        expect(unRef(1)).toBe(1);
        expect(isRef(counter)).toBe(true);
    });

    it("unRef relativeness should not be lost", () => {
        const counter = ref(0);
        let value = unRef(counter);
        expect(value).toBe(0);

        // update
        value = 2;
        expect(value).toBe(2);

        //
        value++
        expect(value).toBe(3);
    })
});

describe("proxyRefs", () => {
    it("basic proxyRefs example:", () => {
        const counter = {
            desc: ref(10),
            age: 200,
            name: "John"
        };
        const value = proxyRefs(counter);
        expect(counter.desc.value).toBe(10);

        expect(value.desc).toBe(10);
        expect(value.name).toBe("John");
    })

    it("proxyRefs should be reactive", () => {
        const counter = { desc: ref(1) };
        const value = proxyRefs(counter);
        expect(counter.desc.value).toBe(1);
        expect(value.desc).toBe(1);

        // update
        value.desc = 10
        expect(counter.desc.value).toBe(10);
        expect(value.desc).toBe(10);

        value.desc++;
        expect(counter.desc.value).toBe(11);
        expect(value.desc).toBe(11);

        value.desc = ref(20);
        expect(counter.desc.value).toBe(20);
        expect(value.desc).toBe(20);

        // special case: 考虑下面边缘case是否有意义(报错)
        // value.desc.value = 30;
        // expect(counter.desc.value).toBe(30);
        // expect(value.desc).toBe(30);
    });
})