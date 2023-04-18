export enum CONTROLLER_ENUM {
    TOP = "TOP",
    BOTTOM = "BOTTOM",
    LEFT = "LEFT",
    RIGHT = "RIGHT",
    TURNLEFT = "TURNLEFT",
    TURNRIGHT = "TURNRIGHT",
}

export enum DIRECTION_ENUM {
    TOP = "TOP",
    BOTTOM = "BOTTOM",
    LEFT = "LEFT",
    RIGHT = "RIGHT",
}

export enum ENTITY_STATE_ENUM {
    IDLE = "IDLE",
    ATTACK = "ATTACK",
    TURNLEFT = "TURNLEFT",
    TURNRIGHT = "TURNRIGHT",
    BLOCKFRONT = "BLOCKFRONT",
    BLOCKLEFT = "BLOCKLEFT",
    BLOCKRIGHT = "BLOCKRIGHT",
    BLOCKBACK = "BLOCKBACK",
    BLOCKTURNLEFT = "BLOCKTURNLEFT",
    BLOCKTURNRIGHT = "BLOCKTURNRIGHT",
    DEATH = "DEATH",
    AIRDEATH = "AIRDEATH",
}

export enum DIRECTION_ORDER_ENUM {
    RIGHT = 0,
    TOP = 1,
    LEFT = 2,
    BOTTOM = 3,
    TURNLEFT = -1,
    TURNRIGHT = -2,
}

export enum ENTITY_TYPE_ENUM {
    PLAYER = "PLAYER",
    SKELETON_WOODEN = "SKELETON_WOODEN",
    SKELETON_IRON = "SKELETON_IRON",
    DOOR = "DOOR",
    BURST = "BURST",
    SPIKE_ONE = "SPIKE_ONE",
    SPIKE_TWO = "SPIKE_TWO",
    SPIKE_THREE = "SPIKE_THREE",
    SPIKE_FOUR = "SPIKE_FOUR",
    SMOKE = "SMOKE",
}

export enum SPIKE_TYPE_MAP_TOTAL_COUNT_ENUM {
    SPIKE_ONE = 2,
    SPIKE_TWO = 3,
    SPIKE_THREE = 4,
    SPIKE_FOUR = 5,
}

export enum SPIKE_COUNT_ENUM {
    ZERO = "ZERO",
    ONE = "ONE",
    TWO = "TWO",
    THREE = "THREE",
    FOUR = "FOUR",
    FIVE = "FIVE",
}

export enum SPIKE_COUNT_MAP_NUMBER_NUM {
    ZERO = 0,
    ONE = 1,
    TWO = 2,
    THREE = 3,
    FOUR = 4,
    FIVE = 5,
}
