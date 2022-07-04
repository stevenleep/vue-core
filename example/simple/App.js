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
          `${this.msg}`
        ),
        h(
          "div",
          {
            class: "blue",
          },
          `Hello Branlice ${this.subMessage}`
        ),
      ]
    );
  },

  setup() {
    return {
      msg: "hello world 2022",
      subMessage: "good luck!",
    };
  },
};
