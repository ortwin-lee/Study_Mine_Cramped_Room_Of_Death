import { _decorator } from "cc";
import { ENTITY_STATE_ENUM, EVENT_ENUM } from "../Enum";
import { WoodenSkeletonStateMachine } from "./WoodenSkeletonStateMachine";
import EventManager from "../Runtime/EventManager";
import DataManager from "../Runtime/DataManager";
import { EnemyManager } from "../Base/EnemyManager";
import { IEntity } from "../Types";
const { ccclass } = _decorator;

@ccclass("WoodenSkeletonManager")
export class WoodenSkeletonManager extends EnemyManager {
    async init(params: IEntity) {
        this.fsm = this.addComponent(WoodenSkeletonStateMachine);
        await this.fsm.init();
        await super.init(params);

        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack, this);
    }

    onDestroy() {
        super.onDestroy();
        EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack, this);
    }

    onAttack() {
        if (this.state === ENTITY_STATE_ENUM.DEATH || !DataManager.Instance.player) {
            return;
        }

        const { x: playerX, y: playerY, state: playerState } = DataManager.Instance.player;

        if (
            Math.abs(this.x - playerX) + Math.abs(this.y - playerY) <= 1 &&
            playerState !== ENTITY_STATE_ENUM.DEATH &&
            playerState !== ENTITY_STATE_ENUM.AIRDEATH
        ) {
            this.state = ENTITY_STATE_ENUM.ATTACK;
            EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.DEATH);
        } else {
            this.state = ENTITY_STATE_ENUM.IDLE;
        }
    }
}
