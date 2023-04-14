import DirectionSubStateMachine from "../Base/DirectionSubStateMachine";
import State from "../Base/State";
import { StateMachine } from "../Base/StateMachine";
import { DIRECTION_ENUM } from "../Enum";

const PREFIX_URL = "texture/player";
const BASE_URL = "blockback";

export default class BlockBackSubStateMachine extends DirectionSubStateMachine {
    constructor(fsm: StateMachine) {
        super(fsm);
        this.stateMachines.set(DIRECTION_ENUM.TOP, new State(fsm, `${PREFIX_URL}/${BASE_URL}/top/${BASE_URL}`));
        this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new State(fsm, `${PREFIX_URL}/${BASE_URL}/bottom/${BASE_URL}`));
        this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(fsm, `${PREFIX_URL}/${BASE_URL}/left/${BASE_URL}`));
        this.stateMachines.set(DIRECTION_ENUM.RIGHT, new State(fsm, `${PREFIX_URL}/${BASE_URL}/right/${BASE_URL}`));
    }
}
