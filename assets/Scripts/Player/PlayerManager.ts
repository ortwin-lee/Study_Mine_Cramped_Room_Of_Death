import { _decorator, Component, Sprite, UITransform } from "cc";
import { TILE_HEIGHT, TILE_WIDTH } from "../Const";
import {
    CONTROLLER_ENUM,
    DIRECTION_ENUM,
    DIRECTION_ORDER_ENUM,
    ENTITY_STATE_ENUM,
    EVENT_ENUM,
    PARAMS_NAME_ENUM,
} from "../Enum";
import EventManager from "../Runtime/EventManager";
import { PlayerStateMachine } from "./PlayerStateMachine";
const { ccclass } = _decorator;

@ccclass("PlayerManager")
export class PlayerManager extends Component {
    x: number = 0;
    y: number = 0;
    targetX: number = 0;
    targetY: number = 0;
    private readonly speed = 1 / 10;

    fsm: PlayerStateMachine;

    private _direction: DIRECTION_ENUM;
    private _state: ENTITY_STATE_ENUM;

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

    async init() {
        const spirteComponent = this.node.addComponent(Sprite);
        spirteComponent.sizeMode = Sprite.SizeMode.CUSTOM;

        const transformComponet = this.node.getComponent(UITransform);
        transformComponet?.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4);

        this.fsm = this.addComponent(PlayerStateMachine);
        await this.fsm.init();
        this.fsm.setParams(PARAMS_NAME_ENUM.IDLE, true);
        this.state = ENTITY_STATE_ENUM.IDLE;
        this.direction = DIRECTION_ENUM.TOP;

        EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL, this.move, this);
    }

    update() {
        this.updateXY();
        this.node.setPosition((this.x - 1.5) * TILE_WIDTH, -(this.y - 1.5) * TILE_HEIGHT);
    }

    onDestroy() {
        EventManager.Instance.off(EVENT_ENUM.PLAYER_CTRL, this.move, this);
    }

    updateXY() {
        if (this.targetX < this.x) {
            this.x -= this.speed;
        } else if (this.targetX > this.x) {
            this.x += this.speed;
        }

        if (this.targetY < this.y) {
            this.y -= this.speed;
        } else if (this.targetY > this.y) {
            this.y += this.speed;
        }

        if (Math.abs(this.targetX - this.x) <= 0.1 && Math.abs(this.targetY - this.y) <= 0.1) {
            this.x = this.targetX;
            this.y = this.targetY;
        }
    }

    move(inputDirection: CONTROLLER_ENUM) {
        switch (inputDirection) {
            case CONTROLLER_ENUM.TOP:
                this.targetY -= 1;
                break;
            case CONTROLLER_ENUM.BOTTOM:
                this.targetY += 1;
                break;
            case CONTROLLER_ENUM.LEFT:
                this.targetX -= 1;
                break;
            case CONTROLLER_ENUM.RIGHT:
                this.targetX += 1;
                break;
            case CONTROLLER_ENUM.TURNLEFT:
                if (this.direction === DIRECTION_ENUM.TOP) {
                    this.direction = DIRECTION_ENUM.LEFT;
                } else if (this.direction === DIRECTION_ENUM.LEFT) {
                    this.direction = DIRECTION_ENUM.BOTTOM;
                } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
                    this.direction = DIRECTION_ENUM.RIGHT;
                } else if (this.direction === DIRECTION_ENUM.RIGHT) {
                    this.direction = DIRECTION_ENUM.TOP;
                }
                this.state = ENTITY_STATE_ENUM.TURNLEFT;
        }
    }
}
