import { _decorator, Component, Node } from "cc";
import { TileMapManager } from "../Tile/TileMapManager";
import { createUINode } from "../Utils";
import levels from "../Levels";
import { ILevel } from "../Types";
import { TILE_HEIGHT, TILE_WIDTH } from "../Const";
import DataManager from "../Runtime/DataManager";
import EventManager from "../Runtime/EventManager";
import { EVENT_ENUM } from "../Enum";
import { PlayerManager } from "../Player/PlayerManager";
const { ccclass } = _decorator;

@ccclass("BattleManager")
export class BattleManager extends Component {
    level: ILevel;
    stage: Node;

    onLoad() {
        EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this);
    }

    start() {
        this.generateStage();
        this.initLevel();
    }

    update(deltaTime: number) {}

    onDestroy() {
        EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this);
    }

    initLevel() {
        const level = levels[`level${DataManager.Instance.levelIndex}`];
        if (level) {
            this.clearLevel();

            this.level = level;
            DataManager.Instance.mapInfo = this.level.mapInfo;
            DataManager.Instance.mapColumnCount = this.level.mapInfo.length || 0;
            DataManager.Instance.mapRowCount = this.level.mapInfo[0].length || 0;
            this.generateTileMap();
            this.generatePlayer();
        }
    }

    nextLevel() {
        DataManager.Instance.levelIndex++;
        this.initLevel();
    }

    clearLevel() {
        this.stage.destroyAllChildren();
        DataManager.Instance.reset();
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
        const { mapRowCount, mapColumnCount } = DataManager.Instance;
        const disX = (TILE_WIDTH * mapColumnCount) / 2;
        const disY = (TILE_HEIGHT * mapRowCount) / 2 + 120;

        this.stage.setPosition(-disX, disY);
    }

    generatePlayer() {
        const player = createUINode();
        player.setParent(this.stage);
        const playerManager = player.addComponent(PlayerManager);
        playerManager.init();
    }
}
