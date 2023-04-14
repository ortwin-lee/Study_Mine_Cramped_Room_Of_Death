import Singleton from "../Base/Singleton";
import { TileManager } from "../Tile/TileManager";
import { ITile } from "../Types";

export default class DataManager extends Singleton {
    static get Instance() {
        return super.GetInstance<DataManager>();
    }

    mapInfo: Array<Array<ITile>>;
    mapRowCount: number;
    mapColumnCount: number;
    levelIndex: number = 1;
    tileInfo: Array<Array<TileManager>>;

    reset() {
        this.mapInfo = [];
        this.mapRowCount = 0;
        this.mapColumnCount = 0;
    }
}
