import { _decorator, Component, Node } from "cc";
import { TileMapManager } from "../Tile/TileMapManager";
import { createUINode } from "../Utils";
const { ccclass, property } = _decorator;

@ccclass("BattleManager")
export class BattleManager extends Component {
    start() {
        this.generateTileMap();
    }

    update(deltaTime: number) {}

    generateTileMap() {
        const stage = createUINode();
        stage.setParent(this.node);

        const tileMap = createUINode();
        tileMap.setParent(stage);
        const tileMapManager = tileMap.addComponent(TileMapManager);
        tileMapManager.init();
    }
}
