import { h } from "../../lib/m-vue.esm.js";

export const App = {
  // vue template -> render
  render() {
    // return h("div", {}, "shi-wen" + this.msg);
    return h(
      "div",
      {
        id: "mini-vue-page",
        class: "first-layer",
      },
      [
        h(
          "div",
          {
            class: "red",
          },
          "shi-wen-red"
        ),
        h(
          "div",
          {
            class: "blue",
          },
          "shi-wen-blue"
        ),
      ]
    );
  },

  setup() {
    return {
      msg: "hello world",
    };
  },
};
