import DirectionSubStateMachine from "../Base/DirectionSubStateMachine";
import State from "../Base/State";
import { StateMachine } from "../Base/StateMachine";
import { DIRECTION_ENUM } from "../Enum";

const PREFIX_URL = "texture/door";
const BASE_URL = "death";

export default class DeathSubStateMachine extends DirectionSubStateMachine {
    constructor(fsm: StateMachine) {
        super(fsm);
        this.stateMachines.set(DIRECTION_ENUM.TOP, new State(fsm, `${PREFIX_URL}/${BASE_URL}/${BASE_URL}`));
        this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new State(fsm, `${PREFIX_URL}/${BASE_URL}/${BASE_URL}`));
        this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(fsm, `${PREFIX_URL}/${BASE_URL}/${BASE_URL}`));
        this.stateMachines.set(DIRECTION_ENUM.RIGHT, new State(fsm, `${PREFIX_URL}/${BASE_URL}/${BASE_URL}`));
    }
}
