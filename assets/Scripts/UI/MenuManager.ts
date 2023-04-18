import { _decorator, Component } from "cc";
import EventManager from "../Runtime/EventManager";
import { EVENT_ENUM } from "../Enum";
const { ccclass } = _decorator;

@ccclass("MenuManager")
export class MenuManager extends Component {
    handleUndo() {
        EventManager.Instance.emit(EVENT_ENUM.REVOKE_STEP);
    }

    handleRestart() {
        EventManager.Instance.emit(EVENT_ENUM.RESTART_LEVEL);
    }

    handleOut() {
        EventManager.Instance.emit(EVENT_ENUM.OUT_BATTLE);
    }
}
