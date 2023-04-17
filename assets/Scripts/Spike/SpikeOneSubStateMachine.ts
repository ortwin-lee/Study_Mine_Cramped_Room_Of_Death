import State from "../Base/State";
import { StateMachine } from "../Base/StateMachine";
import { SPIKE_COUNT_ENUM } from "../Enum";
import SpikeSubStateMachine from "./SpikeSubStateMachine";

const PREFIX_URL = "texture/spikes";
const BASE_URL = "spikesone";

export default class SpikeOneSubStateMachine extends SpikeSubStateMachine {
    constructor(fsm: StateMachine) {
        super(fsm);
        this.stateMachines.set(SPIKE_COUNT_ENUM.ZERO, new State(fsm, `${PREFIX_URL}/${BASE_URL}/zero/zero`));
        this.stateMachines.set(SPIKE_COUNT_ENUM.ONE, new State(fsm, `${PREFIX_URL}/${BASE_URL}/one/one`));
        this.stateMachines.set(SPIKE_COUNT_ENUM.TWO, new State(fsm, `${PREFIX_URL}/${BASE_URL}/two/two`));
    }
}
