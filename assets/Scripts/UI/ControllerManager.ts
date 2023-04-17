import { _decorator, Component, Event } from "cc";
import EventManager from "../Runtime/EventManager";
import { CONTROLLER_ENUM, EVENT_ENUM } from "../Enum";
import DataManager from "../Runtime/DataManager";
const { ccclass } = _decorator;

@ccclass("ControllerManager")
export class ControllerManager extends Component {
    handleCtrl(event: Event, type: string) {
        EventManager.Instance.emit(EVENT_ENUM.PLAYER_CTRL, type as CONTROLLER_ENUM);
    }
}
