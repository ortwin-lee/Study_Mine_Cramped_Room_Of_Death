import { SpriteFrame } from "cc";

let reg = /\(\d+\)/;

const getNumberWithinString = (str: string) => {
    return parseInt(str.match(reg)[1] || "0");
};

export const sortSpriteFrame = (spriteFrames: SpriteFrame[]): SpriteFrame[] =>
    spriteFrames.sort((a, b) => getNumberWithinString(a.name) - getNumberWithinString(b.name));
