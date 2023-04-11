import { _decorator, Component, Animation, Asset } from "cc";
import { FSM_PARAMS_TYPE_ENUM } from "../Enum";

import State from "./State";
import { SubStateMachine } from "./SubStateMachine";

const { ccclass } = _decorator;

type ParamsVlaueType = boolean | number;

interface IParamsValue {
    type: FSM_PARAMS_TYPE_ENUM;
    value: ParamsVlaueType;
}

export const getInitParamsTrigger = () => {
    return {
        type: FSM_PARAMS_TYPE_ENUM.TRIGGER,
        value: false,
    };
};

export const getInitParamsNumber = () => {
    return {
        type: FSM_PARAMS_TYPE_ENUM.NUMBER,
        value: 0,
    };
};

@ccclass("StateMachine")
export abstract class StateMachine extends Component {
    private _currentState: State | SubStateMachine = null;
    params: Map<string, IParamsValue> = new Map();
    stateMachines: Map<string, State | SubStateMachine> = new Map();
    animationComponent: Animation;
    waitingList: Array<Promise<Asset>> = [];

    abstract init(): void;
    abstract run(): void;

    getParams(paramsName: string) {
        if (this.params.has(paramsName)) {
            return this.params.get(paramsName).value;
        }
    }

    setParams(paramsName: string, value: ParamsVlaueType) {
        if (this.params.has(paramsName)) {
            this.params.get(paramsName).value = value;
            this.run();
            this.resetTrigger();
        }
    }

    get currentState() {
        return this._currentState;
    }

    set currentState(newState: State | SubStateMachine) {
        this._currentState = newState;
        this._currentState.run();
    }

    resetTrigger() {
        for (const [_, value] of this.params) {
            if (value.type === FSM_PARAMS_TYPE_ENUM.TRIGGER) {
                value.value = false;
            }
        }
    }
}
