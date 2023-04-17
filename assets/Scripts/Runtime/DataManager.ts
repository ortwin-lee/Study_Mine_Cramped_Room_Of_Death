import { EnemyManager } from "../Base/EnemyManager";
import Singleton from "../Base/Singleton";
import { BurstManager } from "../Burst/BurstManager";
import { DoorManager } from "../Door/DoorManager";
import { PlayerManager } from "../Player/PlayerManager";
import { TileManager } from "../Tile/TileManager";
import { ITile } from "../Types";
import { SpikeManager } from "../Spike/SpikeManager";

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
    enemies: EnemyManager[];
    bursts: BurstManager[];
    spikes: SpikeManager[];

    reset() {
        this.mapInfo = [];
        this.mapRowCount = 0;
        this.mapColumnCount = 0;
        this.tileInfo = [];
        this.player = null;
        this.enemies = [];
        this.bursts = [];
        this.spikes = [];
    }
}
