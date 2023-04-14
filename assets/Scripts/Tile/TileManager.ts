import { _decorator, Component, Sprite, SpriteFrame, UITransform } from "cc";
import { ITILECLIFF, ITILEFLOOR, ITILEWALL, TILE_HEIGHT, TILE_WIDTH } from "../Const";
import { TILE_TYPE_ENUM } from "../Enum/index";
const { ccclass } = _decorator;

@ccclass("TileManager")
export class TileManager extends Component {
    type: TILE_TYPE_ENUM;
    mobile: boolean;
    rotatable: boolean;

    init(type: TILE_TYPE_ENUM, spriteFrame: SpriteFrame, i: number, j: number) {
        this.type = type;
        if (ITILEWALL.includes(this.type)) {
            this.mobile = false;
            this.rotatable = false;
        } else if (ITILECLIFF.includes(this.type)) {
            this.mobile = false;
            this.rotatable = true;
        } else if (ITILEFLOOR.includes(this.type)) {
            this.mobile = true;
            this.rotatable = true;
        }

        const spriteComponet = this.node.addComponent(Sprite);
        spriteComponet.spriteFrame = spriteFrame;

        const transformComponet = this.node.getComponent(UITransform);
        transformComponet?.setContentSize(TILE_WIDTH, TILE_HEIGHT);

        this.node.setPosition(i * TILE_WIDTH, -j * TILE_HEIGHT);
    }
}
