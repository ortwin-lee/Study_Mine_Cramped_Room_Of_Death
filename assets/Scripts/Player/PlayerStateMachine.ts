import { _decorator, Animation } from "cc";
import { ENTITY_STATE_ENUM, PARAMS_NAME_ENUM } from "../Enum";
import { StateMachine, getInitParamsNumber, getInitParamsTrigger } from "../Base/StateMachine";
import IdleSubStateMachine from "./IdleSubStateMachine";
import TurnLeftSubStateMachine from "./TurnLeftSubStateMachine";
import TurnRightSubStateMachine from "./TurnRightSubStateMachine";
import BlockFrontSubStateMachine from "./BlockFrontSubStateMachine";
import { EntityManager } from "../Base/EntityManager";
import BlockLeftSubStateMachine from "./BlockLeftSubStateMachine";
import BlockRightSubStateMachine from "./BlockRightSubStateMachine";
import BlockBackSubStateMachine from "./BlockBackSubStateMachine";
import BlockTurnLeftSubStateMachine from "./BlockTurnLeftSubStateMachine";
import BlockTurnRightSubStateMachine from "./BlockTurnRightSubStateMachine";
import DeathSubStateMachine from "./DeathSubStateMachine";
import AttackSubStateMachine from "./AttackSubStateMachine";
import AirDeathSubStateMachine from "./AirDeathSubStateMachine";
const { ccclass } = _decorator;

@ccclass("PlayerStateMachine")
export class PlayerStateMachine extends StateMachine {
    async init() {
        this.animationComponent = this.node.addComponent(Animation);

        this.initParams();
        this.initStateMachines();
        this.initAnimationEvent();

        await Promise.all(this.waitingList);
    }

    initParams() {
        this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger());
        this.params.set(PARAMS_NAME_ENUM.ATTACK, getInitParamsTrigger());
        this.params.set(PARAMS_NAME_ENUM.DEATH, getInitParamsTrigger());
        this.params.set(PARAMS_NAME_ENUM.AIRDEATH, getInitParamsTrigger());
        this.params.set(PARAMS_NAME_ENUM.TURNLEFT, getInitParamsTrigger());
        this.params.set(PARAMS_NAME_ENUM.TURNRIGHT, getInitParamsTrigger());
        this.params.set(PARAMS_NAME_ENUM.BLOCKFRONT, getInitParamsTrigger());
        this.params.set(PARAMS_NAME_ENUM.BLOCKLEFT, getInitParamsTrigger());
        this.params.set(PARAMS_NAME_ENUM.BLOCKRIGHT, getInitParamsTrigger());
        this.params.set(PARAMS_NAME_ENUM.BLOCKBACK, getInitParamsTrigger());
        this.params.set(PARAMS_NAME_ENUM.BLOCKTURNLEFT, getInitParamsTrigger());
        this.params.set(PARAMS_NAME_ENUM.BLOCKTURNRIGHT, getInitParamsTrigger());
        this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber());
    }

    initStateMachines() {
        this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new IdleSubStateMachine(this));
        this.stateMachines.set(PARAMS_NAME_ENUM.ATTACK, new AttackSubStateMachine(this));
        this.stateMachines.set(PARAMS_NAME_ENUM.DEATH, new DeathSubStateMachine(this));
        this.stateMachines.set(PARAMS_NAME_ENUM.AIRDEATH, new AirDeathSubStateMachine(this));
        this.stateMachines.set(PARAMS_NAME_ENUM.TURNLEFT, new TurnLeftSubStateMachine(this));
        this.stateMachines.set(PARAMS_NAME_ENUM.TURNRIGHT, new TurnRightSubStateMachine(this));
        this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKFRONT, new BlockFrontSubStateMachine(this));
        this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKLEFT, new BlockLeftSubStateMachine(this));
        this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKRIGHT, new BlockRightSubStateMachine(this));
        this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKBACK, new BlockBackSubStateMachine(this));
        this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKTURNLEFT, new BlockTurnLeftSubStateMachine(this));
        this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKTURNRIGHT, new BlockTurnRightSubStateMachine(this));
    }

    initAnimationEvent() {
        this.animationComponent.on(Animation.EventType.FINISHED, () => {
            const name = this.animationComponent.defaultClip.name;
            const whiteList = ["block", "turn", "attack"];
            if (whiteList.some(v => name.includes(v))) {
                this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.IDLE;
            }
        });
    }

    run() {
        switch (this.currentState) {
            case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
            case this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK):
            case this.stateMachines.get(PARAMS_NAME_ENUM.DEATH):
            case this.stateMachines.get(PARAMS_NAME_ENUM.AIRDEATH):
            case this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT):
            case this.stateMachines.get(PARAMS_NAME_ENUM.TURNRIGHT):
            case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKFRONT):
            case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKLEFT):
            case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKRIGHT):
            case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKBACK):
            case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT):
            case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKTURNRIGHT):
                if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE);
                } else if (this.params.get(PARAMS_NAME_ENUM.ATTACK).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK);
                } else if (this.params.get(PARAMS_NAME_ENUM.DEATH).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.DEATH);
                } else if (this.params.get(PARAMS_NAME_ENUM.AIRDEATH).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.AIRDEATH);
                } else if (this.params.get(PARAMS_NAME_ENUM.TURNLEFT).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT);
                } else if (this.params.get(PARAMS_NAME_ENUM.TURNRIGHT).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURNRIGHT);
                } else if (this.params.get(PARAMS_NAME_ENUM.BLOCKFRONT).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKFRONT);
                } else if (this.params.get(PARAMS_NAME_ENUM.BLOCKLEFT).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKLEFT);
                } else if (this.params.get(PARAMS_NAME_ENUM.BLOCKRIGHT).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKRIGHT);
                } else if (this.params.get(PARAMS_NAME_ENUM.BLOCKBACK).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKBACK);
                } else if (this.params.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT);
                } else if (this.params.get(PARAMS_NAME_ENUM.BLOCKTURNRIGHT).value) {
                    this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKTURNRIGHT);
                } else {
                    this.currentState = this.currentState;
                }
                break;
            default:
                this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE);
        }
    }
}
