import { AnimationClip } from "cc";
import State from "../Base/State";
import { StateMachine } from "../Base/StateMachine";
import { DIRECTION_ENUM } from "../Enum";
import DirectionSubStateMachine from "../Base/DirectionSubStateMachine";
import { ANIMATION_SPEED } from "../Const";

const PREFIX_URL = "texture/smoke";
const BASE_URL = "idle";

export default class IdleSubStateMachine extends DirectionSubStateMachine {
    constructor(fsm: StateMachine) {
        super(fsm);
        this.stateMachines.set(
            DIRECTION_ENUM.TOP,
            new State(fsm, `${PREFIX_URL}/${BASE_URL}/top/${BASE_URL}`, AnimationClip.WrapMode.Normal, ANIMATION_SPEED / 1.5),
        );
        this.stateMachines.set(
            DIRECTION_ENUM.BOTTOM,
            new State(fsm, `${PREFIX_URL}/${BASE_URL}/bottom/${BASE_URL}`, AnimationClip.WrapMode.Normal, ANIMATION_SPEED / 1.5),
        );
        this.stateMachines.set(
            DIRECTION_ENUM.LEFT,
            new State(fsm, `${PREFIX_URL}/${BASE_URL}/left/${BASE_URL}`, AnimationClip.WrapMode.Normal, ANIMATION_SPEED / 1.5),
        );
        this.stateMachines.set(
            DIRECTION_ENUM.RIGHT,
            new State(fsm, `${PREFIX_URL}/${BASE_URL}/right/${BASE_URL}`, AnimationClip.WrapMode.Normal, ANIMATION_SPEED / 1.5),
        );
    }
}
