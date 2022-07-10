import { h, provide } from "../../lib/m-vue.esm.js";
import Consumer from "./Consumer.js";

export default {
  name: "Provider",

  render() {
    return h("div", {}, [h(Consumer)]);
  },

  setup() {
    provide("count", 10);
    provide("bar", "bar");
  },
};
