import { TILE_TYPE_ENUM } from "../Enum";

export interface ITile {
    src: number | null;
    type: TILE_TYPE_ENUM | null;
}

export interface ILevel {
    mapInfo: Array<Array<ITile>>;
}
