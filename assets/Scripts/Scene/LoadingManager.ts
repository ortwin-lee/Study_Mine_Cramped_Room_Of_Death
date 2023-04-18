import { _decorator, Component, director, ProgressBar, resources } from "cc";
import { SCENE_ENUM } from "../Enum";
const { ccclass, property } = _decorator;

@ccclass("LoadingManager")
export class LoadingManager extends Component {
    @property(ProgressBar)
    bar: ProgressBar = null;

    onLoad() {
        resources.preloadDir(
            "texture",
            (finished, total) => {
                this.bar.progress = finished / total;
            },
            () => {
                director.loadScene(SCENE_ENUM.Start);
            },
        );
    }
}
