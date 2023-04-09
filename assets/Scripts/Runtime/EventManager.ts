import Singleton from "../Base/Singleton";

interface IItem {
    func: Function;
    ctx: unknown;
}

export default class EventManager extends Singleton {
    static get Instance() {
        return super.GetInstance<EventManager>();
    }

    private _eventDic: Map<string, Array<IItem>> = new Map();

    on(eventName: string, func: Function, ctx?: unknown) {
        if (this._eventDic.has(eventName)) {
            this._eventDic.get(eventName).push({ func, ctx });
        } else {
            this._eventDic.set(eventName, [{ func, ctx }]);
        }
    }

    off(eventName: string, func: Function, ctx?: unknown) {
        if (this._eventDic.has(eventName)) {
            const index = this._eventDic
                .get(eventName)
                .findIndex(i => (ctx ? i.func === func && i.ctx === ctx : i.func === func));
            index !== -1 && this._eventDic.get(eventName).splice(index, 1);
        }
    }

    emit(eventName: string, ...params: unknown[]) {
        if (this._eventDic.has(eventName)) {
            this._eventDic.get(eventName).forEach(({ func, ctx }) => {
                ctx ? func.apply(ctx, params) : func(...params);
            });
        }
    }

    clear() {
        this._eventDic.clear();
    }
}
