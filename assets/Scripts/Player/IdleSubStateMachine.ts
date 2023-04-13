import { AnimationClip } from "cc";
import State from "../Base/State";
import { StateMachine } from "../Base/StateMachine";
import { DIRECTION_ENUM } from "../Enum";
import DirectionSubStateMachine from "../Base/DirectionSubStateMachine";

const BASE_URL = "texture/player/idle";

export default class IdleSubStateMachine extends DirectionSubStateMachine {
    constructor(fsm: StateMachine) {
        super(fsm);
        this.stateMachines.set(DIRECTION_ENUM.TOP, new State(fsm, `${BASE_URL}/top/idle`, AnimationClip.WrapMode.Loop));
        this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new State(fsm, `${BASE_URL}/bottom/idle`, AnimationClip.WrapMode.Loop));
        this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(fsm, `${BASE_URL}/left/idle`, AnimationClip.WrapMode.Loop));
        this.stateMachines.set(DIRECTION_ENUM.RIGHT, new State(fsm, `${BASE_URL}/right/idle`, AnimationClip.WrapMode.Loop));
    }
}
