import { _decorator, Component, director, Node } from "cc";
import { TileMapManager } from "../Tile/TileMapManager";
import { createUINode } from "../Utils";
import levels from "../Levels";
import { ILevel, IRecord } from "../Types";
import { TILE_HEIGHT, TILE_WIDTH } from "../Const";
import DataManager from "../Runtime/DataManager";
import EventManager from "../Runtime/EventManager";
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, SCENE_ENUM } from "../Enum";
import { PlayerManager } from "../Player/PlayerManager";
import { WoodenSkeletonManager } from "../WoodenSkeleton/WoodenSkeletonManager";
import { DoorManager } from "../Door/DoorManager";
import { IronSkeletonManager } from "../IronSkeleton/IronSkeletonManager";
import { BurstManager } from "../Burst/BurstManager";
import { SpikeManager } from "../Spike/SpikeManager";
import { SmokeManager } from "../Smoke/SmokeManager";
import FaderManager from "../Runtime/FaderManager";
import { ShakeManager } from "../UI/ShakeManager";
const { ccclass } = _decorator;

@ccclass("BattleManager")
export class BattleManager extends Component {
    level: ILevel;
    stage: Node;
    private inited: boolean = false;

    onLoad() {
        DataManager.Instance.levelIndex = 1;
        EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this);
        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrived, this);
        EventManager.Instance.on(EVENT_ENUM.SHOW_SMOKE, this.generateSmoke, this);
        EventManager.Instance.on(EVENT_ENUM.RECORD_STEP, this.record, this);
        EventManager.Instance.on(EVENT_ENUM.REVOKE_STEP, this.revoke, this);
        EventManager.Instance.on(EVENT_ENUM.RESTART_LEVEL, this.initLevel, this);
        EventManager.Instance.on(EVENT_ENUM.OUT_BATTLE, this.outBattle, this);
    }

    start() {
        this.generateStage();
        this.initLevel();
    }

    update(deltaTime: number) {}

    onDestroy() {
        EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this);
        EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrived, this);
        EventManager.Instance.off(EVENT_ENUM.SHOW_SMOKE, this.generateSmoke, this);
        EventManager.Instance.off(EVENT_ENUM.RECORD_STEP, this.record, this);
        EventManager.Instance.off(EVENT_ENUM.REVOKE_STEP, this.revoke, this);
        EventManager.Instance.off(EVENT_ENUM.RESTART_LEVEL, this.initLevel, this);
        EventManager.Instance.off(EVENT_ENUM.OUT_BATTLE, this.outBattle, this);
    }

    async initLevel() {
        const level = levels[`level${DataManager.Instance.levelIndex}`];
        if (level) {
            if (this.inited) {
                await FaderManager.Instance.fadeIn();
            } else {
                await FaderManager.Instance.mask();
                this.inited = true;
            }

            this.clearLevel();

            this.level = level;
            DataManager.Instance.mapInfo = this.level.mapInfo;
            DataManager.Instance.mapColumnCount = this.level.mapInfo.length || 0;
            DataManager.Instance.mapRowCount = this.level.mapInfo[0].length || 0;
            await Promise.all([
                this.generateTileMap(),
                this.generateBursts(),
                this.generateSpikes(),
                this.generateDoor(),
                this.generateEnemies(),
                this.generatePlayer(),
            ]);

            await FaderManager.Instance.fadeOut();
        } else {
            this.outBattle();
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
        this.stage.addComponent(ShakeManager);
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
        player.setSiblingIndex(player.parent.children.length - 1);
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
            const Manager = enemy.type === ENTITY_TYPE_ENUM.SKELETON_WOODEN ? WoodenSkeletonManager : IronSkeletonManager;
            const manager = node.addComponent(Manager);
            promise.push(manager.init(enemy));
            DataManager.Instance.enemies.push(manager);
        }

        await Promise.all(promise);
    }

    async generateSmoke(x: number, y: number, direction: DIRECTION_ENUM) {
        const item = DataManager.Instance.smokes.find(smoke => smoke.state === ENTITY_STATE_ENUM.DEATH);
        if (item) {
            item.x = x;
            item.y = y;
            item.direction = direction;
            item.state = ENTITY_STATE_ENUM.IDLE;
            item.node.setSiblingIndex(item.node.parent.children.length - 2);
            // item.node.setPosition((x - 1.5) * TILE_WIDTH, -(y - 1.5) * TILE_HEIGHT);
        } else {
            const smoke = createUINode();
            smoke.setParent(this.stage);
            smoke.setSiblingIndex(smoke.parent.children.length - 2);
            const smokeManager = smoke.addComponent(SmokeManager);
            await smokeManager.init({
                x,
                y,
                direction,
                state: ENTITY_STATE_ENUM.IDLE,
                type: ENTITY_TYPE_ENUM.SMOKE,
            });
            DataManager.Instance.smokes.push(smokeManager);
        }
    }

    adaptPos() {
        const { mapRowCount, mapColumnCount } = DataManager.Instance;
        const disX = (TILE_WIDTH * mapColumnCount) / 2;
        const disY = (TILE_HEIGHT * mapRowCount) / 2 + 120;
        this.stage.getComponent(ShakeManager)?.stop();
        this.stage.setPosition(-disX, disY);
    }

    checkArrived() {
        if (!DataManager.Instance.player || !DataManager.Instance.door) {
            return;
        }
        const { x: playerX, y: playerY } = DataManager.Instance.player;
        const { x: doorX, y: doorY, state: doorState } = DataManager.Instance.door;
        if (playerX === doorX && playerY === doorY && doorState === ENTITY_STATE_ENUM.DEATH) {
            EventManager.Instance.emit(EVENT_ENUM.NEXT_LEVEL);
        }
    }

    record() {
        const item: IRecord = {
            player: {
                x: DataManager.Instance.player.x,
                y: DataManager.Instance.player.y,
                type: DataManager.Instance.player.type,
                state:
                    DataManager.Instance.player.state === ENTITY_STATE_ENUM.IDLE ||
                    DataManager.Instance.player.state === ENTITY_STATE_ENUM.DEATH ||
                    DataManager.Instance.player.state === ENTITY_STATE_ENUM.AIRDEATH
                        ? DataManager.Instance.player.state
                        : ENTITY_STATE_ENUM.IDLE,
                direction: DataManager.Instance.player.direction,
            },
            door: {
                x: DataManager.Instance.door.x,
                y: DataManager.Instance.door.y,
                type: DataManager.Instance.door.type,
                state: DataManager.Instance.door.state,
                direction: DataManager.Instance.door.direction,
            },
            enemies: DataManager.Instance.enemies.map(({ x, y, type, state, direction }) => ({ x, y, type, state, direction })),
            bursts: DataManager.Instance.bursts.map(({ x, y, type, state, direction }) => ({ x, y, type, state, direction })),
            spikes: DataManager.Instance.spikes.map(({ x, y, type, curCount }) => ({ x, y, type, curCount })),
        };

        DataManager.Instance.records.push(item);
    }

    async outBattle() {
        await FaderManager.Instance.fadeIn();
        director.loadScene(SCENE_ENUM.Start);
    }

    revoke() {
        const item = DataManager.Instance.records.pop();
        if (item) {
            DataManager.Instance.player.x = DataManager.Instance.player.targetX = item.player.x;
            DataManager.Instance.player.y = DataManager.Instance.player.targetY = item.player.y;
            DataManager.Instance.player.state = item.player.state;
            DataManager.Instance.player.direction = item.player.direction;

            DataManager.Instance.door.x = item.door.x;
            DataManager.Instance.door.y = item.door.y;
            DataManager.Instance.door.state = item.door.state;
            DataManager.Instance.door.direction = item.door.direction;

            for (let i = 0; i < DataManager.Instance.enemies.length; i++) {
                DataManager.Instance.enemies[i].x = item.enemies[i].x;
                DataManager.Instance.enemies[i].y = item.enemies[i].y;
                DataManager.Instance.enemies[i].state = item.enemies[i].state;
                DataManager.Instance.enemies[i].direction = item.enemies[i].direction;
            }

            for (let i = 0; i < DataManager.Instance.bursts.length; i++) {
                DataManager.Instance.bursts[i].x = item.bursts[i].x;
                DataManager.Instance.bursts[i].y = item.bursts[i].y;
                DataManager.Instance.bursts[i].state = item.bursts[i].state;
            }

            for (let i = 0; i < DataManager.Instance.spikes.length; i++) {
                DataManager.Instance.spikes[i].x = item.spikes[i].x;
                DataManager.Instance.spikes[i].y = item.spikes[i].y;
                DataManager.Instance.spikes[i].curCount = item.spikes[i].curCount;
                DataManager.Instance.spikes[i].type = item.spikes[i].type;
            }
        }
    }
}
