import { h, inject } from "../../lib/m-vue.esm.js";

export default {
  name: "Consumer",

  render() {
    return h("span", {}, `inject value: ${this.bar}`);
  },

  setup() {
    const bar = inject("bar");

    return {
      bar,
    };
  },
};
