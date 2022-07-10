import { createTextVNode, h } from "../../lib/m-vue.esm.js";
import SlotInstance from "./Slot.js";
import BarInstance from "./Bar.js";

export default {
  render() {
    const Bar = h(BarInstance);
    // NOTE: slot example
    const Slot = h(
      SlotInstance,
      {},
      // 在Slot Children设置Slot Component, 期望可以在内部显示出来
      {
        header: ({ count }) => [
          h("span", {}, "Header " + count),
          createTextVNode("这是一个文本节点"),
          h("span", {}, "Header Text"),
        ],
        footer: ({ clickedNumbers }) =>
          h("span", {}, "Footer" + clickedNumbers),
        content: h("span", {}, "Original"),
      }
    );
    return h("div", {}, [Bar, Slot]);
  },

  setup() {},
};
