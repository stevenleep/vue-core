import { createRenderer } from "../../lib/m-vue.esm.js";

export const renderer = createRenderer({
  createElement: (tagName) => {
    if (tagName === "rect") {
      const rect = new PIXI.Graphics();
      rect.beginFill(0xf0f000);
      rect.drawRect(0, 0, 100, 100);
      rect.endFill();
      return rect;
    }
  },

  patchProp: (el, key, value) => {
    el[key] = value;
  },

  insert: (el, parent) => {
    parent.addChild(el);
  },
});
