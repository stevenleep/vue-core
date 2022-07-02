import { effect } from "../effect";
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
    })
});
