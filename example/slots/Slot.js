import { h, renderSlots } from "../../lib/m-vue.esm.js";

export default {
  render() {
    const originalContent = h("div", {}, "这是原来的内容");
    const count = 10;
    const clickedNumbers = 2000;

    return h("div", {}, [
      renderSlots(this.$slots, "header", { count }),
      originalContent,
      renderSlots(this.$slots, "content"),
      renderSlots(this.$slots, "footer", { clickedNumbers }),
    ]);
  },

  setup() {},
};
