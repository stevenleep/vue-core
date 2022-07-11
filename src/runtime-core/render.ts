import { ShapeFlags } from "../shared/ShapeFlags";
import { Fragment } from "../shared/SpecificBuiltinTags";
import { createComponentInstance, setupComponent } from "./component";
import { Text } from "../shared/SpecificBuiltinTags";
import { createAppAPI } from "./createApp";
import { effect } from "../reactivity";

const DEFAULT_EMPTY_OBJ = {};
export function createRenderer(customRenderOptions) {
    const {
        createElement: hostCreateElement,
        patchProp: hostPatchProp,
        insert: hostInsert,
        remove: hostRemove,
        setElementText: hostSetElementText
    } = customRenderOptions;

    function render(vnode, container, parentComponent) {
        patch(null, vnode, container, parentComponent);
    }

    // n1 --> oldSubtree
    // n2 --> newSubtree
    function patch(n1, n2, container, parentComponent) {
        switch (n2?.type) {
            case Fragment:
                processFragment(n1, n2, container, parentComponent);
                break;
            case Text:
                processText(n1, n2, container);
                break;
            default:
                if (n2.shapeFlag & ShapeFlags.ELEMENT) {
                    processElement(n1, n2, container, parentComponent);
                }
                if (n2.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                    processComponent(n1, n2, container, parentComponent);
                }
                break;
        }

    }

    function processElement(n1, n2: any, container: any, parentComponent) {
        if (!n1) { // n1 不存在->初始化
            mountElement(n2, container, parentComponent);
        } else {
            patchElement(n1, n2, container);
        }
    }

    // TODO: 实现Element的更新
    function patchElement(n1, n2, container) {
        const oldProps = n1.props || DEFAULT_EMPTY_OBJ;
        const newProps = n2.props || DEFAULT_EMPTY_OBJ;

        const el = (n2.el = n1.el);

        patchChildren(n1, n2, el, container);
        patchProps(el, oldProps, newProps);
    }

    // TODO（lishiwen）: 更新Children更好的做法
    function patchChildren(n1, n2, el, parentComponent) {
        const oldShapeFlag = n1.shapeFlag;
        const newShapeFlag = n2.shapeFlag;

        // ArrayChildren -> TextChildren
        // 由TextChildren -> TextChildren
        if (newShapeFlag & ShapeFlags.TEXT_CHILDREN) {
            if (oldShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                unmountChildren(n1.children);
                hostSetElementText(el, n2.children);
            } else if ((oldShapeFlag & ShapeFlags.TEXT_CHILDREN) && n1.children !== n2.children) {
                // 由TextChildren -> TextChildren, 在两次结果不相同时候更新
                hostSetElementText(el, n2.children);
            }
        }

        // TextChildren -> ArrayChildren
        if ((oldShapeFlag & ShapeFlags.TEXT_CHILDREN) & (newShapeFlag & ShapeFlags.ARRAY_CHILDREN)) {
            hostSetElementText(el, "");
            mountChildren(n2.children, el, parentComponent);
        }

        if ((oldShapeFlag & ShapeFlags.ARRAY_CHILDREN) & (newShapeFlag & ShapeFlags.ARRAY_CHILDREN)) {
            // TODO: ArrayChildren -> ArrayChildren
        }
    }

    function unmountChildren(children) {
        for (let index = 0; index < children.length; index++) {
            const child = children[index];
            hostRemove(child.el, child);
        }
    }

    function patchProps(el, oldProps, newProps) {
        if (oldProps !== newProps) {
            // 以前存在，现在也存在，但是值变化了
            for (const key in newProps) {
                const prevProp = oldProps[key];
                const nextProp = newProps[key];
                if (prevProp !== nextProp) {
                    hostPatchProp(el, key, prevProp, nextProp);
                }
            }

            // 原来存在，现在不存在
            if (oldProps !== DEFAULT_EMPTY_OBJ) {
                for (const key in oldProps) {
                    if (!(key in newProps)) {
                        hostPatchProp(el, key, oldProps[key], null);
                    }
                }
            }
        }
    }

    function processComponent(n1, n2, container, parentComponent) {
        mountComponent(n2, container, parentComponent);
    }
    function processFragment(n1, n2: any, container: any, parentComponent) {
        mountChildren(n2?.children, container, parentComponent);
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
            patch(null, child, container, parentComponent)
        })
    }

    function addAttrs(vnode, container) {
        const props = vnode.props || {};
        for (const key in props) {
            if (Object.prototype.hasOwnProperty.call(props, key)) {
                const value = props[key];
                hostPatchProp(container, key, null, value);
            }
        }
    }
    function processText(n1, n2: any, container: any) {
        const el = (n2.el = document.createTextNode(n2.children));
        container.append(el);
    }

    function setupRenderEffect(instance, container, initialVNode) {
        effect(() => {
            // initial
            if (!instance.isMounted) {
                // 当处于更新逻辑时， instance.subTree则为旧的数据（旧的VNode）
                const subTree = (instance.subTree = instance?.render.call(instance.proxy));
                patch(null, subTree, container, instance);
                initialVNode.el = subTree.el;
                instance.isMounted = true
            } else {
                // update
                // 在更新时候可以认为是新的VNod, 和初始化时候的VNode进行对比
                const subTree = instance?.render.call(instance.proxy);
                const prevSubTree = instance.subTree;

                // 设置为下一次对比的VNode
                instance.subTree = subTree;
                patch(prevSubTree, subTree, container, instance);
            }
        })
    }

    return {
        createApp: createAppAPI(render),
    }
}