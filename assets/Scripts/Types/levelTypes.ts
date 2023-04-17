import { TILE_TYPE_ENUM } from "../Enum";
import { IEntity, ISpike } from "./entityType";

export interface ITile {
    src: number | null;
    type: TILE_TYPE_ENUM | null;
}

export interface ILevel {
    mapInfo: Array<Array<ITile>>;
    player: IEntity;
    enemies: Array<IEntity>;
    spikes: Array<ISpike>;
    bursts: Array<IEntity>;
    door: IEntity;
}
