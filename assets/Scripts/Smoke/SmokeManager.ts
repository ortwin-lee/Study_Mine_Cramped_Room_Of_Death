import { _decorator } from "cc";
import { IEntity } from "../Types";
import { EntityManager } from "../Base/EntityManager";
import { SmokeStateMachine } from "./SmokeStateMachine";
const { ccclass } = _decorator;

@ccclass("SmokeManager")
export class SmokeManager extends EntityManager {
    async init(params: IEntity) {
        this.fsm = this.addComponent(SmokeStateMachine);
        await this.fsm.init();
        await super.init(params);
    }
}
