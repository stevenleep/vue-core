import { h } from "../../lib/m-vue.esm.js";

export const App = {
  // vue template -> render
  render() {
    return h("div", "shi-wen" + this.msg);
  },

  setup() {
    return {
      msg: "hello world",
    };
  },
};
