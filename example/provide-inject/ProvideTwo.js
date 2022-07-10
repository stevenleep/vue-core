import { createTextVNode, h, provide, inject } from "../../lib/m-vue.esm.js";
import Consumer from "./Consumer.js";
import EnhanceInject from "./EnhanceInject.js";

export default {
  name: "ProviderTwo",

  render() {
    return h("div", {}, [
      h("div", {}, "bar: " + this.bar),
      h(Consumer),
      h(EnhanceInject),
    ]);
  },

  setup() {
    provide("two", "twosss");
    provide("bar", "two bar");
    const bar = inject("bar");

    return {
      bar,
    };
  },
};
