import { _decorator, Component, Sprite, UITransform } from "cc";
import { TILE_HEIGHT, TILE_WIDTH } from "../Const";
import { ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAMS_NAME_ENUM, SPIKE_TYPE_MAP_TOTAL_COUNT_ENUM } from "../Enum";
import { ISpike } from "../Types";
import { randomStringFromLength } from "../Utils";
import { StateMachine } from "../Base/StateMachine";
import { SpikeStateMachine } from "./SpikeStateMachine";
import EventManager from "../Runtime/EventManager";
import DataManager from "../Runtime/DataManager";
const { ccclass } = _decorator;

@ccclass("SpikeManager")
export class SpikeManager extends Component {
    id: string = randomStringFromLength(12);
    x: number = 0;
    y: number = 0;

    fsm: StateMachine;

    private _curCount: number;
    private _totalCount: number;
    private type: ENTITY_TYPE_ENUM;

    get curCount() {
        return this._curCount;
    }

    set curCount(newCount) {
        this._curCount = newCount;
        this.fsm.setParams(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT, newCount);
    }

    get totalCount() {
        return this._totalCount;
    }

    set totalCount(newTotalCount) {
        this._totalCount = newTotalCount;
        this.fsm.setParams(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT, newTotalCount);
    }

    async init(params: ISpike) {
        const spirteComponent = this.node.addComponent(Sprite);
        spirteComponent.sizeMode = Sprite.SizeMode.CUSTOM;

        const transformComponet = this.node.getComponent(UITransform);
        transformComponet?.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4);

        this.fsm = this.addComponent(SpikeStateMachine);
        await this.fsm.init();

        this.x = params.x;
        this.y = params.y;
        this.type = params.type;
        this.totalCount = SPIKE_TYPE_MAP_TOTAL_COUNT_ENUM[this.type];
        this.curCount = params.curCount;

        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onLoop, this);
    }

    update() {
        this.node.setPosition((this.x - 1.5) * TILE_WIDTH, -(this.y - 1.5) * TILE_HEIGHT);
    }

    onDestroy() {
        EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onLoop, this);
    }

    onLoop() {
        if (this.curCount === this.totalCount) {
            this.curCount = 1;
        } else {
            this.curCount++;
        }

        this.onAttack();
    }

    backZero() {
        this.curCount = 0;
    }

    onAttack() {
        if (!DataManager.Instance.player) {
            return;
        }
        const { x: playerX, y: playerY } = DataManager.Instance.player;
        if (this.x === playerX && this.y === playerY && this.curCount === this.totalCount) {
            EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.DEATH);
        }
    }
}
