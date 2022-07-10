import { h, provide } from "../../lib/m-vue.esm.js";
import ProvideTwo from "./ProvideTwo.js";

export default {
  name: "Provider",

  render() {
    return h("div", {}, [h(ProvideTwo)]);
  },

  setup() {
    provide("count", 10);
    provide("bar", "bar");
  },
};
