import { _decorator, Component, resources, SpriteFrame } from "cc";
import { TileManager } from "./TileManager";
import { createUINode, randomByRange } from "../Utils";
import DataManager from "../Runtime/DataManager";
import { ResourceManager } from "../Runtime/ResourceManager";
const { ccclass } = _decorator;

@ccclass("TileMapManager")
export class TileMapManager extends Component {
    async init() {
        const spriteFrames = await ResourceManager.Instance.loadDir("/texture/tile/tile");
        const { mapInfo } = DataManager.Instance;
        for (let i = 0; i < mapInfo.length; i++) {
            const column = mapInfo[i];
            for (let j = 0; j < column.length; j++) {
                const item = column[j];
                if (item.src === null || item.type === null) {
                    continue;
                }

                let number = item.src;

                if (randomByRange(0, 4) === 0 && (number === 1 || number === 5 || number === 9)) {
                    number += randomByRange(0, 4);
                }

                const imageSrc = `tile (${number})`;
                const spriteFrame = spriteFrames.find(sp => sp.name === imageSrc) || spriteFrames[0];

                const node = createUINode();
                const tileManager = node.addComponent(TileManager);
                tileManager.init(spriteFrame, i, j);

                node.parent = this.node;
            }
        }
    }
}
