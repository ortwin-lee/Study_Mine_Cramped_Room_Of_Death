import { AnimationClip } from "cc";
import DirectionSubStateMachine from "../Base/DirectionSubStateMachine";
import State from "../Base/State";
import { StateMachine } from "../Base/StateMachine";
import { DIRECTION_ENUM, SHAKE_TYPE_ENUM } from "../Enum";
import { ANIMATION_SPEED } from "../Const";

const PREFIX_URL = "texture/player";
const BASE_URL = "attack";

export default class AttackSubStateMachine extends DirectionSubStateMachine {
    constructor(fsm: StateMachine) {
        super(fsm);
        this.stateMachines.set(
            DIRECTION_ENUM.TOP,
            new State(fsm, `${PREFIX_URL}/${BASE_URL}/top/${BASE_URL}`, AnimationClip.WrapMode.Normal, ANIMATION_SPEED, [
                { frame: ANIMATION_SPEED * 4, func: "onAttackShake", params: [SHAKE_TYPE_ENUM.TOP] },
            ]),
        );
        this.stateMachines.set(
            DIRECTION_ENUM.BOTTOM,
            new State(fsm, `${PREFIX_URL}/${BASE_URL}/bottom/${BASE_URL}`, AnimationClip.WrapMode.Normal, ANIMATION_SPEED, [
                { frame: ANIMATION_SPEED * 4, func: "onAttackShake", params: [SHAKE_TYPE_ENUM.BOTTOM] },
            ]),
        );
        this.stateMachines.set(
            DIRECTION_ENUM.LEFT,
            new State(fsm, `${PREFIX_URL}/${BASE_URL}/left/${BASE_URL}`, AnimationClip.WrapMode.Normal, ANIMATION_SPEED, [
                { frame: ANIMATION_SPEED * 4, func: "onAttackShake", params: [SHAKE_TYPE_ENUM.LEFT] },
            ]),
        );
        this.stateMachines.set(
            DIRECTION_ENUM.RIGHT,
            new State(fsm, `${PREFIX_URL}/${BASE_URL}/right/${BASE_URL}`, AnimationClip.WrapMode.Normal, ANIMATION_SPEED, [
                { frame: ANIMATION_SPEED * 4, func: "onAttackShake", params: [SHAKE_TYPE_ENUM.RIGHT] },
            ]),
        );
    }
}
