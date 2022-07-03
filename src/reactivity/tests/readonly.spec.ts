import { readonly, isReadonly, shallowReadonly } from "../reactive";

describe("readonly", () => {
    it("should return a readonly proxy", () => {
        const target = { a: 1, b: { c: 2 } };
        const proxy = readonly(target);
        expect(proxy).not.toBe(target);
        expect(proxy.a).toBe(1);
    });

    it("cannot set readonly proxy", () => {
        console.warn = jest.fn();

        const target = { a: 1 };
        const proxy = readonly(target);

        proxy.a = 20;
        expect(console.warn).toBeCalled();
    })
})

describe("isReadonly", () => {
    it("basic isReadonly example: ", () => {
        const originalUser = { age: 10 };
        const observedUser = readonly(originalUser);
        expect(isReadonly(originalUser)).toBe(false);
        expect(isReadonly(observedUser)).toBe(true);
    });
})

describe("nested readonly example: ", () => {
    it("basic nested isReadonly example: ", () => {
        const originalUser = {
            age: 10,
            des: {
                name: "John"
            }
        };
        const observedUser = readonly(originalUser);
        expect(isReadonly(observedUser)).toBe(true);
        expect(isReadonly(observedUser.des)).toBe(true);
    });
})

describe("shallow readonly example: ", () => {
    it("basic shallow isReadonly example: ", () => {
        const props = shallowReadonly({ foo: { bar: "bar" } });
        expect(isReadonly(props)).toBe(true);
        expect(isReadonly(props.foo)).toBe(false);
    })
});