import { createVNode } from "./createVNode";

export function createAppAPI(render) {

    return function createApp(rootComponent) {
        return {
            mount(rootContainer) {
                // 转vNode, 基于vNode工作
                const vnode = createVNode(rootComponent);
                render(vnode, rootContainer, undefined)
            }
        }
    }

}