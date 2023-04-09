import { _decorator, Component, Layers, Node, resources, Sprite, SpriteFrame, UITransform } from "cc";
import levels from "../Levels";
const { ccclass, property } = _decorator;

export const TILE_WIDTH = 55;
export const TILE_HEIGHT = 55;

@ccclass("TileManager")
export class TileManager extends Component {
    init(spriteFrame: SpriteFrame, i: number, j: number) {
        const spriteComponet = this.node.addComponent(Sprite);
        spriteComponet.spriteFrame = spriteFrame;

        const transformComponet = this.node.getComponent(UITransform);
        transformComponet?.setContentSize(TILE_WIDTH, TILE_HEIGHT);

        this.node.setPosition(i * TILE_WIDTH, -j * TILE_HEIGHT);
    }
}
