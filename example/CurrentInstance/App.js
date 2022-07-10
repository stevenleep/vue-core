import { h, getCurrentInstance } from "../../lib/m-vue.esm.js";
import Foo from "./Foo.js";

export default {
  name: "App",
  render() {
    return h("div", {}, [h("p", {}, "Current Instance"), h(Foo)]);
  },
  setup() {
    const instance = getCurrentInstance();
    console.log("App", instance);
  },
};
