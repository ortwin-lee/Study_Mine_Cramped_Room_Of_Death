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
import { WoodenSkeletonManager } from "../WoodenSkeleton/WoodenSkeletonManager";
import { DoorManager } from "../Door/DoorManager";
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
            this.generateDoor();
            this.generateEnemies();
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

    async generateTileMap() {
        const tileMap = createUINode();
        tileMap.setParent(this.stage);
        const tileMapManager = tileMap.addComponent(TileMapManager);
        await tileMapManager.init();

        this.adaptPos();
    }

    async generateDoor() {
        const door = createUINode();
        door.setParent(this.stage);
        const doorManager = door.addComponent(DoorManager);
        await doorManager.init();
        DataManager.Instance.door = doorManager;
    }

    async generatePlayer() {
        const player = createUINode();
        player.setParent(this.stage);
        const playerManager = player.addComponent(PlayerManager);
        await playerManager.init();
        DataManager.Instance.player = playerManager;
        EventManager.Instance.emit(EVENT_ENUM.PLAYER_BORN, true);
    }

    async generateEnemies() {
        const enemy = createUINode();
        enemy.setParent(this.stage);
        const woodenSkeletonManager = enemy.addComponent(WoodenSkeletonManager);
        await woodenSkeletonManager.init();
        DataManager.Instance.enemies.push(woodenSkeletonManager);
    }

    adaptPos() {
        const { mapRowCount, mapColumnCount } = DataManager.Instance;
        const disX = (TILE_WIDTH * mapColumnCount) / 2;
        const disY = (TILE_HEIGHT * mapRowCount) / 2 + 120;

        this.stage.setPosition(-disX, disY);
    }
}
