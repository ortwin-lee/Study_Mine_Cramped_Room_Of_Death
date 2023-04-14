import { TILE_TYPE_ENUM } from "../Enum";
import { IPos } from "../Types";

export const TILE_WIDTH = 55;
export const TILE_HEIGHT = 55;
export const ANIMATION_SPEED = 1 / 8;

export const ITILEWALL: Array<TILE_TYPE_ENUM> = [
    TILE_TYPE_ENUM.WALL_ROW,
    TILE_TYPE_ENUM.WALL_COLUMN,
    TILE_TYPE_ENUM.WALL_LEFT_TOP,
    TILE_TYPE_ENUM.WALL_LEFT_BOTTOM,
    TILE_TYPE_ENUM.WALL_RIGHT_TOP,
    TILE_TYPE_ENUM.WALL_RIGHT_BOTTOM,
];

export const ITILECLIFF: Array<TILE_TYPE_ENUM> = [TILE_TYPE_ENUM.CLIFF_LEFT, TILE_TYPE_ENUM.CLIFF_CENTER, TILE_TYPE_ENUM.CLIFF_RIGHT];

export const ITILEFLOOR: Array<TILE_TYPE_ENUM> = [TILE_TYPE_ENUM.FLOOR];

export const IDIRECTION = {
    TOP: { x: 0, y: 1 },
    BOTTOM: { x: 0, y: -1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 },
};

export const IROTATION = {
    TURNLEFT: 1,
    TURNRIGHT: -1,
};
