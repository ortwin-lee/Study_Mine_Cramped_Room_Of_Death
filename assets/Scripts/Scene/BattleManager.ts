import { _decorator, Component, Node } from "cc";
import { TileMapManager } from "../Tile/TileMapManager";
import { createUINode } from "../Utils";
import levels from "../Levels";
import { ILevel } from "../Types";
import { TILE_HEIGHT, TILE_WIDTH } from "../Const";
import DataManager from "../Runtime/DataManager";
import EventManager from "../Runtime/EventManager";
import { ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from "../Enum";
import { PlayerManager } from "../Player/PlayerManager";
import { WoodenSkeletonManager } from "../WoodenSkeleton/WoodenSkeletonManager";
import { DoorManager } from "../Door/DoorManager";
import { IronSkeletonManager } from "../IronSkeleton/IronSkeletonManager";
import { BurstManager } from "../Burst/BurstManager";
import { SpikeManager } from "../Spike/SpikeManager";
const { ccclass } = _decorator;

@ccclass("BattleManager")
export class BattleManager extends Component {
    level: ILevel;
    stage: Node;

    onLoad() {
        DataManager.Instance.levelIndex = 2;
        EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this);
        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrived, this);
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
            this.generateBursts();
            this.generateSpikes();
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

    async generateBursts() {
        const promise = [];
        for (let i = 0; i < this.level.bursts.length; i++) {
            const burst = this.level.bursts[i];
            const node = createUINode();
            node.setParent(this.stage);
            const burstManager = node.addComponent(BurstManager);
            promise.push(burstManager.init(burst));
            DataManager.Instance.bursts.push(burstManager);
        }

        await Promise.all(promise);
    }

    async generateSpikes() {
        const promise = [];
        for (let i = 0; i < this.level.spikes.length; i++) {
            const spike = this.level.spikes[i];
            const node = createUINode();
            node.setParent(this.stage);
            const spikeManager = node.addComponent(SpikeManager);
            promise.push(spikeManager.init(spike));
            DataManager.Instance.spikes.push(spikeManager);
        }

        await Promise.all(promise);
    }

    async generateDoor() {
        const door = createUINode();
        door.setParent(this.stage);
        const doorManager = door.addComponent(DoorManager);
        await doorManager.init(this.level.door);
        DataManager.Instance.door = doorManager;
    }

    async generatePlayer() {
        const player = createUINode();
        player.setParent(this.stage);
        const playerManager = player.addComponent(PlayerManager);
        await playerManager.init(this.level.player);
        DataManager.Instance.player = playerManager;
        EventManager.Instance.emit(EVENT_ENUM.PLAYER_BORN, true);
    }

    async generateEnemies() {
        const promise = [];
        for (let i = 0; i < this.level.enemies.length; i++) {
            const enemy = this.level.enemies[i];
            const node = createUINode();
            node.setParent(this.stage);
            const Manager = enemy.type === ENTITY_TYPE_ENUM.SKELETON_IRON ? WoodenSkeletonManager : IronSkeletonManager;
            const manager = node.addComponent(Manager);
            promise.push(manager.init(enemy));
            DataManager.Instance.enemies.push(manager);
        }

        await Promise.all(promise);
    }

    adaptPos() {
        const { mapRowCount, mapColumnCount } = DataManager.Instance;
        const disX = (TILE_WIDTH * mapColumnCount) / 2;
        const disY = (TILE_HEIGHT * mapRowCount) / 2 + 120;

        this.stage.setPosition(-disX, disY);
    }

    checkArrived() {
        const { x: playerX, y: playerY } = DataManager.Instance.player;
        const { x: doorX, y: doorY, state: doorState } = DataManager.Instance.door;
        if (playerX === doorX && playerY === doorY && doorState === ENTITY_STATE_ENUM.DEATH) {
            EventManager.Instance.emit(EVENT_ENUM.NEXT_LEVEL);
        }
    }
}
