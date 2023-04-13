import DirectionSubStateMachine from "../Base/DirectionSubStateMachine";
import State from "../Base/State";
import { StateMachine } from "../Base/StateMachine";
import { DIRECTION_ENUM } from "../Enum";

const BASE_URL = "texture/player/turnleft";

export default class TurnLeftSubStateMachine extends DirectionSubStateMachine {
    constructor(fsm: StateMachine) {
        super(fsm);
        this.stateMachines.set(DIRECTION_ENUM.TOP, new State(fsm, `${BASE_URL}/top/turnleft`));
        this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new State(fsm, `${BASE_URL}/bottom/turnleft`));
        this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(fsm, `${BASE_URL}/left/turnleft`));
        this.stateMachines.set(DIRECTION_ENUM.RIGHT, new State(fsm, `${BASE_URL}/right/turnleft`));
    }
}
