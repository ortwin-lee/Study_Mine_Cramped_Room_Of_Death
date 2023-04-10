import { _decorator, Component } from "cc";
import EventManager from "../Runtime/EventManager";
import { EVENT_ENUM } from "../Enum";
const { ccclass } = _decorator;

@ccclass("ControllerManager")
export class ControllerManager extends Component {
    handleCtrl() {
        EventManager.Instance.emit(EVENT_ENUM.NEXT_LEVEL);
    }
}
