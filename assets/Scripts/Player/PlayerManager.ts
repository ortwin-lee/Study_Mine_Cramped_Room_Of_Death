import { _decorator } from "cc";
import { CONTROLLER_ENUM, DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from "../Enum";
import EventManager from "../Runtime/EventManager";
import { PlayerStateMachine } from "./PlayerStateMachine";
import { EntityManager } from "../Base/EntityManager";
import DataManager from "../Runtime/DataManager";
import { RelativeDirection, calculateMoveBlock, calculateRotationBlock } from "../Utils";
import { IDIRECTION, IROTATION } from "../Const";
const { ccclass } = _decorator;

@ccclass("PlayerManager")
export class PlayerManager extends EntityManager {
    targetX: number = 0;
    targetY: number = 0;
    private readonly speed = 1 / 10;

    isMoveing: boolean = false;

    async init() {
        this.fsm = this.addComponent(PlayerStateMachine);
        await this.fsm.init();
        await super.init({
            x: 2,
            y: 8,
            type: ENTITY_TYPE_ENUM.PLAYER,
            direction: DIRECTION_ENUM.TOP,
            state: ENTITY_STATE_ENUM.IDLE,
        });
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
        EventManager.Instance.on(EVENT_ENUM.ATTACK_PLAYER, this.onDead, this);
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
            EventManager.Instance.emit(EVENT_ENUM.ATTACK_ENEMY, enemyId);
            return;
        }
        if (this.willBlock(inputDirection)) {
            return;
        }
        this.move(inputDirection);
    }

    onDead(type: ENTITY_STATE_ENUM) {
        this.state = type;
    }

    move(inputDirection: CONTROLLER_ENUM) {
        switch (inputDirection) {
            case CONTROLLER_ENUM.TOP:
                this.targetY -= 1;
                this.isMoveing = true;
                break;
            case CONTROLLER_ENUM.BOTTOM:
                this.targetY += 1;
                this.isMoveing = true;
                break;
            case CONTROLLER_ENUM.LEFT:
                this.targetX -= 1;
                this.isMoveing = true;
                break;
            case CONTROLLER_ENUM.RIGHT:
                this.targetX += 1;
                this.isMoveing = true;
                break;
            case CONTROLLER_ENUM.TURNLEFT:
                if (this.direction === DIRECTION_ENUM.TOP) {
                    this.direction = DIRECTION_ENUM.LEFT;
                } else if (this.direction === DIRECTION_ENUM.LEFT) {
                    this.direction = DIRECTION_ENUM.BOTTOM;
                } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
                    this.direction = DIRECTION_ENUM.RIGHT;
                } else if (this.direction === DIRECTION_ENUM.RIGHT) {
                    this.direction = DIRECTION_ENUM.TOP;
                }
                this.state = ENTITY_STATE_ENUM.TURNLEFT;
                EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END);
                break;
            case CONTROLLER_ENUM.TURNRIGHT:
                if (this.direction === DIRECTION_ENUM.TOP) {
                    this.direction = DIRECTION_ENUM.RIGHT;
                } else if (this.direction === DIRECTION_ENUM.RIGHT) {
                    this.direction = DIRECTION_ENUM.BOTTOM;
                } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
                    this.direction = DIRECTION_ENUM.LEFT;
                } else if (this.direction === DIRECTION_ENUM.LEFT) {
                    this.direction = DIRECTION_ENUM.TOP;
                }
                this.state = ENTITY_STATE_ENUM.TURNRIGHT;
                EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END);
                break;
        }
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
                this.state = ENTITY_STATE_ENUM.ATTACK;
                return enemyId;
            }
        }

        return "";
    }

    willBlock(inputDirection: CONTROLLER_ENUM) {
        const { targetX: x, targetY: y, direction } = this;
        const { tileInfo } = DataManager.Instance;
        if (inputDirection === CONTROLLER_ENUM.TURNLEFT || inputDirection === CONTROLLER_ENUM.TURNRIGHT) {
            const { first, second, third } = calculateRotationBlock({ x, y }, IDIRECTION[direction], IROTATION[inputDirection], true);
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

            const playerTile = tileInfo[playerNext.x]?.[playerNext.y];
            const weaponTile = tileInfo[weaponNext.x]?.[weaponNext.y];

            if ((!playerTile || playerTile.mobile) && (!weaponTile || weaponTile.rotatable)) {
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
