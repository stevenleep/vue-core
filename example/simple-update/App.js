import { h, ref } from "../../lib/m-vue.esm.js";

export default {
  name: "App",
  setup() {
    const count = ref(0);
    const prop = ref({
      foo: "foo",
      bar: "bar",
    });

    const clickIncrease = () => {
      count.value++;
    };
    const clickDecrease = () => {
      count.value--;
    };

    const changeValue = () => {
      prop.value.foo = "newFoo";
    };
    const changeValueUndefined = () => {
      prop.value.foo = undefined;
    };
    const deleteProperty = () => {
      prop.value = { foo: "foo" };
    };

    return {
      count,
      prop,

      clickIncrease,
      clickDecrease,

      changeValue,
      changeValueUndefined,
      deleteProperty,
    };
  },
  render() {
    return h(
      "div",
      {
        id: "root",
        ...this.prop,
      },
      [
        // 需要将这里的count作为依赖进行收集
        h("span", {}, `count: ${this.count}`),
        h(
          "button",
          {
            onClick: this.clickIncrease,
          },
          "+"
        ),
        h(
          "button",
          {
            onClick: this.clickDecrease,
          },
          "-"
        ),

        h("div", {}, [
          h("span", {}, `foo: ${this.prop.foo}`),
          h(
            "button",
            {
              onClick: this.changeValue,
            },
            "change value"
          ),
          h(
            "button",
            {
              onClick: this.changeValueUndefined,
            },
            "change value undefined"
          ),
          h(
            "button",
            {
              onClick: this.deleteProperty,
            },
            "delete property"
          ),
        ]),
      ]
    );
  },
};
