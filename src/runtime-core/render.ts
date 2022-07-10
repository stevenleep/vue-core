import { ShapeFlags } from "../shared/ShapeFlags";
import { Fragment } from "../shared/SpecificBuiltinTags";
import { createComponentInstance, setupComponent } from "./component";
import { Text } from "../shared/SpecificBuiltinTags";
import { createAppAPI } from "./createApp";

export function createRenderer(customRenderOptions) {
    const { createElement: hostCreateElement, patchProp: hostPatchProp, insert: hostInsert } = customRenderOptions;

    function render(vnode, container, parentComponent) {
        patch(vnode, container, parentComponent);
    }

    function patch(vnode, container, parentComponent) {
        switch (vnode?.type) {
            case Fragment:
                processFragment(vnode, container, parentComponent);
                break;
            case Text:
                processText(vnode, container);
                break;
            default:
                if (vnode.shapeFlag & ShapeFlags.ELEMENT) {
                    processElement(vnode, container, parentComponent);
                }
                if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                    processComponent(vnode, container, parentComponent);
                }
                break;
        }

    }

    function processElement(vnode: any, container: any, parentComponent) {
        mountElement(vnode, container, parentComponent);
    }
    function processComponent(vnode, container, parentComponent) {
        mountComponent(vnode, container, parentComponent);
    }
    function processFragment(vnode: any, container: any, parentComponent) {
        mountChildren(vnode?.children, container, parentComponent);
    }
    function mountComponent(initialVNode, container, parentComponent) {
        const instance = createComponentInstance(initialVNode, parentComponent);
        setupComponent(instance);
        setupRenderEffect(instance, container, initialVNode);
    }
    function mountElement(vnode: any, container: any, parentComponent) {
        const el = (vnode.el = hostCreateElement(vnode.type))
        if (vnode.shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            el.textContent = vnode.children;
        } else if (vnode.shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            mountChildren(vnode.children, el, parentComponent);
        }
        addAttrs(vnode, el);
        hostInsert(el, container);
    }
    function mountChildren(children = [], container, parentComponent) {
        children.forEach(child => {
            patch(child, container, parentComponent)
        })
    }

    function addAttrs(vnode, container) {
        const props = vnode.props || {};
        for (const key in props) {
            if (Object.prototype.hasOwnProperty.call(props, key)) {
                const value = props[key];
                hostPatchProp(container, key, value);
            }
        }
    }
    function setupRenderEffect(instance, container, initialVNode) {
        const subTree = instance?.render?.call(instance.proxy);
        patch(subTree, container, instance);
        initialVNode.el = subTree.el;
    }
    function processText(vnode: any, container: any) {
        const el = (vnode.el = document.createTextNode(vnode.children));
        container.append(el);
    }

    return {
        createApp: createAppAPI(render),
    }
}