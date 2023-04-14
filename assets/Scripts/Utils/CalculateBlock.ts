interface Vec2 {
    x: number;
    y: number;
}

export enum RelativeDirection {
    FRONT = "FRONT",
    BACK = "BACK",
    LEFT = "LEFT",
    RIGHT = "RIGHT",
}

/**
 * 将参数调整到0，1，-1。
 * 已经考虑到js三角函数运算浮点数精度误差问题。
 * @param number 需要调整的值
 * @returns
 */
function roundToAxis(number: number): number {
    if (number > 1e-10) {
        return 1;
    } else if (number < -1e-10) {
        return -1;
    } else {
        return 0;
    }
}

/**
 * 判断第二个向量相对于第一个向量的方向
 * @param vector1 基准向量
 * @param vector2 需要判断的向量
 * @returns 结果返回相对方向中的一个
 */
const calculateAngle = function (vector1: Vec2, vector2: Vec2): RelativeDirection {
    const crossProduct = vector1.x * vector2.y - vector1.y * vector2.x;
    if (crossProduct > 0) {
        return RelativeDirection.LEFT;
    } else if (crossProduct < 0) {
        return RelativeDirection.RIGHT;
    } else {
        const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
        if (dotProduct > 0) {
            return RelativeDirection.FRONT;
        } else {
            return RelativeDirection.BACK;
        }
    }
};

/**
 * 计算九宫格随人物旋转问题
 * @param i 角色实际坐标
 * @param direction 角色面朝方向 正方向为笛卡尔坐标系x轴(1,0)
 * @param rotation  角色旋转方向，1为逆时针，-1为顺时针
 * @param isAxisYConvert y轴是否朝下
 * @returns 返回角色旋转时，武器所经过的3个方格坐标
 */
export const calculateRotationBlock = function (i: Vec2, direction: Vec2, rotation: number, isAxisYConvert: boolean = false) {
    const flag = isAxisYConvert ? -1 : 1;
    const secondRadians = Math.atan2(direction.y, direction.x) + (Math.PI / 4) * rotation;
    const thirdRadians = Math.atan2(direction.y, direction.x) + (Math.PI / 2) * rotation;

    let first: Vec2 = {
        x: i.x + direction.x,
        y: i.y + direction.y * flag,
    };
    let second: Vec2 = {
        x: i.x + roundToAxis(Math.cos(secondRadians)),
        y: i.y + roundToAxis(Math.sin(secondRadians)) * flag,
    };
    let third: Vec2 = {
        x: i.x + roundToAxis(Math.cos(thirdRadians)),
        y: i.y + roundToAxis(Math.sin(thirdRadians)) * flag,
    };

    return { first, second, third };
};

/**
 * 计算九宫格随人物移动问题
 * @param i 角色实际坐标
 * @param direction 角色面朝方向 正方向为笛卡尔坐标系x轴(1,0)
 * @param forwardDirection  角色前进方向，正方向为笛卡尔坐标系x轴(1,0)
 * @param isAxisYConvert y轴是否朝下
 * @returns 返回角色和武器在移动后的方格坐标
 */
export const calculateMoveBlock = function (i: Vec2, direction: Vec2, forwardDirection: Vec2, isAxisYConvert: boolean = false) {
    const flag = isAxisYConvert ? -1 : 1;

    let playerNext: Vec2 = {
        x: i.x + forwardDirection.x,
        y: i.y + forwardDirection.y * flag,
    };
    let weaponNext: Vec2 = {
        x: i.x + direction.x + forwardDirection.x,
        y: i.y + direction.y * flag + forwardDirection.y * flag,
    };

    const relativeDirection = calculateAngle(direction, forwardDirection);

    return { playerNext, weaponNext, relativeDirection };
};
