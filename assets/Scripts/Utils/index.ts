import { Layers, Node, UITransform } from "cc";

export const createUINode = (name: string = " ") => {
    const node = new Node(name);
    const transformComponet = node.addComponent(UITransform);
    transformComponet.setAnchorPoint(0, 1);
    node.layer = 1 << Layers.nameToLayer("UI_2D");
    return node;
};

export const randomByRange = (start: number, end: number) => Math.floor(start + (end - start) * Math.random());
