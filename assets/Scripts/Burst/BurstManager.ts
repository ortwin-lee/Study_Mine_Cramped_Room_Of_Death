import { UITransform, _decorator } from "cc";
import { ENTITY_STATE_ENUM, EVENT_ENUM } from "../Enum";
import { BurstStateMachine } from "./BurstStateMachine";
import EventManager from "../Runtime/EventManager";
import DataManager from "../Runtime/DataManager";
import { IEntity } from "../Types";
import { EntityManager } from "../Base/EntityManager";
import { TILE_HEIGHT, TILE_WIDTH } from "../Const";
const { ccclass } = _decorator;

@ccclass("BurstManager")
export class BurstManager extends EntityManager {
    async init(params: IEntity) {
        this.fsm = this.addComponent(BurstStateMachine);
        await this.fsm.init();
        await super.init(params);

        const transformComponet = this.node.getComponent(UITransform);
        transformComponet?.setContentSize(TILE_WIDTH, TILE_HEIGHT);

        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onBurst, this);
    }

    update() {
        this.node.setPosition(this.x * TILE_WIDTH, -this.y * TILE_HEIGHT);
    }

    onDestroy() {
        super.onDestroy();
        EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onBurst, this);
    }

    onBurst() {
        if (this.state === ENTITY_STATE_ENUM.DEATH || !DataManager.Instance.player) {
            return;
        }

        const { x: playerX, y: playerY, state: playerState } = DataManager.Instance.player;

        if (this.x === playerX && this.y === playerY && this.state === ENTITY_STATE_ENUM.IDLE) {
            this.state = ENTITY_STATE_ENUM.ATTACK;
        } else if (this.state === ENTITY_STATE_ENUM.ATTACK) {
            this.state = ENTITY_STATE_ENUM.DEATH;
            if (this.x === playerX && this.y === playerY) {
                EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.AIRDEATH);
            }
        }
    }
}
