import { effect } from "../effect";
import { ref } from "../ref";

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