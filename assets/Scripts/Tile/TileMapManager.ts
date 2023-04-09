import { _decorator, Component, Layers, Node, resources, Sprite, SpriteFrame, UITransform } from "cc";
import levels from "../Levels";
const { ccclass, property } = _decorator;

export const TILE_WIDTH = 55;
export const TILE_HEIGHT = 55;

@ccclass("TileMapManager")
export class TileMapManager extends Component {
    start() {}

    update(deltaTime: number) {}

    async init() {
        const { mapInfo } = levels[`level${1}`];
        const spriteFrames = await this.loadRes();
        for (let i = 0; i < mapInfo.length; i++) {
            const column = mapInfo[i];
            for (let j = 0; j < column.length; j++) {
                const item = column[j];
                if (item.src === null || item.type === null) {
                    continue;
                }
                const node = new Node();

                const spriteComponet = node.addComponent(Sprite);
                const imageSrc = `tile (${item.src})`;
                spriteComponet.spriteFrame = spriteFrames.find(sp => sp.name === imageSrc) || spriteFrames[0];

                const transformComponet = node.addComponent(UITransform);
                transformComponet.setContentSize(TILE_WIDTH, TILE_HEIGHT);

                node.layer = 1 << Layers.nameToLayer("UI_2D");
                node.setPosition(i * TILE_WIDTH, -j * TILE_HEIGHT);

                node.parent = this.node;
            }
        }
    }

    loadRes() {
        return new Promise<SpriteFrame[]>((resolve, reject) => {
            resources.loadDir("/texture/tile/tile", SpriteFrame, function (err, assets) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(assets);
            });
        });
    }
}
