import { _decorator, Animation } from "cc";
import { ENTITY_TYPE_ENUM, PARAMS_NAME_ENUM, SPIKE_TYPE_MAP_TOTAL_COUNT_ENUM } from "../Enum";
import { StateMachine, getInitParamsNumber } from "../Base/StateMachine";
import SpikeOneSubStateMachine from "./SpikeOneSubStateMachine";
import SpikeTwoSubStateMachine from "./SpikeTwoSubStateMachine";
import SpikeThreeSubStateMachine from "./SpikeThreeSubStateMachine";
import SpikeFourSubStateMachine from "./SpikeFourSubStateMachine";
import { SpikeManager } from "./SpikeManager";
const { ccclass } = _decorator;

@ccclass("SpikeStateMachine")
export class SpikeStateMachine extends StateMachine {
    async init() {
        this.animationComponent = this.node.addComponent(Animation);

        this.initParams();
        this.initStateMachines();
        this.initAnimationEvent();

        await Promise.all(this.waitingList);
    }

    initParams() {
        this.params.set(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT, getInitParamsNumber());
        this.params.set(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT, getInitParamsNumber());
    }

    initStateMachines() {
        this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKE_ONE, new SpikeOneSubStateMachine(this));
        this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKE_TWO, new SpikeTwoSubStateMachine(this));
        this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKE_THREE, new SpikeThreeSubStateMachine(this));
        this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKE_FOUR, new SpikeFourSubStateMachine(this));
    }

    initAnimationEvent() {
        this.animationComponent.on(Animation.EventType.FINISHED, () => {
            const name = this.animationComponent.defaultClip.name;
            const value = this.getParams(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT);
            if (
                (value === SPIKE_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKE_ONE && name.includes("spikesone/two")) ||
                (value === SPIKE_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKE_TWO && name.includes("spikestwo/three")) ||
                (value === SPIKE_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKE_THREE && name.includes("spikesthree/four")) ||
                (value === SPIKE_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKE_FOUR && name.includes("spikesfour/five"))
            ) {
                this.node.getComponent(SpikeManager).backZero();
            }

            // const whiteList = ["attack"];
            // if (whiteList.some(v => name.includes(v))) {
            //     this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.IDLE;
            // }
        });
    }

    run() {
        const value = this.getParams(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT);
        switch (this.currentState) {
            case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKE_ONE):
            case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKE_TWO):
            case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKE_THREE):
            case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKE_FOUR):
                if (value === SPIKE_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKE_ONE) {
                    this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKE_ONE);
                }
                if (value === SPIKE_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKE_TWO) {
                    this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKE_TWO);
                }
                if (value === SPIKE_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKE_THREE) {
                    this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKE_THREE);
                }
                if (value === SPIKE_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKE_FOUR) {
                    this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKE_FOUR);
                } else {
                    this.currentState = this.currentState;
                }
                break;
            default:
                this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKE_ONE);
        }
    }
}
