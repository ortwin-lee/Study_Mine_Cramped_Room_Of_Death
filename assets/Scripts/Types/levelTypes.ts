import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, TILE_TYPE_ENUM } from "../Enum";

export interface ITile {
    src: number | null;
    type: TILE_TYPE_ENUM | null;
}

export interface ILevel {
    mapInfo: Array<Array<ITile>>;
}

export interface IEntity {
    x: number;
    y: number;
    type: ENTITY_TYPE_ENUM;
    state: ENTITY_STATE_ENUM;
    direction: DIRECTION_ENUM;
}
