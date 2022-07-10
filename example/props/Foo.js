import { h } from "../../lib/m-vue.esm.js";
export const Foo = {
  render() {
    // the value of the props can be obtained through this
    return h("div", {}, [
      h("div", {}, "props count: " + this.count),
      h("button", { onClick: this.emitClickAdd }, "AddBtn"),
      h("button", { onClick: this.emitClickRemove }, "RemoveBtn"),
    ]);
  },
  setup(props, { emit, ...exn }) {
    const emitClickAdd = (event) => {
      emit("add", event);
    };
    const emitClickRemove = (event) => {
      emit("underline-in", event);
    };
    return { emitClickAdd, emitClickRemove };
  },
};
