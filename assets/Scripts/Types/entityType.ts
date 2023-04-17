import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM } from "../Enum";

export interface IEntity {
    x: number;
    y: number;
    type: ENTITY_TYPE_ENUM;
    state: ENTITY_STATE_ENUM;
    direction: DIRECTION_ENUM;
}

export interface ISpike {
    x: number;
    y: number;
    type: ENTITY_TYPE_ENUM;
    curCount: number;
}

export interface IPos {
    x: number;
    y: number;
}
