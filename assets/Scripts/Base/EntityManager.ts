import { _decorator, Component, Sprite, UITransform } from "cc";
import { TILE_HEIGHT, TILE_WIDTH } from "../Const";
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, PARAMS_NAME_ENUM } from "../Enum";
import { PlayerStateMachine } from "../Player/PlayerStateMachine";
import { IEntity } from "../Types";
const { ccclass } = _decorator;

@ccclass("EntityManager")
export class EntityManager extends Component {
    x: number = 0;
    y: number = 0;

    fsm: PlayerStateMachine;

    private _direction: DIRECTION_ENUM;
    private _state: ENTITY_STATE_ENUM;
    private type: ENTITY_TYPE_ENUM;

    get direction() {
        return this._direction;
    }

    set direction(newDirection) {
        this._direction = newDirection;
        this.fsm.setParams(PARAMS_NAME_ENUM.DIRECTION, DIRECTION_ORDER_ENUM[this._direction]);
    }

    get state() {
        return this._state;
    }

    set state(newState) {
        this._state = newState;
        this.fsm.setParams(this._state, true);
    }

    async init(params: IEntity) {
        const spirteComponent = this.node.addComponent(Sprite);
        spirteComponent.sizeMode = Sprite.SizeMode.CUSTOM;

        const transformComponet = this.node.getComponent(UITransform);
        transformComponet?.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4);

        this.x = params.x;
        this.y = params.y;
        this.state = params.state;
        this.direction = params.direction;
        this.type = params.type;
    }

    update() {
        this.node.setPosition((this.x - 1.5) * TILE_WIDTH, -(this.y - 1.5) * TILE_HEIGHT);
    }
}
