import { ILevel } from "./levelTypes";

export type IRecord = Omit<ILevel, "mapInfo">;
