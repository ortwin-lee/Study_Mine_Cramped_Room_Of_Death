import { _decorator, BlockInputEvents, Color, Component, game, Graphics, UITransform, view } from "cc";
const { ccclass } = _decorator;

const SCREEN_SIZE = {
    WIDTH: view.getVisibleSize().width,
    HEIGHT: view.getVisibleSize().height,
};

enum FADE_STATE_ENUM {
    IDLE = "IDLE",
    FADE_IN = "FADE_IN",
    FADE_OUT = "FADE_OUT",
}

export const DEFAULT_DURATION = 200;

@ccclass("DrawManager")
export class DrawManager extends Component {
    private ctx: Graphics;
    private state: FADE_STATE_ENUM = FADE_STATE_ENUM.IDLE;
    private oldTime: number = 0;
    private duration: number = 0;
    private fadeResolve: (value: PromiseLike<null>) => void;
    private block: BlockInputEvents;
    init() {
        this.block = this.addComponent(BlockInputEvents);
        this.ctx = this.addComponent(Graphics);
        const transform = this.getComponent(UITransform);
        transform.setAnchorPoint(0.5, 0.5);
        transform.setContentSize(SCREEN_SIZE.WIDTH, SCREEN_SIZE.HEIGHT);

        this.setAlpha(1);
    }

    setAlpha(percent: number) {
        this.ctx.clear();
        this.ctx.rect(0, 0, SCREEN_SIZE.WIDTH, SCREEN_SIZE.HEIGHT);
        this.ctx.fillColor = new Color(0, 0, 0, 255 * percent);
        this.ctx.fill();
        this.block.enabled = percent === 1;
    }

    update() {
        const percent = (game.totalTime - this.oldTime) / this.duration;
        switch (this.state) {
            case FADE_STATE_ENUM.FADE_IN:
                if (percent < 1) {
                    this.setAlpha(percent);
                } else {
                    this.setAlpha(1);
                    this.state = FADE_STATE_ENUM.IDLE;
                    this.fadeResolve(null);
                }
                break;
            case FADE_STATE_ENUM.FADE_OUT:
                if (percent < 1) {
                    this.setAlpha(1 - percent);
                } else {
                    this.setAlpha(0);
                    this.state = FADE_STATE_ENUM.IDLE;
                    this.fadeResolve(null);
                }
                break;
        }
    }

    fadeIn(duration: number = DEFAULT_DURATION) {
        this.setAlpha(0);
        this.duration = duration;
        this.oldTime = game.totalTime;
        this.state = FADE_STATE_ENUM.FADE_IN;
        return new Promise((resolve, _) => {
            this.fadeResolve = resolve;
        });
    }

    fadeOut(duration: number = DEFAULT_DURATION) {
        this.setAlpha(1);
        this.duration = duration;
        this.oldTime = game.totalTime;
        this.state = FADE_STATE_ENUM.FADE_OUT;
        return new Promise((resolve, _) => {
            this.fadeResolve = resolve;
        });
    }

    mask() {
        this.setAlpha(1);
        return new Promise(resolve => {
            setTimeout(resolve, DEFAULT_DURATION);
        });
    }
}
