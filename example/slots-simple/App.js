import { h } from "../../lib/m-vue.esm.js";
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
        header: h("span", {}, "Header"),
        footer: h("span", {}, "Footer"),
      }
    );
    return h("div", {}, [Bar, Slot]);
  },

  setup() {},
};
