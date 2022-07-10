import { h, ref } from "../../lib/m-vue.esm.js";

export default {
  name: "App",
  setup() {
    const count = ref(0);
    const clickIncrease = () => {
      count.value++;
    };
    const clickDecrease = () => {
      count.value--;
    };
    return {
      count,
      clickIncrease,
      clickDecrease,
    };
  },
  render() {
    return h(
      "div",
      {
        id: "root",
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
      ]
    );
  },
};
