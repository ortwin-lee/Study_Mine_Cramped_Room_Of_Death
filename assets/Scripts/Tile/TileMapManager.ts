import { _decorator, Component, Layers, Node, resources, Sprite, SpriteFrame, UITransform } from "cc";
import levels from "../Levels";
import { TileManager } from "./TileManager";
import { createUINode } from "../Utils";
const { ccclass, property } = _decorator;

export const TILE_WIDTH = 55;
export const TILE_HEIGHT = 55;

@ccclass("TileMapManager")
export class TileMapManager extends Component {
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

                const imageSrc = `tile (${item.src})`;
                const spriteFrame = spriteFrames.find(sp => sp.name === imageSrc) || spriteFrames[0];

                const node = createUINode();
                const tileManager = node.addComponent(TileManager);
                tileManager.init(spriteFrame, i, j);

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
