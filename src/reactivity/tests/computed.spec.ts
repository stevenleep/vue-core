import { reactive } from "../reactive";
import { computed } from "../computed";

describe("computed", () => {
    it("basic computed example", () => {
        const user = reactive({ age: 20 });
        const userAge = computed(() => user.age);
        expect(userAge.value).toEqual(20);
    });

    it("should computed lazily", () => {
        const user = reactive({ age: 20 });
        const getter = jest.fn(() => user.age);

        const userAge = computed(getter);
        expect(getter).not.toHaveBeenCalled();
        expect(userAge.value).toEqual(20);

        userAge.value;
        expect(getter).toHaveBeenCalledTimes(1);

        // update
        user.age = 30;
        expect(getter).toHaveBeenCalledTimes(1);
        expect(userAge.value).toEqual(30);
    });
});
