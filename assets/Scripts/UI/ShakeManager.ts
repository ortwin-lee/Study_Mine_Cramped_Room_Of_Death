import { _decorator, Component, game } from "cc";
import EventManager from "../Runtime/EventManager";
import { EVENT_ENUM, SHAKE_TYPE_ENUM } from "../Enum";
import { IPos } from "../Types";
import { IDIRECTION } from "../Const";
const { ccclass } = _decorator;

@ccclass("ShakeManager")
export class ShakeManager extends Component {
    private isShaking = false;
    private oldTime: number = 0;
    private oldPos: IPos = { x: 0, y: 0 };
    private type: SHAKE_TYPE_ENUM;

    onLoad() {
        EventManager.Instance.on(EVENT_ENUM.SCREEN_SHAKE, this.onShake, this);
    }

    onDestroy() {
        EventManager.Instance.off(EVENT_ENUM.SCREEN_SHAKE, this.onShake, this);
    }

    update() {
        if (this.isShaking) {
            const duration = 500;
            const amount = 1.6;
            const frequency = 12;
            const curTime = (game.totalTime - this.oldTime) / 1000;
            const totalTime = duration / 1000;
            const offset = amount * Math.sin(frequency * Math.PI * curTime);
            const { x: directionX, y: directionY } = IDIRECTION[this.type];
            this.node.setPosition(this.oldPos.x + offset * directionX, this.oldPos.y + offset * directionY);

            if (curTime > totalTime) {
                this.isShaking = false;
                this.node.setPosition(this.oldPos.x, this.oldPos.y);
            }
        }
    }

    onShake(type: SHAKE_TYPE_ENUM) {
        if (this.isShaking) {
            return;
        }
        this.type = type;
        this.oldTime = game.totalTime;
        this.isShaking = true;
        this.oldPos.x = this.node.position.x;
        this.oldPos.y = this.node.position.y;
    }

    stop() {
        this.isShaking = false;
    }
}
