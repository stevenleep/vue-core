import { h, getCurrentInstance } from "../../lib/m-vue.esm.js";

export default {
  name: "Foo",
  render() {
    return h("div", {}, "Foo");
  },

  setup() {
    const instance = getCurrentInstance();
    console.log("Foo", instance);
  },
};
