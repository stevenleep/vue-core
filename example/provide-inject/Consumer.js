import { createTextVNode, h, inject } from "../../lib/m-vue.esm.js";

export default {
  name: "Consumer",

  render() {
    return h("span", {}, [
      createTextVNode(`inject value: ${this.bar}`),
      h("div", {}, `当前的Count: ${this.count}`),
      createTextVNode("第二层提供的 inject value:" + this.two),
    ]);
  },

  setup() {
    const bar = inject("bar");
    const two = inject("two");

    const count = inject("count");

    return {
      bar,
      two,
      count,
    };
  },
};
