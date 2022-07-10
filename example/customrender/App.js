import { h } from "../../lib/m-vue.esm.js";

export default {
  setup() {
    return {
      x: 300,
      y: 300,
    };
  },

  render() {
    return h("rect", {
      x: this.x,
      y: this.y,
    });
  },
};
