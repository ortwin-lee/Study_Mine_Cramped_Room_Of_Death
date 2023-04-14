import { _decorator, Animation } from "cc";
import { PARAMS_NAME_ENUM } from "../Enum";
import { StateMachine, getInitParamsNumber, getInitParamsTrigger } from "../Base/StateMachine";
import IdleSubStateMachine from "./IdleSubStateMachine";
const { ccclass } = _decorator;

@ccclass("WoodenSkeletonStateMachine")
export class WoodenSkeletonStateMachine extends StateMachine {
    async init() {
        this.animationComponent = this.node.addComponent(Animation);

        this.initParams();
        this.initStateMachines();
        this.initAnimationEvent();

        await Promise.all(this.waitingList);
    }

    initParams() {
        this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger());
        this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber());
    }

    initStateMachines() {
        this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new IdleSubStateMachine(this));
    }

    initAnimationEvent() {
        this.animationComponent.on(Animation.EventType.FINISHED, () => {
            // const name = this.animationComponent.defaultClip.name;
            // const whiteList = ["block", "turn"];
            // if (whiteList.some(v => name.includes(v))) {
            //     this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.IDLE;
            // }
        });
    }

    run() {
        switch (this.currentState) {
            case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
                if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE);
                } else {
                    this.currentState = this.currentState;
                }
                break;
            default:
                this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE);
        }
    }
}
