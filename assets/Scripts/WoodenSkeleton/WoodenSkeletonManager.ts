import { _decorator } from "cc";
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from "../Enum";
import { EntityManager } from "../Base/EntityManager";
import { WoodenSkeletonStateMachine } from "./WoodenSkeletonStateMachine";
import EventManager from "../Runtime/EventManager";
import DataManager from "../Runtime/DataManager";
const { ccclass } = _decorator;

@ccclass("WoodenSkeletonManager")
export class WoodenSkeletonManager extends EntityManager {
    async init() {
        this.fsm = this.addComponent(WoodenSkeletonStateMachine);
        await this.fsm.init();
        await super.init({
            x: 2,
            y: 4,
            type: ENTITY_TYPE_ENUM.PLAYER,
            direction: DIRECTION_ENUM.TOP,
            state: ENTITY_STATE_ENUM.IDLE,
        });

        EventManager.Instance.on(EVENT_ENUM.PLAYER_BORN, this.onChangeDirection, this);
        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection, this);
        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack, this);
        EventManager.Instance.on(EVENT_ENUM.ATTACK_ENEMY, this.onDead, this);

        this.onChangeDirection(true);
    }

    onDestroy() {
        super.onDestroy();
        EventManager.Instance.off(EVENT_ENUM.PLAYER_BORN, this.onChangeDirection, this);
        EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection, this);
        EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack, this);
        EventManager.Instance.off(EVENT_ENUM.ATTACK_ENEMY, this.onDead, this);
    }

    onChangeDirection(isInit: boolean = false) {
        if (this.state === ENTITY_STATE_ENUM.DEATH || !DataManager.Instance.player) {
            return;
        }

        if (!DataManager.Instance.player) {
            return;
        }
        const { x: playerX, y: playerY } = DataManager.Instance.player;
        const radians = Math.round((Math.atan2(-playerY + this.y, playerX - this.x) / Math.PI) * 180);

        if (!isInit && Math.abs(playerY - this.y) === Math.abs(playerX - this.x)) {
            return;
        }

        if (radians > -45 && radians <= 45) {
            this.direction = DIRECTION_ENUM.RIGHT;
        } else if (radians > 45 && radians <= 135) {
            this.direction = DIRECTION_ENUM.TOP;
        } else if (radians > 135 || radians <= -135) {
            this.direction = DIRECTION_ENUM.LEFT;
        } else if (radians > -135 && radians <= -45) {
            this.direction = DIRECTION_ENUM.BOTTOM;
        }
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

    onDead(id: string) {
        if (this.state === ENTITY_STATE_ENUM.DEATH) {
            return;
        }

        if (this.id === id) {
            this.state = ENTITY_STATE_ENUM.DEATH;
        }
    }
}
