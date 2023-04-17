import { _decorator } from "cc";
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from "../Enum";
import { EntityManager } from "../Base/EntityManager";
import EventManager from "../Runtime/EventManager";
import { DoorStateMachine } from "./DoorStateMachine";
import DataManager from "../Runtime/DataManager";
import { IEntity } from "../Types";
const { ccclass } = _decorator;

@ccclass("DoorManager")
export class DoorManager extends EntityManager {
    async init(params: IEntity) {
        this.fsm = this.addComponent(DoorStateMachine);
        await this.fsm.init();
        await super.init(params);

        EventManager.Instance.on(EVENT_ENUM.DOOR_OPEN, this.onOpen, this);
    }

    onDestroy() {
        EventManager.Instance.off(EVENT_ENUM.DOOR_OPEN, this.onOpen, this);
    }

    onOpen() {
        if (this.state !== ENTITY_STATE_ENUM.DEATH) {
            if (DataManager.Instance.enemies.every(enemy => enemy.state === ENTITY_STATE_ENUM.DEATH)) {
                this.state = ENTITY_STATE_ENUM.DEATH;
            }
        }
    }
}
