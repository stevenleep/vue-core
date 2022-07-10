import { createVNode } from "./createVNode";
import { render } from "./render"

export function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            // 转vNode, 基于vNode工作
            const vnode = createVNode(rootComponent);
            render(vnode, rootContainer, undefined)
        }
    }
}
