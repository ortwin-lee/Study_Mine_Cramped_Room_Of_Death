import { ITile } from "../Types/levelTypes";

class DataManager {
    mapInfo: Array<Array<ITile>>;
    mapRowCount: number;
    mapColumnCount: number;
}

export const DataManagerInstance = new DataManager();
