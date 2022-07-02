import { reactive } from "../reactive";

describe("reactive", () => {
    it("basic reactive example: ", () => {
        const originalUser = { age: 10 };
        const observedUser = reactive(originalUser);

        // originalUser should  not be observedUser
        expect(originalUser).not.toBe(observedUser);
        // observedUser user.age should be originalUser age(10)
        expect(observedUser.age).toBe(10);
    });
})