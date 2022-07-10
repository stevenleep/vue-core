import { createTextVNode, h, useInject } from "../../lib/m-vue.esm.js";

export default {
  name: "Consumer",
  render() {
    return h("div", {}, [
      createTextVNode(
        `自定义增强的inject: ${this.provideContext.count} - ${this.provideContext.notFound}`
      ),
    ]);
  },

  setup() {
    const provideContext = useInject(["two", "count", "notFound"], {
      notFound: "this is default value",
    });
    return {
      provideContext,
    };
  },
};
