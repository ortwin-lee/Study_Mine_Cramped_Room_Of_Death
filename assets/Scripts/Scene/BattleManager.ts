import { _decorator, Component, Node } from "cc";
import { TileMapManager } from "../Tile/TileMapManager";
import { createUINode } from "../Utils";
import levels from "../Levels";
import { ILevel } from "../Types/levelTypes";
import { DataManagerInstance } from "../Runtime/DataManager";
import { TILE_HEIGHT, TILE_WIDTH } from "../Const";
const { ccclass, property } = _decorator;

@ccclass("BattleManager")
export class BattleManager extends Component {
    level: ILevel;
    stage: Node;

    start() {
        this.generateStage();
        this.initLevel();
    }

    update(deltaTime: number) {}

    initLevel() {
        const level = levels[`level${1}`];
        if (level) {
            this.level = level;

            DataManagerInstance.mapInfo = this.level.mapInfo;
            DataManagerInstance.mapColumnCount = this.level.mapInfo.length || 0;
            DataManagerInstance.mapRowCount = this.level.mapInfo[0].length || 0;
            this.generateTileMap();
        }
    }

    generateStage() {
        this.stage = createUINode();
        this.stage.setParent(this.node);
    }

    generateTileMap() {
        const tileMap = createUINode();
        tileMap.setParent(this.stage);
        const tileMapManager = tileMap.addComponent(TileMapManager);
        tileMapManager.init();

        this.adaptPos();
    }

    adaptPos() {
        const { mapRowCount, mapColumnCount } = DataManagerInstance;
        const disX = (TILE_WIDTH * mapColumnCount) / 2;
        const disY = (TILE_HEIGHT * mapRowCount) / 2 + 120;

        this.stage.setPosition(-disX, disY);
    }
}
