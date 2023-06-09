import { _decorator } from "cc";
import {
    CONTROLLER_ENUM,
    DIRECTION_ENUM,
    DIRECTION_ORDER_ENUM,
    ENTITY_STATE_ENUM,
    ENTITY_TYPE_ENUM,
    EVENT_ENUM,
    SHAKE_TYPE_ENUM,
} from "../Enum";
import EventManager from "../Runtime/EventManager";
import { PlayerStateMachine } from "./PlayerStateMachine";
import { EntityManager } from "../Base/EntityManager";
import DataManager from "../Runtime/DataManager";
import { RelativeDirection, calculateMoveBlock, calculateRotationBlock } from "../Utils";
import { IDIRECTION, IROTATION } from "../Const";
import { IEntity } from "../Types";
import { EnemyManager } from "../Base/EnemyManager";
import { BurstManager } from "../Burst/BurstManager";
const { ccclass } = _decorator;

@ccclass("PlayerManager")
export class PlayerManager extends EntityManager {
    targetX: number = 0;
    targetY: number = 0;
    private readonly speed = 1 / 10;

    isMoveing: boolean = false;

    async init(params: IEntity) {
        this.fsm = this.addComponent(PlayerStateMachine);
        await this.fsm.init();
        await super.init(params);
        this.targetX = this.x;
        this.targetY = this.y;

        EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL, this.inputHandle, this);
        EventManager.Instance.on(EVENT_ENUM.ATTACK_PLAYER, this.onDead, this);
    }

    update() {
        this.updateXY();
        super.update();
    }

    onDestroy() {
        EventManager.Instance.off(EVENT_ENUM.PLAYER_CTRL, this.inputHandle, this);
        EventManager.Instance.off(EVENT_ENUM.ATTACK_PLAYER, this.onDead, this);
    }

    updateXY() {
        if (this.targetX < this.x) {
            this.x -= this.speed;
        } else if (this.targetX > this.x) {
            this.x += this.speed;
        }

        if (this.targetY < this.y) {
            this.y -= this.speed;
        } else if (this.targetY > this.y) {
            this.y += this.speed;
        }

        if (Math.abs(this.targetX - this.x) <= 0.1 && Math.abs(this.targetY - this.y) <= 0.1 && this.isMoveing) {
            this.isMoveing = false;
            this.x = this.targetX;
            this.y = this.targetY;
            EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END);
        }
    }

    inputHandle(inputDirection: CONTROLLER_ENUM) {
        if (this.isMoveing) {
            return;
        }

        if (
            this.state === ENTITY_STATE_ENUM.DEATH ||
            this.state === ENTITY_STATE_ENUM.AIRDEATH ||
            this.state === ENTITY_STATE_ENUM.ATTACK
        ) {
            return;
        }

        const enemyId = this.willAttack(inputDirection);
        if (enemyId) {
            EventManager.Instance.emit(EVENT_ENUM.RECORD_STEP);
            this.state = ENTITY_STATE_ENUM.ATTACK;
            EventManager.Instance.emit(EVENT_ENUM.ATTACK_ENEMY, enemyId);
            EventManager.Instance.emit(EVENT_ENUM.DOOR_OPEN);
            EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END);
            return;
        }

        if (this.willBlock(inputDirection)) {
            const input: number = DIRECTION_ORDER_ENUM[inputDirection] as number;
            const direction: number = DIRECTION_ORDER_ENUM[this.direction] as number;
            if (input >= 0) {
                EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, DIRECTION_ORDER_ENUM[input] as string);
            } else {
                const rotateSign: number = IROTATION[inputDirection] as number;
                EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, DIRECTION_ORDER_ENUM[(direction + rotateSign + 4) % 4] as string);
            }
            return;
        }

        this.move(inputDirection);
    }

    onDead(type: ENTITY_STATE_ENUM) {
        this.state = type;
    }

    onAttackShake(type: SHAKE_TYPE_ENUM) {
        EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, type);
    }

    move(inputDirection: CONTROLLER_ENUM) {
        EventManager.Instance.emit(EVENT_ENUM.RECORD_STEP);

        const input: number = DIRECTION_ORDER_ENUM[inputDirection] as number;
        const direction: number = DIRECTION_ORDER_ENUM[this.direction] as number;
        if (input >= 0) {
            this.targetX = this.targetX + IDIRECTION[inputDirection].x;
            this.targetY = this.targetY - IDIRECTION[inputDirection].y;
            this.isMoveing = true;
            this.showSmoke(DIRECTION_ENUM[inputDirection]);
        } else {
            const rotateSign: number = IROTATION[inputDirection];
            this.direction = DIRECTION_ENUM[DIRECTION_ORDER_ENUM[(direction + rotateSign + 4) % 4]];
            this.state = ENTITY_STATE_ENUM[inputDirection];
            EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END);
        }
    }

    showSmoke(type: DIRECTION_ENUM) {
        EventManager.Instance.emit(EVENT_ENUM.SHOW_SMOKE, this.x, this.y, type);
    }

    willAttack(inputDirection: CONTROLLER_ENUM) {
        const enemies = DataManager.Instance.enemies.filter(enemy => enemy.state !== ENTITY_STATE_ENUM.DEATH);
        const { targetX: x, targetY: y, direction } = this;
        for (let i = 0; i < enemies.length; i++) {
            const { x: enemyX, y: enemyY, id: enemyId } = enemies[i];
            if (
                (inputDirection as string) === (direction as string) &&
                enemyX === x + IDIRECTION[direction].x * 2 &&
                enemyY === y - IDIRECTION[direction].y * 2
            ) {
                return enemyId;
            }
        }

        return "";
    }

    willBlock(inputDirection: CONTROLLER_ENUM) {
        const { targetX: x, targetY: y, direction } = this;
        const {
            tileInfo,
            door: { x: doorX, y: doorY, state: doorState },
        } = DataManager.Instance;
        const enemies: EnemyManager[] = DataManager.Instance.enemies.filter(enemy => enemy.state !== ENTITY_STATE_ENUM.DEATH);
        const bursts: BurstManager[] = DataManager.Instance.bursts.filter(burst => burst.state !== ENTITY_STATE_ENUM.DEATH);

        //旋转 或者 移动
        if (inputDirection === CONTROLLER_ENUM.TURNLEFT || inputDirection === CONTROLLER_ENUM.TURNRIGHT) {
            const { first, second, third } = calculateRotationBlock({ x, y }, IDIRECTION[direction], IROTATION[inputDirection], true);

            //为方便维护，下面的代码不做优化处理
            //判断门
            if (
                doorState !== ENTITY_STATE_ENUM.DEATH &&
                ((first.x === doorX && first.y === doorY) ||
                    (second.x === doorX && second.y === doorY) ||
                    (third.x === doorX && third.y === doorY))
            ) {
                if (inputDirection === CONTROLLER_ENUM.TURNRIGHT) {
                    this.state = ENTITY_STATE_ENUM.BLOCKTURNRIGHT;
                } else if (inputDirection === CONTROLLER_ENUM.TURNLEFT) {
                    this.state = ENTITY_STATE_ENUM.BLOCKTURNLEFT;
                }
                return true;
            }

            //判断敌人
            for (let i = 0; i < enemies.length; i++) {
                const { x: enemyX, y: enemyY } = enemies[i];
                if (
                    (first.x === enemyX && first.y === enemyY) ||
                    (second.x === enemyX && second.y === enemyY) ||
                    (third.x === enemyX && third.y === enemyY)
                ) {
                    if (inputDirection === CONTROLLER_ENUM.TURNRIGHT) {
                        this.state = ENTITY_STATE_ENUM.BLOCKTURNRIGHT;
                    } else if (inputDirection === CONTROLLER_ENUM.TURNLEFT) {
                        this.state = ENTITY_STATE_ENUM.BLOCKTURNLEFT;
                    }
                    return true;
                }
            }

            //判断地图元素
            if (
                (!tileInfo[first.x]?.[first.y] || tileInfo[first.x]?.[first.y].rotatable) &&
                (!tileInfo[second.x]?.[second.y] || tileInfo[second.x]?.[second.y].rotatable) &&
                (!tileInfo[third.x]?.[third.y] || tileInfo[third.x]?.[third.y].rotatable)
            ) {
                //empty
            } else {
                if (inputDirection === CONTROLLER_ENUM.TURNRIGHT) {
                    this.state = ENTITY_STATE_ENUM.BLOCKTURNRIGHT;
                } else if (inputDirection === CONTROLLER_ENUM.TURNLEFT) {
                    this.state = ENTITY_STATE_ENUM.BLOCKTURNLEFT;
                }

                return true;
            }
        } else {
            const { playerNext, weaponNext, relativeDirection } = calculateMoveBlock(
                { x, y },
                IDIRECTION[direction],
                IDIRECTION[inputDirection],
                true,
            );

            const playerNextTile = tileInfo[playerNext.x]?.[playerNext.y];
            const weaponNextTile = tileInfo[weaponNext.x]?.[weaponNext.y];

            //判断门
            if (
                doorState !== ENTITY_STATE_ENUM.DEATH &&
                ((playerNext.x === doorX && playerNext.y === doorY) || (weaponNext.x === doorX && weaponNext.y === doorY))
            ) {
                switch (relativeDirection) {
                    case RelativeDirection.FRONT:
                        this.state = ENTITY_STATE_ENUM.BLOCKFRONT;
                        break;
                    case RelativeDirection.BACK:
                        this.state = ENTITY_STATE_ENUM.BLOCKBACK;
                        break;
                    case RelativeDirection.LEFT:
                        this.state = ENTITY_STATE_ENUM.BLOCKLEFT;
                        break;
                    case RelativeDirection.RIGHT:
                        this.state = ENTITY_STATE_ENUM.BLOCKRIGHT;
                        break;
                }
                return true;
            }

            //判断敌人
            for (let i = 0; i < enemies.length; i++) {
                const { x: enemyX, y: enemyY } = enemies[i];
                if ((playerNext.x === enemyX && playerNext.y === enemyY) || (weaponNext.x === enemyX && weaponNext.y === enemyY)) {
                    switch (relativeDirection) {
                        case RelativeDirection.FRONT:
                            this.state = ENTITY_STATE_ENUM.BLOCKFRONT;
                            break;
                        case RelativeDirection.BACK:
                            this.state = ENTITY_STATE_ENUM.BLOCKBACK;
                            break;
                        case RelativeDirection.LEFT:
                            this.state = ENTITY_STATE_ENUM.BLOCKLEFT;
                            break;
                        case RelativeDirection.RIGHT:
                            this.state = ENTITY_STATE_ENUM.BLOCKRIGHT;
                            break;
                    }
                    return true;
                }
            }

            for (let i = 0; i < bursts.length; i++) {
                const { x: burstX, y: burstY } = bursts[i];
                if (playerNext.x === burstX && playerNext.y === burstY && (!weaponNextTile || weaponNextTile.rotatable)) {
                    return false;
                }
            }

            //判断地图元素
            if (playerNextTile && playerNextTile.mobile && (!weaponNextTile || weaponNextTile.rotatable)) {
                //empty
            } else {
                switch (relativeDirection) {
                    case RelativeDirection.FRONT:
                        this.state = ENTITY_STATE_ENUM.BLOCKFRONT;
                        break;
                    case RelativeDirection.BACK:
                        this.state = ENTITY_STATE_ENUM.BLOCKBACK;
                        break;
                    case RelativeDirection.LEFT:
                        this.state = ENTITY_STATE_ENUM.BLOCKLEFT;
                        break;
                    case RelativeDirection.RIGHT:
                        this.state = ENTITY_STATE_ENUM.BLOCKRIGHT;
                        break;
                }
                return true;
            }
        }

        return false;
    }
}
