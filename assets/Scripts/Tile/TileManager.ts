import { _decorator, Component, Sprite, SpriteFrame, UITransform } from "cc";
import { TILE_HEIGHT, TILE_WIDTH } from "../Const";
const { ccclass } = _decorator;

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
