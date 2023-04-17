import { SubStateMachine } from "../Base/SubStateMachine";
import { PARAMS_NAME_ENUM, SPIKE_COUNT_MAP_NUMBER_NUM } from "../Enum";

export default class SpikeSubStateMachine extends SubStateMachine {
    run() {
        const value = this.fsm.getParams(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT);
        this.currentState = this.stateMachines.get(SPIKE_COUNT_MAP_NUMBER_NUM[value as number]);
    }
}
