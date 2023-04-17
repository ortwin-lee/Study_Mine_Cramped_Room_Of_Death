import Singleton from "../Base/Singleton";
import { DoorManager } from "../Door/DoorManager";
import { PlayerManager } from "../Player/PlayerManager";
import { TileManager } from "../Tile/TileManager";
import { ITile } from "../Types";
import { WoodenSkeletonManager } from "../WoodenSkeleton/WoodenSkeletonManager";

export default class DataManager extends Singleton {
    static get Instance() {
        return super.GetInstance<DataManager>();
    }

    mapInfo: Array<Array<ITile>>;
    mapRowCount: number;
    mapColumnCount: number;
    levelIndex: number = 1;
    tileInfo: Array<Array<TileManager>>;
    door: DoorManager;
    player: PlayerManager;
    enemies: WoodenSkeletonManager[];

    reset() {
        this.mapInfo = [];
        this.mapRowCount = 0;
        this.mapColumnCount = 0;
        this.tileInfo = [];
        this.player = null;
        this.enemies = [];
    }
}
