import { _decorator } from "cc";
import { EnemyManager } from "../Base/EnemyManager";
import { IEntity } from "../Types";
import { IronSkeletonStateMachine } from "./IronSkeletonStateMachine";
const { ccclass } = _decorator;

@ccclass("IronSkeletonManager")
export class IronSkeletonManager extends EnemyManager {
    async init(params: IEntity) {
        this.fsm = this.addComponent(IronSkeletonStateMachine);
        await this.fsm.init();
        await super.init(params);
    }
}
