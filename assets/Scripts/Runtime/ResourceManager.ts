import { Asset, resources, SpriteFrame } from "cc";
import Singleton from "../Base/Singleton";

export class ResourceManager extends Singleton {
    static get Instance() {
        return super.GetInstance<ResourceManager>();
    }

    loadDir(path: string, type: typeof SpriteFrame = SpriteFrame) {
        return new Promise<SpriteFrame[]>((resolve, reject) => {
            resources.loadDir(path, SpriteFrame, function (err, assets) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(assets);
            });
        });
    }

    loadRes<T extends Asset>(path: string, type?: { new (): T }): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            resources.load(path, type, function (err, asset) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(asset);
            });
        });
    }
}
