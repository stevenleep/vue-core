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
