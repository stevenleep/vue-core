import { h } from "../../lib/m-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  render() {
    return h("div", {}, [
      h("h1", {}, "Hello World " + this.msg),
      h("button", {}, "Click me"),
      h(Foo, {
        count: this.count,
        onAdd(event) {
          console.log("emit add ...", event);
        },
        onUnderlineIn(event) {
          console.log("emit underlineIn2hump ...", event);
        },
      }),
    ]);
  },

  setup() {
    return {
      msg: "props example",
      count: 0,
    };
  },
};
