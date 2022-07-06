import { h, renderSlots } from "../../lib/m-vue.esm.js";

export default {
  render() {
    const originalContent = h("div", {}, "这是原来的内容");
    return h("div", {}, [
      renderSlots(this.$slots, "header"),
      originalContent,
      renderSlots(this.$slots, "footer"),
    ]);
  },
  setup() {},
};
