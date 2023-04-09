import { _decorator, Component, Node } from "cc";
import { TileMapManager } from "../Tile/TileMapManager";
const { ccclass, property } = _decorator;

@ccclass("BattleManager")
export class BattleManager extends Component {
    start() {
        this.generateTileMap();
    }

    update(deltaTime: number) {}

    generateTileMap() {
        const stage = new Node();
        stage.setParent(this.node);
        const tileMap = new Node();
        tileMap.setParent(stage);
        const tileMapManager = tileMap.addComponent(TileMapManager);
        tileMapManager.init();
    }
}
