import Singleton from "../Base/Singleton";
import { ITile } from "../Types/levelTypes";

export default class DataManager extends Singleton {
    static get Instance() {
        return super.GetInstance<DataManager>();
    }

    mapInfo: Array<Array<ITile>>;
    mapRowCount: number;
    mapColumnCount: number;
    levelIndex: number = 1;

    reset() {
        this.mapInfo = [];
        this.mapRowCount = 0;
        this.mapColumnCount = 0;
    }
}
